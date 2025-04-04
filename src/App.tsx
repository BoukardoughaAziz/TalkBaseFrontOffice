import { Route, Routes } from "react-router-dom";
import './assets/css/style.css';
import './assets/js/dropdown-bootstrap-extended.js';
import AppDashboard from "./pages/AppDashboard.js";
import SignIn from "./pages/auth/SignIn";
export default function App() {
    return (
  
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/AppDashboard" element={<AppDashboard />} />
        </Routes>
     
    );
  }
  