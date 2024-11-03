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
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign In</h1>
        
        <form onSubmit={handleSignIn} className="space-y-4">
          <label className="block">
            <span className="text-lg text-gray-700">Email:</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="block">
            <span className="text-lg text-gray-700">Password:</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
          >
            Sign In
          </button>
          <button
            onClick={handleRegister}
            className="w-full mt-2 py-3 px-4 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 focus:outline-none"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
