import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

type EmailVerificationProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  pin: z.string().min(6, { message: 'PIN must be 6 digits' }),
})

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Email pin sent", data)
    console.log("Email ", email)
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/verifyEmail`, {
        emailPin: data.pin,
        email:email
      })

      if (response.status === 201) {
        navigate('/sign-in') 
      } else {
        setError('Verification failed. Please try again.')
      }
    } catch (err) {
      setError('Invalid PIN or verification error.')
    } finally {
      setIsLoading(false)
    }
  }

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
                            <img className="brand-img d-inline-block" src="https://photos.app.goo.gl/oyXKPMECuEHEbxue9" alt="brand" style={{ height: "100px" }} />
                          </a>
                        </div>
                        <div className="card card-border">
                          <div className="card-body">
                            <h4 className="text-center mb-0">Verify Your Email</h4>
                            <p className="p-xs mt-2 mb-4 text-center">
                              Enter the 6-digit PIN sent to your email address.
                            </p>

                            <div className="form-group col-lg-12">
                              <label className="form-label">PIN Code</label>
                              <input
                                className="form-control"
                                placeholder="Enter the 6-digit code"
                                type="text"
                                {...register("pin")}
                              />
                              {errors.pin && (
                                <p className="text-danger small">{errors.pin.message}</p>
                              )}
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary btn-rounded btn-uppercase btn-block mt-3"
                              disabled={isLoading}
                            >
                              {isLoading ? "Verifying..." : "Verify Email"}
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
                  <span className="copy-text">Nwidget © All rights reserved.</span>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default EmailVerification
