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
                              src="public/images/logo2.png"
                              alt="brand"
                              style={{ height: "100px", width: "100px" }}
                            />
                          </a>
                        </div>
                        <div className="card card-lg card-border">
                          <div className="card-body">
                            <h4 className="mb-4 text-center">Sign in to your account</h4>
                            <div className="row gx-3">
                              <div className="form-group col-lg-12">
                                <div className="form-label-group">
                                  <label>Email</label>
                                </div>
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
                                <div className="form-label-group">
                                  <label>Password</label>
                                  <a href="#" className="fs-7 fw-medium">Forgot Password?</a>
                                </div>
                                <div className="input-group password-check">
                                  <span className="input-affix-wrapper">
                                    <input
                                      className="form-control"
                                      placeholder="Enter your password"
                                      type="password"
                                      {...register("password")}
                                    />
                                  </span>
                                </div>
                                {errors.password && (
                                  <p className="text-danger">{errors.password.message}</p>
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-center">
                              <div className="form-check form-check-sm mb-3">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id="logged_in"
                                />
                                <label
                                  className="form-check-label text-muted fs-7"
                                  htmlFor="logged_in"
                                >
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
                              New to Nwidget?{" "}
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
                  <span className="copy-text">Nwidget All rights reserved.</span>{" "}
                  <a href="#" className="" target="_blank">Privacy Policy</a>
                  <span className="footer-link-sep">|</span>
                  <a href="#" className="" target="_blank">T&C</a>
                  <span className="footer-link-sep">|</span>
                  <a href="#" className="" target="_blank">System Status</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
