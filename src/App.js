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
import TutorProfile from './pages/TutorProfile'; // Adjust the path as necessary


function App() {
  const { currentUser } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

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
            setIsProfileComplete(data.name && data.role);
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

  // Function to update the user role
  const handleRoleUpdate = (role) => {
    setUserRole(role);
    setIsProfileComplete(true); // Mark the profile as complete when the role is updated
  };

  return (
    <Router>
      <Routes>
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
        <Route
          path="/profile-setup"
          element={
            currentUser 
              ? <ProfileSetup onRoleUpdate={handleRoleUpdate} /> // Pass the handler here
              : <Navigate to="/" />
          }
        />
        <Route
          path="/tutor-dashboard"
          element={
            currentUser && userRole === 'Tutor' ? <TutorDashboard /> : <Navigate to="/" />
          }
        />
        <Route
          path="/student-dashboard"
          element={
            currentUser && userRole === 'Student' ? <StudentDashboard /> : <Navigate to="/" />
          }
        />
        <Route
            path="/tutor-profile/:id"
            element={<TutorProfile />} // This assumes you will pass tutorId as a prop
        />
      </Routes>
    </Router>
  );
}

export default App;