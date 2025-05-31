import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { HomePage } from '@/pages/home';
import { AboutPage } from '@/pages/about';
import { ResourcesPage } from '@/pages/resources';
import { UIKit } from '@/pages/uikit';
import { PrivacyPage } from '@/pages/privacy';
import { ProfilePage } from '@/pages/profile';
import { MatchPage } from '@/pages/match';
import { LoginPage } from '@/pages/login';


import '@/App.css';

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

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;