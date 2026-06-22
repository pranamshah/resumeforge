import { useState } from 'react';
import { customizeResume } from '../utils/groqApi.js';
import { showToast } from '../utils/toast.js';

export default function TargetInput({ groqKey, resumeData, company, setCompany, jobTitle, setJobTitle, jobDescription, setJobDescription, setCustomizedResult, setScreen }) {
  const [skipJD, setSkipJD] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!company.trim() || !jobTitle.trim()) {
      showToast('Company name and job title are required', 'warning');
      return;
    }
    setLoading(true);
    setScreen('loading');
    try {
      const result = await customizeResume(groqKey, resumeData, company, jobTitle, skipJD ? '' : jobDescription);
      setCustomizedResult(result);
      setScreen('results');
    } catch (err) {
      if (err.message.includes('Invalid Groq')) showToast('Invalid API key. Check in settings.', 'error');
      else if (err.message.includes('Rate limit')) showToast(err.message, 'warning');
      else showToast(err.message || 'Customization failed. Try again.', 'error');
      setScreen('target');
    }
    setLoading(false);
  };

  return (
    <main className="flex-grow flex flex-col items-center py-xl px-margin-mobile md:px-margin-desktop">
      <div className="w-full max-w-2xl space-y-lg">
        <div className="text-center">
          <div className="inline-flex items-center gap-xs px-sm py-base rounded-full bg-secondary-container/30 border border-outline-variant mb-md">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>my_location</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Target Role</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-sm">Where do you want to work?</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            AI will research this company and role to craft a precision-targeted resume.
          </p>
        </div>

        <div className="bg-surface-container border border-outline-variant rounded-xl p-lg space-y-md">
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>business</span>
              Company Name *
            </label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Google, OpenAI, Stripe..."
              autoFocus
              className="w-full bg-surface border border-outline-variant focus:border-primary rounded-lg px-md py-sm font-body-md text-body-md text-on-surface transition-all"
            />
          </div>

          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>work</span>
              Job Title / Role *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer, Product Manager..."
              className="w-full bg-surface border border-outline-variant focus:border-primary rounded-lg px-md py-sm font-body-md text-body-md text-on-surface transition-all"
            />
          </div>

          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>description</span>
              Job Description (optional)
            </label>
            <textarea
              rows={6}
              value={skipJD ? '' : jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              disabled={skipJD}
              placeholder="Paste the full job posting here for best results..."
              className={`w-full bg-surface border border-outline-variant focus:border-primary rounded-lg px-md py-sm font-body-sm text-body-sm text-on-surface transition-all resize-none ${skipJD ? 'opacity-40 cursor-not-allowed' : ''}`}
            />
            <label className="flex items-center gap-sm cursor-pointer">
              <input type="checkbox" checked={skipJD} onChange={e => setSkipJD(e.target.checked)} className="accent-primary w-4 h-4" />
              <span className="font-label-sm text-label-sm text-on-surface-variant">Skip JD — let AI research the role online</span>
            </label>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !company.trim() || !jobTitle.trim()}
            className={`w-full flex items-center justify-center gap-sm font-label-md text-label-md py-md rounded-lg transition-all ${
              company.trim() && jobTitle.trim() && !loading
                ? 'bg-primary text-on-primary hover:opacity-90 electric-glow'
                : 'bg-primary/30 text-on-primary/50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span> Analyzing...</>
            ) : (
              <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>rocket_launch</span> Analyze & Customize</>
            )}
          </button>

          <p className="text-center font-label-sm text-label-sm text-on-surface-variant opacity-60">
            AI will run 4+ web searches to research this company and role before customizing
          </p>
        </div>

        <div className="flex justify-center">
          <button onClick={() => setScreen('landing')} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back
          </button>
        </div>
      </div>
    </main>
  );
}
