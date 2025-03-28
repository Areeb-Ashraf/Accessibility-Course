"use client"
import React, { useState } from 'react';
import '../styles/accordian.css';
import Quiz from './Quiz';

interface AccordionProps {
  subItem: {
    subTitle: string;
    subSections: {
      title: string;
      content: string;
    }[];
  };
  onQuizComplete?: (quizId: string) => void;
}

const Accordion: React.FC<AccordionProps> = ({ subItem, onQuizComplete }) => {
  const [activePanels, setActivePanels] = useState<number[]>([]);

  const toggleAccordion = (index: number) => {
      if (activePanels.includes(index)) {
          setActivePanels(activePanels.filter((i) => i !== index));
      } else {
          setActivePanels([...activePanels, index]);
      }
  };

  // Handle quiz completion
  const handleQuizComplete = (quizId: string) => {
    if (onQuizComplete) {
      onQuizComplete(quizId);
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
              maxHeight: activePanels.includes(index) ? 'fit-content' : '0',
            }}
          >
            <div className='panel-text'>
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </div>
          </div>
        </div>
      ))}
      
      {/* Quiz Section */}
      <div className='accordion--inner-container'>
        <button
          className={`accordion quiz-accordion ${activePanels.includes(subItem.subSections.length) ? 'accordian-active' : ''}`}
          onClick={() => toggleAccordion(subItem.subSections.length)}
        >
          Section Quiz
        </button>
        <div
          className={`panel ${activePanels.includes(subItem.subSections.length) ? 'panel-active' : ''}`}
          style={{
            maxHeight: activePanels.includes(subItem.subSections.length) ? 'fit-content' : '0',
          }}
        >
          <div className='panel-text'>
            <Quiz 
              key={subItem.subTitle} 
              subTitle={subItem.subTitle} 
              onComplete={() => handleQuizComplete(subItem.subTitle)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
