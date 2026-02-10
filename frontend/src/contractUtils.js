// ═══════════════════════════════════════════════════════════════
// CONTRACT INTERACTION UTILITIES
// Frontend utilities for ArenaWagering contract
// ═══════════════════════════════════════════════════════════════

import { ethers } from 'ethers'

// Contract ABI (simplified - only functions we use)
const CONTRACT_ABI = [
  "function createArena(string title, uint8 gameType, uint256 betAmount, uint256 minPlayers, uint256 maxPlayers, uint256 duration) returns (uint256)",
  "function joinArena(uint256 arenaId) payable",
  "function getArena(uint256 arenaId) view returns (uint256 id, string title, uint8 gameType, uint8 status, uint256 betAmount, uint256 minPlayers, uint256 maxPlayers, uint256 startTime, uint256 endTime, address[] players, address[] winners, uint256 prizePool)",
  "function getArenaPlayers(uint256 arenaId) view returns (address[])",
  "function hasPlayerJoined(uint256 arenaId, address player) view returns (bool)",
  "function getTotalArenas() view returns (uint256)",
  "event ArenaCreated(uint256 indexed arenaId, string title, uint8 gameType, uint256 betAmount, address creator)",
  "event PlayerJoined(uint256 indexed arenaId, address indexed player, uint256 amount)",
  "event ArenaCompleted(uint256 indexed arenaId, address[] winners, uint256 prizePerWinner)"
]

// Get contract address from environment
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || ''

/**
 * Get contract instance
 */
export function getContract(signerOrProvider) {
  if (!CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured')
  }
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider)
}

/**
 * Get contract with signer
 */
export async function getContractWithSigner() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected')
  }
  
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()
  return getContract(signer)
}

/**
 * Get contract read-only
 */
export function getContractReadOnly() {
  const provider = new ethers.JsonRpcProvider(
    'https://testnet.monad.network'
  )
  return getContract(provider)
}

/**
 * Create a new arena
 */
export async function createArena({
  title,
  gameType,
  betAmount,
  minPlayers = 2,
  maxPlayers = 10,
  duration = 3600 // 1 hour default
}) {
  try {
    const contract = await getContractWithSigner()
    
    // Convert bet amount to wei
    const betAmountWei = ethers.parseEther(betAmount.toString())
    
    const tx = await contract.createArena(
      title,
      gameType,
      betAmountWei,
      minPlayers,
      maxPlayers,
      duration
    )
    
    console.log('Creating arena, tx:', tx.hash)
    const receipt = await tx.wait()
    
    // Get arena ID from event
    const event = receipt.logs.find(
      log => log.topics[0] === ethers.id('ArenaCreated(uint256,string,uint8,uint256,address)')
    )
    
    if (event) {
      const arenaId = ethers.toNumber(event.topics[1])
      console.log('Arena created with ID:', arenaId)
      return { success: true, arenaId, txHash: tx.hash }
    }
    
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Create arena error:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Join an arena
 */
export async function joinArena(arenaId, betAmount) {
  try {
    const contract = await getContractWithSigner()
    
    // Convert bet amount to wei
    const betAmountWei = ethers.parseEther(betAmount.toString())
    
    const tx = await contract.joinArena(arenaId, {
      value: betAmountWei
    })
    
    console.log('Joining arena, tx:', tx.hash)
    const receipt = await tx.wait()
    
    console.log('Successfully joined arena!')
    return { success: true, txHash: tx.hash }
  } catch (error) {
    console.error('Join arena error:', error)
    
    // Parse error messages
    let message = error.message
    if (message.includes('Arena is full')) {
      message = 'Arena is full!'
    } else if (message.includes('Already joined')) {
      message = 'You have already joined this arena!'
    } else if (message.includes('Incorrect bet amount')) {
      message = 'Incorrect bet amount sent!'
    } else if (message.includes('insufficient funds')) {
      message = 'Insufficient MON balance!'
    }
    
    return { success: false, error: message }
  }
}

/**
 * Get arena details from contract
 */
export async function getArenaFromContract(arenaId) {
  try {
    const contract = getContractReadOnly()
    const arena = await contract.getArena(arenaId)
    
    return {
      id: Number(arena.id),
      title: arena.title,
      gameType: Number(arena.gameType),
      status: ['open', 'in-progress', 'completed', 'cancelled'][Number(arena.status)],
      betAmount: ethers.formatEther(arena.betAmount),
      minPlayers: Number(arena.minPlayers),
      maxPlayers: Number(arena.maxPlayers),
      startTime: Number(arena.startTime),
      endTime: Number(arena.endTime),
      players: arena.players,
      winners: arena.winners,
      prizePool: ethers.formatEther(arena.prizePool)
    }
  } catch (error) {
    console.error('Get arena error:', error)
    return null
  }
}

/**
 * Check if player has joined arena
 */
export async function hasJoinedArena(arenaId, playerAddress) {
  try {
    const contract = getContractReadOnly()
    return await contract.hasPlayerJoined(arenaId, playerAddress)
  } catch (error) {
    console.error('Has joined check error:', error)
    return false
  }
}

/**
 * Get total arenas count
 */
export async function getTotalArenas() {
  try {
    const contract = getContractReadOnly()
    const total = await contract.getTotalArenas()
    return Number(total)
  } catch (error) {
    console.error('Get total arenas error:', error)
    return 0
  }
}

/**
 * Listen for arena events
 */
export function subscribeToArenaEvents(callback) {
  try {
    const contract = getContractReadOnly()
    
    // Listen for ArenaCreated
    contract.on('ArenaCreated', (arenaId, title, gameType, betAmount, creator) => {
      callback({
        type: 'ArenaCreated',
        arenaId: Number(arenaId),
        title,
        gameType: Number(gameType),
        betAmount: ethers.formatEther(betAmount),
        creator
      })
    })
    
    // Listen for PlayerJoined
    contract.on('PlayerJoined', (arenaId, player, amount) => {
      callback({
        type: 'PlayerJoined',
        arenaId: Number(arenaId),
        player,
        amount: ethers.formatEther(amount)
      })
    })
    
    // Listen for ArenaCompleted
    contract.on('ArenaCompleted', (arenaId, winners, prizePerWinner) => {
      callback({
        type: 'ArenaCompleted',
        arenaId: Number(arenaId),
        winners,
        prizePerWinner: ethers.formatEther(prizePerWinner)
      })
    })
    
    return () => {
      contract.removeAllListeners()
    }
  } catch (error) {
    console.error('Subscribe error:', error)
    return () => {}
  }
}

/**
 * Format transaction error
 */
export function formatTxError(error) {
  if (error.code === 'ACTION_REJECTED') {
    return 'Transaction rejected by user'
  }
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient MON balance for transaction'
  }
  return error.message || 'Transaction failed'
}
