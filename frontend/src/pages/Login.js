import React from 'react';
import { loginWithProvider } from '../utils/api';

/**
 * Login page offers OAuth login options.  Upon clicking a provider
 * button the browser will be redirected to the provider’s consent page.
 */
export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="bg-white p-8 rounded shadow max-w-sm w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">Sign In</h1>
        <button
          className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={() => loginWithProvider('google')}
        >
          <span>Continue with Google</span>
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          onClick={() => loginWithProvider('github')}
        >
          <span>Continue with GitHub</span>
        </button>
      </div>
    </div>
  );
}
