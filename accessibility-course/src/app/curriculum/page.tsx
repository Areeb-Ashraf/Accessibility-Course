"use client"
import React, { useState } from 'react';
import Csidebar from './c-sidebar'
import Accordian from './accordian'

export default function Curriculum() {
  const [currentSubItem, setCurrentSubItem] = useState(null);

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
