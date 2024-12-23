"use client"
import React, { useState } from 'react'
import '../styles/csidebar.css'
import Image from "next/image";
import curriculumData from './curriculumData.json';

interface CsidebarProps {
    children: React.ReactNode;
    onSubItemClick: (subItem: { subTitle: string; subSections: { title: string; content: string }[] }) => void; // Add a callback prop
}

const Csidebar: React.FC<CsidebarProps> = ({ children, onSubItemClick }) => {
    const [openAccordion, setOpenAccordion] = useState(null); // Track the open accordion by index

    const toggleAccordion = (index) => {
      setOpenAccordion(openAccordion === index ? null : index); // Toggle open/close for the clicked accordion
    };

    const [activeSubItem, setActiveSubItem] = useState<string | null>(     // Track active sub-item
        curriculumData.sections[0].subItems[0].subTitle // Default to "1.1 Title"
    );

    const handleSubItemClick = (subItem) => {
    setActiveSubItem(subItem.subTitle); // Set active sub-item
    onSubItemClick(subItem); // Pass the clicked sub-item to the parent
    };
  
    const accordionsData = curriculumData.sections;
    return(
        <>
            <div className="curriculum-container">
                <div className="Csidebar-container" >
                    <div className="Csidebar-menubar">
                    <Image
                        aria-hidden
                        src="Csidebar-Menubar.svg"
                        alt="Menubar img"
                        width={15}
                        height={14}
                    />
                        Hide
                    </div>
                    <div className="Csidebar-title">Web Content Accessibility</div>
                    <div className="Csidebar-percent">75 % completed</div>
                    <div className="Csidebar-progressbar-container"><div className="Csidebar-progressbar" style={{width : "75%"}}></div></div>
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
                            <div className="Csidebar-Accordian-Satus">
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
                                <div className="Csidevbar-Accordian-subitem-status">
                                    <Image
                                        aria-hidden
                                        src="Csidebar-status.svg"
                                        alt="status icon"
                                        width={16}
                                        height={16}
                                    />
                                </div>
                                {subItem.subTitle}
                                </div>
                            ))}
                            </div>
                        )}
                        </div>
                    ))}
                </div>
                {children}
            </div>
        </>
    )
}

export default Csidebar;