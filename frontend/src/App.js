import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
/*
 * Version 1 of the skill tree site does not include any authentication or
 * user-specific functionality. To make the site publicly accessible
 * without a login barrier we remove all references to the login and
 * profile pages and avoid attempting to fetch a current user.  A
 * simplified `App` component renders only the home page.  If future
 * versions reintroduce authentication the previous code can be restored
 * from version control.
 */

export default function App() {
  // For the simplified publicly accessible version there is no notion
  // of a logged in user.  The user prop is always null and the home
  // page does not attempt to fetch a session or redirect.
  return (
    <Routes>
      <Route path="/" element={<Home user={null} setUser={() => {}} />} />
      {/* Additional routes such as /profile or /login have been removed */}
    </Routes>
  );
}
