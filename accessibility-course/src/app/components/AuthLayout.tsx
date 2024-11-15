"use client";
import React, { useState } from 'react'
import '../styles/authLayout.css'
import Image from "next/image";
// how to import:

interface AuthLayoutProps {
    children: React.ReactNode;
  }

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    const [imgIndex, setImgIndex] = useState(0);

    const images = [
        { name:'Interactive Dashboard', src: '/interactiveDashboard.svg', alt: 'Interactive Dashboard img' },
        { name:'Learning Modules', src: '/learningModules.svg', alt: 'Learning Modules img' },
        { name:'Progress Report', src: '/progressReport.svg', alt: 'Progress Report img' },
    ];

    const nextImg = () => {
        setImgIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setImgIndex((prevIndex) => 
        (prevIndex - 1 + images.length) % images.length
        );
    };

  return (
    <>
        <div className="auth-layout-container">
            <div className="auth-layout-left">
                <h1 className='auth-title'>Learn Accessibility</h1>
                <Image
                    aria-hidden
                    src={images[imgIndex].src}
                    alt={images[imgIndex].alt}
                    width={350}
                    height={350}
                />
                <div className='auth-imgName'>{images[imgIndex].name}</div>
                <div className="auth-img-navigation">
                    <div className="auth-img-btn" onClick={prevImage}>&lt;</div>
                    <div className="auth-img-nav-container">
                        {images.map((_, index) => (
                        <div key={index} className={`auth-img-nav ${imgIndex == index ? 'auth-img-active': ''}`} ></div>
                        ))}
                    </div>
                    <div className="auth-img-btn" onClick={nextImg}>&gt;</div>
                </div>
            </div>
            <div className="auth-layout-right">{children}</div>
        </div>
    </>
  )
}

export default AuthLayout;