"use client";

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

export default function RefreshOnNavigate() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      // Show loading screen first
      setIsLoading(true);
      
      // Short delay before reload to ensure loading screen appears
      const timer = setTimeout(() => {
        // Route has changed, refresh the page
        window.location.reload();
      }, 300); // Small delay to ensure loading screen is shown
      
      return () => clearTimeout(timer);
    }
    
    // Update the previous path reference
    prevPathRef.current = pathname;
  }, [pathname]);

  // Return loading screen if loading, otherwise nothing
  return isLoading ? <LoadingScreen /> : null;
} 