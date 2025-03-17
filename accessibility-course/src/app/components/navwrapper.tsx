"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import React from 'react';
import AuthGuard from "./AuthGuard";

export default function NavbarWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Define routes where the Navbar should not appear
    const noNavbarRoutes = ["/login", "/signup", "/"];
    
    // Define public routes that don't need authentication
    const publicRoutes = ["/login", "/signup", "/"];
    
    const isPublicRoute = publicRoutes.includes(pathname);

    return (
        <>
            {!noNavbarRoutes.includes(pathname) && <Navbar />}
            {isPublicRoute ? (
                children
            ) : (
                <AuthGuard>
                    {children}
                </AuthGuard>
            )}
        </>
    );
}
