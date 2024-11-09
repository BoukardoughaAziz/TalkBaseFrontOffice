import React from 'react'
import Horizontal from '../layouts/dashboard/horizontal'
import Boxed from '../layouts/dashboard/boxed'
import DualHorizontal from '../layouts/dashboard/dual-horizontal'
import DualCompact from '../layouts/dashboard/dual-compact'
 
export const IndexRouters = [
    {
        path: 'horizontal',
        element: <Horizontal />
    },
    {
        path: 'dual-horizontal',
        element: <DualHorizontal />
    },
    {
        path: 'dual-compact',
        element: <DualCompact />
    },
  
    {
        path: 'boxed',
        element: <Boxed />
    }
]
