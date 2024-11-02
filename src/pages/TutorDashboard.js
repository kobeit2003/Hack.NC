import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const TutorDashboard = () => {
    const { currentUser, signOut } = useAuth(); // Access signOut from AuthContext
    const [classCode, setClassCode] = useState('');
    const [classes, setClasses] = useState([]);
    
  useEffect(() => {
    // Fetch the tutor's class list from Firestore on component mount
    const fetchClasses = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setClasses(userData.classes || []); // Set classes if they exist
            console.log('Fetched classes:', userData.classes);
          }
        } catch (error) {
          console.error('Error fetching classes:', error);
        }
      }
    };

    fetchClasses();
  }, [currentUser]); // Only runs when currentUser changes

  const handleAddClass = async () => {
    const format = /^[A-Z]{2,4}-\d{3}$/;
    if (!format.test(classCode)) {
      alert('Please enter a valid class code (e.g., STOR-435).');
      return;
    }
  
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      console.log('Attempting to add class:', classCode);
  
      await updateDoc(docRef, {
        classes: arrayUnion(classCode),
      });
  
      console.log('Class added to Firestore:', classCode);
  
      setClasses((prevClasses) => [...prevClasses, classCode]);
      setClassCode(''); // Clear the input field
    } catch (error) {
      console.error('Error adding class code:', error);
    }
  };

  const handleRemoveClass = async (code) => {
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, {
        classes: arrayRemove(code),
      });

      setClasses((prevClasses) => prevClasses.filter((c) => c !== code));
    } catch (error) {
      console.error('Error removing class code:', error);
    }
  };

  return (
    <div>
      <h1>Tutor Dashboard</h1>
      <button onClick={signOut}>Sign Out</button> {/* Sign Out Button */}
      <p>Welcome, Tutor! Here you can manage your classes.</p>

      <div>
        <label>
          Add Class Code:
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value)}
            placeholder="e.g., STOR-435"
          />
        </label>
        <button onClick={handleAddClass}>Add Class</button>
      </div>

      <h2>Your Classes</h2>
      <ul>
        {classes.map((code) => (
          <li key={code}>
            {code} <button onClick={() => handleRemoveClass(code)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorDashboard;