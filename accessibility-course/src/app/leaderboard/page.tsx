"use client"
import React, { useEffect, useState } from 'react'
import '../styles/leaderboard.css'
import Image from "next/image";
import { useSession } from 'next-auth/react';
import { getAllUsersWithXp, getTotalUserXp } from '../actions/quizActions';

interface UserWithXp {
  id: string;
  name: string;
  totalXp: number;
  rank?: number;
}

export default function Leaderboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserWithXp[]>([]);
  const [currentUserXp, setCurrentUserXp] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Fetch users data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users with XP
        const response = await getAllUsersWithXp();
        
        if (response.status === 'success') {
          // Add rank to each user
          const usersWithRank = response.data.map((user, index) => ({
            ...user,
            rank: index + 1
          }));
          
          setUsers(usersWithRank);
        }
        
        // Fetch current user's XP if logged in
        if (session?.user?.id) {
          const userXpResponse = await getTotalUserXp(session.user.id);
          if (userXpResponse.status === 'success') {
            setCurrentUserXp(userXpResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [session?.user?.id]);

  // Get top 3 users with fallback for missing positions
  const getTopThree = (): [UserWithXp, UserWithXp, UserWithXp] => {
    const defaultUser: UserWithXp = { id: 'na', name: 'N/A', totalXp: 0 };
    
    // Create array of top 3 or fill with N/A if not enough users
    const top: UserWithXp[] = [
      users[0] || { ...defaultUser, rank: 1 },
      users[1] || { ...defaultUser, rank: 2 },
      users[2] || { ...defaultUser, rank: 3 }
    ];
    
    return [top[0], top[1], top[2]];
  };
  
  // Reorder for display (2nd, 1st, 3rd)
  const getDisplayOrder = () => {
    const [first, second, third] = getTopThree();
    
    return [
      { user: second, className: "top-2" },
      { user: first, className: "top-1" },
      { user: third, className: "top-3" }
    ];
  };
  
  // Get users ranked 4 and below for the leaderboard list
  const remainingUsers = users.slice(3);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter users based on search term
  const filteredUsers = remainingUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Display loading state
  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-left">
          <div className="leaderboard-left-title">
            Leaderboard
          </div>
        </div>
        <div className="leaderboard-right">
          <div className="leaderboard-loading">Loading leaderboard data...</div>
        </div>
      </div>
    );
  }

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
              {currentUserXp}
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
          {getDisplayOrder().map(({ user, className }) => (
            <div key={user.id} className={`top3-item ${className}`}>
              <div className="top3-item-XP">{user.totalXp}XP</div>
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
              placeholder="Search by name" 
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </div>
          <div className="leaderboard-list-inner-container">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <div key={user.id} className="leaderboard-list-item">
                  <div className="leaderboard-list-item-rank">{user.rank}</div>
                  <div className="leaderboard-list-item-name">{user.name}</div>
                  <div className="leaderboard-list-item-xp">{user.totalXp}XP</div>
                </div>
              ))
            ) : searchTerm ? (
              <div className="no-results">No users found matching "{searchTerm}"</div>
            ) : (
              <div className="no-results">No users here yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
