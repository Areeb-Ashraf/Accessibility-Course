"use client"
import React, { useState } from 'react'
import '../styles/csidebar.css'
import Image from "next/image";

interface CsidebarProps {
    children: React.ReactNode;
}

const Csidebar: React.FC<CsidebarProps> = ({ children }) => {
    const [openAccordion, setOpenAccordion] = useState(null); // Track the open accordion by index

    const toggleAccordion = (index) => {
      setOpenAccordion(openAccordion === index ? null : index); // Toggle open/close for the clicked accordion
    };
  
    const accordionsData = [
      { title: "1. Title", subItems: ["1.1 title", "1.2 title"] },
      { title: "2. Title", subItems: ["2.1 title", "2.2 title"] },
      { title: "3. Title", subItems: ["3.1 title", "3.2 title"] },
    ];
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
                                className="Csidevbar-Accordian-subitem"
                                key={subIndex}
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
                                {subItem}
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