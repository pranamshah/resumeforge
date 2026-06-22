import { useState, useEffect } from 'react';
import { onAuthChange, signInWithGoogle, signOutUser, createOrUpdateUser, checkUserExists, isAdmin } from './firebase.js';
import { DEFAULT_GROQ_KEY } from './config.js';
import { showToast } from './utils/toast.js';
import Navbar from './components/Navbar.jsx';
import Landing from './components/Landing.jsx';
import UploadScreen from './components/UploadScreen.jsx';
import ExtractedDataEditor from './components/ExtractedDataEditor.jsx';
import BuildResumeForm from './components/BuildResumeForm.jsx';
import TargetInput from './components/TargetInput.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import ResultsScreen from './components/ResultsScreen.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function ApiKeyModal({ currentKey, onSave, onClose }) {
  const [key, setKey] = useState(currentKey);
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-white text-xl font-bold mb-2">Groq API Key</h2>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">
          Stored in your browser only — never sent anywhere except Groq's API.{' '}
          <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
            Get a free key at console.groq.com →
          </a>
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave(key)}
          placeholder="gsk_..."
          className="w-full bg-[#0B1120] border border-gray-600 rounded-lg px-4 py-3 text-white text-sm mb-4 focus:border-blue-500"
        />
        <div className="flex gap-3">
          <button onClick={() => onSave(key)} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2.5 font-semibold text-sm transition-colors">
            Save Key
          </button>
          <button onClick={onClose} className="px-5 bg-transparent border border-gray-600 rounded-lg text-gray-400 hover:text-white text-sm transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState('landing');
  const [groqKey, setGroqKey] = useState(() => DEFAULT_GROQ_KEY || localStorage.getItem('rf_groq_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const [resumeData, setResumeData] = useState(null);
  const [customizedResult, setCustomizedResult] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    const unsub = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        const exists = await checkUserExists(firebaseUser.uid);
        await createOrUpdateUser(firebaseUser, !exists);
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    try { await signInWithGoogle(); }
    catch { showToast('Sign-in failed. Try again.', 'error'); }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setScreen('landing');
    setResumeData(null);
    setCustomizedResult(null);
    showToast('Signed out successfully', 'info');
  };

  const saveGroqKey = (key) => {
    setGroqKey(key);
    if (key) localStorage.setItem('rf_groq_key', key);
    setShowKeyModal(false);
    showToast('Groq API key saved', 'success');
  };

  const requireAuth = () => {
    if (!user) { showToast('Please sign in with Google first', 'warning'); return false; }
    if (!groqKey) { setShowKeyModal(true); return false; }
    return true;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-blue-400 text-sm">Loading...</div>
      </div>
    );
  }

  const shared = {
    user, groqKey, company, setCompany, jobTitle, setJobTitle,
    jobDescription, setJobDescription, resumeData, setResumeData,
    customizedResult, setCustomizedResult, setScreen, activeFlow, setActiveFlow,
    selectedTemplate, setSelectedTemplate,
  };

  return (
    <div className="min-h-screen">
      <Navbar
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onAdminClick={() => setScreen('admin')}
        onLogoClick={() => setScreen('landing')}
        onApiKeyClick={() => setShowKeyModal(true)}
        groqKeySet={!!groqKey}
        isAdminUser={isAdmin(user)}
      />
      {showKeyModal && <ApiKeyModal currentKey={groqKey} onSave={saveGroqKey} onClose={() => setShowKeyModal(false)} />}

      {screen === 'landing'       && <Landing user={user} onUpload={() => requireAuth() && setScreen('upload')} onBuild={() => requireAuth() && setScreen('build')} onSignIn={handleSignIn} />}
      {screen === 'upload'        && <UploadScreen {...shared} />}
      {screen === 'editExtracted' && <ExtractedDataEditor {...shared} />}
      {screen === 'build'         && <BuildResumeForm {...shared} />}
      {screen === 'target'        && <TargetInput {...shared} />}
      {screen === 'loading'       && <LoadingScreen company={company} jobTitle={jobTitle} />}
      {screen === 'results'       && <ResultsScreen {...shared} />}
      {screen === 'admin'         && isAdmin(user) && <AdminDashboard user={user} onBack={() => setScreen('landing')} />}
    </div>
  );
}
