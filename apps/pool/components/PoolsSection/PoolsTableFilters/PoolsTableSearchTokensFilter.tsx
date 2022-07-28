import { Transition } from '@headlessui/react'
import { PlusIcon, SearchIcon, XCircleIcon } from '@heroicons/react/solid'
import { classNames, DEFAULT_INPUT_UNSTYLED, IconButton, Loader } from '@sushiswap/ui'
import React, { FC, useEffect, useState } from 'react'

import { usePoolFilters } from '../../PoolsProvider'

interface PoolsTableSearchTokensFilterProps {
  isLoading: boolean
}

export const PoolsTableSearchTokensFilter: FC<PoolsTableSearchTokensFilterProps> = ({ isLoading }) => {
  const { query, setFilters } = usePoolFilters()
  const [extra, setExtra] = useState(false)

  useEffect(() => {
    if (!extra) {
      setTimeout(() => {
        setFilters({ extraQuery: '' })
      }, 750)
    }
  }, [extra, setFilters])

  return (
    <div className="flex gap-3 items-center bg-slate-800 rounded-2xl h-11 pr-4">
      <div
        className={classNames(
          query ? 'pr-8' : 'pr-4',
          'w-[220px] pr-4 transform-all relative flex gap-2 items-center px-4 py-2.5 rounded-2xl'
        )}
      >
        <div className="min-w-[24px] w-6 h-6 min-h-[24px] flex flex-grow items-center justify-center">
          {isLoading ? (
            <Loader size={16} strokeWidth={3} className="animate-spin-slow text-slate-500" />
          ) : (
            <SearchIcon className="text-slate-500" strokeWidth={2} width={20} height={20} />
          )}
        </div>

        <input
          value={query}
          placeholder="Search a token"
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'flex flex-grow !text-base placeholder:text-sm')}
          type="text"
          onInput={(e) => setFilters({ query: e.currentTarget.value })}
        />
        <Transition
          appear
          show={query?.length > 0}
          className="absolute top-0 bottom-0 right-0 flex items-center"
          enter="transition duration-300 origin-center ease-out"
          enterFrom="transform scale-90 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform opacity-100"
          leaveTo="transform opacity-0"
        >
          <IconButton onClick={() => setFilters({ query: '' })}>
            <XCircleIcon width={20} height={20} className="cursor-pointer text-slate-500 hover:text-slate-300" />
          </IconButton>
        </Transition>
      </div>
      <div className="py-3 h-full">
        <div className="w-px h-full bg-slate-200/20" />
      </div>
      <Transition
        show={extra}
        unmount={false}
        className="transition-[max-width] overflow-hidden"
        enter="duration-300 ease-in-out"
        enterFrom="transform max-w-0"
        enterTo="transform max-w-[120px]"
        leave="transition-[max-width] duration-250 ease-in-out"
        leaveFrom="transform max-w-[120px]"
        leaveTo="transform max-w-0"
      >
        <input
          placeholder="... other token"
          className={classNames(DEFAULT_INPUT_UNSTYLED, 'w-[120px] !text-base placeholder:text-sm')}
          type="text"
          onInput={(e) => setFilters({ extraQuery: e.currentTarget.value })}
        />
      </Transition>
      <IconButton onClick={() => setExtra((prev) => !prev)}>
        <PlusIcon
          width={20}
          height={20}
          className={classNames(
            extra ? 'rotate-45' : '',
            'transition-[transform] ease-in-out rotate-0 text-slate-400 group-hover:text-slate-200 delay-[400ms]'
          )}
        />
      </IconButton>
    </div>
  )
}