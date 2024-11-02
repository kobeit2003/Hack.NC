import React, { useState } from 'react';
import { CloudinaryContext, openUploadWidget } from 'cloudinary-react';
import { firestore } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const TutorRegistration = () => {
  // State for tutor form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classCodes, setClassCodes] = useState('');
  const [availability, setAvailability] = useState('');
  const [transcriptUrl, setTranscriptUrl] = useState('');
  
  // Get the current authenticated user (assuming they are logged in)
  const { currentUser } = useAuth();

  // Cloudinary file upload
  const handleUpload = () => {
    openUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'url'],
        multiple: false,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log('Upload successful:', result.info.secure_url);
          setTranscriptUrl(result.info.secure_url); // Store the transcript URL in state
        } else if (error) {
          console.error('Upload Error:', error);
        }
      }
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Make sure a transcript URL exists
    if (!transcriptUrl) {
      alert("Please upload your transcript before submitting.");
      return;
    }
    
    // Define the tutor data object
    const tutorData = {
      name,
      email: currentUser?.email || email, // Use the current user's email if logged in
      classCodes: classCodes.split(',').map((code) => code.trim()), // Convert class codes to an array
      availability,
      transcriptUrl,
      createdAt: new Date() // Set the current timestamp
    };

    try {
      // Save the tutor data in Firestore under the 'tutors' collection
      await firestore.collection('tutors').add(tutorData);
      alert("Tutor registered successfully!");
      
      // Clear form fields after submission
      setName('');
      setEmail('');
      setClassCodes('');
      setAvailability('');
      setTranscriptUrl('');
    } catch (error) {
      console.error("Error adding tutor:", error);
      alert("There was an error registering the tutor. Please try again.");
    }
  };

  return (
    <CloudinaryContext cloudName={process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}>
      <form onSubmit={handleSubmit}>
        <h2>Register as a Tutor</h2>
        
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
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={!!currentUser} // Disable if logged in, assuming email is set by auth
          />
        </label>

        <label>
          Class Codes (comma-separated):
          <input
            type="text"
            value={classCodes}
            onChange={(e) => setClassCodes(e.target.value)}
            placeholder="e.g., MATH101, COMP202"
            required
          />
        </label>

        <label>
          Availability:
          <input
            type="text"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="e.g., Mondays and Wednesdays, 2-4 PM"
            required
          />
        </label>

        <button type="button" onClick={handleUpload}>Upload Transcript</button>

        {transcriptUrl && (
          <div>
            <p>Transcript Uploaded:</p>
            <a href={transcriptUrl} target="_blank" rel="noopener noreferrer">View Transcript</a>
          </div>
        )}

        <button type="submit">Register as Tutor</button>
      </form>
    </CloudinaryContext>
  );
};

export default TutorRegistration;