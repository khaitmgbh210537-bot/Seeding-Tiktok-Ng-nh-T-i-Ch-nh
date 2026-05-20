import { useState } from "react";
import LandingPage from "./components/LandingPage";
import CommandCenter from "./components/CommandCenter";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "dashboard">("landing");

  return (
    <div className="min-h-screen bg-[#0e1322] text-[#dee1f7]">
      {currentView === "landing" ? (
        <LandingPage onEnterDashboard={() => setCurrentView("dashboard")} />
      ) : (
        <CommandCenter onBackToLanding={() => setCurrentView("landing")} />
      )}
    </div>
  );
}
