// src/migrateData.js
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { tutoriais, modulosGestaoTempo, modulosTutorial2 } from './data/database';

const migrateData = async () => {
  try {
    // Migrate tutorials
    for (const tutorial of tutoriais) {
      await addDoc(collection(db, 'tutorials'), tutorial);
    }

    // Migrate modules for tutorial 1
    for (const module of modulosGestaoTempo) {
      await addDoc(collection(db, 'modules'), { ...module, tutorialId: '1' });
    }

    // Migrate modules for tutorial 2
    for (const module of modulosTutorial2) {
      await addDoc(collection(db, 'modules'), { ...module, tutorialId: '2' });
    }

    console.log('Data migrated successfully!');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
};

export default migrateData;