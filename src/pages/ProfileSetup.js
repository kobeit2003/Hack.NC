import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProfileSetup = ({ onRoleUpdate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [schedule, setSchedule] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData.name || '');
          setRole(userData.role || 'Student');
          setPhone(userData.phone || '');
          setEmail(userData.email || '');
          setBio(userData.bio || '');
          setSchedule(userData.schedule || '');
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedData = { name, role, phone, email, bio, schedule };

      await setDoc(docRef, updatedData, { merge: true });
      onRoleUpdate(role);
      navigate(role === 'Tutor' ? '/tutor-dashboard' : '/student-dashboard');
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
        <label>
          Phone Number:
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Bio (Optional):
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label>
          Typical Schedule (Optional):
          <textarea
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </label>
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default ProfileSetup;