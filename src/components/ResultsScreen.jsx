import { useState, useEffect, useRef } from 'react';
import ResumePreview from './ResumePreview.jsx';
import TemplateSelector from './TemplateSelector.jsx';
import { exportResumeToPDF } from '../utils/pdfExport.js';
import { refineResume } from '../utils/groqApi.js';
import { saveResumeRecord } from '../db.js';
import { showToast } from '../utils/toast.js';

function ATSArc({ score }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + 2, score);
      setDisplay(cur);
      if (cur >= score) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [score]);

  const R = 90, cx = 96, cy = 96;
  const circ = 2 * Math.PI * R;
  const offset = circ - (display / 100) * circ;
  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';

  return (
    <div className="flex flex-col items-center justify-center text-center relative">
      <div className="relative mb-md">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 192 192">
          <circle cx={cx} cy={cy} r={R} fill="transparent" stroke="#334155" strokeWidth="8" />
          <circle cx={cx} cy={cy} r={R} fill="transparent" stroke={color} strokeWidth="8"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.05s' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline-xl text-headline-xl leading-none font-mono" style={{ color }}>{display}</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">ATS Score</span>
        </div>
      </div>
      <h2 className="font-headline-lg text-headline-lg mb-xs" style={{ fontSize: 20 }}>
        {score >= 80 ? 'Elite Match Found' : score >= 60 ? 'Strong Candidate' : 'Needs Improvement'}
      </h2>
    </div>
  );
}

export default function ResultsScreen({ user, groqKey, customizedResult, company, jobTitle, resumeData, setResumeData, setCustomizedResult, setCompany, setJobTitle, setJobDescription, setScreen, selectedTemplate, setSelectedTemplate, activeFlow }) {
  const [downloading, setDownloading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [refineSuggestion, setRefineSuggestion] = useState('');
  const [refining, setRefining] = useState(false);
  const [refineHistory, setRefineHistory] = useState([]);
  const [activeSections, setActiveSections] = useState(null);
  const previewRef = useRef(null);

  if (!customizedResult) return null;

  const { customized_resume, ats_score, missing_skills, key_changes, top_hire_insights, section_order } = customizedResult;

  const currentSectionOrder = activeSections || section_order || ['personal','summary','skills','experience','projects','education','certifications','achievements'];

  const OPTIONAL_SECTIONS = [
    { key: 'extracurricular', label: 'Extracurricular', icon: 'sports_esports' },
    { key: 'languages', label: 'Languages', icon: 'translate' },
    { key: 'awards', label: 'Awards', icon: 'emoji_events' },
    { key: 'publications', label: 'Publications', icon: 'menu_book' },
    { key: 'interests', label: 'Interests', icon: 'interests' },
    { key: 'references', label: 'References', icon: 'contact_page' },
  ];

  const SECTION_DEFAULTS = {
    awards: [{ title: 'Best Project Award — College Tech Fest', issuer: '', year: '2024' }],
    publications: [{ title: 'Sample Publication Title', journal: '', year: '2024' }],
    languages: [{ name: 'English', proficiency: 'Professional' }],
    interests: ['Technology', 'Reading'],
    extracurricular: [{ activity: 'Coding Club', role: 'Member', organization: '', duration: '2023 – 2024', description: '' }],
  };

  const addSection = (secKey) => {
    if (currentSectionOrder.includes(secKey)) return;
    // Seed placeholder data so the section actually renders (refine to edit it).
    if (SECTION_DEFAULTS[secKey] && !customized_resume[secKey]?.length) {
      setCustomizedResult({
        ...customizedResult,
        customized_resume: { ...customized_resume, [secKey]: SECTION_DEFAULTS[secKey] },
      });
    }
    setActiveSections([...currentSectionOrder, secKey]);
  };

  const removeSection = (secKey) => {
    setActiveSections(currentSectionOrder.filter(s => s !== secKey));
  };

  const addSkillToResume = (skill) => {
    const updated = { ...customized_resume };
    updated.skills = { ...updated.skills };
    updated.skills.other = [...(updated.skills.other || []), skill];
    setCustomizedResult({ ...customizedResult, customized_resume: updated, missing_skills: missing_skills.filter(s => s !== skill) });
    showToast(`Added "${skill}" to skills`, 'success');
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      await exportResumeToPDF(previewRef.current, customized_resume, company);
      showToast('Resume downloaded!', 'success');
      if (user) {
        await saveResumeRecord(user, { company, role: jobTitle, atsScore: ats_score, flow: activeFlow || 'upload' });
      }
    } catch (err) {
      showToast(err.message || 'Download failed. Try again.', 'error');
    }
    setDownloading(false);
  };

  const handleRefine = async () => {
    if (!refineSuggestion.trim() || refining) return;
    setRefining(true);
    try {
      showToast('Applying your suggestion...', 'info');
      const updated = await refineResume(groqKey, customized_resume, refineSuggestion, company, jobTitle);
      setCustomizedResult({ ...customizedResult, customized_resume: updated });
      setRefineHistory(h => [...h, refineSuggestion]);
      setRefineSuggestion('');
      showToast('Resume updated!', 'success');
    } catch (err) {
      showToast(err.message || 'Refinement failed. Try again.', 'error');
    }
    setRefining(false);
  };

  const handleCustomizeAnother = () => {
    setCompany('');
    setJobTitle('');
    setJobDescription('');
    setScreen('target');
  };

  const QUICK_SUGGESTIONS = [
    'Make bullets more aggressive and results-focused',
    'Shorten the summary to 2 sentences',
    'Add more leadership language',
    'Make it more suitable for startups',
  ];

  return (
    <div className="flex flex-1 overflow-hidden min-h-screen">
      {showTemplates && <TemplateSelector selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} onClose={() => setShowTemplates(false)} />}

      {/* Left Sidebar */}
      <aside className="hidden md:flex flex-col h-screen p-sm gap-xs border-r border-outline-variant bg-surface-container w-64 shrink-0 sticky top-0 overflow-y-auto">
        <div className="px-xs py-sm mb-md">
          <h1 className="font-headline-lg text-headline-lg font-black text-primary" style={{ fontSize: 20 }}>Results</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">AI Customization Complete</p>
        </div>
        <nav className="flex flex-col gap-xs">
          {[
            { icon: 'analytics', label: 'ATS Score' },
            { icon: 'psychology', label: 'Top Hire Insights' },
            { icon: 'auto_awesome', label: 'Key Changes' },
            { icon: 'warning', label: 'Skills Gap' },
            { icon: 'edit_note', label: 'Refine Resume' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-sm p-sm text-on-surface-variant rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Optional sections */}
        <div className="mt-md">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-xs px-xs">Add Section</p>
          <div className="flex flex-col gap-xs">
            {OPTIONAL_SECTIONS.map(sec => {
              const active = currentSectionOrder.includes(sec.key);
              return (
                <button
                  key={sec.key}
                  onClick={() => active ? removeSection(sec.key) : addSection(sec.key)}
                  className={`flex items-center gap-sm p-sm rounded-lg border transition-all text-left ${active ? 'border-primary/40 bg-primary/10 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:text-primary'}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{active ? 'check_circle' : 'add_circle'}</span>
                  <span className="font-label-sm text-label-sm">{sec.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-xs mt-auto pt-md border-t border-outline-variant">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="bg-primary text-on-primary font-label-md text-label-md p-sm rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-xs electric-glow"
          >
            {downloading
              ? <><span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>sync</span> Generating...</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>download</span> Download PDF</>
            }
          </button>
          <button onClick={() => setShowTemplates(true)} className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>style</span>
            <span className="font-label-md text-label-md">Change Template</span>
          </button>
          <button onClick={handleCustomizeAnother} className="flex items-center gap-sm p-sm text-on-surface-variant hover:bg-surface-variant transition-all rounded-lg">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>cycle</span>
            <span className="font-label-md text-label-md">Customize Again</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-md md:p-lg">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          {/* Left: Analysis */}
          <div className="lg:col-span-5 flex flex-col gap-lg">

            {/* ATS Score */}
            <div className="bg-surface-container-low rounded-xl border border-outline-variant p-lg">
              <ATSArc score={ats_score || 0} />
              <p className="font-body-md text-body-md text-on-surface-variant text-center mt-sm">
                Optimized for <strong className="text-on-surface">{jobTitle}</strong> at <strong className="text-on-surface">{company}</strong>.
              </p>
            </div>

            {/* Top Hire Insights */}
            {top_hire_insights && (
              <div className="bg-surface-container rounded-xl border border-outline-variant p-md">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-primary">psychology</span>
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">What Gets People Hired at {company}</h3>
                </div>
                {top_hire_insights.typical_background && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">{top_hire_insights.typical_background}</p>
                )}
                {top_hire_insights.must_have_skills?.length > 0 && (
                  <div className="mb-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Must-Have Skills</p>
                    <div className="flex flex-wrap gap-xs">
                      {top_hire_insights.must_have_skills.map((s, i) => (
                        <span key={i} className="px-xs py-0.5 rounded-full font-label-sm text-label-sm border border-primary/30 bg-primary/10 text-primary">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {top_hire_insights.ats_keywords_found?.length > 0 && (
                  <div className="mb-md">
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">ATS Keywords Found</p>
                    <div className="flex flex-wrap gap-xs">
                      {top_hire_insights.ats_keywords_found.map((k, i) => (
                        <span key={i} className="px-xs py-0.5 rounded-full font-label-sm text-label-sm border border-secondary/30 bg-secondary/10 text-secondary">{k}</span>
                      ))}
                    </div>
                  </div>
                )}
                {top_hire_insights.culture_signals?.length > 0 && (
                  <div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs">Culture Signals</p>
                    <ul className="space-y-xs">
                      {top_hire_insights.culture_signals.map((s, i) => (
                        <li key={i} className="flex items-start gap-xs font-body-sm text-body-sm text-on-surface-variant">
                          <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontSize: 14, marginTop: 3 }}>fiber_manual_record</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Key Changes */}
            {key_changes?.length > 0 && (
              <div className="bg-surface-container rounded-xl border border-outline-variant p-md">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Key Changes Made</h3>
                </div>
                <ul className="flex flex-col gap-sm">
                  {key_changes.map((c, i) => (
                    <li key={i} className="flex items-start gap-sm">
                      <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <p className="font-body-sm text-body-sm text-on-surface">{c}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Gap */}
            {missing_skills?.length > 0 && (
              <div className="bg-surface-container rounded-xl border border-outline-variant p-md">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-tertiary">warning</span>
                  <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Skills Gap</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                  To reach 100%, consider adding these if you genuinely have them:
                </p>
                <div className="flex flex-wrap gap-xs">
                  {missing_skills.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => addSkillToResume(s)}
                      className="bg-tertiary-container/20 text-tertiary border border-tertiary-container/30 px-sm py-xs rounded-full font-label-sm text-label-sm flex items-center gap-xs hover:bg-tertiary/20 transition-colors"
                      title="Click to add to resume"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Refine Resume ── */}
            <div className="bg-surface-container rounded-xl border border-outline-variant p-md">
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-primary">edit_note</span>
                <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Refine Resume</h3>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
                Not happy with something? Describe the change and AI will update your resume instantly.
              </p>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-xs mb-md">
                {QUICK_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setRefineSuggestion(s)}
                    className="font-label-sm text-label-sm text-primary border border-primary/30 bg-primary/5 px-xs py-0.5 rounded-full hover:bg-primary/15 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex gap-xs">
                <input
                  value={refineSuggestion}
                  onChange={e => setRefineSuggestion(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRefine()}
                  placeholder="e.g. Make the summary shorter and punchier..."
                  className="flex-1 bg-surface border border-outline-variant focus:border-primary rounded px-sm py-xs font-body-sm text-body-sm text-on-surface transition-all"
                />
                <button
                  onClick={handleRefine}
                  disabled={refining || !refineSuggestion.trim()}
                  className="bg-primary text-on-primary font-label-md text-label-md px-md py-xs rounded hover:opacity-90 transition-all flex items-center gap-xs electric-glow disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {refining
                    ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span>
                    : <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
                  }
                </button>
              </div>

              {refineHistory.length > 0 && (
                <div className="mt-sm space-y-xs">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">Applied:</p>
                  {refineHistory.slice(-3).map((h, i) => (
                    <div key={i} className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                      <span className="material-symbols-outlined text-green-400" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      {h}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons (mobile) */}
            <div className="flex flex-col sm:flex-row gap-sm md:hidden">
              <button onClick={handleDownload} disabled={downloading} className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-sm electric-glow">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
                Download PDF
              </button>
              <button onClick={handleCustomizeAnother} className="flex-1 border border-outline-variant text-on-surface font-label-md text-label-md py-md rounded-lg hover:bg-surface-variant flex items-center justify-center gap-sm">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>cycle</span>
                Customize Again
              </button>
            </div>
          </div>

          {/* Right: Resume Preview */}
          <div className="lg:col-span-7 flex flex-col gap-md">
            <div className="flex justify-between items-center px-sm">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Live Preview</span>
              <button onClick={() => setShowTemplates(true)} className="flex items-center gap-xs px-sm py-xs hover:bg-surface-variant rounded transition-colors font-label-sm text-label-sm text-primary border border-primary/30">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>style</span>
                Change Template
              </button>
            </div>
            <ResumePreview ref={previewRef} resumeData={customized_resume} sectionOrder={currentSectionOrder} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </main>
    </div>
  );
}
