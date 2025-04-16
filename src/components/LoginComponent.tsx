import React, { useEffect, useState } from 'react';
import { login } from '../services/api/auth/auth.login.service';
import { useAuthStore } from '../store/authStore';

export default function LoginComponent() {
  const [email, setEmail] = useState('');
  const [password , setPassword] = useState('');

      const fetchUser = useAuthStore((state) => state.fetchUser)
  
      useEffect(() => {
  
          fetchUser()
  
      },[])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // evita el reload de la página

    const userData = {
      email: email,
      password: password
    };

    await login(userData); 
    
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Login</button>
    </form>
  );
}
