import { Button } from '@/components/button'
import { cn } from '@/lib/utils'
import AppUtil from '@/utils/AppUtil'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Separator } from '@radix-ui/react-separator'
import {
    IconEdit,
    IconMessages,
    IconSearch
} from '@tabler/icons-react'
import { Fragment, useState } from 'react'

export default function ChatLeftSide(props) {
  const [search, setSearch] = useState('')

  return (
    <div>
      {/* Left Side */}
      <div className='flex w-full flex-col gap-2 sm:w-56 lg:w-72 2xl:w-80'>
        <div className='sticky top-0 z-10 -mx-4 bg-background px-4 pb-3 shadow-md sm:static sm:z-auto sm:mx-0 sm:p-0 sm:shadow-none'>
          

          <label className='flex h-12 w-full items-center space-x-0 rounded-md border border-input pl-2 focus-within:outline-none focus-within:ring-1 focus-within:ring-ring'>
            <IconSearch size={15} className='mr-2 stroke-slate-500' />
            <span className='sr-only'>Search</span>
            <input
              type='text'
              className='w-full flex-1 bg-inherit text-sm focus-visible:outline-none'
              placeholder='Search chat...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <ScrollArea className='-mx-3 h-full p-3'>
          {Array.from(props.conversation.entries()).map(([appClientIdentifier]) => {
            const humanIdentifier = AppUtil.getAppClientByIdentifier(
                props.conversation,
              appClientIdentifier
            ).humanIdentifier

            const appClient = AppUtil.getAppClientByIdentifier(
                props.conversation,
              appClientIdentifier
            )

            return (
              <Fragment key={appClientIdentifier}>
                <button
                  type='button'
                  className={cn(
                    `-mx-1 flex w-full rounded-md px-2 py-2 text-left text-sm hover:bg-secondary/75`,
                    props.selectedAppClient?.identifier === appClient.identifier
                      ? 'bg-blue-100'
                      : 'hover:bg-secondary/75'
                  )}
                  onClick={() => {
                    props.setSelectedAppClient(appClient)
                  }}
                >
                  <div className='flex gap-2  '>
                   
                    <div>
                      <span className='col-start-2 row-span-2 font-medium'>
                        {humanIdentifier}
                      </span>
                      <div className='flex flex-row '>
                        <Avatar>
                          <AvatarImage className='w-14'
                            src='https://purecatamphetamine.github.io/country-flag-icons/3x2/TN.svg'
                            alt='avatar'
                          />
                        </Avatar>
                        <div>
                          <Avatar>
                            <AvatarImage className='w-14'
                              src={AppUtil.getClientExplorerUrl(
                                appClient?.appBrowser
                              )}
                              alt='avatar'
                            />
                          </Avatar>
                        </div>
                        <div>
                          <Avatar>
                            <AvatarImage className='w-14'
                              src={AppUtil.getClientAppOsUrl(appClient?.appOS)}
                              alt='avatar'
                            />
                          </Avatar>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
                <Separator className='my-1' />
              </Fragment>
            )
          })}
        </ScrollArea>
      </div>
    </div>
  )
}
