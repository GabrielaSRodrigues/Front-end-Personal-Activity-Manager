'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button, Input } from '@nextui-org/react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3002/personal_manager/users');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      sessionStorage.setItem('users', JSON.stringify(data));
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="font-semibold text-3xl">Personal Activity Manager</h1>
        <div className="flex flex-col items-center justify-between gap-4">
          <Input
            className="w-full"
            type="text"
            placeholder="Enter your username or E-mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            className="w-full"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="w-full bg-purple-500 hover:bg-purple-700"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Sign In'}
          </Button>
          <Button className="w-full bg-purple-500 hover:bg-purple-700">Sign Up</Button>
        </div>
      </div>
    </main>
  );
}