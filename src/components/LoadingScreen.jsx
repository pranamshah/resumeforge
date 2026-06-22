import { useState, useEffect } from 'react';

const STEPS = [
  { icon: 'analytics', text: 'Analyzing your professional background...' },
  { icon: 'travel_explore', text: (c) => `Searching for top hired profiles at ${c}...` },
  { icon: 'corporate_fare', text: (c) => `Analyzing ${c}'s culture and values...` },
  { icon: 'key', text: (r) => `Identifying ATS keywords for ${r}...` },
  { icon: 'edit_note', text: 'Rewriting your resume for maximum impact...' },
  { icon: 'verified', text: 'Scoring and finalizing...' },
];

export default function LoadingScreen({ company, jobTitle }) {
  const [completedSteps, setCompletedSteps] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) {
          setCompletedSteps(prev);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const getStepText = (step, i) => {
    const text = step.text;
    if (typeof text === 'function') {
      return i === 1 || i === 2 ? text(company || 'target company') : text(jobTitle || 'target role');
    }
    return text;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center px-margin-mobile">
      {/* Pulsing ring */}
      <div className="relative mb-xl">
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 absolute inset-0 animate-ping"></div>
        <div className="w-24 h-24 rounded-full border-4 border-t-primary border-r-primary/20 border-b-primary/10 border-l-primary/5 animate-spin flex items-center justify-center">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 36, fontVariationSettings: "'FILL' 1" }}>bolt</span>
        </div>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-white mb-xs text-center">
        Customizing for <span className="text-primary">{company || 'your target'}</span>...
      </h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-xl text-center">
        Running AI research and rewriting your resume
      </p>

      <div className="w-full max-w-md space-y-sm">
        {STEPS.map((step, i) => {
          const done = i < completedSteps;
          const active = i === activeStep;
          const pending = i > activeStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-md p-sm rounded-lg border transition-all duration-700 ${
                active ? 'border-primary/50 bg-primary/5' :
                done ? 'border-outline-variant/30 bg-surface-container-low/50' :
                'border-transparent opacity-30'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                done ? 'bg-primary/20 text-primary' :
                active ? 'bg-primary text-on-primary' :
                'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {done
                  ? <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  : active
                  ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>sync</span>
                  : <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{step.icon}</span>
                }
              </div>
              <span className={`font-label-md text-label-md ${active ? 'text-primary' : done ? 'text-on-surface-variant' : 'text-on-surface-variant'}`}>
                {getStepText(step, i)}
              </span>
              {done && <span className="material-symbols-outlined text-primary ml-auto" style={{ fontSize: 16 }}>check</span>}
            </div>
          );
        })}
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant opacity-40 mt-xl text-center">
        This may take 30–60 seconds depending on web research depth
      </p>
    </div>
  );
}
