"use client"
import React, { useEffect, useState, useRef } from 'react';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const reportCardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
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
  
  const getCurrentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };
  
  const getFileName = (extension: string) => {
    const dateStr = getCurrentDate();
    const userName = session?.user?.name || '';
    return `accessibility-report-card${userName ? `-${userName}` : ''}-${dateStr}.${extension}`;
  };
  
  const handleDownloadAsPDF = async () => {
    if (!reportCardRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress('Preparing PDF...');
    setShowMenu(false);
    
    try {
      // Dynamically import the required libraries
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      
      // Create a temporary div to clone the report card
      // This allows us to modify styles for PDF without affecting the UI
      const tempDiv = document.createElement('div');
      tempDiv.style.width = reportCardRef.current.offsetWidth + 'px';
      tempDiv.style.position = 'absolute';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      // Clone the report card and append to temp div
      const clone = reportCardRef.current.cloneNode(true) as HTMLElement;
      
      // Ensure all images are properly loaded in the clone
      const images = clone.querySelectorAll('img');
      for (let i = 0; i < images.length; i++) {
        images[i].crossOrigin = 'anonymous';
      }
      
      tempDiv.appendChild(clone);
      
      setDownloadProgress('Rendering content...');
      
      // Render to canvas
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // To handle images from different origins
        logging: false,
        backgroundColor: '#f5ebe0', // Match background color
        onclone: (document, element) => {
          // Additional styling for PDF output can be added here
          element.style.padding = '20px';
        }
      });
      
      // Clean up the temporary div
      document.body.removeChild(tempDiv);
      
      setDownloadProgress('Creating PDF...');
      
      const imageData = canvas.toDataURL('image/png');
      
      // Calculate PDF dimensions to maintain aspect ratio
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add a title to the PDF
      pdf.setFontSize(16);
      pdf.text('Accessibility Course - Report Card', 105, 15, { align: 'center' });
      
      const userName = session?.user?.name || '';
      if (userName) {
        pdf.setFontSize(12);
        pdf.text(`Student: ${userName}`, 105, 25, { align: 'center' });
      }
      
      pdf.setFontSize(10);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
      
      // Add the report card image with a slight offset to account for the header
      let position = 40;
      pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
      
      // If the image is larger than a single page, handle multiple pages
      const pageCount = Math.ceil((imgHeight + position) / pageHeight);
      
      // Add subsequent pages if needed
      for (let i = 1; i < pageCount; i++) {
        position = -(pageHeight * i) + 40; // Negative position to move up the canvas plus initial offset
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', 0, position, imgWidth, imgHeight);
      }
      
      // Add page numbers
      for (let i = 0; i < pageCount; i++) {
        pdf.setPage(i + 1);
        pdf.setFontSize(8);
        pdf.text(`Page ${i + 1} of ${pageCount}`, 105, 292, { align: 'center' });
      }
      
      setDownloadProgress('Finishing up...');
      pdf.save(getFileName('pdf'));
    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // More helpful error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('SecurityError') || error.message.includes('cross-origin')) {
          alert('Cannot download due to cross-origin restrictions. Some images may not be accessible.');
        } else {
          alert(`Failed to download report card as PDF: ${error.message}`);
        }
      } else {
        alert('Failed to download report card as PDF. Please try again later.');
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };
  
  const handleDownloadAsImage = async () => {
    if (!reportCardRef.current || isDownloading) return;
    
    setIsDownloading(true);
    setDownloadProgress('Capturing image...');
    setShowMenu(false);
    
    try {
      const domToImage = (await import('dom-to-image-more')).default;
      
      const scale = 2; // Higher scale for better quality
      const node = reportCardRef.current;
      
      const options = {
        height: node.offsetHeight * scale,
        width: node.offsetWidth * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
        },
        quality: 1,
        bgcolor: '#f5ebe0',
      };
      
      setDownloadProgress('Processing image...');
      const blob = await domToImage.toBlob(node, options);
      
      setDownloadProgress('Downloading...');
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.download = getFileName('png');
      link.href = URL.createObjectURL(blob);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error generating image:', error);
      
      // More helpful error message based on error type
      if (error instanceof Error) {
        if (error.message.includes('SecurityError') || error.message.includes('cross-origin')) {
          alert('Cannot download due to cross-origin restrictions. Some images may not be accessible.');
        } else {
          alert(`Failed to download report card as image: ${error.message}`);
        }
      } else {
        alert('Failed to download report card as image. Please try again later.');
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress('');
    }
  };
  
  const toggleMenu = () => {
    if (!isDownloading) {
      setShowMenu(!showMenu);
    }
  };
  
  // If not logged in or loading, show appropriate message
  if (!session) {
    return (
      <div className="report-card-container">
        <div className="report-card-header">
          <div className="report-card-container-title">Report Card</div>
          <p>Please log in to view your progress</p>
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
    <div className="report-card-container" ref={reportCardRef}>
      <div className="report-card-header">
        <div className="report-card-container-title">Report Card</div>      
        <div className="report-card-download-wrapper">
          <div 
            className={`report-card-download-text ${isDownloading ? 'downloading' : ''}`} 
            onClick={toggleMenu}
            style={{ cursor: isDownloading ? 'not-allowed' : 'pointer' }}
          > 
            <img src="/download-icon.svg" alt="download-icon" />
            {isDownloading ? downloadProgress || 'Generating...' : 'Download report'}
          </div>
          {showMenu && (
            <div className="report-card-download-menu" ref={menuRef}>
              <div className="menu-item" onClick={handleDownloadAsPDF}>
                <img src="/pdf-icon.svg" alt="PDF icon" onError={(e) => e.currentTarget.src = "/download-icon.svg"} />
                Download as PDF
              </div>
              <div className="menu-item" onClick={handleDownloadAsImage}>
                <img src="/image-icon.svg" alt="Image icon" onError={(e) => e.currentTarget.src = "/download-icon.svg"} />
                Download as Image
              </div>
            </div>
          )}
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