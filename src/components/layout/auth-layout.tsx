import { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/providers/auth-provider';
import { LoginPrompt } from '@/components/auth/login-prompt';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  const { user } = useAuth();

  if (!user) {
    return <LoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-4 md:py-8">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}