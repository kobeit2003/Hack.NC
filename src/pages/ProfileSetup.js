import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ProfileSetup = ({ onRoleUpdate }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Student'); // Default to "Student"
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [schedule, setSchedule] = useState('');
  const [price, setPrice] = useState('');
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
          setPrice(userData.price || '');
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatedData = { name, role, phone, email, bio, schedule, price };

      await setDoc(docRef, updatedData, { merge: true });
      onRoleUpdate(role);
      navigate(role === 'Tutor' ? '/tutor-dashboard' : '/student-dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-full max-w-lg bg-white p-10 rounded-lg shadow-lg">
        {/* Title and Description Block */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Tarheel Tutor</h1>
          <p className="text-sm text-gray-600 mt-2">
            Connecting students and tutors for personalized academic support in UNC classes.
          </p>
        </div>

        {/* Profile Setup Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Set Up Your Profile</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block">
            <span className="text-lg text-gray-700">Name:</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>
          <label className="block">
            <span className="text-lg text-gray-700">Role:</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Student">Student</option>
              <option value="Tutor">Tutor</option>
            </select>
          </label>

          {role === 'Tutor' && (
            <>
              <label className="block">
                <span className="text-lg text-gray-700">Phone Number:</span>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                  required
                  className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
              <label className="block">
                <span className="text-lg text-gray-700">Email:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
              <label className="block">
                <span className="text-lg text-gray-700">Bio (Optional):</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
              <label className="block">
                <span className="text-lg text-gray-700">Typical Schedule (Optional):</span>
                <textarea
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
              <label className="block">
                <span className="text-lg text-gray-700">Price Per Hour:</span>
                <textarea
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-2 block w-full p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-semibold text-lg rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
