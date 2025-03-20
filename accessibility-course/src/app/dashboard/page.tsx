import React from "react";
import { auth, signOut } from "@/auth";
import "../styles/dashboard.css";
import Image from "next/image";
import { getUserInfoWithXp, getAllUsersWithXp, calculateLevelFromXp, xpNeededForNextLevel, getSectionProgress, getNextTodoQuizzes, getSectionXpData } from "../actions/quizActions";
import Link from "next/link";
import ScoresChart from "../components/ScoresChart";

// Define types
interface Performer {
  id: string;
  name: string;
  totalXp: number;
}

interface ProgressSection {
  title: string;
  progress: number;
}

interface TodoQuiz {
  quizId: string;
  title: string;
  section: string;
}

export default async function Dashboard() {
  const session = await auth();
  
  // Default values
  let userName = "User";
  let userXp = 0;
  let userLevel = 0;
  let xpNeeded: number | null = 25; // Default XP needed for level 2
  let topPerformers: Performer[] = [];
  let progressSections: ProgressSection[] = [
    { title: 'Perceivable', progress: 0 },
    { title: 'Operable', progress: 0 },
    { title: 'Understandable', progress: 0 },
    { title: 'Robust', progress: 0 }
  ];
  let todoQuizzes: TodoQuiz[] = [];
  let sectionXpData: {[sectionTitle: string]: number} = {
    'Perceivable': 0,
    'Operable': 0,
    'Understandable': 0,
    'Robust': 0
  };
  
  // Fetch real data if user is logged in
  if (session?.user?.id) {
    try {
      // Get user's info and XP
      const userInfoResponse = await getUserInfoWithXp(session.user.id);
      if (userInfoResponse.status === 'success') {
        userName = userInfoResponse.data.name;
        userXp = userInfoResponse.data.totalXp;
        userLevel = await calculateLevelFromXp(userXp);
        xpNeeded = await xpNeededForNextLevel(userXp);
      }
      
      // Get all users with XP for top performers
      const allUsersResponse = await getAllUsersWithXp();
      if (allUsersResponse.status === 'success') {
        // Limit to top 10 performers
        topPerformers = allUsersResponse.data.slice(0, 10);
      }
      
      // Get section progress
      const progressResponse = await getSectionProgress(session.user.id);
      if (progressResponse.status === 'success') {
        // Update section progress with real data
        progressSections = [
          { title: 'Perceivable', progress: progressResponse.data['1'] || 0 },
          { title: 'Operable', progress: progressResponse.data['2'] || 0 },
          { title: 'Understandable', progress: progressResponse.data['3'] || 0 },
          { title: 'Robust', progress: progressResponse.data['4'] || 0 }
        ];
      }
      
      // Get next todo quizzes
      const todoResponse = await getNextTodoQuizzes(session.user.id);
      if (todoResponse.status === 'success') {
        todoQuizzes = todoResponse.data;
      }
      
      // Get section XP data for chart
      const sectionXpResponse = await getSectionXpData(session.user.id);
      if (sectionXpResponse.status === 'success') {
        sectionXpData = sectionXpResponse.data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Render appropriate content for todo cards based on remaining quizzes
  const renderTodoCards = () => {
    // If no quizzes are left
    if (todoQuizzes.length === 0) {
      return (
        <>
          <div className="todo-card">
            <div className="todo-inner">
              <div className="todo-image-container">
                <img src="/db-todo-image.svg" alt="todo-img" />
              </div>
              <div className="todo-text-container">
                <p>You finished all todos!</p>
              </div>
            </div>
          </div>
          <div className="todo-card">
            <div className="todo-inner">
              <div className="todo-image-container">
                <img src="/db-todo-image.svg" alt="todo-img" />
              </div>
              <div className="todo-text-container">
                <p>You finished all todos!</p>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    // If only one quiz is left
    if (todoQuizzes.length === 1) {
      return (
        <>
          <div className="todo-card">
            <div className="todo-inner">
              <div className="todo-image-container">
                <img src="/db-todo-image.svg" alt="todo-img" />
              </div>
              <div className="todo-text-container">
                <p>{todoQuizzes[0].quizId}</p>
              </div>
              <Link href={`/curriculum`} className="todo-continue">
                continue
              </Link>
            </div>
          </div>
          <div className="todo-card">
            <div className="todo-inner">
              <div className="todo-image-container">
                <img src="/db-todo-image.svg" alt="todo-img" />
              </div>
              <div className="todo-text-container">
                <p>You finished almost all todos!</p>
              </div>
            </div>
          </div>
        </>
      );
    }
    
    // If two or more quizzes are left
    return (
      <>
        <div className="todo-card">
          <div className="todo-inner">
            <div className="todo-image-container">
              <img src="/db-todo-image.svg" alt="todo-img" />
            </div>
            <div className="todo-text-container">
              <p>{todoQuizzes[0].quizId}</p>
            </div>
            <Link href={`/curriculum`} className="todo-continue">
              continue
            </Link>
          </div>
        </div>
        <div className="todo-card">
          <div className="todo-inner">
            <div className="todo-image-container">
              <img src="/db-todo-image.svg" alt="todo-img" />
            </div>
            <div className="todo-text-container">
              <p>{todoQuizzes[1].quizId}</p>
            </div>
            <Link href={`/curriculum`} className="todo-continue">
              continue
            </Link>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {session ? (
        <div className="dashboard-container">
          <div className="dashboard-left">
            <div className="dashboard-panel">
              <div className="dashboard-panel-greeting">
                <h2>Hey, {userName}!</h2>
                <p>Another great day to continue learning.</p>
              </div>
              <div className="dashboard-panel-progress">
                <div className="progress-text">
                  <img src="/db-panel-icon.svg" alt="lvl-icon" />
                  {xpNeeded !== null ? (
                    <p>Keep going! {xpNeeded} XP left to Level Up</p>
                  ) : (
                    <p>Hooray! You've reached the highest level!</p>
                  )}
                </div>
                <div className="progress-lvls">
                  <div className="prev-lvl">Level {userLevel}</div>
                  <p>-------------</p>
                  <div className="next-lvl">
                    {userLevel < 4 ? `Level ${userLevel + 1}` : 'Master'}
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard-middle">
              <div className="dashboard-todo">
                To Do
                <div className="todo-card-container">
                  {renderTodoCards()}
                </div>
              </div>
              <div className="dashboard-recent-scores">
                Recent Scores
                <div className="recent-score-chart-container">
                  <ScoresChart sectionData={sectionXpData} />
                </div>
              </div>
            </div>
            <div className="dashboard-bottom">
            <div className="dashboard-achievements">
              Achievements
              <div className="badges-container">
                {[0, 2, 3, 4].map((level) => (
                  <div key={`level-${level}`} className="badge-item">
                    <img 
                      src="/achievement-lvl-badge.svg" 
                      alt={`Level ${level} badge`} 
                      style={{ filter: level > userLevel ? 'grayscale(1)' : 'none' }}
                    />
                    <span className="badge-text">Level {level}</span>
                  </div>
                ))}
                {[5, 10, 25, 50, 100, 150, 200, 300, 500, 700, 1000].map((xp) => (
                  <div key={`xp-${xp}`} className="xp-badge-item" style={{ filter: xp > userXp ? 'grayscale(1)' : 'none' }}>
                    <img 
                      src="/achievement-xp-badge.svg" 
                      alt={`XP ${xp} badge`} 
                    />
                    {xp}
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-course-progress">
              Course Progress
              <div className="progress-circles-container">
                {progressSections.map((section, index) => (
                  <div key={section.title} className="progress-circle-item">
                    <div className="progress-ring-container">
                      <svg className="progress-ring" width="80" height="80">
                        <circle 
                          className="progress-ring-circle-bg" 
                          stroke="#E3D5CA" 
                          strokeWidth="10" 
                          fill="transparent" 
                          r="32" 
                          cx="40" 
                          cy="40"
                        />
                        <circle 
                          className="progress-ring-circle" 
                          stroke="#C16102" 
                          strokeWidth="10" 
                          fill="transparent" 
                          r="32" 
                          cx="40" 
                          cy="40"
                          style={{
                            strokeDasharray: `${2 * Math.PI * 32}`,
                            strokeDashoffset: `${2 * Math.PI * 32 * (1 - section.progress / 100)}`
                          }}
                        />
                      </svg>
                      <span className="course-progress-text">{section.progress}%</span>
                    </div>
                    <span className="course-progress-title">{index + 1}. {section.title}</span>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </div>
          <div className="dashboard-right">
          <div className="panda-container">
            <p>Here's a cute panda to cheer you up!</p>
            <img src="/db-panda.svg" alt="notification-icon" className="db-panda"/>
          </div>
          <div className="stats-container">
            <div className="xp-container">
              <div className="dashboard-value">
                <img src="/leaderboard-xp-icon.svg" alt="XP" />
                {userXp}
              </div>
              <div className="dashboard-label">
                XP Points
              </div>
            </div>
            <div className="lvl-container">
              <div className="dashboard-value">
                <img src="/leaderboard-lvl-icon.svg" alt="Level" />
                {userLevel}
              </div>
              <div className="dashboard-label">
                Level
              </div>
            </div>
          </div>
          <div className="top-performers">
            <div className="top-performrs-header">
              Top Performers
            </div>
            <div className="top-performers-container">
                {topPerformers.length > 0 ? (
                  topPerformers.map((performer, index) => (
                    <div key={performer.id} className="top-performers-item">
                      <div className="performer-rank">{index + 1}</div>
                      <div className="performer-pfp-container">
                        <Image
                          aria-hidden
                          src="/default-pfp-18.jpg"
                          alt="profile picture"
                          width={45}
                          height={45}
                        />
                      </div>
                      <p>{performer.name}</p>
                      <div className="performer-xp">{performer.totalXp}xp</div>
                    </div>
                  ))
                ) : (
                  <div className="no-performers">No users yet</div>
                )}
              </div>
          </div>
          </div>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </>
  );
}
