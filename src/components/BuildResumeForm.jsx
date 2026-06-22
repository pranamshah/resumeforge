import { useState } from 'react';
import { suggestSkills, generateSummary } from '../utils/groqApi.js';
import { showToast } from '../utils/toast.js';

const STEPS = ['Identity','Experience','Education','Skills','Projects','Certifications','Review'];
const SKILL_CATS = ['languages','frameworks','tools','databases','cloud','other'];

const emptyExp = () => ({ company:'',title:'',location:'',startDate:'',endDate:'',current:false,bullets:['','',''] });
const emptyEdu = () => ({ school:'',degree:'',field:'',endDate:'',gpa:'' });
const emptyProj = () => ({ name:'',description:'',techStack:[],link:'',bullets:[''] });
const emptyCert = () => ({ name:'',issuer:'',year:'' });

function Field({ label, value, onChange, placeholder, type='text', required }) {
  return (
    <div className="space-y-base">
      <label className="font-label-sm text-label-sm text-on-surface-variant">{label}{required && <span className="text-error ml-0.5">*</span>}</label>
      <input type={type} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface transition-all"
      />
    </div>
  );
}

export default function BuildResumeForm({ groqKey, setResumeData, setScreen, setActiveFlow }) {
  const [step, setStep] = useState(0);
  const [personal, setPersonal] = useState({ name:'',email:'',phone:'',location:'',linkedin:'',github:'',website:'',summary:'' });
  const [experience, setExperience] = useState([emptyExp()]);
  const [education, setEducation] = useState([emptyEdu()]);
  const [skills, setSkills] = useState({ languages:[],frameworks:[],tools:[],databases:[],cloud:[],other:[] });
  const [projects, setProjects] = useState([emptyProj()]);
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState('');
  const [activeSkillCat, setActiveSkillCat] = useState('languages');
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (cat, val) => {
    if (!val.trim()) return;
    setSkills(s => ({ ...s, [cat]: [...(s[cat]||[]), val.trim()] }));
  };
  const removeSkill = (cat, i) => setSkills(s => ({ ...s, [cat]: s[cat].filter((_,j)=>j!==i) }));

  const handleSuggestSkills = async () => {
    const expText = experience.map(e => `${e.title} at ${e.company}: ${e.bullets.join(' ')}`).join('\n');
    setLoadingSuggestions(true);
    try {
      const sug = await suggestSkills(groqKey, expText);
      setSkills(prev => {
        const next = { ...prev };
        Object.entries(sug).forEach(([cat, arr]) => {
          if (Array.isArray(arr)) next[cat] = [...new Set([...(next[cat]||[]), ...arr])];
        });
        return next;
      });
      showToast('Skills suggested based on your experience', 'success');
    } catch { showToast('Could not suggest skills. Try again.', 'error'); }
    setLoadingSuggestions(false);
  };

  const handleGenerateSummary = async () => {
    setLoadingSummary(true);
    try {
      const data = { personal, experience, education, skills };
      const s = await generateSummary(groqKey, data);
      setPersonal(p => ({ ...p, summary: s }));
      showToast('Summary generated!', 'success');
    } catch { showToast('Could not generate summary.', 'error'); }
    setLoadingSummary(false);
  };

  const handleFinish = () => {
    const data = {
      personal,
      experience,
      education,
      skills,
      projects,
      certifications,
      achievements: achievements.split('\n').filter(Boolean),
    };
    setResumeData(data);
    setActiveFlow('build');
    setScreen('target');
  };

  const progressPct = ((step) / (STEPS.length - 1)) * 100;

  return (
    <main className="flex-grow py-xl px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto w-full">
      {/* Step Progress */}
      <div className="mb-xl">
        <div className="flex justify-between mb-md">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-xs">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-label-sm text-label-sm transition-all ${
                i < step ? 'border-primary bg-primary/20 text-primary' :
                i === step ? 'border-primary bg-primary text-on-primary' :
                'border-outline-variant text-on-surface-variant'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`font-label-sm text-label-sm hidden sm:block ${i === step ? 'text-primary' : 'text-on-surface-variant'}`}>{s}</span>
            </div>
          ))}
        </div>
        <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant rounded-xl p-lg space-y-lg">
        {/* Step 0: Identity */}
        {step === 0 && (
          <div className="space-y-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Personal Identity</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <Field label="Full Name" value={personal.name} onChange={v=>setPersonal(p=>({...p,name:v}))} required />
              <Field label="Email" value={personal.email} onChange={v=>setPersonal(p=>({...p,email:v}))} required type="email" />
              <Field label="Phone" value={personal.phone} onChange={v=>setPersonal(p=>({...p,phone:v}))} required />
              <Field label="Location" value={personal.location} onChange={v=>setPersonal(p=>({...p,location:v}))} required />
              <Field label="LinkedIn URL" value={personal.linkedin} onChange={v=>setPersonal(p=>({...p,linkedin:v}))} />
              <Field label="GitHub URL" value={personal.github} onChange={v=>setPersonal(p=>({...p,github:v}))} />
              <Field label="Website" value={personal.website} onChange={v=>setPersonal(p=>({...p,website:v}))} />
            </div>
          </div>
        )}

        {/* Step 1: Experience */}
        {step === 1 && (
          <div className="space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Work Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="border border-outline-variant rounded-lg p-md space-y-md relative group">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Field label="Company" value={exp.company} onChange={v=>{const e=[...experience];e[i]={...e[i],company:v};setExperience(e);}} required />
                  <Field label="Job Title" value={exp.title} onChange={v=>{const e=[...experience];e[i]={...e[i],title:v};setExperience(e);}} required />
                  <Field label="Start Date" value={exp.startDate} onChange={v=>{const e=[...experience];e[i]={...e[i],startDate:v};setExperience(e);}} placeholder="e.g. Jan 2022" />
                  <Field label={exp.current ? 'End Date (Present)' : 'End Date'} value={exp.current ? 'Present' : exp.endDate} onChange={v=>{const e=[...experience];e[i]={...e[i],endDate:v};setExperience(e);}} placeholder="e.g. Dec 2024" />
                  <Field label="Location" value={exp.location} onChange={v=>{const e=[...experience];e[i]={...e[i],location:v};setExperience(e);}} />
                  <div className="flex items-center gap-sm pt-lg">
                    <input type="checkbox" id={`curr-${i}`} checked={exp.current} onChange={e=>{const x=[...experience];x[i]={...x[i],current:e.target.checked};setExperience(x);}} className="accent-primary" />
                    <label htmlFor={`curr-${i}`} className="font-label-sm text-label-sm text-on-surface-variant">Currently working here</label>
                  </div>
                </div>
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">Bullet Points (one per field)</label>
                  {(exp.bullets || []).map((b, j) => (
                    <div key={j} className="flex gap-xs">
                      <input value={b} onChange={e=>{const x=[...experience];x[i]={...x[i],bullets:[...x[i].bullets]};x[i].bullets[j]=e.target.value;setExperience(x);}}
                        placeholder="Led team of 5 engineers to deliver..."
                        className="flex-1 bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface"
                      />
                      <button onClick={()=>{const x=[...experience];x[i].bullets.splice(j,1);setExperience(x);}} className="material-symbols-outlined text-on-surface-variant hover:text-error" style={{fontSize:16}}>close</button>
                    </div>
                  ))}
                  <button onClick={()=>{const x=[...experience];x[i].bullets.push('');setExperience(x);}} className="font-label-sm text-label-sm text-primary flex items-center gap-base">
                    <span className="material-symbols-outlined" style={{fontSize:14}}>add</span> Add bullet
                  </button>
                </div>
                {experience.length > 1 && (
                  <button onClick={()=>setExperience(experience.filter((_,j)=>j!==i))} className="absolute top-md right-md opacity-0 group-hover:opacity-100 material-symbols-outlined text-on-surface-variant hover:text-error transition-all">delete</button>
                )}
              </div>
            ))}
            <button onClick={()=>setExperience([...experience,emptyExp()])} className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80">
              <span className="material-symbols-outlined" style={{fontSize:16}}>add</span> Add Another Role
            </button>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="border border-outline-variant rounded-lg p-md">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Field label="School / University" value={edu.school} onChange={v=>{const e=[...education];e[i]={...e[i],school:v};setEducation(e);}} required />
                  <Field label="Degree" value={edu.degree} onChange={v=>{const e=[...education];e[i]={...e[i],degree:v};setEducation(e);}} placeholder="B.S., M.S., MBA..." />
                  <Field label="Field of Study" value={edu.field} onChange={v=>{const e=[...education];e[i]={...e[i],field:v};setEducation(e);}} />
                  <Field label="Graduation Year" value={edu.endDate} onChange={v=>{const e=[...education];e[i]={...e[i],endDate:v};setEducation(e);}} placeholder="2024" />
                  <Field label="GPA (optional)" value={edu.gpa} onChange={v=>{const e=[...education];e[i]={...e[i],gpa:v};setEducation(e);}} />
                </div>
              </div>
            ))}
            <button onClick={()=>setEducation([...education,emptyEdu()])} className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80">
              <span className="material-symbols-outlined" style={{fontSize:16}}>add</span> Add Education
            </button>
          </div>
        )}

        {/* Step 3: Skills */}
        {step === 3 && (
          <div className="space-y-md">
            <div className="flex justify-between items-center">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Skills Vector</h2>
              <button onClick={handleSuggestSkills} disabled={loadingSuggestions} className="flex items-center gap-xs font-label-sm text-label-sm text-primary border border-primary/30 bg-primary/10 px-sm py-xs rounded hover:bg-primary/20 transition-colors">
                {loadingSuggestions ? <span className="material-symbols-outlined animate-spin" style={{fontSize:14}}>sync</span> : <span className="material-symbols-outlined" style={{fontSize:14}}>auto_awesome</span>}
                Suggest from experience
              </button>
            </div>
            <div className="flex gap-xs flex-wrap border-b border-outline-variant pb-md">
              {SKILL_CATS.map(cat => (
                <button key={cat} onClick={()=>setActiveSkillCat(cat)} className={`font-label-sm text-label-sm px-sm py-xs rounded-lg transition-colors capitalize ${activeSkillCat===cat ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-xs">
              {(skills[activeSkillCat]||[]).map((s, i) => (
                <span key={i} className="flex items-center gap-base px-xs py-1 border border-outline-variant rounded bg-surface-container-highest text-on-surface font-label-sm text-label-sm">
                  {s}
                  <button onClick={()=>removeSkill(activeSkillCat,i)} className="text-on-surface-variant hover:text-error" style={{fontSize:12}}>×</button>
                </span>
              ))}
              <input
                value={skillInput}
                placeholder="Type skill + Enter"
                className="bg-surface border border-outline-variant rounded px-xs py-1 font-label-sm text-label-sm text-on-surface w-32 focus:border-primary"
                onChange={e=>setSkillInput(e.target.value)}
                onKeyDown={e=>{if(e.key==='Enter'&&skillInput.trim()){addSkill(activeSkillCat,skillInput);setSkillInput('');}}}
              />
            </div>
          </div>
        )}

        {/* Step 4: Projects */}
        {step === 4 && (
          <div className="space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Projects</h2>
            {projects.map((proj, i) => (
              <div key={i} className="border border-outline-variant rounded-lg p-md space-y-md relative group">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  <Field label="Project Name" value={proj.name} onChange={v=>{const p=[...projects];p[i]={...p[i],name:v};setProjects(p);}} />
                  <Field label="Link (optional)" value={proj.link} onChange={v=>{const p=[...projects];p[i]={...p[i],link:v};setProjects(p);}} />
                  <div className="col-span-2">
                    <label className="font-label-sm text-label-sm text-on-surface-variant">Description</label>
                    <textarea value={proj.description} rows={2} onChange={e=>{const p=[...projects];p[i]={...p[i],description:e.target.value};setProjects(p);}}
                      className="mt-base w-full bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface resize-none"
                    />
                  </div>
                </div>
                {projects.length > 0 && (
                  <button onClick={()=>setProjects(projects.filter((_,j)=>j!==i))} className="absolute top-md right-md opacity-0 group-hover:opacity-100 material-symbols-outlined text-on-surface-variant hover:text-error">delete</button>
                )}
              </div>
            ))}
            <button onClick={()=>setProjects([...projects,emptyProj()])} className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80">
              <span className="material-symbols-outlined" style={{fontSize:16}}>add</span> Add Project
            </button>
          </div>
        )}

        {/* Step 5: Certifications */}
        {step === 5 && (
          <div className="space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Certifications & Achievements</h2>
            {certifications.map((cert, i) => (
              <div key={i} className="border border-outline-variant rounded-lg p-md">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
                  <Field label="Certification Name" value={cert.name} onChange={v=>{const c=[...certifications];c[i]={...c[i],name:v};setCertifications(c);}} />
                  <Field label="Issuer" value={cert.issuer} onChange={v=>{const c=[...certifications];c[i]={...c[i],issuer:v};setCertifications(c);}} />
                  <Field label="Year" value={cert.year} onChange={v=>{const c=[...certifications];c[i]={...c[i],year:v};setCertifications(c);}} />
                </div>
              </div>
            ))}
            <button onClick={()=>setCertifications([...certifications,emptyCert()])} className="font-label-sm text-label-sm text-primary flex items-center gap-base hover:opacity-80">
              <span className="material-symbols-outlined" style={{fontSize:16}}>add</span> Add Certification
            </button>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant">Achievements (one per line)</label>
              <textarea rows={4} value={achievements} onChange={e=>setAchievements(e.target.value)} placeholder="e.g. Won Hackathon 2023&#10;Dean's List 2022"
                className="mt-base w-full bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <div className="space-y-md">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Review & Summary</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-md">
              {[
                { label: 'Name', val: personal.name },
                { label: 'Email', val: personal.email },
                { label: 'Experience Entries', val: experience.length },
                { label: 'Education Entries', val: education.length },
                { label: 'Projects', val: projects.length },
                { label: 'Skills (total)', val: Object.values(skills).flat().length },
              ].map(({label,val}) => (
                <div key={label} className="bg-surface-container-low border border-outline-variant rounded-lg p-md">
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
                  <p className="font-body-md text-body-md text-on-surface font-semibold mt-xs">{val || '—'}</p>
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center justify-between mb-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Professional Summary</label>
                <button onClick={handleGenerateSummary} disabled={loadingSummary} className="flex items-center gap-xs font-label-sm text-label-sm text-primary hover:opacity-80">
                  {loadingSummary ? <span className="material-symbols-outlined animate-spin" style={{fontSize:14}}>sync</span> : <span className="material-symbols-outlined" style={{fontSize:14}}>auto_awesome</span>}
                  Generate
                </button>
              </div>
              <textarea rows={4} value={personal.summary} onChange={e=>setPersonal(p=>({...p,summary:e.target.value}))}
                placeholder="A compelling summary will be generated when you click Generate..."
                className="w-full bg-surface border border-outline-variant focus:border-primary rounded p-xs font-body-sm text-body-sm text-on-surface resize-none"
              />
            </div>
            <button onClick={handleFinish} className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:opacity-90 transition-all electric-glow flex items-center justify-center gap-sm">
              <span className="material-symbols-outlined">rocket_launch</span>
              Customize My Resume →
            </button>
          </div>
        )}

        {/* Nav */}
        {step < 6 && (
          <div className="flex justify-between pt-md border-t border-outline-variant">
            <button onClick={()=>step>0?setStep(step-1):setScreen('landing')} className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant border border-outline-variant px-md py-xs rounded hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_back</span>
              {step === 0 ? 'Back' : 'Previous'}
            </button>
            <button onClick={()=>setStep(step+1)} className="flex items-center gap-xs font-label-md text-label-md bg-primary text-on-primary px-md py-xs rounded hover:opacity-90 transition-all">
              Next
              <span className="material-symbols-outlined" style={{fontSize:16}}>arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
