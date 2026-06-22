const TEMPLATES = {
  classic: {
    name: 'ATS Classic',
    headerClass: 'text-center border-b-2 border-black pb-4 mb-4',
    nameStyle: { fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' },
    contactStyle: { fontFamily: 'Arial, sans-serif', fontSize: 11, color: '#555', textAlign: 'center', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #111', paddingBottom: 2, marginBottom: 8, marginTop: 16, color: '#111' },
    bodyStyle: { fontFamily: 'Georgia, serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Arial, sans-serif', fontSize: 10, color: '#666' },
  },
  modern: {
    name: 'Modern Tech',
    headerClass: 'border-b-2 border-blue-600 pb-4 mb-4',
    nameStyle: { fontFamily: 'Inter, sans-serif', fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#555', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', borderLeft: '3px solid #2563EB', paddingLeft: 8, marginBottom: 8, marginTop: 16, color: '#2563EB' },
    bodyStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#666' },
  },
  executive: {
    name: 'Executive',
    headerClass: 'bg-gray-900 text-white px-6 py-5 mb-4 -mx-12 -mt-12',
    nameStyle: { fontFamily: 'Inter, sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: 3, marginBottom: 8, marginTop: 18 },
    bodyStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#666', fontWeight: 600 },
  },
  minimal: {
    name: 'Minimalist',
    headerClass: 'mb-6',
    nameStyle: { fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 300, color: '#111', letterSpacing: '0.1em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#888', marginTop: 6, letterSpacing: '0.05em' },
    sectionHeaderStyle: { fontFamily: 'Inter, sans-serif', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888', marginBottom: 8, marginTop: 20 },
    bodyStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10.5, lineHeight: 1.6, color: '#333' },
    dateStyle: { fontFamily: 'Inter, sans-serif', fontSize: 9.5, color: '#999' },
  },
  accent: {
    name: 'Accent Line',
    headerClass: 'flex gap-6 items-start border-b border-gray-300 pb-4 mb-4',
    nameStyle: { fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 700, color: '#111' },
    contactStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#666', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', borderLeft: '4px solid #6366f1', paddingLeft: 8, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter, sans-serif', fontSize: 10, color: '#888' },
  },
};

function renderSections(resumeData, sectionOrder, t) {
  const d = resumeData || {};
  const p = d.personal || {};
  const order = sectionOrder || ['personal','summary','experience','skills','education','projects','certifications'];

  return order.map(sec => {
    if (sec === 'personal') return null;

    if (sec === 'summary' && p.summary) return (
      <div key="summary">
        <div style={t.sectionHeaderStyle}>Professional Summary</div>
        <p style={t.bodyStyle}>{p.summary}</p>
      </div>
    );

    if (sec === 'experience' && d.experience?.length) return (
      <div key="experience">
        <div style={t.sectionHeaderStyle}>Professional Experience</div>
        {d.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{exp.title}{exp.company ? ` | ${exp.company}` : ''}</strong>
              <span style={t.dateStyle}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
            </div>
            {exp.location && <div style={{ ...t.bodyStyle, color: '#666', fontSize: 9.5 }}>{exp.location}</div>}
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {(exp.bullets || []).filter(Boolean).map((b, j) => (
                <li key={j} style={{ ...t.bodyStyle, marginBottom: 2 }}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );

    if (sec === 'skills' && d.skills) {
      const cats = Object.entries(d.skills).filter(([, v]) => v?.length);
      if (!cats.length) return null;
      return (
        <div key="skills">
          <div style={t.sectionHeaderStyle}>Technical Skills</div>
          {cats.map(([cat, vals]) => (
            <p key={cat} style={{ ...t.bodyStyle, marginBottom: 3 }}>
              <strong style={{ textTransform: 'capitalize' }}>{cat}:</strong> {vals.join(', ')}
            </p>
          ))}
        </div>
      );
    }

    if (sec === 'education' && d.education?.length) return (
      <div key="education">
        <div style={t.sectionHeaderStyle}>Education</div>
        {d.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{edu.school}</strong>
              <span style={t.dateStyle}>{edu.endDate}</span>
            </div>
            <div style={{ ...t.bodyStyle, color: '#555' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </div>
    );

    if (sec === 'projects' && d.projects?.length) return (
      <div key="projects">
        <div style={t.sectionHeaderStyle}>Projects</div>
        {d.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{proj.name}</strong>
              {proj.link && <span style={{ ...t.dateStyle, color: '#2563eb' }}>{proj.link}</span>}
            </div>
            {proj.description && <p style={{ ...t.bodyStyle, color: '#555', marginTop: 2 }}>{proj.description}</p>}
            {(proj.bullets || []).filter(Boolean).map((b, j) => (
              <li key={j} style={{ ...t.bodyStyle, marginLeft: 16, marginBottom: 2 }}>{b}</li>
            ))}
          </div>
        ))}
      </div>
    );

    if (sec === 'certifications' && d.certifications?.length) return (
      <div key="certifications">
        <div style={t.sectionHeaderStyle}>Certifications</div>
        {d.certifications.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ ...t.bodyStyle, fontWeight: 600 }}>{c.name}</span>
            <span style={t.dateStyle}>{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
          </div>
        ))}
      </div>
    );

    if (sec === 'achievements' && d.achievements?.length) return (
      <div key="achievements">
        <div style={t.sectionHeaderStyle}>Achievements</div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {d.achievements.map((a, i) => (
            <li key={i} style={{ ...t.bodyStyle, marginBottom: 2 }}>{a}</li>
          ))}
        </ul>
      </div>
    );

    return null;
  });
}

export default function ResumePreview({ resumeData, sectionOrder, selectedTemplate = 'classic' }) {
  const t = TEMPLATES[selectedTemplate] || TEMPLATES.classic;
  const p = resumeData?.personal || {};

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  const linkParts = [p.linkedin, p.github, p.website].filter(Boolean);

  return (
    <div className="bg-white text-[#111827] resume-shadow rounded overflow-hidden relative selection:bg-blue-100" style={{ minHeight: 800 }}>
      <div style={{ padding: '48px', fontFamily: 'Arial, sans-serif', fontSize: '10pt', lineHeight: 1.5 }}>
        {/* Header */}
        <div className={t.headerClass}>
          <div style={t.nameStyle}>{p.name || 'Your Name'}</div>
          {contactParts.length > 0 && (
            <div style={t.contactStyle}>{contactParts.join(' | ')}</div>
          )}
          {linkParts.length > 0 && (
            <div style={{ ...t.contactStyle, color: '#2563EB' }}>{linkParts.join(' | ')}</div>
          )}
        </div>

        {/* Sections */}
        {renderSections(resumeData, sectionOrder, t)}
      </div>

      {/* Preview badge */}
      <div className="absolute top-2 right-2 bg-surface-container border border-outline-variant text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded opacity-60">
        Preview
      </div>
    </div>
  );
}

export { TEMPLATES };
