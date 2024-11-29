import React from 'react'
import Link from 'next/link';
import '../styles/navbar.css'
import Image from "next/image";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname(); // Get the current route                                    
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

            <div className="navbar-links-container">
                <Link className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`} href="/dashboard">
                    <Image
                        aria-hidden
                        src='/navDashboard.svg'
                        alt='navDashboard'
                        width={11}
                        height={14}
                        className="navbar-icon"
                    />
                    Dashboard
                </Link>
                <Link className={`navbar-link ${pathname === '/curriculum' ? 'active' : ''}`} href="/curriculum"> 
                    <Image
                        aria-hidden
                        src='/navCurriculum.svg'
                        alt='navCurriculum'
                        width={11}
                        height={14}
                        className="navbar-icon"
                    />
                    Curriculum
                </Link>
                <Link className={`navbar-link ${pathname === '/leaderboard' ? 'active' : ''}`} href="/leaderboard">
                    <Image
                        aria-hidden
                        src='/navLeaderboard.svg'
                        alt='navLeaderboard'
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
    </>  
  )
}
