import { createErrorToast, createToast } from '@sushiswap/ui/components/toast'
import { useCallback } from 'react'
import { ChainId } from 'sushi/chain'
import { Address, UserRejectedRequestError } from 'viem'
import {
  useAccount,
  usePublicClient,
  useSimulateContract,
  useWriteContract,
} from 'wagmi'
import { SendTransactionReturnType } from 'wagmi/actions'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { ERC1967Proxy } from '../abis'

interface UseHarvestAngleRewards {
  account: Address | undefined
  chainId: ChainId
  enabled?: boolean
  args:
    | {
        users: Address[]
        tokens: Address[]
        claims: bigint[]
        proofs: `0x${string}`[][]
      }
    | undefined
}

export const useHarvestAngleRewards = ({
  account,
  chainId,
  args,
  enabled = true,
}: UseHarvestAngleRewards) => {
  const { chain } = useAccount()
  const simulation = useSimulateContract({
    chainId,
    abi: ERC1967Proxy,
    address: '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae',
    functionName: 'claim',
    args: args
      ? [args.users, args.tokens, args.claims, args.proofs]
      : undefined,
    query: {
      enabled: Boolean(enabled && args && chainId === chain?.id),
    },
  })
  const client = usePublicClient<PublicWagmiConfig>()

  const onSuccess = useCallback(
    (data: SendTransactionReturnType) => {
      const ts = new Date().getTime()
      void createToast({
        account,
        type: 'approval',
        chainId,
        txHash: data,
        promise: client.waitForTransactionReceipt({ hash: data }),
        summary: {
          pending: 'Harvesting rewards',
          completed: 'Successfully harvested rewards',
          failed: 'Something went wrong harvesting rewards',
        },
        groupTimestamp: ts,
        timestamp: ts,
      })
    },
    [client, account, chainId],
  )

  const onError = useCallback((e: Error) => {
    if (e instanceof Error) {
      if (!(e instanceof UserRejectedRequestError)) {
        createErrorToast(e.message, true)
      }
    }
  }, [])

  return {
    simulation,
    writeContract: useWriteContract({
      mutation: {
        onSuccess,
        onError,
      },
    }).writeContract,
  }
}
