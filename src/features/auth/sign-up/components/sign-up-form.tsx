import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/button'
import { PasswordInput } from '@/components/password-input'
import axios from 'axios'
import { useNavigate } from '@tanstack/react-router'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/stores/userSlice'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Please enter your first name' }),
  lastName: z.string().min(1, { message: 'Please enter your last name' }),
  email: z.string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(1, { message: 'Please enter your password' })
    .min(7, { message: 'Password must be at least 7 characters long' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ['confirmPassword'],
})

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/register`,
        {
          email: data.email,
          password: data.password,
          firstname: data.firstName,
          lastname: data.lastName
        }
      )

      if (response.status === 201) {
        if (response.data.isApproved) {
          dispatch(loginSuccess({ email: data.email, token: response.data.accessToken }))
          navigate({ to: '/' })
        } else {
          setError('Your account has been created but requires admin approval. Please check back later.')
        }
      } else {
        setError('Registration failed. Please try again.')
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('This email is already registered.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const renderFormField = (
    name: keyof z.infer<typeof formSchema>,
    label: string,
    placeholder: string,
    isPassword = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">{label}</FormLabel>
          <FormControl>
            {isPassword ? (
              <PasswordInput
                placeholder={placeholder}
                className="h-10"
                {...field}
              />
            ) : (
              <Input
                placeholder={placeholder}
                className="h-10"
                {...field}
              />
            )}
          </FormControl>
          <FormMessage className="text-sm text-red-500" />
        </FormItem>
      )}
    />
  )

  return (
    <div className={cn('grid gap-6 w-full max-w-md', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className='space-y-4'>
            <div className="grid grid-cols-2 gap-4">
              {renderFormField('firstName', 'First Name', 'John')}
              {renderFormField('lastName', 'Last Name', 'Doe')}
            </div>
            {renderFormField('email', 'Email', 'name@example.com')}
            {renderFormField('password', 'Password', 'Enter your password', true)}
            {renderFormField('confirmPassword', 'Confirm Password', 'Confirm your password', true)}
            
            {error && (
              <p className="text-sm text-red-500 text-center font-medium">
                {error}
              </p>
            )}
            
            <Button 
              className='w-full h-10 mt-6' 
              loading={isLoading}
            >
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}