import { Prisma } from '@sushiswap/database'

export const SushiPoolSelect = {
  id: true,
  address: true,
  name: true,
  chainId: true,
  protocol: true,
  swapFee: true,
  totalSupply: true,
  liquidityUSD: true,
  reserve0: true,
  reserve1: true,
  token0Price: true,
  token1Price: true,
  volumeUSD: true,
  feeApr1h: true,
  feeApr1d: true,
  feeApr1w: true,
  feeApr1m: true,
  totalApr1h: true,
  totalApr1d: true,
  totalApr1w: true,
  totalApr1m: true,
  incentiveApr: true,
  isIncentivized: true,
  wasIncentivized: true,
  feesUSD: true,
  fees1h: true,
  fees1d: true,
  fees1w: true,
  fees1m: true,
  feesChange1h: true,
  feesChange1d: true,
  feesChange1w: true,
  feesChange1m: true,
  volume1h: true,
  volume1d: true,
  volume1w: true,
  volume1m: true,
  volumeChange1h: true,
  volumeChange1d: true,
  volumeChange1w: true,
  volumeChange1m: true,
  liquidityUSDChange1h: true,
  liquidityUSDChange1d: true,
  liquidityUSDChange1w: true,
  liquidityUSDChange1m: true,
  isBlacklisted: true,
  token0: {
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
  },
  token1: {
    select: {
      id: true,
      address: true,
      name: true,
      symbol: true,
      decimals: true,
    },
  },
  incentives: {
    select: {
      id: true,
      pid: true,
      chainId: true,
      chefType: true,
      apr: true,
      rewarderAddress: true,
      rewarderType: true,
      rewardPerDay: true,
      rewardToken: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
  },
  hadEnabledSteerVault: true,
  hasEnabledSteerVault: true,
  steerVaults: {
    select: {
      id: true,
      address: true,
      chainId: true,
    },
  },
} as const satisfies Prisma.SushiPoolSelect
