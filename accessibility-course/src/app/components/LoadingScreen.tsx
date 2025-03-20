"use client";

import React, { useEffect, useState } from 'react';
import '../styles/loading-screen.css';

export default function LoadingScreen() {
  // Animation for dots
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <img 
        src="/sitting-panda.svg" 
        alt="Loading" 
        className="loading-image"
      />
      <h2 className="loading-title">
        Loading{dots}
      </h2>
      <p className="loading-text">
        Preparing your content
      </p>
    </div>
  );
} 