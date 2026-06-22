import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, increment,
  collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { FIREBASE_CONFIG, ADMIN_EMAIL } from './config.js';

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

export const isAdmin = (user) => user?.email === ADMIN_EMAIL;

export const checkUserExists = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists();
};

export const createOrUpdateUser = async (user, isNew = false) => {
  const ref = doc(db, 'users', user.uid);
  if (isNew) {
    await setDoc(ref, {
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
      resumeCount: 0,
      lastActiveAt: serverTimestamp(),
    }, { merge: true });
    const statsRef = doc(db, 'stats', 'global');
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) {
      await setDoc(statsRef, { totalResumes: 0, totalUsers: 0 });
    }
    await updateDoc(statsRef, { totalUsers: increment(1) }).catch(() => {});
  } else {
    await updateDoc(ref, { lastActiveAt: serverTimestamp() }).catch(() =>
      setDoc(ref, {
        email: user.email, name: user.displayName,
        photoURL: user.photoURL, resumeCount: 0,
        lastActiveAt: serverTimestamp(), createdAt: serverTimestamp(),
      })
    );
  }
};

export const saveResumeRecord = async (user, { company, role, atsScore, flow }) => {
  await addDoc(collection(db, 'resumes'), {
    userId: user.uid, userEmail: user.email, userName: user.displayName,
    targetCompany: company, targetRole: role, atsScore, flow,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'users', user.uid), {
    resumeCount: increment(1), lastActiveAt: serverTimestamp(),
  });
  const statsRef = doc(db, 'stats', 'global');
  const snap = await getDoc(statsRef);
  if (!snap.exists()) await setDoc(statsRef, { totalResumes: 0, totalUsers: 0 });
  await updateDoc(statsRef, { totalResumes: increment(1), lastUpdatedAt: serverTimestamp() });
};

export const checkAndIncrementUsage = async (userEmail, limit = 2) => {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD UTC
  const docId = userEmail.replace(/[^a-zA-Z0-9]/g, '_') + '_' + today;
  const ref = doc(db, 'daily_usage', docId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const { count, firstUse } = snap.data();
      if (count >= limit) {
        const firstUsed = firstUse?.toDate?.() || new Date();
        const resetAt = new Date(firstUsed.getTime() + 24 * 60 * 60 * 1000);
        return { allowed: false, count, resetAt };
      }
      await updateDoc(ref, { count: increment(1), lastUse: serverTimestamp() });
      return { allowed: true, count: count + 1 };
    }
    await setDoc(ref, { email: userEmail, date: today, count: 1, firstUse: serverTimestamp(), lastUse: serverTimestamp() });
    return { allowed: true, count: 1 };
  } catch {
    return { allowed: true, count: 0 }; // graceful: let through on Firestore error
  }
};

export const getAdminStats = async () => {
  const [statsSnap, recentResumes, topUsers] = await Promise.all([
    getDoc(doc(db, 'stats', 'global')),
    getDocs(query(collection(db, 'resumes'), orderBy('createdAt', 'desc'), limit(50))),
    getDocs(query(collection(db, 'users'), orderBy('resumeCount', 'desc'), limit(20))),
  ]);
  return {
    stats: statsSnap.data() || { totalResumes: 0, totalUsers: 0 },
    recentResumes: recentResumes.docs.map(d => ({ id: d.id, ...d.data() })),
    topUsers: topUsers.docs.map(d => ({ id: d.id, ...d.data() })),
  };
};
