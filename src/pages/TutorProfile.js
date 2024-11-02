import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const TutorProfile = () => {
  const { id } = useParams(); // Extract tutorId from URL
  const [tutorInfo, setTutorInfo] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTutorInfo = async () => {
      const docRef = doc(db, 'users', id); // Use the id here
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTutorInfo(docSnap.data());
      } else {
        console.error('No tutor found for this ID');
      }
    };

    fetchTutorInfo();
  }, [id]);

  if (!tutorInfo) return <div>Loading...</div>;

  return (
    <div>
      <h1>{tutorInfo.name}'s Profile</h1>
      <p><strong>Email:</strong> {tutorInfo.email}</p>
      <p><strong>Phone:</strong> {tutorInfo.phone}</p>
      <p><strong>Bio:</strong> {tutorInfo.bio || 'No bio available.'}</p>
      <p><strong>Typical Schedule:</strong> {tutorInfo.schedule || 'No schedule available.'}</p>
      <button onClick={() => navigate('/student-dashboard')}>Back to Dashboard</button>
    </div>
  );
};

export default TutorProfile;
