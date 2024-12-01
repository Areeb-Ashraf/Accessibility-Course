import React from "react";
import { auth, signOut } from "@/auth";
import "../styles/dashboard.css";

export default async function Dashboard() {
  const session = await auth();
  return (
    <>
      {session ? (
        <div className="dashboard-container">
          <div className="dashboard-left">
            <div className="dashboard-panel"></div>
            <div className="dashboard-middle">
              <div className="dashboard-todo">
                To Do
                <div className="todo-card-container">
                  <div className="todo-card"></div>
                  <div className="todo-card"></div>
                </div>
              </div>
              <div className="dashboard-recent-scores">
                Recent Scores
                <div className="recent-score-chart-container">
                  <pre>{JSON.stringify(session, null, 2)}</pre>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                  >
                    <button type="submit"> signOut</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="dashboard-bottom">
            <div className="dashboard-achievements">
              Achievements
              <div className="badges-container"></div>
            </div>
            <div className="dashboard-course-progress">
              Course Progress
              <div className="progress-circles-container"></div>
            </div>
            </div>
          </div>
          <div className="dashboard-right">
          <div className="recent-notifications"></div>
          <div className="stats-container">
            <div className="xp-container"></div>
            <div className="lvl-container"></div>
          </div>
          <div className="top-performers"></div>
          </div>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </>
  );
}
