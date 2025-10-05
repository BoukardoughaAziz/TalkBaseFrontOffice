import { Outlet } from "react-router-dom";
import Sidebar from "./statisticsDashboard/Sidebar";


export default function Layout() {
  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar always visible */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Optional top header */}
        {/* {<Header />} */}

        {/* Route content */}
        <div style={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
