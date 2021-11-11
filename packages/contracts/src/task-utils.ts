import { createInterface } from 'readline'

export const getInput = (query) => {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close()
      resolve(ans)
    })
  )
}

const codes = {
  reset: '\x1b[0m',
  black: '\x1b[0;30m',
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  blue: '\x1b[0;34m',
  purple: '\x1b[0;35m',
  cyan: '\x1b[0;36m',
  lightGray: '\x1b[0;37m',
  darkGray: '\x1b[1;30m',
  lightRed: '\x1b[1;31m',
  lightGreen: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  white: '\x1b[1;37m',
}

export const color = Object.fromEntries(
  Object.entries(codes).map(([k]) => [
    k,
    (msg: string) => `${codes[k]}${msg}${codes.reset}`,
  ])
)

export const getArtifact = (name: string) => {
  // Paths to artifacts relative to artifacts/contracts
  const locations = {
    ChainStorageContainer_CTC_batches:
      'L1/rollup/ChainStorageContainer.sol/ChainStorageContainer.json',
    ChainStorageContainer_SCC_batches:
      'L1/rollup/ChainStorageContainer.sol/ChainStorageContainer.json',
    CanonicalTransactionChain:
      'L1/rollup/CanonicalTransactionChain.sol/CanonicalTransactionChain.json',
    StateCommitmentChain:
      'L1/rollup/StateCommitmentChain.sol/StateCommitmentChain.json',
    BondManager: 'L1/verification/BondManager.sol/BondManager.json',
    OVM_L1CrossDomainMessenger:
      'L1/messaging/L1CrossDomainMessenger.sol/L1CrossDomainMessenger.json',
    Proxy__OVM_L1CrossDomainMessenger:
      'libraries/resolver/Lib_ResolvedDelegateProxy.sol/Lib_ResolvedDelegateProxy.json',
    Proxy__OVM_L1StandardBridge:
      'chugsplash/L1ChugSplashProxy.sol/L1ChugSplashProxy.json',
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require(`../artifacts/contracts/${locations[name]}`)
}
