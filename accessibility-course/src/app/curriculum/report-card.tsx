"use client"
import React from 'react';
import '../styles/report-card.css';

const ReportCard = () => {
  // Hard-coded sample data for development
  const sampleReportData = [
    {
      id: "1",
      title: "1. Perceivable",
      quizzes: [
        {
          id: "1.1",
          title: "1.1 Text Alternatives",
          completed: true,
          grade: 85
        },
        {
          id: "1.2",
          title: "1.2 Adaptable Content",
          completed: true,
          grade: 92
        }
      ]
    },
    {
      id: "2",
      title: "2. Operable",
      quizzes: [
        {
          id: "2.1",
          title: "2.1 Keyboard Accessibility",
          completed: true,
          grade: 78
        },
        {
          id: "2.2",
          title: "2.2 Sufficient Time",
          completed: false,
          grade: null
        },
        {
          id: "2.3",
          title: "2.3 Seizures and Physical Reactions",
          completed: true,
          grade: 90
        }
      ]
    },
    {
      id: "3",
      title: "3. Understandable",
      quizzes: [
        {
          id: "3.1",
          title: "3.1 Readable Content",
          completed: true,
          grade: 88
        },
        {
          id: "3.2",
          title: "3.2 Predictable Behavior",
          completed: false,
          grade: null
        },
        {
          id: "3.3",
          title: "3.3 Input Assistance",
          completed: true,
          grade: 95
        }
      ]
    },
    {
      id: "4",
      title: "4. Robust",
      quizzes: [
        {
          id: "4.1",
          title: "4.1 Compatible Technologies",
          completed: true,
          grade: 82
        },
        {
          id: "4.2",
          title: "4.2 Future Compatibility",
          completed: false,
          grade: null
        }
      ]
    }
  ];

  // Separate data for left and right containers
  const leftContainerData = sampleReportData.slice(0, 2); // 1. Perceivable, 2. Operable
  const rightContainerData = sampleReportData.slice(2, 4); // 3. Understandable, 4. Robust

  return (
    <div className="report-card-container">
        <div className="report-card-header">
            <div className="report-card-container-title">Report Card</div>      
            <div className="report-card-download-text"> 
                <img src="/download-icon.svg" alt="download-icon" />
                Download report</div>          
            <div className="report-card-legend-container">
                <div className="report-card-legend-item">
                    <img src="/completed.svg" alt="completed-icon" />
                    Completed
                </div>
                <div className="report-card-legend-item">
                    <img src="/not-started.svg" alt="not-started-icon" />
                    Not Started
                </div>
            </div>
        </div>
        <div className="report-card-body">
            <div className="card-container-left">
                {leftContainerData.map(section => (
                    <div key={section.id} className="card-container">
                        <div className="card-header">{section.title}</div>
                        <div className="card-body">
                            <div className="card-body-titles">
                                <div className="card-body-title card-body-title-quiz">Quiz</div>
                                <div className="card-body-title card-body-title-status">Status</div>
                                <div className="card-body-title">Grade</div>
                            </div>
                            {section.quizzes.map((quiz, index) => (
                                <div key={quiz.id} className={`card-body-item ${index === section.quizzes.length - 1 ? 'item-last' : ''}`}>
                                    <div className="card-body-item-quiz">
                                        {quiz.id} Quiz
                                    </div>
                                    <div className="card-body-item-status">
                                        {quiz.completed ? (
                                            <>
                                                <img src="/completed.svg" alt="completed-icon" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <img src="/not-started.svg" alt="not-started-icon" />
                                                Not Started
                                            </>
                                        )}
                                    </div>
                                    <div className={`card-body-item-grade ${quiz.grade == null ? "not-completed": ""}`}>
                                        {quiz.grade !== null ? `${quiz.grade}%` : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="card-container-right">
                {rightContainerData.map(section => (
                    <div key={section.id} className="card-container">
                        <div className="card-header">{section.title}</div>
                        <div className="card-body">
                            <div className="card-body-titles">
                                <div className="card-body-title card-body-title-quiz">Quiz</div>
                                <div className="card-body-title card-body-title-status">Status</div>
                                <div className="card-body-title">Grade</div>
                            </div>
                            {section.quizzes.map((quiz, index) => (
                                <div key={quiz.id} className={`card-body-item ${index === section.quizzes.length - 1 ? 'item-last' : ''}`}>
                                    <div className="card-body-item-quiz">
                                        {quiz.id} Quiz
                                    </div>
                                    <div className="card-body-item-status">
                                        {quiz.completed ? (
                                            <>
                                                <img src="/completed.svg" alt="completed-icon" />
                                                Completed
                                            </>
                                        ) : (
                                            <>
                                                <img src="/not-started.svg" alt="not-started-icon" />
                                                Not Started
                                            </>
                                        )}
                                    </div>
                                    <div className={`card-body-item-grade ${quiz.grade == null ? "not-completed": ""}`}>
                                        {quiz.grade !== null ? `${quiz.grade}%` : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default ReportCard; 