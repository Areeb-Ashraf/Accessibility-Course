import React from "react";
import { auth, signOut } from "@/auth";
import "../styles/dashboard.css";
import Image from "next/image";

export default async function Dashboard() {
  const session = await auth();
  
  // User's current level and XP (these would normally come from a database)
  const user_lvl = 2; // Example: User is level 2
  const user_xp = 150; // Example: User has 150 XP

  // Section completion percentages
  const progressSections = [
    { title: 'Perceivable', progress: 75 },
    { title: 'Operable', progress: 45 },
    { title: 'Understandable', progress: 60 },
    { title: 'Robust', progress: 30 }
  ];

   // Dummy data for top performers
   const performersData = [
    { id: 1, name: "Emma Johnson", xp: 250 },
    { id: 2, name: "Michael Chen", xp: 320 },
    { id: 3, name: "Sophia Rodriguez", xp: 180 },
    { id: 4, name: "Aiden Patel", xp: 290 },
    { id: 5, name: "Olivia Williams", xp: 210 },
    { id: 6, name: "Noah Thompson", xp: 175 },
    { id: 7, name: "Isabella Garcia", xp: 160 },
    { id: 8, name: "Liam Wilson", xp: 145 },
    { id: 9, name: "Ava Martinez", xp: 130 },
    { id: 10, name: "Ethan Brown", xp: 120 }
  ];

  // Sort by XP in descending order and add rank
  const sortedPerformers = [...performersData]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));

  return (
    <>
      {session ? (
        <div className="dashboard-container">
          <div className="dashboard-left">
            <div className="dashboard-panel">
              <div className="dashboard-panel-greeting">
                <h2>Hey, Oliver!</h2>
                <p>Another great day to continue learning.</p>
              </div>
              <div className="dashboard-panel-progress">
                <div className="progress-text">
                  <img src="/db-panel-icon.svg" alt="lvl-icon" />
                  <p>Take 2 more quizzes to Level Up</p>
                </div>
                <div className="progress-lvls">
                  <div className="prev-lvl">Level 3</div>
                  <p>-------------</p>
                  <div className="next-lvl">Level 4</div>
                </div>
              </div>
            </div>
            <div className="dashboard-middle">
              <div className="dashboard-todo">
                To Do
                <div className="todo-card-container">
                  <div className="todo-card">
                    <div className="todo-inner">
                      <div className="todo-image-container">
                        <img src="/db-todo-image.svg" alt="todo-img" />
                      </div>
                      <div className="todo-text-container">
                        <p>4.1 Compatible Quiz</p>
                      </div>
                      <div className="todo-progress-container">
                        <div className="todo-progress-bar">
                          <div className="todo-progress-fill" style={{ width: '50%' }}></div>
                        </div>
                        <p>50%</p>
                      </div> 
                      <div className="todo-continue"> 
                        continue
                      </div>
                    </div>
                  </div>
                  <div className="todo-card"></div>
                </div>
              </div>
              <div className="dashboard-recent-scores">
                Recent Scores
                <div className="recent-score-chart-container">
                  {/* <pre>{JSON.stringify(session, null, 2)}</pre>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                  >
                    <button type="submit"> signOut</button>
                  </form> */}
                </div>
              </div>
            </div>
            <div className="dashboard-bottom">
            <div className="dashboard-achievements">
              Achievements
              <div className="badges-container">
                {[1, 2, 3, 4].map((level) => (
                  <div key={`level-${level}`} className="badge-item">
                    <img 
                      src="/achievement-lvl-badge.svg" 
                      alt={`Level ${level} badge`} 
                      style={{ filter: level > user_lvl ? 'grayscale(1)' : 'none' }}
                    />
                    <span className="badge-text">Level {level}</span>
                  </div>
                ))}
                {[5, 10, 25, 50, 100, 150, 200, 300, 500, 700, 1000].map((xp) => (
                  <div key={`xp-${xp}`} className="xp-badge-item" style={{ filter: xp > user_xp ? 'grayscale(1)' : 'none' }}>
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
                20
              </div>
              <div className="dashboard-label">
                XP Points
              </div>
            </div>
            <div className="lvl-container">
              <div className="dashboard-value">
                <img src="/leaderboard-lvl-icon.svg" alt="Level" />
                3
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
                {sortedPerformers.map(performer => (
                  <div key={performer.id} className="top-performers-item">
                    <div className="performer-rank">{performer.rank}</div>
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
                    <div className="performer-xp">{performer.xp}xp</div>
                  </div>
                ))}
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
