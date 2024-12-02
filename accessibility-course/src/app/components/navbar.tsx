import React, { useState } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import '../styles/navbar.css';

export default function Navbar() {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <nav className="navbar-container">
                <div className="navbar-logo">
                    <Image
                        aria-hidden
                        src="/logo.svg"
                        alt="Logo"
                        width={35}
                        height={35}
                    />
                </div>

                {/* Menu Button for Mobile */}
                <div className="menu-icon" onClick={toggleSidebar}>
                    <Image
                        aria-hidden
                        src="/menu-icon.svg" // Add a menu icon image
                        alt="Menu"
                        width={24}
                        height={24}
                    />
                </div>

                {/* Desktop Navbar Links */}
                <div className="navbar-links-container">
                    <Link
                        className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`}
                        href="/dashboard"
                    >
                        <Image
                            aria-hidden
                            src="/navDashboard.svg"
                            alt="navDashboard"
                            width={11}
                            height={14}
                            className="navbar-icon"
                        />
                        Dashboard
                    </Link>
                    <Link
                        className={`navbar-link ${pathname === '/curriculum' ? 'active' : ''}`}
                        href="/curriculum"
                    >
                        <Image
                            aria-hidden
                            src="/navCurriculum.svg"
                            alt="navCurriculum"
                            width={11}
                            height={14}
                            className="navbar-icon"
                        />
                        Curriculum
                    </Link>
                    <Link
                        className={`navbar-link ${pathname === '/leaderboard' ? 'active' : ''}`}
                        href="/leaderboard"
                    >
                        <Image
                            aria-hidden
                            src="/navLeaderboard.svg"
                            alt="navLeaderboard"
                            width={11}
                            height={14}
                            className="navbar-icon"
                        />
                        Leaderboard
                    </Link>
                </div>

                <div className="navbar-profile">
                    <Image
                        aria-hidden
                        src="/default-pfp-18.jpg"
                        alt="profile picture"
                        width={35}
                        height={35}
                    />
                </div>
            </nav>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-links">
                    <Link
                        className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}
                        href="/dashboard"
                        onClick={closeSidebar}
                    >
                        Dashboard
                    </Link>
                    <Link
                        className={`sidebar-link ${pathname === '/curriculum' ? 'active' : ''}`}
                        href="/curriculum"
                        onClick={closeSidebar}
                    >
                        Curriculum
                    </Link>
                    <Link
                        className={`sidebar-link ${pathname === '/leaderboard' ? 'active' : ''}`}
                        href="/leaderboard"
                        onClick={closeSidebar}
                    >
                        Leaderboard
                    </Link>
                </div>
            </div>

            {/* Overlay to close the sidebar */}
            {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
        </>
    );
}
