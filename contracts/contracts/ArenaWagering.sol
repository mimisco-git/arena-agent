// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ArenaWagering
 * @notice Smart contract for AI-powered gaming arenas with automated wagering
 * @dev Built for Moltiverse Hackathon 2026 on Monad Testnet
 * @author BusyBrain Devs
 */
contract ArenaWagering {
    
    // ═══════════════════════════════════════════════════════════
    // TYPES
    // ═══════════════════════════════════════════════════════════
    
    enum ArenaStatus { Open, InProgress, Completed, Cancelled }
    enum GameType { Prediction, Trivia, Trading, Strategy }
    
    struct Arena {
        uint256 id;
        string title;
        GameType gameType;
        ArenaStatus status;
        uint256 betAmount;        // Entry fee in wei
        uint256 minPlayers;
        uint256 maxPlayers;
        uint256 startTime;
        uint256 endTime;
        address[] players;
        address[] winners;
        uint256 prizePool;
        address creator;
    }
    
    // ═══════════════════════════════════════════════════════════
    // STATE VARIABLES
    // ═══════════════════════════════════════════════════════════
    
    uint256 public nextArenaId;
    mapping(uint256 => Arena) public arenas;
    mapping(uint256 => mapping(address => bool)) public hasJoined;
    
    address public owner;
    uint256 public platformFee = 5; // 5% platform fee
    uint256 public totalFeesCollected;
    
    // ═══════════════════════════════════════════════════════════
    // EVENTS
    // ═══════════════════════════════════════════════════════════
    
    event ArenaCreated(
        uint256 indexed arenaId,
        string title,
        GameType gameType,
        uint256 betAmount,
        address creator
    );
    
    event PlayerJoined(
        uint256 indexed arenaId,
        address indexed player,
        uint256 amount
    );
    
    event ArenaStarted(
        uint256 indexed arenaId,
        uint256 playerCount
    );
    
    event ArenaCompleted(
        uint256 indexed arenaId,
        address[] winners,
        uint256 prizePerWinner
    );
    
    event ArenaCancelled(
        uint256 indexed arenaId,
        uint256 refundAmount
    );
    
    event PrizeDistributed(
        uint256 indexed arenaId,
        address indexed winner,
        uint256 amount
    );
    
    // ═══════════════════════════════════════════════════════════
    // MODIFIERS
    // ═══════════════════════════════════════════════════════════
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier arenaExists(uint256 _arenaId) {
        require(_arenaId < nextArenaId, "Arena does not exist");
        _;
    }
    
    modifier arenaOpen(uint256 _arenaId) {
        require(arenas[_arenaId].status == ArenaStatus.Open, "Arena not open");
        _;
    }
    
    // ═══════════════════════════════════════════════════════════
    // CONSTRUCTOR
    // ═══════════════════════════════════════════════════════════
    
    constructor() {
        owner = msg.sender;
        nextArenaId = 0;
    }
    
    // ═══════════════════════════════════════════════════════════
    // CORE FUNCTIONS
    // ═══════════════════════════════════════════════════════════
    
    /**
     * @notice Create a new gaming arena
     * @param _title Arena title
     * @param _gameType Type of game (0-3)
     * @param _betAmount Entry fee in wei
     * @param _minPlayers Minimum players to start
     * @param _maxPlayers Maximum players allowed
     * @param _duration Arena duration in seconds
     */
    function createArena(
        string memory _title,
        GameType _gameType,
        uint256 _betAmount,
        uint256 _minPlayers,
        uint256 _maxPlayers,
        uint256 _duration
    ) external returns (uint256) {
        require(_betAmount > 0, "Bet amount must be > 0");
        require(_maxPlayers >= _minPlayers, "Max >= Min players");
        require(_minPlayers >= 2, "Need at least 2 players");
        require(_maxPlayers <= 100, "Max 100 players");
        require(_duration >= 60, "Duration must be >= 60 seconds");
        
        uint256 arenaId = nextArenaId++;
        
        Arena storage arena = arenas[arenaId];
        arena.id = arenaId;
        arena.title = _title;
        arena.gameType = _gameType;
        arena.status = ArenaStatus.Open;
        arena.betAmount = _betAmount;
        arena.minPlayers = _minPlayers;
        arena.maxPlayers = _maxPlayers;
        arena.startTime = block.timestamp;
        arena.endTime = block.timestamp + _duration;
        arena.creator = msg.sender;
        arena.prizePool = 0;
        
        emit ArenaCreated(arenaId, _title, _gameType, _betAmount, msg.sender);
        
        return arenaId;
    }
    
    /**
     * @notice Join an arena by paying the bet amount
     * @param _arenaId Arena to join
     */
    function joinArena(uint256 _arenaId) 
        external 
        payable 
        arenaExists(_arenaId) 
        arenaOpen(_arenaId) 
    {
        Arena storage arena = arenas[_arenaId];
        
        require(block.timestamp < arena.endTime, "Arena has ended");
        require(arena.players.length < arena.maxPlayers, "Arena is full");
        require(!hasJoined[_arenaId][msg.sender], "Already joined");
        require(msg.value == arena.betAmount, "Incorrect bet amount");
        
        // Add player
        arena.players.push(msg.sender);
        hasJoined[_arenaId][msg.sender] = true;
        arena.prizePool += msg.value;
        
        emit PlayerJoined(_arenaId, msg.sender, msg.value);
        
        // Auto-start if max players reached
        if (arena.players.length == arena.maxPlayers) {
            _startArena(_arenaId);
        }
        
        // Auto-start if min players reached and time passed
        if (arena.players.length >= arena.minPlayers && 
            block.timestamp >= arena.startTime + 300) { // 5 min buffer
            _startArena(_arenaId);
        }
    }
    
    /**
     * @notice Start an arena (internal)
     * @param _arenaId Arena to start
     */
    function _startArena(uint256 _arenaId) internal {
        Arena storage arena = arenas[_arenaId];
        
        if (arena.status == ArenaStatus.Open && 
            arena.players.length >= arena.minPlayers) {
            arena.status = ArenaStatus.InProgress;
            emit ArenaStarted(_arenaId, arena.players.length);
        }
    }
    
    /**
     * @notice Manually start arena (owner only, if min players met)
     * @param _arenaId Arena to start
     */
    function startArena(uint256 _arenaId) 
        external 
        onlyOwner 
        arenaExists(_arenaId) 
    {
        Arena storage arena = arenas[_arenaId];
        require(arena.status == ArenaStatus.Open, "Arena not open");
        require(arena.players.length >= arena.minPlayers, "Not enough players");
        
        _startArena(_arenaId);
    }
    
    /**
     * @notice Complete arena and distribute prizes
     * @param _arenaId Arena to complete
     * @param _winners Array of winner addresses
     * @dev In production, this would be called by AI oracle
     */
    function completeArena(uint256 _arenaId, address[] calldata _winners) 
        external 
        onlyOwner 
        arenaExists(_arenaId) 
    {
        Arena storage arena = arenas[_arenaId];
        require(
            arena.status == ArenaStatus.InProgress, 
            "Arena not in progress"
        );
        require(_winners.length > 0, "Need at least 1 winner");
        require(_winners.length <= arena.players.length, "Too many winners");
        
        // Verify all winners are players
        for (uint256 i = 0; i < _winners.length; i++) {
            require(hasJoined[_arenaId][_winners[i]], "Winner not a player");
        }
        
        arena.status = ArenaStatus.Completed;
        arena.winners = _winners;
        
        // Calculate prizes
        uint256 fee = (arena.prizePool * platformFee) / 100;
        uint256 netPrize = arena.prizePool - fee;
        uint256 prizePerWinner = netPrize / _winners.length;
        
        totalFeesCollected += fee;
        
        // Distribute prizes
        for (uint256 i = 0; i < _winners.length; i++) {
            (bool success, ) = _winners[i].call{value: prizePerWinner}("");
            require(success, "Prize transfer failed");
            emit PrizeDistributed(_arenaId, _winners[i], prizePerWinner);
        }
        
        emit ArenaCompleted(_arenaId, _winners, prizePerWinner);
    }
    
    /**
     * @notice Cancel arena and refund all players
     * @param _arenaId Arena to cancel
     */
    function cancelArena(uint256 _arenaId) 
        external 
        onlyOwner 
        arenaExists(_arenaId) 
    {
        Arena storage arena = arenas[_arenaId];
        require(
            arena.status == ArenaStatus.Open || 
            arena.status == ArenaStatus.InProgress,
            "Cannot cancel completed arena"
        );
        
        arena.status = ArenaStatus.Cancelled;
        
        // Refund all players
        uint256 refundAmount = arena.betAmount;
        for (uint256 i = 0; i < arena.players.length; i++) {
            (bool success, ) = arena.players[i].call{value: refundAmount}("");
            require(success, "Refund failed");
        }
        
        arena.prizePool = 0;
        
        emit ArenaCancelled(_arenaId, refundAmount);
    }
    
    // ═══════════════════════════════════════════════════════════
    // VIEW FUNCTIONS
    // ═══════════════════════════════════════════════════════════
    
    /**
     * @notice Get arena details
     */
    function getArena(uint256 _arenaId) 
        external 
        view 
        arenaExists(_arenaId) 
        returns (
            uint256 id,
            string memory title,
            GameType gameType,
            ArenaStatus status,
            uint256 betAmount,
            uint256 minPlayers,
            uint256 maxPlayers,
            uint256 startTime,
            uint256 endTime,
            address[] memory players,
            address[] memory winners,
            uint256 prizePool
        ) 
    {
        Arena storage arena = arenas[_arenaId];
        return (
            arena.id,
            arena.title,
            arena.gameType,
            arena.status,
            arena.betAmount,
            arena.minPlayers,
            arena.maxPlayers,
            arena.startTime,
            arena.endTime,
            arena.players,
            arena.winners,
            arena.prizePool
        );
    }
    
    /**
     * @notice Get all players in an arena
     */
    function getArenaPlayers(uint256 _arenaId) 
        external 
        view 
        arenaExists(_arenaId) 
        returns (address[] memory) 
    {
        return arenas[_arenaId].players;
    }
    
    /**
     * @notice Get arena winners
     */
    function getArenaWinners(uint256 _arenaId) 
        external 
        view 
        arenaExists(_arenaId) 
        returns (address[] memory) 
    {
        return arenas[_arenaId].winners;
    }
    
    /**
     * @notice Check if player has joined arena
     */
    function hasPlayerJoined(uint256 _arenaId, address _player) 
        external 
        view 
        arenaExists(_arenaId) 
        returns (bool) 
    {
        return hasJoined[_arenaId][_player];
    }
    
    /**
     * @notice Get total arenas created
     */
    function getTotalArenas() external view returns (uint256) {
        return nextArenaId;
    }
    
    // ═══════════════════════════════════════════════════════════
    // ADMIN FUNCTIONS
    // ═══════════════════════════════════════════════════════════
    
    /**
     * @notice Update platform fee
     * @param _newFee New fee percentage (0-10)
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 10, "Fee too high");
        platformFee = _newFee;
    }
    
    /**
     * @notice Withdraw collected fees
     */
    function withdrawFees() external onlyOwner {
        uint256 amount = totalFeesCollected;
        totalFeesCollected = 0;
        
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @notice Emergency withdraw (if needed)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Emergency withdrawal failed");
    }
    
    /**
     * @notice Transfer ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
    
    // ═══════════════════════════════════════════════════════════
    // FALLBACK
    // ═══════════════════════════════════════════════════════════
    
    receive() external payable {}
}
