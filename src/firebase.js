import { initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  signOut, onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, increment,
  collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { FIREBASE_CONFIG, ADMIN_EMAIL } from './config.js';

const app = initializeApp(FIREBASE_CONFIG);
export const auth = getAuth(app);
export const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    if (err.code === 'auth/popup-blocked') {
      await signInWithRedirect(auth, googleProvider);
    }
    throw err;
  }
};

export const signOutUser = () => signOut(auth);
export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);
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
