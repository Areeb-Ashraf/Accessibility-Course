"use client"
import React, { useState } from 'react';
import Csidebar from './c-sidebar'
import Accordian from './accordian'
import ReportCard from './report-card'
import curriculumData from './curriculumData.json';

export default function Curriculum() {
    // Initialize state with the default subItem (1.1 Title)
    const defaultSubItem = curriculumData.sections[0].subItems[0];
    const [currentSubItem, setCurrentSubItem] = useState(defaultSubItem);
    const [showReportCard, setShowReportCard] = useState(false);

    const handleSubItemClick = (subItem) => {
        setCurrentSubItem(subItem); // Set the selected subItem
        setShowReportCard(false); // Hide report card when a curriculum item is clicked
    };

    const handleReportCardClick = () => {
        setShowReportCard(true); // Show report card when the report card link is clicked
    };

    return (
        <>
            <Csidebar 
                onSubItemClick={handleSubItemClick}
                onReportCardClick={handleReportCardClick}
                reportCardActive={showReportCard}
            >
                {showReportCard ? <ReportCard /> : <Accordian subItem={currentSubItem} />}
            </Csidebar>
        </>
    )
}