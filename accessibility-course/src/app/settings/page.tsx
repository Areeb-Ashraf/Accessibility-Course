'use client'

import React, { useState, useEffect } from 'react'
import { auth } from "@/auth";
import "../styles/settings.css";
import Image from "next/image";
import { updateProfilePicture, deleteProfilePicture, getUserProfile } from '../actions/settingsActions';

export default function Settings() {
  const [user, setUser] = useState<{ name: string | null; email: string | null; image: string | null } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageKey, setImageKey] = useState(Date.now());

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        // Ensure userData has the correct type structure
        setUser({
          name: userData.name || null,
          email: userData.email || null,
          image: userData.image || null
        });
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      
      const result = await updateProfilePicture(file);
      if (result.success) {
        setUser(prev => prev ? { ...prev, image: result.imageUrl } : null);
        setImageKey(Date.now());
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      setIsLoading(true);
      
      const result = await deleteProfilePicture();
      if (result.success) {
        setUser(prev => prev ? { ...prev, image: null } : null);
        setImageKey(Date.now());
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <div className="settings">
        <div className="settings-title">Settings</div>
        <div className="settings-label">Profile Picture</div>
        <div className="settings-picture-container">
          <div className="settings-picture">
            {isLoading ? (
              <div className="loading-indicator">Loading...</div>
            ) : (
              <Image
                key={imageKey}
                aria-hidden
                src={user?.image || "/default-pfp-18.jpg"}
                alt="profile picture"
                width={85}
                height={85}
                priority
                unoptimized={!!user?.image}
              />
            )}
          </div>
          <label className="change-picture">
            Change picture
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={isLoading}
            />
          </label>
          <button 
            className="delete-picture"
            onClick={handleDeleteImage}
            disabled={isLoading}
          >
            Delete picture
          </button>
        </div>
        <div className="settings-label">Account name</div>
        <div className="settings-box">{user?.name || 'Not set'}</div>
        <div className="settings-label">Email</div>
        <div className="settings-box">{user?.email || 'Not set'}</div>
      </div>
    </div>
  );
}
