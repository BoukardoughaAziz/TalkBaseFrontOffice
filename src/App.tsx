import { Route, Routes } from 'react-router-dom'
import routesConfig from './RoutesConfig.js'
import './assets/css/style.css'
import './assets/js/dropdown-bootstrap-extended.js'
import AppDashboard from './pages/AppDashboard.js'
import SignIn from './pages/auth/SignIn'
import Chat from './pages/chats/Chat.js'
export const ALL_COMPONENTS = {
  AppDashboard: { name: AppDashboard, value: <AppDashboard /> },
  Chat: { name: Chat, value: <Chat /> },
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      {routesConfig.map(({ path, component }) => {
        const ComponentData = ALL_COMPONENTS[component]; // Get component object

        if (!ComponentData) {
          return <Route key={path} path={path} element={<div>Not Found</div>} />;
        }

        const Component = ComponentData.name; // Extract the actual component reference

        return <Route key={path} path={path} element={<Component />} />;
      })}
    </Routes>
  );
}
