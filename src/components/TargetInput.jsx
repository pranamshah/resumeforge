import { useState } from 'react';
import { customizeResume } from '../utils/groqApi.js';
import { checkAndIncrementUsage, saveResumeRecord } from '../firebase.js';
import { showToast } from '../utils/toast.js';

function LimitModal({ resetAt, onBack }) {
  const now = new Date();
  const msLeft = resetAt - now;
  const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
  const minutesLeft = Math.ceil(msLeft / (1000 * 60));
  const timeLabel = hoursLeft >= 1 ? `${hoursLeft}h` : `${minutesLeft}m`;
  const resetTime = resetAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-md">
      <div className="bg-surface-container border border-outline-variant rounded-2xl p-xl max-w-sm w-full text-center fade-in">
        <div className="w-20 h-20 rounded-full bg-tertiary/10 border border-tertiary/30 flex items-center justify-center mx-auto mb-lg">
          <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 40, fontVariationSettings: "'FILL' 1" }}>lock_clock</span>
        </div>

        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Daily Limit Reached</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
          You've used your <strong className="text-on-surface">2 free AI resumes</strong> for today. Come back in <strong className="text-primary">{timeLabel}</strong> to generate more.
        </p>

        {/* Usage bar */}
        <div className="bg-surface rounded-xl p-md mb-lg border border-outline-variant text-left">
          <div className="flex justify-between items-center mb-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Today's usage</span>
            <span className="font-label-md text-label-md text-error font-mono">2 / 2</span>
          </div>
          <div className="h-2 bg-outline-variant rounded-full overflow-hidden">
            <div className="h-full bg-error rounded-full w-full transition-all"></div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">
            Resets at {resetTime} · Limit resets every 24 hours
          </p>
        </div>

        <div className="space-y-sm">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Meanwhile, download your generated resume or refine it using suggestions.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all electric-glow"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TargetInput({ user, groqKey, resumeData, company, setCompany, jobTitle, setJobTitle, jobDescription, setJobDescription, setCustomizedResult, setScreen }) {
  const [skipJD, setSkipJD] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitData, setLimitData] = useState(null); // { resetAt }

  const handleSubmit = async () => {
    if (!company.trim() || !jobTitle.trim()) {
      showToast('Company name and job title are required', 'warning');
      return;
    }
    setLoading(true);

    // Check daily limit
    if (user?.email) {
      const usage = await checkAndIncrementUsage(user.email, 2);
      if (!usage.allowed) {
        setLimitData({ resetAt: usage.resetAt });
        setLoading(false);
        return;
      }
    }

    setScreen('loading');
    try {
      const result = await customizeResume(groqKey, resumeData, company, jobTitle, skipJD ? '' : jobDescription);
      setCustomizedResult(result);
      // Record every generation (not just downloads) so admin sees accurate count
      if (user) {
        saveResumeRecord(user, {
          company,
          role: jobTitle,
          atsScore: result.ats_score,
          flow: 'generate',
        });
      }
      setScreen('results');
    } catch (err) {
      showToast(err.message || 'Customization failed. Try again.', 'error');
      setScreen('target');
    }
    setLoading(false);
  };

  return (
    <main className="flex-grow flex flex-col items-center py-xl px-margin-mobile md:px-margin-desktop">
      {limitData && <LimitModal resetAt={limitData.resetAt} onBack={() => setScreen('landing')} />}

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

        {/* Usage indicator */}
        {user && (
          <div className="flex items-center justify-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
            2 free AI resumes per 24 hours
          </div>
        )}

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
              <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span> Checking...</>
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
