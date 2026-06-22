import { initializeApp } from 'firebase/app';
import {
  getFirestore, doc, setDoc, getDoc, updateDoc, increment,
  collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { FIREBASE_CONFIG, ADMIN_EMAIL } from './config.js';

const app = initializeApp(FIREBASE_CONFIG);
export const db = getFirestore(app);

export const isAdmin = (user) => user?.email === ADMIN_EMAIL;

// Sanitize email to use as a Firestore doc ID (no / allowed)
const emailToId = (email) => email.replace(/[^a-zA-Z0-9]/g, '_');

// ── Sign-in tracking (source of truth for "who has used the app") ─────────────
export const recordSignIn = async (email) => {
  const ref = doc(db, 'signins', emailToId(email));
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { lastSignIn: serverTimestamp(), signInCount: increment(1) });
    } else {
      await setDoc(ref, {
        email,
        firstSignIn: serverTimestamp(),
        lastSignIn: serverTimestamp(),
        signInCount: 1,
        resumesGenerated: 0,
      });
    }
  } catch (e) {
    console.warn('recordSignIn failed:', e.message);
  }
};

// ── Resume generation tracking ─────────────────────────────────────────────────
export const saveResumeRecord = async (user, { company, role, atsScore, flow }) => {
  try {
    await addDoc(collection(db, 'resumes'), {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName || user.email,
      targetCompany: company,
      targetRole: role,
      atsScore,
      flow,
      createdAt: serverTimestamp(),
    });
    // Increment per-user resume counter in signins
    await updateDoc(doc(db, 'signins', emailToId(user.email)), {
      resumesGenerated: increment(1),
      lastActiveAt: serverTimestamp(),
    }).catch(() => {});
  } catch (e) {
    console.warn('saveResumeRecord failed:', e.message);
  }
};

// ── Daily usage limit ──────────────────────────────────────────────────────────
export const checkAndIncrementUsage = async (userEmail, dailyLimit = 2) => {
  const today = new Date().toISOString().split('T')[0];
  const docId = emailToId(userEmail) + '_' + today;
  const ref = doc(db, 'daily_usage', docId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const { count, firstUse } = snap.data();
      if (count >= dailyLimit) {
        const firstUsed = firstUse?.toDate?.() || new Date();
        const resetAt = new Date(firstUsed.getTime() + 24 * 60 * 60 * 1000);
        return { allowed: false, count, resetAt };
      }
      await updateDoc(ref, { count: increment(1), lastUse: serverTimestamp() });
      return { allowed: true, count: count + 1 };
    }
    await setDoc(ref, {
      email: userEmail,
      date: today,
      count: 1,
      firstUse: serverTimestamp(),
      lastUse: serverTimestamp(),
    });
    return { allowed: true, count: 1 };
  } catch {
    return { allowed: true, count: 0 };
  }
};

// ── Admin stats (aggregated from signins + resumes) ────────────────────────────
export const getAdminStats = async () => {
  try {
    const [signinSnaps, resumeSnaps] = await Promise.all([
      getDocs(collection(db, 'signins')),
      getDocs(query(collection(db, 'resumes'), orderBy('createdAt', 'desc'), limit(100))),
    ]);

    const resumeDocs = resumeSnaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Build per-email resume count from resumes collection
    const resumeCountByEmail = {};
    const lastActiveByEmail = {};
    for (const r of resumeDocs) {
      if (!r.userEmail) continue;
      resumeCountByEmail[r.userEmail] = (resumeCountByEmail[r.userEmail] || 0) + 1;
      if (!lastActiveByEmail[r.userEmail]) lastActiveByEmail[r.userEmail] = r.createdAt;
    }

    // Build user list from signins (every sign-in ever) merged with resume counts
    const signinDocs = signinSnaps.docs.map(d => d.data());
    const allEmailSet = new Set([
      ...signinDocs.map(s => s.email),
      ...Object.keys(resumeCountByEmail),
    ]);

    const topUsers = [...allEmailSet].map(email => {
      const signin = signinDocs.find(s => s.email === email);
      return {
        email,
        name: email,
        resumeCount: resumeCountByEmail[email] || signin?.resumesGenerated || 0,
        lastActiveAt: lastActiveByEmail[email] || signin?.lastSignIn || signin?.firstSignIn || null,
        firstSeen: signin?.firstSignIn || null,
        signInCount: signin?.signInCount || 1,
      };
    }).sort((a, b) => b.resumeCount - a.resumeCount);

    return {
      stats: {
        totalUsers: allEmailSet.size,
        totalResumes: resumeDocs.length,
      },
      recentResumes: resumeDocs.slice(0, 20),
      topUsers,
    };
  } catch (e) {
    console.error('getAdminStats failed:', e);
    return { stats: { totalUsers: 0, totalResumes: 0 }, recentResumes: [], topUsers: [] };
  }
};
