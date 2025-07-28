import React from 'react';

/**
 * Displays a user’s profile information and progress summary.  Expects
 * `user` with `username` and `email` and `progress` object with
 * completion counts.
 */
export default function UserProfile({ user, progressSummary }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p className="text-sm mb-2"><strong>Name:</strong> {user.username}</p>
      <p className="text-sm mb-4"><strong>Email:</strong> {user.email}</p>
      <div className="mb-4">
        <h3 className="font-medium mb-2">Progress</h3>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 relative">
            {/* simple circular progress indicator using SVG */}
            <svg className="transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <path
                className="text-primary"
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                strokeDasharray={`${progressSummary.percentage}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              ></path>
              <text
                x="18"
                y="20.35"
                className="text-primary text-xs"
                dominantBaseline="central"
                textAnchor="middle"
              >
                {Math.round(progressSummary.percentage)}%
              </text>
            </svg>
          </div>
          <div>
            <p className="text-sm"><strong>Completed:</strong> {progressSummary.completed}</p>
            <p className="text-sm"><strong>Total:</strong> {progressSummary.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
