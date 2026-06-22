import { useState, useEffect } from 'react';
import { recordSignIn, isAdmin } from './db.js';
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

function EmailModal({ onSave }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handle = () => {
    const val = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError('Enter a valid email address');
      return;
    }
    onSave(val);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-sm mb-md">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>mail</span>
          <div>
            <h2 className="text-white text-xl font-bold">Welcome to ResumeForge</h2>
            <p className="text-gray-400 text-sm mt-xs">Enter your email to get started — no password needed.</p>
          </div>
        </div>
        <input
          type="email"
          value={email}
          onChange={e => { setEmail(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handle()}
          placeholder="you@example.com"
          autoFocus
          className="w-full bg-[#0B1120] border border-gray-600 rounded-lg px-4 py-3 text-white text-sm mb-2 focus:border-blue-500 focus:outline-none"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handle}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:opacity-90 transition-all electric-glow mt-sm"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

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

const TEMPLATE_KEYS = ['classic', 'modern', 'executive', 'minimal', 'accent'];

const pickTemplateForEmail = (email) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = (hash << 5) - hash + email.charCodeAt(i);
    hash |= 0;
  }
  return TEMPLATE_KEYS[Math.abs(hash) % TEMPLATE_KEYS.length];
};

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('landing');
  const [groqKey, setGroqKey] = useState(() => DEFAULT_GROQ_KEY || localStorage.getItem('rf_groq_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const [resumeData, setResumeData] = useState(null);
  const [customizedResult, setCustomizedResult] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rf_user_email');
    if (saved) {
      restoreUser(saved);
      const savedTemplate = localStorage.getItem('rf_template') || pickTemplateForEmail(saved);
      setSelectedTemplate(savedTemplate);
    }
  }, []);

  const restoreUser = (email) => {
    const u = { email, displayName: email, uid: email, photoURL: null };
    setUser(u);
    // Record once per browser session so returning users still appear in admin
    if (!sessionStorage.getItem('rf_signin_recorded')) {
      recordSignIn(email).then(() => sessionStorage.setItem('rf_signin_recorded', '1'));
    }
  };

  const handleSignIn = (email) => {
    const u = { email, displayName: email, uid: email, photoURL: null };
    localStorage.setItem('rf_user_email', email);
    setUser(u);
    setShowEmailModal(false);
    const tmpl = localStorage.getItem('rf_template') || pickTemplateForEmail(email);
    setSelectedTemplate(tmpl);
    recordSignIn(email); // always record new sign-ins
    showToast(`Welcome to ResumeForge!`, 'success');
  };

  const handleSignOut = () => {
    localStorage.removeItem('rf_user_email');
    setUser(null);
    setScreen('landing');
    setResumeData(null);
    setCustomizedResult(null);
    showToast('Signed out', 'info');
  };

  const saveGroqKey = (key) => {
    setGroqKey(key);
    if (key) localStorage.setItem('rf_groq_key', key);
    setShowKeyModal(false);
    showToast('Groq API key saved', 'success');
  };

  const requireAuth = () => {
    if (!user) { setShowEmailModal(true); return false; }
    if (!groqKey) { setShowKeyModal(true); return false; }
    return true;
  };

  const handleSetTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    localStorage.setItem('rf_template', tmpl);
  };

  const shared = {
    user, groqKey, company, setCompany, jobTitle, setJobTitle,
    jobDescription, setJobDescription, resumeData, setResumeData,
    customizedResult, setCustomizedResult, setScreen, activeFlow, setActiveFlow,
    selectedTemplate, setSelectedTemplate: handleSetTemplate,
  };

  return (
    <div className="min-h-screen">
      <Navbar
        user={user}
        onSignIn={() => setShowEmailModal(true)}
        onSignOut={handleSignOut}
        onAdminClick={() => setScreen('admin')}
        onLogoClick={() => setScreen('landing')}
        onApiKeyClick={() => setShowKeyModal(true)}
        groqKeySet={!!groqKey}
        isAdminUser={isAdmin(user)}
      />

      {showEmailModal && <EmailModal onSave={handleSignIn} />}
      {showKeyModal && <ApiKeyModal currentKey={groqKey} onSave={saveGroqKey} onClose={() => setShowKeyModal(false)} />}

      {screen === 'landing'       && <Landing user={user} onUpload={() => requireAuth() && setScreen('upload')} onBuild={() => requireAuth() && setScreen('build')} onSignIn={() => setShowEmailModal(true)} />}
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
