const routesConfig = [
  {
    path: '/AppDashboard',
    component: 'AppDashboard',
    label: 'Dashboard',
    isAGap:false,
    isActive:true
  },
  {
    path: '/agents',
    component: 'AgentManagement',
    label: 'Agent Management',
    isAGap:false,
    isActive:true
  },
  {
    path: '/ClientInformationUI',
    component: 'ClientInformationUI',
    label: 'Client management',
    isAGap:false,
    isActive:false
  }
]

export const authRoutes = [
  {
    path: '/sign-up',
    component: 'SignUp',
    label: 'Sign Up',
    importPath: '@/pages/auth/SignUp'
  },
  {
    path: '/sign-in',
    component: 'SignIn',
    label: 'Sign In',
    importPath: '@/pages/auth/SignIn'
  }
]

export default routesConfig
