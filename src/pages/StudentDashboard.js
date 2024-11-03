import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { currentUser, signOut } = useAuth();
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [classCodeFilter, setClassCodeFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      console.error('No current user, redirecting to sign-in.');
      navigate('/');
      return;
    }

    const fetchTutors = async () => {
      try {
        const tutorsRef = collection(db, 'users');
        const q = query(tutorsRef, where('role', '==', 'Tutor'));
        const querySnapshot = await getDocs(q);
        const tutorList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTutors(tutorList);
        setFilteredTutors(tutorList);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, [currentUser]);

  const handleFilterChange = (e) => {
    const input = e.target.value;
    setClassCodeFilter(input);

    if (input) {
      const filtered = tutors.filter(tutor =>
        tutor.classes && tutor.classes.includes(input.toUpperCase())
      );
      setFilteredTutors(filtered);
    } else {
      setFilteredTutors(tutors);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Available Tutors</h1>

        <div className="mb-6">
          <label className="block text-lg text-gray-700 mb-2">Filter by Class Code:</label>
          <input
            type="text"
            value={classCodeFilter}
            onChange={handleFilterChange}
            placeholder="e.g., STOR-435"
            className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
          />
        </div>

        <div>
          {filteredTutors.length > 0 ? (
            <ul className="space-y-4">
              {filteredTutors.map((tutor) => (
                <li key={tutor.id} className="bg-gray-100 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-800">{tutor.name}</h2>
                  <p className="text-gray-700">
                    Classes: {tutor.classes ? tutor.classes.join(', ') : 'No classes listed'}
                  </p>
                  <p className="text-gray-700">
                    Grades: {tutor.grades ? tutor.grades : 'No grades found'}
                    {tutor.grades.map((grade) => <div>{grade.grade}</div>)}
                  </p>
                  <button
                    onClick={() => navigate(`/tutor-profile/${tutor.id}`)}
                    className="mt-3 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
                  >
                    View Profile
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-700">No tutors available for this class code.</p>
          )}
        </div>

        <button
          onClick={() => navigate('/profile-setup')}
          className="mt-8 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
        >
          Go to Profile Setup
        </button>

        <button
          onClick={signOut}
          className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard;
