import { useState } from 'react';

function Field({ label, value, onChange, type = 'text', rows }) {
  if (rows) {
    return (
      <div className="space-y-base">
        <label className="font-label-sm text-label-sm text-on-surface-variant">{label}</label>
        <textarea
          rows={rows}
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded p-xs font-body-sm text-body-sm text-on-surface transition-all resize-none"
        />
      </div>
    );
  }
  return (
    <div className="space-y-base">
      <label className="font-label-sm text-label-sm text-on-surface-variant">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-surface border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary rounded p-xs font-body-sm text-body-sm text-on-surface transition-all"
      />
    </div>
  );
}

function SectionCard({ icon, title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="bg-surface-container border border-outline-variant rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full p-md border-b border-outline-variant"
      >
        <div className="flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>{icon}</span>
          <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">{title}</h3>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>
      {open && <div className="p-md">{children}</div>}
    </div>
  );
}

export default function ExtractedDataEditor({ resumeData, setResumeData, setScreen }) {
  const upd = (path, val) => {
    const keys = path.split('.');
    setResumeData(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = val;
      return next;
    });
  };

  const d = resumeData || {};
  const p = d.personal || {};

  return (
    <main className="flex-grow py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Verification Layer</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Confirm the AI extracted your data accurately before proceeding to targeting.</p>
        </div>
        <div className="flex gap-sm">
          <button
            onClick={() => setScreen('upload')}
            className="border border-outline-variant text-on-surface font-label-md text-label-md px-md py-xs rounded hover:bg-surface-container-high transition-colors"
          >
            Re-upload
          </button>
          <button
            onClick={() => setScreen('target')}
            className="bg-primary text-on-primary font-label-md text-label-md px-lg py-xs rounded hover:opacity-90 transition-all electric-glow"
          >
            Proceed to Target
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="md:col-span-2 space-y-md">
          {/* Identity */}
          <SectionCard icon="person" title="Identity">
            <div className="grid grid-cols-2 gap-md">
              <Field label="Full Name" value={p.name} onChange={v => upd('personal.name', v)} />
              <Field label="Email" value={p.email} onChange={v => upd('personal.email', v)} />
              <Field label="Phone" value={p.phone} onChange={v => upd('personal.phone', v)} />
              <Field label="Location" value={p.location} onChange={v => upd('personal.location', v)} />
              <Field label="LinkedIn" value={p.linkedin} onChange={v => upd('personal.linkedin', v)} />
              <Field label="GitHub" value={p.github} onChange={v => upd('personal.github', v)} />
              <div className="col-span-2">
                <Field label="Professional Summary" value={p.summary} onChange={v => upd('personal.summary', v)} rows={3} />
              </div>
            </div>
          </SectionCard>

          {/* Experience */}
          <SectionCard icon="work" title="Experience">
            <div className="space-y-lg">
              {(d.experience || []).map((exp, i) => (
                <div key={i} className="relative group border-b border-outline-variant/30 pb-lg last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-md">
                    <div className="grid grid-cols-2 gap-md flex-1 mr-md">
                      <Field label="Company" value={exp.company} onChange={v => upd(`experience.${i}.company`, v)} />
                      <Field label="Title" value={exp.title} onChange={v => upd(`experience.${i}.title`, v)} />
                      <Field label="Start Date" value={exp.startDate} onChange={v => upd(`experience.${i}.startDate`, v)} />
                      <Field label="End Date" value={exp.current ? 'Present' : exp.endDate} onChange={v => upd(`experience.${i}.endDate`, v)} />
                    </div>
                    <button
                      onClick={() => {
                        const next = [...(d.experience || [])];
                        next.splice(i, 1);
                        upd('experience', next);
                      }}
                      className="opacity-0 group-hover:opacity-100 material-symbols-outlined text-on-surface-variant hover:text-error transition-all mt-6"
                    >delete</button>
                  </div>
                  <div className="space-y-xs">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Bullets</label>
                    {(exp.bullets || []).map((b, j) => (
                      <div key={j} className="flex gap-xs items-start">
                        <input
                          value={b}
                          onChange={e => {
                            const bullets = [...(exp.bullets || [])];
                            bullets[j] = e.target.value;
                            upd(`experience.${i}.bullets`, bullets);
                          }}
                          className="flex-1 bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface"
                        />
                        <button
                          onClick={() => {
                            const bullets = [...(exp.bullets || [])];
                            bullets.splice(j, 1);
                            upd(`experience.${i}.bullets`, bullets);
                          }}
                          className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors"
                          style={{ fontSize: 16, marginTop: 6 }}
                        >close</button>
                      </div>
                    ))}
                    <button
                      onClick={() => upd(`experience.${i}.bullets`, [...(exp.bullets || []), ''])}
                      className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add bullet
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => upd('experience', [...(d.experience || []), { company: '', title: '', startDate: '', endDate: '', current: false, bullets: [] }])}
                className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Another Role
              </button>
            </div>
          </SectionCard>

          {/* Education */}
          <SectionCard icon="school" title="Education">
            <div className="space-y-md">
              {(d.education || []).map((edu, i) => (
                <div key={i} className="grid grid-cols-2 gap-md border-b border-outline-variant/30 pb-md last:border-0">
                  <Field label="School" value={edu.school} onChange={v => upd(`education.${i}.school`, v)} />
                  <Field label="Degree" value={edu.degree} onChange={v => upd(`education.${i}.degree`, v)} />
                  <Field label="Field" value={edu.field} onChange={v => upd(`education.${i}.field`, v)} />
                  <Field label="Graduation Year" value={edu.endDate} onChange={v => upd(`education.${i}.endDate`, v)} />
                  <Field label="GPA (optional)" value={edu.gpa} onChange={v => upd(`education.${i}.gpa`, v)} />
                </div>
              ))}
              <button
                onClick={() => upd('education', [...(d.education || []), { school: '', degree: '', field: '', endDate: '', gpa: '' }])}
                className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span> Add Education
              </button>
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard icon="psychology" title="Skills Vector">
            {Object.entries(d.skills || {}).map(([cat, chips]) => (
              <div key={cat} className="mb-md">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-xs capitalize">{cat}</p>
                <div className="flex flex-wrap gap-xs">
                  {(chips || []).map((s, i) => (
                    <span key={i} className="flex items-center gap-base px-xs py-1 border border-outline-variant rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                      {s}
                      <button
                        onClick={() => {
                          const arr = [...chips];
                          arr.splice(i, 1);
                          upd(`skills.${cat}`, arr);
                        }}
                        className="text-on-surface-variant hover:text-error"
                        style={{ fontSize: 12 }}
                      >×</button>
                    </span>
                  ))}
                  <input
                    placeholder="Add skill..."
                    className="bg-surface border border-outline-variant rounded px-xs py-1 font-label-sm text-label-sm text-on-surface w-28 focus:border-primary"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        upd(`skills.${cat}`, [...(chips || []), e.target.value.trim()]);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </SectionCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-md">
          <div className="bg-surface-container-highest border border-outline-variant p-md rounded-lg overflow-hidden flex flex-col h-[400px]">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-label-md text-label-md text-primary flex items-center gap-xs uppercase tracking-widest">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>data_object</span> Raw Matrix
              </h3>
              <span className="bg-primary-container text-on-primary-container text-[10px] px-xs py-0.5 rounded font-label-sm uppercase">Optimized</span>
            </div>
            <div className="flex-grow overflow-y-auto font-label-sm text-label-sm text-on-surface-variant/80 bg-black/30 p-md rounded border border-outline-variant">
              <pre className="whitespace-pre-wrap text-xs text-on-surface-variant">
                {JSON.stringify({ profile: { name: p.name, email: p.email }, metrics: { parsed_nodes: ((d.experience || []).length * 10) + ((d.skills?.languages || []).length) } }, null, 2)}
              </pre>
            </div>
            <div className="mt-md pt-md border-t border-outline-variant">
              <div className="flex justify-between items-center mb-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Extraction Confidence</span>
                <span className="font-label-sm text-label-sm text-primary">96%</span>
              </div>
              <div className="h-1 w-full bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant p-md rounded-lg">
            <div className="flex items-center gap-xs mb-md border-b border-outline-variant pb-xs">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>psychology</span>
              <h3 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Skills Vector</h3>
            </div>
            <div className="flex flex-wrap gap-xs">
              {[...(d.skills?.languages || []), ...(d.skills?.frameworks || [])].slice(0, 8).map((s, i) => (
                <span key={i} className="font-label-sm text-label-sm px-xs py-1 border border-outline-variant rounded bg-surface-container-highest text-on-surface">{s}</span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setScreen('target')}
            className="w-full bg-primary-container text-on-primary-container font-label-md text-label-md p-sm rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-xs electric-glow"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
            Proceed to Target
          </button>
        </div>
      </div>
    </main>
  );
}
