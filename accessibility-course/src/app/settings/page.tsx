import React from 'react'
import { auth } from "@/auth";
import "../styles/settings.css";
import Image from "next/image";

export default async function Settings() {
    const session = await auth();
  return (
    <>
        {session ? (
        <div className="settings-container">
            <div className="settings">
                <div className="settings-title">Settings</div>
                <div className="settings-label">Profile Picture</div>
                <div className="settings-picture-container">
                    <div className="settings-picture">
                        <Image
                            aria-hidden
                            src="/default-pfp-18.jpg"
                            alt="profile picture"
                            width={85}
                            height={85}
                        />
                    </div>
                    <div className="change-picture">Change picture</div>
                    <div className="delete-picture">Delete picture</div>
                </div>
                <div className="settings-label">Account name</div>
                <div className="settings-box">Oliver Quinn</div>
                <div className="settings-label">Email</div>
                <div className="settings-box">oliverquinn@gmail.com</div>
            </div>
        </div>
        ) : (
            <div>Not signed in</div>
        )}
    </>
  )
}
