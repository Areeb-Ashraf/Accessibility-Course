"use client"
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { signOutUser } from '../actions/authAction';
import '../styles/navbar.css';
import { useSession } from 'next-auth/react';
import { getUserProfileImage } from '../actions/settingsActions';

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    const closeDropdown = () => setDropdownOpen(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Fetch user profile image
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (session?.user?.id) {
                try {
                    const response = await getUserProfileImage();
                    if (response.status === 'success' && response.data?.image) {
                        setUserProfileImage(response.data.image);
                    }
                } catch (error) {
                    console.error("Error fetching user profile image:", error);
                }
            }
        };

        fetchUserProfile();
    }, [session]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

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

                <div className={`navbar-profile ${pathname === '/settings' ? 'profile-active' : ''}`} onClick={toggleDropdown} ref={dropdownRef}>
                    <Image
                        aria-hidden
                        src={userProfileImage ? userProfileImage : "/default-pfp-18.jpg"}
                        alt="profile picture"
                        width={35}
                        height={35}
                        unoptimized={!!userProfileImage}
                    />
                    {dropdownOpen && (
                        <div className="profile-dropdown">
                            <Link href="/settings" className="dropdown-item">
                                Settings
                            </Link>
                            <button 
                                type="button" 
                                className="logout-button" 
                                onClick={signOutUser}
                            >
                                Logout
                            </button>
                        </div>
                    )}
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
