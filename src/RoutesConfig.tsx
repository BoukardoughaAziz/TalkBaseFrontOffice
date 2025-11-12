const routesConfig = [
  {
    path: '/AppDashboard',
    component: 'AppDashboard',
    label: 'Dashboard',
    icon: 'IconDashboard',
    isAGap: false,
    isActive: true,
    roles: ['ADMIN', 'AGENT'], 
  },
  {
    path: '/agents',
    component: 'AgentManagement',
    label: 'Agent Management',
    icon: 'IconUsers',
    isAGap: false,
    isActive: true,
    roles: ['ADMIN'], 
  },
    {
    path: '/email-campaigns',
    component: 'EmailCampaign',
    label: 'Email Campaigns',
    icon: 'IconMail',
    isAGap: false,
    isActive: true,
  },
  {
    path: '/ClientInformationUI',
    component: 'ClientInformationUI',
    label: 'Client management',
    icon: 'IconUserCheck',
    isAGap: false,
    isActive: false,
    roles: ['ADMIN', 'AGENT'], 
  },
  {
     path: 'email',
     component: 'Email',    
     icon: 'IconMail',
     isAGap: false,
     isActive: true,
     roles: ['ADMIN', 'AGENT'],
  },
  {
     path: 'Contact',
     component: 'Contact',    
     icon: 'IconAddressBook',
     isAGap: false,
     isActive: true,
     roles: ['ADMIN', 'AGENT'],
  },
  {
     path: 'todo',
     component: 'Todo',    
     icon: 'IconChecklist',
     isAGap: false,
     isActive: true,
     roles: ['ADMIN', 'AGENT'],
  },
  {
     path: 'scrumboard',
     component: 'ScrumBoard',    
     icon: 'IconLayoutBoard',
     isAGap: false,
     isActive: true,
     roles: ['ADMIN', 'AGENT'],
  },
  {
    path: '/analytics',       
    component: 'GoogleLookerDashboard',  
    label:'Analytics',   
    isAGap: false,
    isActive: true,
    roles: ['ADMIN', 'AGENT'],
  },
  {
     path: '*',
     component: 'NotFoundPage',    
     icon: 'IconAlertTriangle',
     isAGap: false,
     isActive: false,
     roles: ['ADMIN', 'AGENT'],
  },
];

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
  },
    {
    path: '/email-verification',  
    component: 'EmailVerification',
    label: 'Email Verification',
    importPath: '@/pages/auth/EmailVerification'
  }
]

export default routesConfig
