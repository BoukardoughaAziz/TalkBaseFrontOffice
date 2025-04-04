import { loginSuccess } from "@/stores/userSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { HTMLAttributes, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>;

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, {
      message: "Please enter your password",
    })
    .min(7, {
      message: "Password must be at least 7 characters long",
    }),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const url =
        import.meta.env.VITE_BACKEND_URL + "/CallCenterAuthController/login";
      const response = await axios.post(url, {
        email: data.email,
        password: data.password,
      });

      if (response.status === 201) {
        dispatch(
          loginSuccess({ email: data.email, token: response.data.accessToken })
        );
        navigate("/AppDashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="hk-wrapper hk-pg-auth" data-footer="simple">
      <nav className="hk-navbar navbar navbar-expand-xl navbar-light fixed-top">
        <div className="container-xxl">
          <div className="nav-start-wrap">
            <a className="navbar-brand" href="/">
              <img
                className="brand-img d-inline-block"
                src="dist/img/logo-light.png"
                alt="brand"
              />
            </a>
          </div>

          <div className="nav-end-wrap">
            <ul className="navbar-nav flex-row">
              <li className="nav-item nav-link py-0">
                <button className="btn btn-sm btn-outline-light">
                  <span>
                    <span className="icon">
                      <span className="feather-icon">
                        <i data-feather="help-circle"></i>
                      </span>
                    </span>
                    <span>Get Help</span>
                  </span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="hk-pg-wrapper">
        <div className="hk-pg-body">
          <div className="container-xxl">
            <div className="row">
              <div className="col-xl-5 col-lg-6 col-md-7 col-sm-10 position-relative mx-auto">
                <div className="auth-content py-md-0 py-8">
                  <form className="w-100" onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-lg-10 mx-auto">
                        <h4 className="mb-4">Sign in to your account</h4>

                        {/* Email Field */}
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            className="form-control"
                            placeholder="Enter email"
                            type="text"
                            {...register("email")}
                          />
                          {errors.email && (
                            <p className="text-danger">{errors.email.message}</p>
                          )}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                          <label>Password</label>
                          <a href="#" className="fs-7 fw-medium">
                            Forgot Password?
                          </a>
                          <div className="input-group password-check">
                            <span className="input-affix-wrapper">
                              <input
                                className="form-control"
                                placeholder="Enter your password"
                                type="password"
                                {...register("password")}
                              />
                              {errors.password && (
                                <p className="text-danger">
                                  {errors.password.message}
                                </p>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="d-flex justify-content-center">
                          <div className="form-check form-check-sm mb-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="logged_in"
                            />
                            <label
                              className="form-check-label text-muted fs-6"
                              htmlFor="logged_in"
                            >
                              Keep me logged in
                            </label>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="btn btn-primary btn-uppercase btn-block"
                          disabled={isLoading}
                        >
                          {isLoading ? "Signing in..." : "Login"}
                        </button>

                        {/* Error Message */}
                        {error && <p className="text-danger mt-2">{error}</p>}

                        <p className="p-xs mt-2 text-center">
                          New to Jampack?{" "}
                          <a href="#">
                            <u>Create new account</u>
                          </a>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="container-xxl footer">
          <div className="row">
            <div className="col-xl-8">
              <p className="footer-text">
                <span className="copy-text">Jampack © 2022 All rights reserved.</span>{" "}
                <a href="#">Privacy Policy</a>
                <span className="footer-link-sep">|</span>
                <a href="#">T&C</a>
                <span className="footer-link-sep">|</span>
                <a href="#">System Status</a>
              </p>
            </div>
            <div className="col-xl-4">
              <a href="#" className="footer-extr-link link-default">
                <span className="feather-icon">
                  <i data-feather="external-link"></i>
                </span>
                <u>Send feedback to our help forum</u>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
