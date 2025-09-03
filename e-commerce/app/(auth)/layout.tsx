import { ReactNode } from 'react';

// Type definition for the AuthLayout props
interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div style={{ border: '2px solid blue', padding: '20px', borderRadius: '8px' }}>
      <h2>Authentication Portal</h2>
      {children}
    </div>
  );
}