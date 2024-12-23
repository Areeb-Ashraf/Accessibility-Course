"use client"
import React, { useState } from 'react';
import '../styles/accordian.css';

interface AccordionProps {
  subItem: {
    subSections: {
      title: string;
      content: string;
    }[];
  };
}

const Accordion: React.FC<AccordionProps> = ({ subItem }) => {
  const [activePanels, setActivePanels] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
      if (activePanels.includes(index)) {
          setActivePanels(activePanels.filter((i) => i !== index));
      } else {
          setActivePanels([...activePanels, index]);
      }
  };

  // Generate sections based on the selected sub-item
  // const sections = Array.from({ length: 3 }, (_, i) => `${subItem.slice(0, 3)}.${i + 1} Section title `);
  // const sections = subItem.subSections.map((section) => section.title);

  return (
    <div className="accordion-container">
      {subItem.subSections.map((section, index) => (
        <div className='accordion--inner-container' key={index}>
          <button
            className={`accordion ${activePanels.includes(index) ? 'accordian-active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            {section.title}
          </button>
          <div
            className={`panel ${activePanels.includes(index) ? 'panel-active' : ''}`}
            style={{
              maxHeight: activePanels.includes(index) ? '100px' : '0',
            }}
          >
            <div className='panel-text'>
              {section.content} {/* Render content dynamically */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion;
