import { Route, Routes } from "react-router-dom";
import routesConfig, { authRoutes } from "./RoutesConfig.js";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import EmailVerification from "./pages/auth/EmailVerification.js";
import OAuthCallback from "./pages/auth/OAuthCallback";
import NotFoundPage from "./pages/404/NotFoundPage.js";
import AppDashboard from "./pages/AppDashboard.js";
import Chat from "./pages/chats/Chat.js";
import AgentManagement from "./pages/agents/AgentManagement";
import GoogleLookerDashboard from "./pages/GoogleLookerDashboard.js";
import Layout from "./pages/layout.js";
import './assets/css/style.css'
import './assets/js/dropdown-bootstrap-extended.js'

export const ALL_COMPONENTS = {
  AppDashboard: { name: AppDashboard, value: <AppDashboard /> },
  Chat: { name: Chat, value: <Chat /> },
  SignUp: { name: SignUp, value: <SignUp /> },
  SignIn: { name: SignIn, value: <SignIn /> },
  EmailVerification: { name: EmailVerification, value: <EmailVerification /> },
  AgentManagement: { name: AgentManagement, value: <AgentManagement /> },
  GoogleLookerDashboard: { name: GoogleLookerDashboard, value: <GoogleLookerDashboard /> }, // ✅ key fixed
  NotFoundPage: { name: NotFoundPage, value: <NotFoundPage /> }, 
};


export default function App() {
  return (
    <Routes>
      {/* Public routes without sidebar */}
      <Route path="/" element={<SignUp />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/email-verification" element={<EmailVerification />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />
      <Route path="/*" element={<NotFoundPage />} />

      {/* Protected routes with sidebar */}
      <Route element={<Layout />}>
        {routesConfig.map(({ path, component }) => {
          const ComponentData = ALL_COMPONENTS[component];
          if (!ComponentData) {
            return <Route key={path} path={path} element={<NotFoundPage />} />;
          }
          const Component = ComponentData.name;
          return <Route key={path} path={path} element={<Component />} />;
        })}
      </Route>

      {/* Catch all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
