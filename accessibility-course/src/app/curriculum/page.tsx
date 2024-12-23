"use client"
import React, { useState } from 'react';
import Csidebar from './c-sidebar'
import Accordian from './accordian'
import curriculumData from './curriculumData.json';

export default function Curriculum() {
    // Initialize state with the default subItem (1.1 Title)
    const defaultSubItem = curriculumData.sections[0].subItems[0];
    const [currentSubItem, setCurrentSubItem] = useState(defaultSubItem);

  const handleSubItemClick = (subItem) => {
    setCurrentSubItem(subItem); // Set the selected subItem
};
  return (
    <>
      <Csidebar onSubItemClick={handleSubItemClick}>
            {currentSubItem && <Accordian subItem={currentSubItem} />} {/* Pass selected sub-item */}
      </Csidebar>
    </>
  )
}
