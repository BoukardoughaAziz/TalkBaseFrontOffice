import { Store } from '@reduxjs/toolkit'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
interface MyRouterContext {
  // The ReturnType of your useAuth hook or the value of your AuthContext
  store: Store
}
 
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" initialIsOpen={false} />
    </>
  ),
})
