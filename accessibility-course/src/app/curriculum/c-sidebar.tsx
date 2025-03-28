"use client"
import React, { useState, useEffect, useRef } from 'react'
import '../styles/csidebar.css'
import Image from "next/image";
import curriculumData from './curriculumData.json';
import { useSession } from 'next-auth/react';

interface CsidebarProps {
    children: React.ReactNode;
    onSubItemClick: (subItem: { subTitle: string; subSections: { title: string; content: string }[] }) => void;
    onReportCardClick: () => void; // Add callback for report card click
    reportCardActive?: boolean; // Track if report card is active
    completedQuizzes: string[]; // Array of completed quiz IDs
}

const Csidebar: React.FC<CsidebarProps> = ({ 
    children, 
    onSubItemClick, 
    onReportCardClick, 
    reportCardActive = false,
    completedQuizzes = [] 
}) => {
    const [openAccordion, setOpenAccordion] = useState(null); // Track the open accordion by index
    const [sidebarOpen, setSidebarOpen] = useState(true); // Track if sidebar is open (default to open on desktop)
    const [isMobile, setIsMobile] = useState(false); // Track if we're on mobile view
    const [manualToggle, setManualToggle] = useState(false); // Track if sidebar was manually toggled
    const [overallProgress, setOverallProgress] = useState(0); // Track overall progress percentage

    // Calculate overall progress whenever completedQuizzes changes
    useEffect(() => {
        // Calculate overall progress
        const totalSections = curriculumData.sections.reduce(
            (total, section) => total + section.subItems.length, 0
        );
        
        const progressPercentage = totalSections > 0 
            ? Math.round((completedQuizzes.length / totalSections) * 100)
            : 0;
            
        setOverallProgress(progressPercentage);
    }, [completedQuizzes]);

    // Function to check if all subItems in a section are completed
    const isSectionCompleted = (section) => {
        return section.subItems.every(subItem => 
            completedQuizzes.includes(subItem.subTitle)
        );
    };

    const toggleAccordion = (index) => {
      setOpenAccordion(openAccordion === index ? null : index); // Toggle open/close for the clicked accordion
    };

    const toggleSidebar = () => {
        setManualToggle(true); // Mark that this was a manual toggle
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setManualToggle(false); // Reset manual toggle flag
            setSidebarOpen(false);
        }
    };

    // Check window size on mount and resize
    useEffect(() => {
        const checkWindowSize = () => {
            const mobile = window.innerWidth <= 768;
            setIsMobile(mobile);
            
            // Only auto-adjust sidebar if it wasn't manually toggled
            if (!manualToggle) {
                // Auto-close sidebar on mobile, keep open on desktop
                if (mobile && sidebarOpen) {
                    setSidebarOpen(false);
                } else if (!mobile && !sidebarOpen) {
                    setSidebarOpen(true);
                }
            }
            
            // If transitioning from mobile to desktop, reset manual toggle
            if (!mobile) {
                setManualToggle(false);
            }
        };

        // Initial check
        checkWindowSize();

        // Add event listener
        window.addEventListener('resize', checkWindowSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkWindowSize);
    }, [sidebarOpen, manualToggle]);

    const [activeSubItem, setActiveSubItem] = useState<string | null>(     // Track active sub-item
        curriculumData.sections[0].subItems[0].subTitle // Default to "1.1 Title"
    );

    const handleSubItemClick = (subItem) => {
        setActiveSubItem(subItem.subTitle); // Set active sub-item
        onSubItemClick(subItem); // Pass the clicked sub-item to the parent
        closeSidebar(); // Close sidebar on mobile after clicking a sub-item
    };
    
    const handleReportCardClick = () => {
        setActiveSubItem(null); // Clear active sub-item
        onReportCardClick(); // Call the report card click handler
        closeSidebar(); // Close sidebar on mobile
    };
  
    const accordionsData = curriculumData.sections;
    return(
        <>
            <div className="curriculum-container">
                {/* Mobile toggle button - only visible on mobile */}
                <div className={`Csidebar-mobile-toggle ${isMobile ? 'visible' : ''}`} onClick={toggleSidebar}>
                    <Image
                        aria-hidden
                        src="Csidebar-Menubar.svg"
                        alt="Menubar img"
                        width={21}
                        height={20}
                    />
                </div>

                {/* Sidebar with responsive classes */}
                <div className={`Csidebar-container ${isMobile ? 'mobile' : ''} ${sidebarOpen ? 'open' : 'closed'}`}>
                    <div className="Csidebar-menubar" onClick={toggleSidebar}>
                        <Image
                            aria-hidden
                            src="Csidebar-Menubar.svg"
                            alt="Menubar img"
                            width={15}
                            height={14}
                        />
                        {sidebarOpen ? 'Hide' : 'Show'}
                    </div>
                    <div className="Csidebar-title">Web Content Accessibility</div>
                    <div className="Csidebar-percent">{overallProgress} % completed</div>
                    <div className="Csidebar-progressbar-container">
                        <div className="Csidebar-progressbar" style={{width : `${overallProgress}%`}}></div>
                    </div>
                    {accordionsData.map((accordion, index) => (
                        <div
                        className="Csidebar-Accordian-Container"
                        key={index}
                        >
                        <div className="Csidebar-Accordian-header" onClick={() => toggleAccordion(index)}>
                            <div className="Csidebar-Accordian-symbol">
                            <Image
                                aria-hidden
                                src={
                                openAccordion === index
                                    ? "Csidebar-bottom-icon.svg"
                                    : "Csidebar-right-icon.svg"
                                }
                                alt="toggle icon"
                                width={openAccordion === index ? 15 : 7}
                                height={openAccordion === index ? 8 : 14}
                            />
                            </div>
                            <div className="Csidebar-Accordian-text">{accordion.title}</div>
                            <div 
                                className="Csidebar-Accordian-Satus"
                                style={{ display: isSectionCompleted(accordion) ? 'flex' : 'none' }}
                            >
                            <Image
                                aria-hidden
                                src="Csidebar-status.svg"
                                alt="status icon"
                                width={22}
                                height={22}
                            />
                            </div>
                        </div>
                        {openAccordion === index && (
                            <div className="Csidevbar-Accordian-subitem-container">
                            {accordion.subItems.map((subItem, subIndex) => (
                                <div
                                className={`Csidevbar-Accordian-subitem ${
                                    activeSubItem === subItem.subTitle ? 'subItem-active' : ''
                                }`}
                                key={subIndex}
                                onClick={() => handleSubItemClick(subItem)} 
                                >
                                <div 
                                    className="Csidevbar-Accordian-subitem-status"
                                    style={{ display: completedQuizzes.includes(subItem.subTitle) ? 'flex' : 'none' }}
                                >
                                    <Image
                                        aria-hidden
                                        src="Csidebar-status.svg"
                                        alt="status icon"
                                        width={16}
                                        height={16}
                                    />
                                </div>
                                <div className="Csidevbar-Accordian-subitem-text">{subItem.subTitle}</div>
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    ))}
                    
                    {/* Report Card Link */}
                    <div 
                        className={`report-card-link ${reportCardActive ? 'report-card-link-active' : ''}`}
                        onClick={handleReportCardClick}
                        role="button"
                        tabIndex={0}
                    >
                        View Your Report Card
                    </div>
                </div>

                <div className={`Csidebar-content ${sidebarOpen && !isMobile ? 'with-sidebar' : 'full-width'}`}>
                    {children}
                </div>
            </div>

            {/* Overlay for mobile - only visible when sidebar is open on mobile */}
            {isMobile && sidebarOpen && <div className="Csidebar-overlay" onClick={closeSidebar}></div>}
        </>
    )
}

export default Csidebar;