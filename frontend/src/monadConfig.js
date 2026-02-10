export const MONAD_TESTNET_CONFIG = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18
  },
  rpcUrls: ['https://testnet-rpc.monad.xyz'],
  blockExplorerUrls: ['https://testnet.monadexplorer.com']
}

export async function addMonadNetwork() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [MONAD_TESTNET_CONFIG]
    })
    return { success: true }
  } catch (error) {
    console.error('Add network error:', error)
    return { success: false, error: error.message }
  }
}

export async function switchToMonad() {
  if (!window.ethereum) {
    throw new Error('MetaMask not detected')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }]
    })
    return { success: true }
  } catch (error) {
    if (error.code === 4902) {
      return await addMonadNetwork()
    }
    console.error('Switch network error:', error)
    return { success: false, error: error.message }
  }
}

export async function isMonadNetwork() {
  if (!window.ethereum) return false
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
    return chainId === MONAD_TESTNET_CONFIG.chainId
  } catch (error) {
    console.error('Chain check error:', error)
    return false
  }
}

export async function getMonBalance(address) {
  if (!window.ethereum || !address) return '0.0000'
  
  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    })
    const balanceInMON = parseInt(balance, 16) / 1e18
    return balanceInMON.toFixed(4)
  } catch (error) {
    console.error('Balance check error:', error)
    return '0.0000'
  }
}
