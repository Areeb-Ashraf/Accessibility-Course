"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import React from 'react'

export default function NavbarWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Define routes where the Navbar should not appear
    const noNavbarRoutes = ["/login", "/signup", "/"];

    return (
        <>
            {!noNavbarRoutes.includes(pathname) && <Navbar />}
            {children}
        </>
    );
}
