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
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Sign in component mounted");
    
    // Check for OAuth errors in URL params
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

// In your onSubmit function
async function onSubmit(data: z.infer<typeof formSchema>) {
  setIsLoading(true);
  setError(null);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/CallCenterAuthController/login`,
      data,
      { withCredentials: true }
    );

    console.log("Login response:", response.data);

    // Store in Redux
    dispatch(
      loginSuccess({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        user: response.data.user,
      })
    );
    // Save user and accessToken to cookies
    document.cookie = `user=${encodeURIComponent(JSON.stringify(response.data.user))}; path=/;`;
    document.cookie = `accessToken=${response.data.accessToken}; path=/;`;
    navigate("/AppDashboard");
  } catch (err: any) {
    console.error("Login failed:", err);
    setError(err.response?.data?.message || "Login failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
}
  const handleGoogleLogin = () => {
    console.log("Redirecting to Google OAuth...");
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
                      <div className="col-lg-5 col-md-7 col-sm-10 mx-auto">
                        <div className="text-center mb-7">
                          <a className="navbar-brand me-0" href="/">
                            <img
                              className="brand-img d-inline-block"
                              src="https://photos.app.goo.gl/oyXKPMECuEHEbxue9"
                              alt="brand"
                              style={{ height: "100px", width: "100px" }}
                            />
                          </a>
                        </div>
                        <div className="card card-lg card-border">
                          <div className="card-body">
                            <h4 className="mb-4 text-center">Sign in to your account</h4>

                            {/* Google Sign-In */}
                            <div className="mb-4">
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-uppercase btn-block"
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                              >
                                <i className="fab fa-google me-2"></i>
                                Sign in with Google
                              </button>
                            </div>

                            <div className="divider">
                              <span className="divider-text">or</span>
                            </div>

                            <div className="row gx-3">
                              <div className="form-group col-lg-12">
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
                              <div className="form-group col-lg-12">
                                <div className="form-label-group d-flex justify-content-between">
                                  <label>Password</label>
                                  <a href="#" className="fs-7 fw-medium">Forgot Password?</a>
                                </div>
                                <input
                                  className="form-control"
                                  placeholder="Enter your password"
                                  type="password"
                                  {...register("password")}
                                />
                                {errors.password && (
                                  <p className="text-danger">{errors.password.message}</p>
                                )}
                              </div>
                            </div>

                            <div className="d-flex justify-content-center">
                              <div className="form-check form-check-sm mb-3">
                                <input type="checkbox" className="form-check-input" id="logged_in" />
                                <label className="form-check-label text-muted fs-7" htmlFor="logged_in">
                                  Keep me logged in
                                </label>
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="btn btn-primary btn-uppercase btn-block"
                              disabled={isLoading}
                            >
                              {isLoading ? "Signing in..." : "Login"}
                            </button>

                            {error && <p className="text-danger mt-2">{error}</p>}

                            <p className="p-xs mt-2 text-center">
                              New to Talk Base?{" "}
                              <a
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate("/sign-up");
                                }}
                              >
                                <u>Create new account</u>
                              </a>
                            </p>
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
                  <a href="#" target="_blank">Privacy Policy</a>
                  <span className="footer-link-sep">|</span>
                  <a href="#" target="_blank">T&C</a>
                  <span className="footer-link-sep">|</span>
                  <a href="#" target="_blank">System Status</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
