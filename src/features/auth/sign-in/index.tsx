import { Card } from '@/components/ui/card'
import AuthLayout from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { Link } from '@tanstack/react-router'

export default function SignIn() {
  return (
    <AuthLayout>
      <Card className='w-full max-w-md p-8 shadow-lg'>
        <div className='flex flex-col space-y-4 mb-6'>
          <h1 className='text-3xl font-bold tracking-tight text-center'>
            Welcome Back
          </h1>
          <p className='text-sm text-muted-foreground text-center'>
            Enter your credentials to access your account
          </p>
        </div>
        
        <UserAuthForm />

        <p className='mt-6 text-sm text-center text-muted-foreground'>
          Don't have an account?{' '}
          <Link
            to='/sign-up'
            className='font-medium text-primary hover:underline transition-colors'
          >
            Create account
          </Link>
        </p>
      </Card>
    </AuthLayout>
  )
}