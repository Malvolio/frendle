import { Toaster } from "@/components/ui/toaster";
import { AboutPage } from "@/pages/about";
import { HomePage } from "@/pages/home";
import { LoginPage } from "@/pages/login";
import { MatchPage } from "@/pages/match";
import { PrivacyPage } from "@/pages/privacy";
import { ProfilePage } from "@/pages/profile";
import { ResourcesPage } from "@/pages/resources";
import { SessionPage } from "@/pages/session";
import { UIKit } from "@/pages/uikit";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "@/App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/uikit" element={<UIKit />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/match" element={<MatchPage />} />
            <Route path="/session" element={<SessionPage />} />

            {/* Fallback route */}
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App