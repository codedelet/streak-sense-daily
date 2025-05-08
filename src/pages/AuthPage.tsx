
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2 text-foreground">HabitVault</h1>
        <p className="text-muted-foreground">Track, build and master your daily habits.</p>
      </div>
      
      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onToggle={() => setIsLogin(true)} />
      )}
      
      <div className="mt-8 text-xs text-muted-foreground text-center w-full max-w-md">
        <p>
          Demo credentials: <br />
          Email: demo@example.com <br />
          Password: password123
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
