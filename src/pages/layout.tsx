import { Outlet } from "react-router-dom";
import Sidebar from "./statisticsDashboard/Sidebar";
import { useEffect, useState } from "react";
import { AppAgent } from "@/models/AppAgent";
import Cookies from "js-cookie";


export default function Layout() {
  const [connectedAgent, setConnectedAgent] = useState<AppAgent | null>(null);


  useEffect(() => {
  console.log("++++++++++++++++++++++++++++++")
  console.log("trying to fetch the user")
  console.log("++++++++++++++++++++++++++++++")
  const accessToken = Cookies.get("access_token");
  const userCookie = Cookies.get("user");

  console.log("Access Token:", accessToken);
  console.log("User Cookie:", userCookie);

  if (userCookie) {
    const user = JSON.parse(userCookie);
    console.log("Decoded User:", user);
    setConnectedAgent(user);
    console.log("we have set the connected agent : ", connectedAgent);
  }

}, []);


  return (
    <div className="app-container" style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar always visible */}
      <Sidebar 
        connectedAgent={connectedAgent}
      />

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
