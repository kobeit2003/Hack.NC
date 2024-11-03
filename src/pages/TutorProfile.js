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

  if (!tutorInfo) return <div className="flex justify-center items-center min-h-screen bg-blue-100 text-gray-700">Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-100">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{tutorInfo.name}'s Profile</h1>
        
        <p className="text-lg text-gray-700 mb-4">
          <strong>Email:</strong> {tutorInfo.email}
        </p>
        
        <p className="text-lg text-gray-700 mb-4">
          <strong>Phone:</strong> {tutorInfo.phone}
        </p>
        
        <p className="text-lg text-gray-700 mb-4">
          <strong>Bio:</strong> {tutorInfo.bio || 'No bio available.'}
        </p>
        
        <p className="text-lg text-gray-700 mb-8">
          <strong>Typical Schedule:</strong> {tutorInfo.schedule || 'No schedule available.'}
        </p>
        <p className="text-lg text-gray-700 mb-8">
          <strong>Price Per Hour</strong> {tutorInfo.price || 'No price available.'}
        </p>
        
        <button
          onClick={() => navigate('/student-dashboard')}
          className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TutorProfile;
