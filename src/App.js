import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import SignIn from './pages/SignIn';
import ProfileSetup from './pages/ProfileSetup';
import TutorDashboard from './pages/TutorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false); // Track profile completion

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          console.log('Successfully signed in:', result.user);
        })
        .catch((error) => {
          console.error('Error signing in with email link:', error);
        });
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserRole(data.role);
            setIsProfileComplete(data.name && data.role); // Profile is complete if name and role exist
          } else {
            setIsProfileComplete(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  return (
    <Router>
      <Routes>
        {/* Redirect authenticated users based on profile completion */}
        <Route
          path="/"
          element={
            currentUser
              ? isProfileComplete
                ? userRole === 'Tutor'
                  ? <Navigate to="/tutor-dashboard" />
                  : <Navigate to="/student-dashboard" />
                : <Navigate to="/profile-setup" />
              : <SignIn />
          }
        />
        {/* Profile setup route */}
        <Route
          path="/profile-setup"
          element={
            currentUser && !isProfileComplete ? <ProfileSetup /> : <Navigate to="/" />
          }
        />
        {/* Tutor Dashboard route */}
        <Route
          path="/tutor-dashboard"
          element={
            currentUser && userRole === 'Tutor' ? <TutorDashboard /> : <Navigate to="/" />
          }
        />
        {/* Student Dashboard route */}
        <Route
          path="/student-dashboard"
          element={
            currentUser && userRole === 'Student' ? <StudentDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;