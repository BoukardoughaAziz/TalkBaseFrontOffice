import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/stores/userSlice'

type SignUpProps = HTMLAttributes<HTMLDivElement>

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

const SignUp = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
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

      if (response.status === 201 || response.status === 200) {
        if (response.data.isApproved) {
          dispatch(loginSuccess({ email: data.email, token: response.data.accessToken }))
          navigate('/AppDashboard')
        } else {
          navigate('/email-verification', {
            state: { email: data.email }
          })
        }
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

  const handleGoogleSignUp = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/auth/google`;
  };

  return (
    <div className="hk-wrapper hk-pg-auth" data-footer="simple">
      <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
        <div className="hk-pg-body pt-0 pb-xl-0">
          <div className="container-xxl">
            <div className="row">
              <div className="col-sm-10 position-relative mx-auto">
                <div className="auth-content py-8">
                  <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-xxl-5 col-xl-7 col-lg-8 col-sm-10 mx-auto">
                        <div className="text-center mb-7">
                          <a className="navbar-brand me-0" href="/">
                            <img className="brand-img d-inline-block" src=https://photos.app.goo.gl/oyXKPMECuEHEbxue9" alt="brand" style={{ height: "100px" }} />
                          </a>
                        </div>
                        <div className="card card-border">
                          <div className="card-body">
                            <h4 className="text-center mb-0">Sign Up to Talk Base</h4>
                            <p className="p-xs mt-2 mb-4 text-center">
                              Already have an account?{" "}
                              <a href="#" onClick={(e) => {
                                e.preventDefault();
                                navigate('/sign-in');
                              }}>
                                <u>Sign In</u>
                              </a>
                            </p>

                            {/* Google Sign-Up Button */}
                            <div className="mb-4">
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-uppercase btn-block"
                                onClick={handleGoogleSignUp}
                                disabled={isLoading}
                              >
                                <i className="fab fa-google me-2"></i>
                                Sign up with Google
                              </button>
                            </div>

                            <div className="divider">
                              <span className="divider-text">or</span>
                            </div>

                            <div className="row gx-3">
                              <div className="form-group col-lg-6">
                                <label className="form-label">First Name</label>
                                <input
                                  className="form-control"
                                  placeholder="Enter your first name"
                                  type="text"
                                  {...register("firstName")}
                                />
                                {errors.firstName && (
                                  <p className="text-danger small">{errors.firstName.message}</p>
                                )}
                              </div>

                              <div className="form-group col-lg-6">
                                <label className="form-label">Last Name</label>
                                <input
                                  className="form-control"
                                  placeholder="Enter your last name"
                                  type="text"
                                  {...register("lastName")}
                                />
                                {errors.lastName && (
                                  <p className="text-danger small">{errors.lastName.message}</p>
                                )}
                              </div>

                              <div className="form-group col-lg-12">
                                <label className="form-label">Email</label>
                                <input
                                  className="form-control"
                                  placeholder="Enter your email"
                                  type="text"
                                  {...register("email")}
                                />
                                {errors.email && (
                                  <p className="text-danger small">{errors.email.message}</p>
                                )}
                              </div>

                              <div className="form-group col-lg-12">
                                <label className="form-label">Password</label>
                                <div className="input-group password-check">
                                  <span className="input-affix-wrapper affix-wth-text">
                                    <input
                                      className="form-control"
                                      placeholder="+7 characters"
                                      type={showPassword ? "text" : "password"}
                                      {...register("password")}
                                    />
                                    <a href="#" 
                                      className="input-suffix text-primary text-uppercase fs-8 fw-medium"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword(!showPassword);
                                      }}
                                    >
                                      <span>{showPassword ? "Hide" : "Show"}</span>
                                    </a>
                                  </span>
                                </div>
                                {errors.password && (
                                  <p className="text-danger small">{errors.password.message}</p>
                                )}
                              </div>

                              <div className="form-group col-lg-12">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group password-check">
                                  <span className="input-affix-wrapper affix-wth-text">
                                    <input
                                      className="form-control"
                                      placeholder="Confirm your password"
                                      type={showConfirmPassword ? "text" : "password"}
                                      {...register("confirmPassword")}
                                    />
                                    <a href="#" 
                                      className="input-suffix text-primary text-uppercase fs-8 fw-medium"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowConfirmPassword(!showConfirmPassword);
                                      }}
                                    >
                                      <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                                    </a>
                                  </span>
                                </div>
                                {errors.confirmPassword && (
                                  <p className="text-danger small">{errors.confirmPassword.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="form-check form-check-sm mb-3">
                              <input type="checkbox" className="form-check-input" id="terms" />
                              <label className="form-check-label text-muted fs-8" htmlFor="terms">
                                By creating an account you specify that you have read and agree with our{" "}
                                <a href="#">Terms of use</a> and <a href="#">Privacy policy</a>.
                              </label>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary btn-rounded btn-uppercase btn-block"
                              disabled={isLoading}
                            >
                              {isLoading ? "Creating account..." : "Create Account"}
                            </button>

                            {error && <p className="text-danger mt-2 text-center">{error}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hk-footer border-0">
          <footer className="container-xxl footer">
            <div className="row">
              <div className="col-xl-8 text-center">
                <p className="footer-text pb-0">
                  <span className="copy-text">Talk Base © All rights reserved.</span>{" "}
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default SignUp