import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SignIn = () => {
  const { signInWithEmail, register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(email, password);
  };

  return (
    <div>
      <h1>Sign In</h1>
      <form onSubmit={handleSignIn}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign In</button>
        <button onClick={handleRegister}>Register</button>
      </form>
    </div>
  );
};

export default SignIn;