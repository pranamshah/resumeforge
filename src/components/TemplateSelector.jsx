import { TEMPLATES } from './ResumePreview.jsx';

const TEMPLATE_DESCRIPTIONS = {
  classic:   'Harvard-style serif. Top choice for consulting, finance & law.',
  modern:    'Blue-accent sans-serif. Preferred at FAANG & tech unicorns.',
  executive: 'Bold dark header. Perfect for senior roles & C-suite.',
  minimal:   'Ultra-clean whitespace. Loved by startups & design studios.',
  accent:    'Purple left bar. Popular in creative-tech & European markets.',
};

const MiniPreview = ({ templateKey, isActive }) => {
  const previews = {
    classic: (
      <div className="bg-white w-full h-full p-2 text-black overflow-hidden">
        <div className="text-center border-b-2 border-black pb-1 mb-1.5">
          <div className="text-[7.5px] font-bold uppercase tracking-widest" style={{ fontFamily: 'Georgia,serif' }}>ALEX MORGAN</div>
          <div className="text-[5.5px] text-gray-500 mt-0.5">alex@email.com · New York, NY</div>
        </div>
        <div className="text-[5px] font-bold uppercase tracking-wider text-gray-700 border-b border-black pb-0.5 mb-1">Experience</div>
        <div className="text-[6px] font-bold" style={{ fontFamily: 'Georgia,serif' }}>Software Engineer · Google</div>
        <div className="text-[5px] text-gray-600">· Reduced latency by 45% via query optimization</div>
        <div className="text-[5px] text-gray-600">· Led cross-functional team of 8 engineers</div>
        <div className="text-[5px] font-bold uppercase tracking-wider text-gray-700 border-b border-black pb-0.5 mb-1 mt-1.5">Skills</div>
        <div className="text-[5px] text-gray-600">Python · React · AWS · Kubernetes · PostgreSQL</div>
      </div>
    ),
    modern: (
      <div className="bg-white w-full h-full p-2 text-black overflow-hidden">
        <div className="border-b-2 border-blue-600 pb-1 mb-1.5">
          <div className="text-[8px] font-black tracking-tight">Alex Morgan</div>
          <div className="text-[5.5px] text-gray-500 mt-0.5">alex@email.com · New York, NY</div>
        </div>
        <div className="text-[5px] font-bold uppercase tracking-wider border-l-2 border-blue-600 pl-1 mb-1 text-blue-600">Experience</div>
        <div className="text-[6px] font-bold">Software Engineer · Google</div>
        <div className="text-[5px] text-gray-600">· Reduced latency by 45% via query optimization</div>
        <div className="text-[5px] text-gray-600">· Led cross-functional team of 8 engineers</div>
        <div className="text-[5px] font-bold uppercase tracking-wider border-l-2 border-blue-600 pl-1 mt-1.5 mb-1 text-blue-600">Skills</div>
        <div className="text-[5px] text-gray-600">Python · React · AWS · Kubernetes · PostgreSQL</div>
      </div>
    ),
    executive: (
      <div className="bg-white w-full h-full overflow-hidden text-black">
        <div className="bg-gray-900 px-2 py-1.5">
          <div className="text-[8px] font-black text-white tracking-tight">Alex Morgan</div>
          <div className="text-[5.5px] text-gray-400 mt-0.5">alex@email.com · New York, NY</div>
        </div>
        <div className="p-2">
          <div className="text-[5px] font-bold uppercase tracking-wider text-blue-800 border-b-2 border-blue-800 pb-0.5 mb-1">Experience</div>
          <div className="text-[6px] font-bold">Software Engineer · Google</div>
          <div className="text-[5px] text-gray-600">· Reduced latency by 45% via query optimization</div>
          <div className="text-[5px] text-gray-600">· Led cross-functional team of 8 engineers</div>
          <div className="text-[5px] font-bold uppercase tracking-wider text-blue-800 border-b-2 border-blue-800 pb-0.5 mb-1 mt-1.5">Skills</div>
          <div className="text-[5px] text-gray-600">Python · React · AWS · Kubernetes</div>
        </div>
      </div>
    ),
    minimal: (
      <div className="bg-white w-full h-full p-2 text-black overflow-hidden">
        <div className="mb-2">
          <div className="text-[8px] font-light uppercase tracking-widest text-gray-700">ALEX MORGAN</div>
          <div className="text-[5.5px] text-gray-400 mt-0.5 tracking-wide">alex@email.com · New York, NY</div>
        </div>
        <div className="text-[4.5px] font-semibold uppercase tracking-widest text-gray-400 mb-1">Experience</div>
        <div className="text-[6px] font-medium text-gray-800">Software Engineer · Google</div>
        <div className="text-[5px] text-gray-500 mt-0.5">Reduced latency by 45% via query optimization</div>
        <div className="text-[5px] text-gray-500">Led cross-functional team of 8 engineers</div>
        <div className="text-[4.5px] font-semibold uppercase tracking-widest text-gray-400 mt-1.5 mb-1">Skills</div>
        <div className="text-[5px] text-gray-500 tracking-wide">Python  ·  React  ·  AWS  ·  Kubernetes</div>
      </div>
    ),
    accent: (
      <div className="bg-white w-full h-full p-2 text-black overflow-hidden">
        <div className="border-b border-gray-300 pb-1 mb-1.5">
          <div className="text-[8px] font-bold text-gray-900">Alex Morgan</div>
          <div className="text-[5.5px] text-gray-500 mt-0.5">alex@email.com · New York, NY</div>
        </div>
        <div className="text-[5px] font-bold uppercase tracking-wider border-l-4 border-indigo-500 pl-1 mb-1 text-gray-800">Experience</div>
        <div className="text-[6px] font-bold">Software Engineer · Google</div>
        <div className="text-[5px] text-gray-600">· Reduced latency by 45% via query optimization</div>
        <div className="text-[5px] text-gray-600">· Led cross-functional team of 8 engineers</div>
        <div className="text-[5px] font-bold uppercase tracking-wider border-l-4 border-indigo-500 pl-1 mt-1.5 mb-1 text-gray-800">Skills</div>
        <div className="text-[5px] text-gray-600">Python · React · AWS · Kubernetes · PostgreSQL</div>
      </div>
    ),
  };

  return (
    <div className="rounded overflow-hidden h-36 relative border border-gray-200">
      {previews[templateKey] || previews.classic}
      {isActive && (
        <div className="absolute top-1 right-1 bg-primary text-on-primary text-[8px] px-1 py-0.5 rounded font-bold">ACTIVE</div>
      )}
    </div>
  );
};

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-md">
      <div className="bg-surface-container border border-outline-variant rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-md border-b border-outline-variant sticky top-0 bg-surface-container z-10">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface" style={{ fontSize: 20 }}>Choose Your Template</h2>
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
              <MiniPreview templateKey={key} isActive={selectedTemplate === key} />

              <div className="flex items-start justify-between gap-sm mt-md">
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
