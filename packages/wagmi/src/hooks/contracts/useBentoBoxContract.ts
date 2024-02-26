'use client'

import { PublicWagmiConfig } from '@sushiswap/wagmi-config'
import { useMemo } from 'react'
import { bentoBoxV1Abi } from 'sushi/abi'
import { BENTOBOX_ADDRESS, BentoBoxChainId } from 'sushi/config'
import { getContract } from 'viem'
import { usePublicClient } from 'wagmi'

export const getBentoBoxContractConfig = (chainId: BentoBoxChainId) => ({
  address: BENTOBOX_ADDRESS[chainId],
  abi: bentoBoxV1Abi,
})

export function useBentoBoxContract(chainId: BentoBoxChainId | undefined) {
  const client = usePublicClient<PublicWagmiConfig>({ chainId })

  return useMemo(() => {
    if (!client || !chainId) return null

    return getContract({
      client,
      ...(getBentoBoxContractConfig(chainId) as any),
    })
  }, [client, chainId])
}

export type BentoBox = NonNullable<ReturnType<typeof useBentoBoxContract>>
