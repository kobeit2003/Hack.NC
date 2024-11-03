import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const TutorDashboard = () => {
    const { currentUser, signOut } = useAuth();
    const [classCode, setClassCode] = useState('');
    const [classes, setClasses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                try {
                    const docRef = doc(db, 'users', currentUser.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setClasses(userData.classes || []);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    const handleAddClass = async () => {
        const format = /^[A-Z]{2,4}-\d{3}$/;
        if (!format.test(classCode)) {
            alert('Please enter a valid class code (e.g., STOR-435).');
            return;
        }
    
        try {
            const docRef = doc(db, 'users', currentUser.uid);
            await updateDoc(docRef, {
                classes: arrayUnion(classCode),
            });
            setClasses((prevClasses) => [...prevClasses, classCode]);
            setClassCode(''); // Clear the input field after adding the class
        } catch (error) {
            console.error('Error adding class code:', error);
        }
    };

    const handleFileSelection = (event) => {
        const file = event.target.files[0];
        console.log("Selected file:", file);
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
        <div className="flex justify-center items-center min-h-screen bg-blue-100">
            <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Tutor Dashboard</h1>
                
                <button
                    onClick={signOut}
                    className="mb-4 w-full py-2 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600 focus:outline-none"
                >
                    Sign Out
                </button>

                <button
                    onClick={() => navigate('/profile-setup')}
                    className="mb-6 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none"
                >
                    Back to Profile Setup
                </button>

                <p className="text-lg text-gray-700 text-center mb-8">Welcome, Tutor! Here you can manage your classes.</p>

                <div className="mb-6">
                    <label className="block text-lg text-gray-700 mb-2">Add Class Code:</label>
                    <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="e.g., STOR-435 (Must be all Caps)"
                        className="block w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4"
                    />
                    <button onClick={handleAddClass} className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none">
                        Add Class
                    </button>
                </div>

                <label className="block text-lg text-gray-700 mb-4">
                    Upload Transcript:
                    <input
                        onChange={handleFileSelection}
                        type="file"
                        className="block w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </label>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Classes</h2>
                <ul className="space-y-2 mb-8">
                    {classes.map((code) => (
                        <li key={code} className="flex justify-between items-center bg-gray-100 p-3 rounded">
                            <span className="text-gray-700">{code}</span>
                            <button
                                onClick={() => handleRemoveClass(code)}
                                className="py-1 px-2 bg-red-400 text-white rounded hover:bg-red-500"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TutorDashboard;
