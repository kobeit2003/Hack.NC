import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext'; // Ensure you import useAuth
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentDashboard = () => {
  const { currentUser, signOut } = useAuth(); // Access signOut and currentUser from AuthContext
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [classCodeFilter, setClassCodeFilter] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Check if the user is authenticated before fetching tutors
    if (!currentUser) {
      console.error('No current user, redirecting to sign-in.');
      navigate('/'); // Redirect to sign-in if not authenticated
      return; // Exit early if there's no current user
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
        setFilteredTutors(tutorList); // Initialize filtered list with all tutors
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();
  }, [currentUser]); // Re-run effect when currentUser changes

  const handleFilterChange = (e) => {
    const input = e.target.value;
    setClassCodeFilter(input);

    if (input) {
      const filtered = tutors.filter(tutor =>
        tutor.classes && tutor.classes.includes(input.toUpperCase())
      );
      setFilteredTutors(filtered);
    } else {
      setFilteredTutors(tutors); // Show all tutors if no filter is applied
    }
  };

  return (
    <div>
      <h1>Available Tutors</h1>
      <button onClick={signOut}>Sign Out</button> {/* Sign Out Button */}
      <button onClick={() => {
  console.log('Navigating to Profile Setup');
  navigate('/profile-setup'); // Navigate to Profile Setup
}}>Go to Profile Setup</button>

      <div>
        <label>
          Filter by Class Code:
          <input
            type="text"
            value={classCodeFilter}
            onChange={handleFilterChange}
            placeholder="e.g., STOR-435"
          />
        </label>
      </div>

      <div>
      {filteredTutors.length > 0 ? (
  <ul>
    {filteredTutors.map((tutor) => (
      <li key={tutor.id}>
        <h2>{tutor.name}</h2>
        <p>Classes: {tutor.classes ? tutor.classes.join(', ') : 'No classes listed'}</p>
        <button onClick={() => navigate(`/tutor-profile/${tutor.id}`)}>View Profile</button>
      </li>
    ))}
  </ul>
) : (
  <p>No tutors available for this class code.</p>
)}
      </div>
    </div>
  );
};

export default StudentDashboard;