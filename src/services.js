import { firestore } from './firebaseConfig';

// Add a new tutor to the Firestore 'tutors' collection
export const addTutor = async (tutorData) => {
  try {
    await firestore.collection('tutors').add(tutorData);
    console.log("Tutor added successfully!");
  } catch (error) {
    console.error("Error adding tutor: ", error);
  }
};

// Fetch all tutors
export const getTutors = async () => {
  try {
    const snapshot = await firestore.collection('tutors').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tutors: ", error);
    return [];
  }
};