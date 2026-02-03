// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title ArenaAgent
 * @notice Moltiverse Gaming Arena — autonomous wagering & tournaments on Monad.
 *         Anyone can create arenas, join, and bet.
 *         The operator (AI agent) settles results and distributes payouts.
 */
contract ArenaAgent {
    // ─────────────────────────────────────────────
    // Enums
    // ─────────────────────────────────────────────
    enum ArenaStatus {
        OPEN,          // accepting players
        IN_PROGRESS,   // game running
        COMPLETED      // settled, payouts done
    }

    enum GameType {
        PREDICTION,    // predict an outcome
        TRIVIA,        // quiz / knowledge battle
        TRADING,       // mini DeFi challenge
        STRATEGY       // card / strategy duel
    }

    // ─────────────────────────────────────────────
    // Structs
    // ─────────────────────────────────────────────
    struct Arena {
        uint256 id;
        address creator;
        string  title;
        GameType gameType;
        uint256 betAmount;          // fixed bet per player (wei)
        uint256 maxPlayers;
        uint256 minPlayers;
        uint256 createdAt;
        uint256 startTime;          // when the game begins
        uint256 endTime;            // deadline
        ArenaStatus status;
        address[] players;
        address[] winners;
        uint256 totalPot;
    }

    // ─────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────
    address public operator;                    // AI agent wallet
    uint256 public feeBps = 200;                // 2% platform fee (basis points)
    uint256 public arenaCount;
    mapping(uint256 => Arena) public arenas;
    mapping(uint256 => mapping(address => bool)) public hasJoined;  // arenaId → player → joined?
    mapping(address => uint256[]) public playerArenas;              // player → list of arena IDs

    // ─────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────
    event ArenaCreated(
        uint256 indexed id,
        address indexed creator,
        string title,
        GameType gameType,
        uint256 betAmount,
        uint256 minPlayers,
        uint256 maxPlayers,
        uint256 startTime,
        uint256 endTime
    );
    event PlayerJoined(uint256 indexed arenaId, address indexed player);
    event ArenaStarted(uint256 indexed arenaId);
    event ArenSettled(uint256 indexed arenaId, address[] winners, uint256 prizePerWinner);
    event PayoutSent(uint256 indexed arenaId, address indexed winner, uint256 amount);

    // ─────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────
    constructor() {
        operator = msg.sender;
    }

    // ─────────────────────────────────────────────
    // Modifiers
    // ─────────────────────────────────────────────
    modifier onlyOperator() {
        require(msg.sender == operator, "Only operator");
        _;
    }

    // ─────────────────────────────────────────────
    // Arena Creation — anyone can create
    // ─────────────────────────────────────────────
    function createArena(
        string  memory _title,
        GameType _gameType,
        uint256 _betAmount,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        uint256 _startTime,
        uint256 _endTime
    ) external returns (uint256) {
        require(_minPlayers >= 2, "Need at least 2 players");
        require(_maxPlayers >= _minPlayers, "Max must be >= min");
        require(_betAmount > 0, "Bet must be > 0");
        require(_startTime > block.timestamp, "Start must be in the future");
        require(_endTime > _startTime, "End must be after start");

        arenaCount++;
        uint256 id = arenaCount;

        arenas[id] = Arena({
            id:           id,
            creator:      msg.sender,
            title:        _title,
            gameType:     _gameType,
            betAmount:    _betAmount,
            maxPlayers:   _maxPlayers,
            minPlayers:   _minPlayers,
            createdAt:    block.timestamp,
            startTime:    _startTime,
            endTime:      _endTime,
            status:       ArenaStatus.OPEN,
            players:      new address[](0),
            winners:      new address[](0),
            totalPot:     0
        });

        emit ArenaCreated(id, msg.sender, _title, _gameType, _betAmount, _minPlayers, _maxPlayers, _startTime, _endTime);
        return id;
    }

    // ─────────────────────────────────────────────
    // Join Arena — anyone connects wallet & bets
    // ─────────────────────────────────────────────
    function joinArena(uint256 _arenaId) external payable {
        Arena storage arena = arenas[_arenaId];

        require(arena.id != 0, "Arena does not exist");
        require(arena.status == ArenaStatus.OPEN, "Arena not open");
        require(!hasJoined[_arenaId][msg.sender], "Already joined");
        require(arena.players.length < arena.maxPlayers, "Arena is full");
        require(msg.value == arena.betAmount, "Must send exact bet amount");
        require(block.timestamp < arena.startTime, "Joining window closed");

        hasJoined[_arenaId][msg.sender] = true;
        arena.players.push(msg.sender);
        arena.totalPot += msg.value;
        playerArenas[msg.sender].push(_arenaId);

        emit PlayerJoined(_arenaId, msg.sender);
    }

    // ─────────────────────────────────────────────
    // Start Arena — operator flips status
    // ─────────────────────────────────────────────
    function startArena(uint256 _arenaId) external onlyOperator {
        Arena storage arena = arenas[_arenaId];

        require(arena.id != 0, "Arena does not exist");
        require(arena.status == ArenaStatus.OPEN, "Arena not open");
        require(arena.players.length >= arena.minPlayers, "Not enough players");
        require(block.timestamp >= arena.startTime, "Too early to start");

        arena.status = ArenaStatus.IN_PROGRESS;
        emit ArenaStarted(_arenaId);
    }

    // ─────────────────────────────────────────────
    // Settle Arena — operator declares winners, pays out
    // ─────────────────────────────────────────────
    function settleArena(uint256 _arenaId, address[] memory _winners) external onlyOperator {
        Arena storage arena = arenas[_arenaId];

        require(arena.id != 0, "Arena does not exist");
        require(arena.status == ArenaStatus.IN_PROGRESS, "Arena not in progress");
        require(_winners.length > 0, "Must have at least one winner");

        // verify all winners are actual players
        for (uint256 i = 0; i < _winners.length; i++) {
            require(hasJoined[_arenaId][_winners[i]], "Winner not a player");
        }

        arena.status   = ArenaStatus.COMPLETED;
        arena.winners  = _winners;

        // calculate payout: total pot minus fee, split among winners
        uint256 fee           = (arena.totalPot * feeBps) / 10000;
        uint256 payableAmount = arena.totalPot - fee;
        uint256 prizeEach     = payableAmount / _winners.length;

        // pay each winner
        for (uint256 i = 0; i < _winners.length; i++) {
            (bool sent, ) = _winners[i].call{value: prizeEach}("");
            require(sent, "Payout failed");
            emit PayoutSent(_arenaId, _winners[i], prizeEach);
        }

        // send fee to operator
        uint256 dust = payableAmount - (prizeEach * _winners.length); // rounding dust
        (bool feeSent, ) = operator.call{value: fee + dust}("");
        require(feeSent, "Fee transfer failed");

        emit ArenSettled(_arenaId, _winners, prizeEach);
    }

    // ─────────────────────────────────────────────
    // Views — frontend reads
    // ─────────────────────────────────────────────
    function getArena(uint256 _arenaId) external view returns (Arena memory) {
        return arenas[_arenaId];
    }

    function getArenaPlayers(uint256 _arenaId) external view returns (address[] memory) {
        return arenas[_arenaId].players;
    }

    function getArenaWinners(uint256 _arenaId) external view returns (address[] memory) {
        return arenas[_arenaId].winners;
    }

    function getPlayerArenas(address _player) external view returns (uint256[] memory) {
        return playerArenas[_player];
    }

    function getAllArenas() external view returns (Arena[] memory) {
        Arena[] memory all = new Arena[](arenaCount);
        for (uint256 i = 1; i <= arenaCount; i++) {
            all[i - 1] = arenas[i];
        }
        return all;
    }

    function getArenaCount() external view returns (uint256) {
        return arenaCount;
    }

    // ─────────────────────────────────────────────
    // Owner functions
    // ─────────────────────────────────────────────
    function setFee(uint256 _feeBps) external onlyOperator {
        require(_feeBps <= 1000, "Fee max 10%");
        feeBps = _feeBps;
    }

    function transferOperator(address _newOperator) external onlyOperator {
        require(_newOperator != address(0), "Zero address");
        operator = _newOperator;
    }
}
