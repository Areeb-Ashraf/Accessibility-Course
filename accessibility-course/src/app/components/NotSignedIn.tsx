"use client";

import { useRouter } from 'next/navigation';
import React from 'react';
import '../styles/notsignedin.css';

export default function NotSignedIn() {
  const router = useRouter();

  return (
    <div className="not-signed-in-container" >
      <h2>
        Oops! Authentication Required
      </h2>
      <img src="/sitting-panda.svg" alt="sitting panda" />
      <p>
        You need to be signed in to access this page. Please log in to continue.
      </p>
      <button 
        onClick={() => router.push('/login')}
      >
        Go to Login
      </button>
    </div>
  );
} 