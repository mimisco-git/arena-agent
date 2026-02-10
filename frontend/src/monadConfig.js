// ═══════════════════════════════════════════════════════════════
// MONAD TESTNET CONFIGURATION
// Network setup for MetaMask and Web3
// ═══════════════════════════════════════════════════════════════

export const MONAD_TESTNET_CONFIG = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18
  },
  rpcUrls: [
    'https://testnet.monad.network',
    'https://monad-testnet.rpc.caldera.xyz/http'
  ],
  blockExplorerUrls: ['https://testnet.monadexplorer.com']
}

// Add Monad Testnet to MetaMask
export async function addMonadNetwork() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected!')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [MONAD_TESTNET_CONFIG]
    })
    console.log('✅ Monad Testnet added!')
    return { success: true }
  } catch (error) {
    console.error('❌ Failed to add network:', error)
    return { success: false, error: error.message }
  }
}

// Switch to Monad Testnet
export async function switchToMonad() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected!')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }]
    })
    console.log('✅ Switched to Monad Testnet!')
    return { success: true }
  } catch (error) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      return await addMonadNetwork()
    }
    console.error('❌ Failed to switch network:', error)
    return { success: false, error: error.message }
  }
}

// Check if connected to Monad Testnet
export async function isMonadNetwork() {
  if (!window.ethereum) return false

  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return chainId === MONAD_TESTNET_CONFIG.chainId
  } catch (error) {
    console.error('Failed to check network:', error)
    return false
  }
}

// Get MON balance
export async function getMonBalance(address) {
  if (!window.ethereum) return '0'

  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
    
    // Convert from wei to MON (18 decimals)
    const balanceInMon = parseInt(balance, 16) / 1e18
    return balanceInMon.toFixed(4)
  } catch (error) {
    console.error('Failed to get balance:', error)
    return '0'
  }
}
