import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export function CallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectPath = localStorage.getItem('auth_redirect') || '/';
    localStorage.removeItem('auth_redirect'); // Clean up
    navigate({ to: redirectPath });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}