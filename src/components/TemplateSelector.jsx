import { TEMPLATES } from './ResumePreview.jsx';

const TEMPLATE_DESCRIPTIONS = {
  classic: 'Harvard-style ATS-safe. Used by top consulting & finance candidates.',
  modern: 'Clean blue-accent. Preferred at FAANG & tech unicorns.',
  executive: 'Bold dark header. Ideal for senior roles & C-suite applications.',
  minimal: 'Ultra-clean whitespace. Loved by startups & design-forward companies.',
  accent: 'Left accent bar. Popular in European markets & creative-tech roles.',
};

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-md">
      <div className="bg-surface-container border border-outline-variant rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-md border-b border-outline-variant sticky top-0 bg-surface-container z-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface" style={{ fontSize: 20 }}>Choose Template</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">All templates are ATS-compatible. Pick what fits your target industry.</p>
          </div>
          <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
        </div>

        <div className="p-md grid grid-cols-1 sm:grid-cols-2 gap-md">
          {Object.entries(TEMPLATES).map(([key, t]) => (
            <button
              key={key}
              onClick={() => { setSelectedTemplate(key); onClose(); }}
              className={`text-left border-2 rounded-xl p-md transition-all hover:border-primary group ${
                selectedTemplate === key ? 'border-primary bg-primary/5' : 'border-outline-variant'
              }`}
            >
              {/* Mini resume preview */}
              <div className="bg-white rounded p-3 mb-md h-36 overflow-hidden relative">
                <div className="border-b-2 border-gray-400 pb-2 mb-2">
                  <div className="font-bold text-gray-800 text-xs uppercase tracking-wide">Your Name</div>
                  <div className="text-gray-500 text-[8px]">email@example.com | +1 555-0100 | City, State</div>
                </div>
                <div className="text-[7px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-300 pb-0.5 mb-1">Experience</div>
                <div className="text-[7px] text-gray-700 font-semibold">Senior Engineer | Company • 2022–Present</div>
                <div className="text-[6.5px] text-gray-600 mt-0.5">• Led cross-functional team of 8 to deliver platform migration</div>
                <div className="text-[6.5px] text-gray-600">• Reduced API latency by 45% through query optimization</div>
                <div className="text-[7px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-300 pb-0.5 mb-1 mt-2">Skills</div>
                <div className="text-[6.5px] text-gray-600">Python, Go, React, AWS, Kubernetes, PostgreSQL</div>
                {selectedTemplate === key && (
                  <div className="absolute top-1 right-1 bg-primary text-on-primary text-[8px] px-1 py-0.5 rounded font-bold">ACTIVE</div>
                )}
              </div>

              <div className="flex items-start justify-between gap-sm">
                <div>
                  <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">{t.name}</h3>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">{TEMPLATE_DESCRIPTIONS[key]}</p>
                </div>
                {selectedTemplate === key && (
                  <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
