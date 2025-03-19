"use client"
import React, { useEffect, useState } from 'react';
import '../styles/report-card.css';
import { useSession } from 'next-auth/react';
import { getUserQuizResults, getTotalUserXp } from '../actions/quizActions';
import curriculumData from './curriculumData.json';

// Define types based on the data structures
interface QuizResult {
  userId: string;
  quizId: string;
  score: number;
  xpEarned: number;
  completedAt: string;
}

interface FormattedQuiz {
  id: string;
  title: string;
  completed: boolean;
  grade: number | null;
  xp: number;
}

interface FormattedSection {
  id: string;
  title: string;
  quizzes: FormattedQuiz[];
}

// Define curriculumData structure for better type safety
interface CurriculumSection {
  title: string;
  subItems: {
    subTitle: string;
    subSections: {
      title: string;
      content: string;
    }[];
  }[];
}

interface CurriculumData {
  mainTitle: string;
  sections: CurriculumSection[];
}

const ReportCard = () => {
  const { data: session } = useSession();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [totalXp, setTotalXp] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        try {
          const resultsResponse = await getUserQuizResults(session.user.id);
          const xpResponse = await getTotalUserXp(session.user.id);
          
          if (resultsResponse.status === 'success' && xpResponse.status === 'success') {
            setQuizResults(resultsResponse.data as QuizResult[]);
            setTotalXp(xpResponse.data as number);
          }
        } catch (error) {
          console.error("Failed to fetch quiz data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session?.user?.id]);
  
  // If not logged in or loading, show appropriate message
  if (!session) {
    return (
      <div className="report-card-container">
        <div className="report-card-header">
          <div className="report-card-container-title">Report Card</div>
          <p>Please log in to view your progress</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="report-card-container">
        <div className="report-card-header">
          <div className="report-card-container-title">Report Card</div>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }
  
  // Format data to match the curriculum structure
  const typedCurriculumData = curriculumData as CurriculumData;
  
  const formattedReportData: FormattedSection[] = typedCurriculumData.sections.map(section => {
    // Extract section number from title (e.g., "1. Perceivable" => "1")
    const sectionId = section.title.split('.')[0];
    
    return {
      id: sectionId,
      title: section.title,
      quizzes: section.subItems.map(subItem => {
        const result = quizResults.find(r => r.quizId === subItem.subTitle);
        return {
          id: subItem.subTitle,
          title: subItem.subTitle,
          completed: !!result,
          grade: result ? Math.round(result.score) : null,
          xp: result ? result.xpEarned : 0
        };
      })
    };
  });

  // Separate data for left and right containers
  const leftContainerData = formattedReportData.slice(0, Math.ceil(formattedReportData.length / 2));
  const rightContainerData = formattedReportData.slice(Math.ceil(formattedReportData.length / 2));

  return (
    <div className="report-card-container">
      <div className="report-card-header">
        <div className="report-card-container-title">Report Card</div>      
        <div className="report-card-download-text"> 
          <img src="/download-icon.svg" alt="download-icon" />
          Download report
        </div>          
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