import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProfileSetup = ({ onRoleUpdate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student'); // Default to "Student"
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({ name: '', role: '' }); // Track initial profile data

  useEffect(() => {
    // Fetch existing profile data if it exists
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setName(userData.name || '');
            setRole(userData.role || 'Student');
            setInitialData({ name: userData.name || '', role: userData.role || 'Student' });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only save if there’s a change in name or role
    if (name === initialData.name && role === initialData.role) {
      alert('No changes detected.');
      return;
    }

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedData = { name, role };

      // If this is the first time setting up the profile, use setDoc to create the document
      await setDoc(docRef, updatedData, { merge: true });
      
      // Update the role in App.js using onRoleUpdate callback
      onRoleUpdate(role);

      // Redirect based on role
      if (role === 'Tutor') {
        navigate('/tutor-dashboard');
      } else {
        navigate('/student-dashboard');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div>
      <h1>Set Up Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Tutor">Tutor</option>
          </select>
        </label>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;