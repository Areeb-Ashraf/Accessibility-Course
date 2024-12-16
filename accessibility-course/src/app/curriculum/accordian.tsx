"use client"
import React, { useState } from 'react';
import '../styles/accordian.css';

const Accordion: React.FC = () => {
  const [activePanels, setActivePanels] = useState<number[]>([]); // Track multiple active panels

  const toggleAccordion = (index: number) => {
    if (activePanels.includes(index)) {
      // If the panel is already active, remove it from the active list
      setActivePanels(activePanels.filter((i) => i !== index));
    } else {
      // Otherwise, add it to the active list
      setActivePanels([...activePanels, index]);
    }
  };

  return (
    <div className="accordion-container">
      {['Section title 1.1.1', 'Section title 1.1.2', 'Section title 1.1.3'].map((section, index) => (
        <div className='accordion--inner-container' key={index}>
          <button
            className={`accordion ${activePanels.includes(index) ? 'accordian-active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            {section}
          </button>
          <div
            className={`panel ${activePanels.includes(index) ? 'panel-active' : ''}`}
            style={{
              maxHeight: activePanels.includes(index) ? '100px' : '0',
            }}
          >
            <div className='panel-text'>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
