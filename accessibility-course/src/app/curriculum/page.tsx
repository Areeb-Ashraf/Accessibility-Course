"use client"
import React, { useState, useEffect } from 'react';
import Csidebar from './c-sidebar'
import Accordian from './accordian'
import ReportCard from './report-card'
import curriculumData from './curriculumData.json';
import { useSession } from 'next-auth/react';
import { getUserQuizResults } from '../actions/quizActions';

// Define the quiz result interface
interface QuizResult {
    userId: string;
    quizId: string;
    score: number;
    xpEarned: number;
    completedAt: string;
}

export default function Curriculum() {
    // Initialize state with the default subItem (1.1 Title)
    const defaultSubItem = curriculumData.sections[0].subItems[0];
    const [currentSubItem, setCurrentSubItem] = useState(defaultSubItem);
    const [showReportCard, setShowReportCard] = useState(false);
    const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
    const { data: session } = useSession();

    // Fetch user's quiz results on load
    useEffect(() => {
        const fetchQuizResults = async () => {
            if (session?.user?.id) {
                try {
                    const response = await getUserQuizResults(session.user.id);
                    if (response.status === 'success') {
                        const results = response.data as QuizResult[];
                        // Get list of completed quiz IDs
                        const completedQuizIds = results.map(result => result.quizId);
                        setCompletedQuizzes(completedQuizIds);
                    }
                } catch (error) {
                    console.error("Failed to fetch quiz results:", error);
                }
            }
        };
        
        fetchQuizResults();
    }, [session?.user?.id]);

    const handleSubItemClick = (subItem) => {
        setCurrentSubItem(subItem); // Set the selected subItem
        setShowReportCard(false); // Hide report card when a curriculum item is clicked
    };

    const handleReportCardClick = () => {
        setShowReportCard(true); // Show report card when the report card link is clicked
    };

    // Function to update completed quizzes when a quiz is finished
    const handleQuizComplete = (quizId: string) => {
        if (!completedQuizzes.includes(quizId)) {
            setCompletedQuizzes(prev => [...prev, quizId]);
        }
    };

    return (
        <>
            <Csidebar 
                onSubItemClick={handleSubItemClick}
                onReportCardClick={handleReportCardClick}
                reportCardActive={showReportCard}
                completedQuizzes={completedQuizzes}
            >
                {showReportCard ? 
                    <ReportCard /> : 
                    <Accordian 
                        subItem={currentSubItem} 
                        onQuizComplete={handleQuizComplete}
                    />
                }
            </Csidebar>
        </>
    )
}