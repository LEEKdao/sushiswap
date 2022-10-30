import { ChainId, chainName } from '@sushiswap/chain'
import {
  MASTERCHEF_V1_SUBGRAPH_NAME,
  MASTERCHEF_V2_SUBGRAPH_NAME,
  MINICHEF_SUBGRAPH_NAME,
  SUBGRAPH_HOST,
} from '@sushiswap/graph-config'
import { isPromiseFulfilled } from '@sushiswap/validate'

import { getBuiltGraphSDK, Query, QueryResolvers, Resolvers } from './.graphclient'

export const _crossChainChefUser: QueryResolvers['crossChainChefUser'] = async (
  root,
  args,
  context,
  info
): Promise<Query['crossChainChefUser']> => {
  console.debug('_crossChainChefUser')
  const fetcher = async ({
    chainId,
    subgraphName,
    subgraphHost,
  }: {
    chainId: ChainId
    subgraphName:
      | typeof MASTERCHEF_V1_SUBGRAPH_NAME
      | typeof MASTERCHEF_V2_SUBGRAPH_NAME
      | typeof MINICHEF_SUBGRAPH_NAME[keyof typeof MINICHEF_SUBGRAPH_NAME]
    subgraphHost: typeof SUBGRAPH_HOST[number]
  }) => {
    const sdk = getBuiltGraphSDK()
    const { first, skip, where, block } = args
    return sdk
      .ChefUser(
        {
          first: first ?? 1000,
          skip: skip ?? 0,
          where: where ?? undefined,
          // block: block ?? undefined, // bugs it out...
        },
        {
          chainId,
          subgraphHost,
          subgraphName,
        }
      )
      .then(({ users }) => {
        // console.log('USERS IS', users)
        return users.map((user) => ({
          ...user,
          chainId,
          chainName: chainName[chainId],
        }))
      })
  }
  return Promise.allSettled<Query['crossChainChefUser']>([
    ...args.chainIds
      .filter((chainId) => chainId === ChainId.ETHEREUM)
      .flatMap((chainId) => [
        context.MasterChefV1.Query.MASTERCHEF_V1_users({
          root,
          args,
          context: {
            ...context,
            chainId: ChainId.ETHEREUM,
            subgraphName: MASTERCHEF_V1_SUBGRAPH_NAME,
            subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM],
          },
          info,
        }).then((users) => {
          if (!Array.isArray(users)) {
            console.error(`MasterChefV1 users query failed on ${chainId}`, users)
            return []
          }
          return users.map((user) => ({ ...user, chainId, chainName: chainName[chainId] }))
        }),
        context.MasterChefV2.Query.MASTERCHEF_V2_users({
          root,
          args,
          context: {
            ...context,
            chainId: ChainId.ETHEREUM,
            subgraphName: MASTERCHEF_V2_SUBGRAPH_NAME,
            subgraphHost: SUBGRAPH_HOST[ChainId.ETHEREUM],
          },
          info,
        }).then((users) => {
          if (!Array.isArray(users)) {
            console.error(`MasterChefV2 users query failed on ${chainId}`, users)
            return []
          }
          return users.map((user) => ({ ...user, chainId, chainName: chainName[chainId] }))
        }),
      ]),
    ...args.chainIds
      .filter((chainId): chainId is keyof typeof MINICHEF_SUBGRAPH_NAME => chainId in MINICHEF_SUBGRAPH_NAME)
      .map(
        (chainId) =>
          // Weird that we're doing this....
          context.MasterChefV1.Query.MASTERCHEF_V1_users({
            root,
            args,
            context: {
              ...context,
              chainId,
              subgraphName: MINICHEF_SUBGRAPH_NAME[chainId],
              subgraphHost: SUBGRAPH_HOST[chainId],
            },
            info,
          }).then((users) => {
            if (!Array.isArray(users)) {
              console.error(`MiniChefV2 users query failed on ${chainId}`, users)
              return []
            }
            return users.map((user) => ({ ...user, chainId, chainName: chainName[chainId] }))
          })
        // fetcher({ chainId, subgraphName: MINICHEF_SUBGRAPH_NAME[chainId], subgraphHost: SUBGRAPH_HOST[chainId] })
      ),
  ]).then((promiseSettledResults) => {
    if (!Array.isArray(promiseSettledResults)) {
      console.log('crossChainChefUser query failed...', promiseSettledResults)
      return []
    }
    return promiseSettledResults
      .flat()
      .filter(isPromiseFulfilled)
      .map((promiseFulfilled) => promiseFulfilled.value)
      .flat()
    // .filter((user) => user.pool)
  })
}

export const resolvers: Resolvers = {
  ChefUser: {
    chainId: (root, args, context, info) => Number(root.chainId || context.chainId || 1),
  },
  Query: {
    crossChainChefUser: _crossChainChefUser,
  },
}
