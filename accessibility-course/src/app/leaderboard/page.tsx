"use client"
import React from 'react'
import '../styles/leaderboard.css'
import Image from "next/image";

export default function Leaderboard() {
  // Dummy data for leaderboard
  const leaderboardData = [
    { id: 1, name: "Emma Johnson", xp: 250 },
    { id: 2, name: "Michael Chen", xp: 320 },
    { id: 3, name: "Sophia Rodriguez", xp: 180 },
    { id: 4, name: "Aiden Patel", xp: 290 },
    { id: 5, name: "Olivia Williams", xp: 210 },
    { id: 6, name: "Noah Thompson", xp: 175 },
    { id: 7, name: "Isabella Garcia", xp: 160 },
    { id: 8, name: "Liam Wilson", xp: 145 },
    { id: 9, name: "Ava Martinez", xp: 130 },
    { id: 10, name: "Ethan Brown", xp: 120 },
    { id: 11, name: "Mia Davis", xp: 110 },
    { id: 12, name: "Lucas Miller", xp: 100 }
  ];
  
  // Sort by XP in descending order and add rank
  const sortedData = [...leaderboardData]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      ...user,
      rank: index + 1
    }));
  
  // Get top 3 users
  const topThree = sortedData.slice(0, 3);
  
  // Reorder for display (2nd, 1st, 3rd)
  const displayOrder = [
    { user: topThree[1], className: "top-2" },
    { user: topThree[0], className: "top-1" },
    { user: topThree[2], className: "top-3" }
  ];
  
  // Get users ranked 4 and below for the leaderboard list
  const remainingUsers = sortedData.slice(3);

  // Search functionality
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter users based on search term
  const filteredUsers = remainingUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-left">
        <div className="leaderboard-left-title">
            Leaderboard
        </div>
        <div className="leaderboard-left-content">
          <div className="leaderboard-left-value-container">
            <div className="leaderboard-left-value">
              <img src="/leaderboard-xp-icon.svg" alt="XP" />
              20
            </div>
            <div className="leaderboard-left-label">
              XP Points
            </div>
          </div>
            <div className="leaderboard-left-value-container">
              <div className="leaderboard-left-value">
                <img src="/leaderboard-lvl-icon.svg" alt="Level" />
                3
              </div>
              <div className="leaderboard-left-label">
                Level
              </div>
            </div>
        </div>
      </div>
      <div className="leaderboard-right">
        <div className="top3-label">
          Top 3
        </div>
        <div className="top3-container">
          {displayOrder.map(({ user, className }) => (
            <div key={user.id} className={`top3-item ${className}`}>
              <div className="top3-item-XP">{user.xp}XP</div>
              <div className="top3-item-name">{user.name}</div>
              <div className="top3-image-container">
                <div className="profile-image-circle">
                  <Image
                    aria-hidden
                    src="/default-pfp-18.jpg"
                    alt="profile picture"
                    width={90}
                    height={90}
                  />
                </div>
                {/* Add badge based on user rank */}
                {user.rank === 1 && (
                  <Image
                    className="top3-badge"
                    src="/top-1-badge.svg"
                    alt="Top 1 Badge"
                    width={40}
                    height={40}
                  />
                )}
                {user.rank === 2 && (
                  <Image
                    className="top3-badge"
                    src="/top-2-badge.svg"
                    alt="Top 2 Badge"
                    width={40}
                    height={40}
                  />
                )}
                {user.rank === 3 && (
                  <Image
                    className="top3-badge"
                    src="/top-3-badge.svg"
                    alt="Top 3 Badge"
                    width={40}
                    height={40}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="leaderboard-label">
          Leaderboard
        </div>
        <div className="leaderboard-list-container">
          <div className="leaderboard-search-bar">
            <img src="/search-icon.svg" alt="Search" />
            <input 
              type="text" 
              placeholder="Search rank" 
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
          <div className="leaderboard-list-inner-container">
            {filteredUsers.map(user => (
              <div key={user.id} className="leaderboard-list-item">
                <div className="leaderboard-list-item-rank">{user.rank}</div>
                <div className="leaderboard-list-item-name">{user.name}</div>
                <div className="leaderboard-list-item-xp">{user.xp}XP</div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div className="no-results">No users found matching "{searchTerm}"</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
