import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EventFilter, Log, LogsState } from './types'

import { filterToKey } from './utils'

const initialState: LogsState = {}

export function createLogsSlice(reducerPath: string) {
  return createSlice({
    name: reducerPath,
    initialState,
    reducers: {
      addListener(state, { payload: { chainId, filter } }: PayloadAction<{ chainId: number; filter: EventFilter }>) {
        if (!state[chainId]) state[chainId] = {}
        const key = filterToKey(filter)
        if (!state[chainId][key])
          state[chainId][key] = {
            listeners: 1,
          }
        else state[chainId][key].listeners++
      },
      fetchingLogs(
        state,
        {
          payload: { chainId, filters, blockNumber },
        }: PayloadAction<{ chainId: number; filters: EventFilter[]; blockNumber: number }>
      ) {
        if (!state[chainId]) return
        for (const filter of filters) {
          const key = filterToKey(filter)
          if (!state[chainId][key]) continue
          state[chainId][key].fetchingBlockNumber = blockNumber
        }
      },
      fetchedLogs(
        state,
        {
          payload: { chainId, filter, results },
        }: PayloadAction<{ chainId: number; filter: EventFilter; results: { blockNumber: number; logs: Log[] } }>
      ) {
        if (!state[chainId]) return
        const key = filterToKey(filter)
        const fetchState = state[chainId][key]
        if (!fetchState || (fetchState.results && fetchState.results.blockNumber > results.blockNumber)) return
        fetchState.results = results
      },
      fetchedLogsError(
        state,
        {
          payload: { chainId, filter, blockNumber },
        }: PayloadAction<{ chainId: number; blockNumber: number; filter: EventFilter }>
      ) {
        if (!state[chainId]) return
        const key = filterToKey(filter)
        const fetchState = state[chainId][key]
        if (!fetchState || (fetchState.results && fetchState.results.blockNumber > blockNumber)) return
        fetchState.results = {
          blockNumber,
          error: true,
        }
      },
      removeListener(state, { payload: { chainId, filter } }: PayloadAction<{ chainId: number; filter: EventFilter }>) {
        if (!state[chainId]) return
        const key = filterToKey(filter)
        if (!state[chainId][key]) return
        state[chainId][key].listeners--
      },
    },
  })
}

export type LogsActions = ReturnType<typeof createLogsSlice>['actions']