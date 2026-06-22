export const TEMPLATES = {
  classic: {
    name: 'Classic ATS', category: 'Professional',
    description: 'Harvard-style serif. Top choice for consulting, finance & law.',
    headerBg: null, headerAlign: 'center', headerBorder: '2px solid #111',
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#111' },
    contactStyle: { fontFamily: 'Arial,sans-serif', fontSize: 11, color: '#555', textAlign: 'center', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial,sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #111', paddingBottom: 2, marginBottom: 8, marginTop: 16, color: '#111' },
    bodyStyle: { fontFamily: 'Georgia,serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#666' },
  },
  modern: {
    name: 'Modern Tech', category: 'Technology',
    description: 'Blue-accent sans-serif. Preferred at FAANG & tech unicorns.',
    headerBg: null, headerAlign: 'left', headerBorder: '2px solid #2563eb',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#555', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', borderLeft: '3px solid #2563EB', paddingLeft: 8, marginBottom: 8, marginTop: 16, color: '#2563EB' },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#666' },
  },
  executive: {
    name: 'Executive', category: 'Leadership',
    description: 'Bold dark header. Perfect for senior roles & C-suite.',
    headerBg: '#111827', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: 3, marginBottom: 8, marginTop: 18 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#666', fontWeight: 600 },
  },
  minimal: {
    name: 'Minimalist', category: 'Creative',
    description: 'Ultra-clean whitespace. Loved by startups & design studios.',
    headerBg: null, headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 20, fontWeight: 300, color: '#111', letterSpacing: '0.1em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#888', marginTop: 6, letterSpacing: '0.05em' },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#888', marginBottom: 8, marginTop: 20 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.6, color: '#333' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9.5, color: '#999' },
  },
  accent: {
    name: 'Accent Line', category: 'Professional',
    description: 'Purple left bar. Popular in creative-tech & European markets.',
    headerBg: null, headerAlign: 'left', headerBorder: '1px solid #d1d5db',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 20, fontWeight: 700, color: '#111' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#666', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#111', borderLeft: '4px solid #6366f1', paddingLeft: 8, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#888' },
  },
  corporate: {
    name: 'Corporate', category: 'Finance',
    description: 'Navy header. Standard for banking, consulting, and law firms.',
    headerBg: '#1e3a5f', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' },
    contactStyle: { fontFamily: 'Arial,sans-serif', fontSize: 11, color: '#93c5fd', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1e3a5f', borderBottom: '1.5px solid #1e3a5f', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1a1a2e' },
    dateStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#555', fontWeight: 600 },
  },
  fresh: {
    name: 'Fresh', category: 'Technology',
    description: 'Teal accents. Clean and modern — great for SaaS & product roles.',
    headerBg: null, headerAlign: 'left', headerBorder: '3px solid #0d9488',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#64748b', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#0d9488', borderBottom: '1px solid #99f6e4', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1e293b' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#64748b' },
  },
  bold: {
    name: 'Bold Impact', category: 'Creative',
    description: 'Strong typography. Stands out for product, marketing & design.',
    headerBg: null, headerAlign: 'left', headerBorder: '4px solid #111',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 28, fontWeight: 900, color: '#000', letterSpacing: '-0.03em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#555', marginTop: 6 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#000', background: '#f3f4f6', padding: '4px 8px', marginBottom: 8, marginTop: 18 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#666', fontWeight: 700 },
  },
  creative: {
    name: 'Creative', category: 'Creative',
    description: 'Indigo header. Perfect for designers, UX & creative-tech roles.',
    headerBg: '#4f46e5', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#c7d2fe', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#4f46e5', borderLeft: '4px solid #4f46e5', paddingLeft: 8, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#111' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#6366f1' },
  },
  finance: {
    name: 'Finance Pro', category: 'Finance',
    description: 'Amber & charcoal. Wall Street-approved for finance & analyst roles.',
    headerBg: null, headerAlign: 'center', headerBorder: '2px solid #92400e',
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 21, fontWeight: 700, color: '#111', letterSpacing: '0.03em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#666', textAlign: 'center', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#92400e', borderBottom: '1px solid #92400e', paddingBottom: 2, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1a1a1a' },
    dateStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#666' },
  },
  elegant: {
    name: 'Elegant', category: 'Professional',
    description: 'Serif gold accents. Premium look for law, academia & consulting.',
    headerBg: null, headerAlign: 'center', headerBorder: '1px solid #d4af7a',
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 400, color: '#111', letterSpacing: '0.08em' },
    contactStyle: { fontFamily: 'Georgia,serif', fontSize: 10, color: '#888', textAlign: 'center', marginTop: 5, fontStyle: 'italic' },
    sectionHeaderStyle: { fontFamily: 'Georgia,serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#8b6914', borderBottom: '1px solid #d4af7a', paddingBottom: 3, marginBottom: 8, marginTop: 18, textTransform: 'uppercase' },
    bodyStyle: { fontFamily: 'Georgia,serif', fontSize: 10.5, lineHeight: 1.6, color: '#222' },
    dateStyle: { fontFamily: 'Georgia,serif', fontSize: 10, color: '#888', fontStyle: 'italic' },
  },
  prestige: {
    name: 'Prestige', category: 'Leadership',
    description: 'Charcoal premium. Perfect for director & VP-level applications.',
    headerBg: '#1c1c1e', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '0.02em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#a1a1aa', marginTop: 5 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#52525b', borderBottom: '1px solid #e4e4e7', paddingBottom: 3, marginBottom: 8, marginTop: 18 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#18181b' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#71717a', fontWeight: 600 },
  },
  tech: {
    name: 'Tech Dark', category: 'Technology',
    description: 'Monospace accents & dark header. Built for engineers who ship code.',
    headerBg: '#0f172a', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: "'Courier New',monospace", fontSize: 20, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.02em' },
    contactStyle: { fontFamily: "'Courier New',monospace", fontSize: 10, color: '#94a3b8', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1e293b' },
    dateStyle: { fontFamily: "'Courier New',monospace", fontSize: 9.5, color: '#64748b' },
  },
  startup: {
    name: 'Startup', category: 'Technology',
    description: 'Purple gradient header. Loved by modern startups & growth companies.',
    headerBg: '#7c3aed', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 23, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#ddd6fe', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c3aed', background: '#f5f3ff', padding: '3px 8px', marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#111' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#6d28d9' },
  },
  geneva: {
    name: 'Geneva Grid', category: 'Professional',
    description: 'Swiss-inspired grid. Clean, precise, universally respected by HRs.',
    headerBg: null, headerAlign: 'left', headerBorder: '3px solid #111',
    nameStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 20, fontWeight: 700, color: '#111', letterSpacing: '0.03em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 10, color: '#555', marginTop: 6 },
    sectionHeaderStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#111', marginBottom: 8, marginTop: 20, borderBottom: '0.5px solid #ccc', paddingBottom: 3 },
    bodyStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 10.5, lineHeight: 1.5, color: '#333' },
    dateStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 9.5, color: '#777' },
  },
  oxford: {
    name: 'Oxford', category: 'Professional',
    description: 'Deep burgundy accents. Academic and scholarly — ideal for research roles.',
    headerBg: null, headerAlign: 'center', headerBorder: '2px solid #6b1e2e',
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: '#6b1e2e', letterSpacing: '0.04em' },
    contactStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#666', textAlign: 'center', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b1e2e', borderBottom: '1px solid #6b1e2e', paddingBottom: 2, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Georgia,serif', fontSize: 10.5, lineHeight: 1.55, color: '#222' },
    dateStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#888' },
  },
  nordic: {
    name: 'Nordic', category: 'Creative',
    description: 'Scandinavian clean design. White space, clarity, and calm authority.',
    headerBg: null, headerAlign: 'left', headerBorder: '1px solid #e2e8f0',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 21, fontWeight: 600, color: '#0f172a', letterSpacing: '0.01em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#94a3b8', marginTop: 5 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#94a3b8', marginBottom: 8, marginTop: 22, paddingBottom: 4, borderBottom: '1px solid #f1f5f9' },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.65, color: '#334155' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9.5, color: '#94a3b8' },
  },
  bordeaux: {
    name: 'Bordeaux', category: 'Leadership',
    description: 'Deep wine header. Premium look for directors and senior managers.',
    headerBg: '#4a1942', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '0.03em' },
    contactStyle: { fontFamily: 'Arial,sans-serif', fontSize: 11, color: '#e9d5ff', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#4a1942', borderLeft: '4px solid #4a1942', paddingLeft: 8, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1a1a1a' },
    dateStyle: { fontFamily: 'Arial,sans-serif', fontSize: 10, color: '#666' },
  },
  sage: {
    name: 'Sage', category: 'Creative',
    description: 'Sage green accents. Organic and modern — great for sustainability roles.',
    headerBg: null, headerAlign: 'left', headerBorder: '2px solid #4d7c5f',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 21, fontWeight: 700, color: '#1a2e1f', letterSpacing: '-0.01em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, color: '#6b8f72', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#4d7c5f', background: '#f0f7f1', padding: '3px 8px', marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.6, color: '#1a2e1f' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#6b8f72' },
  },
  midnight: {
    name: 'Midnight', category: 'Technology',
    description: 'Deep navy with cyan. Sleek and modern for data & cloud roles.',
    headerBg: '#0a1628', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 800, color: '#67e8f9', letterSpacing: '-0.01em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#0e7490', borderBottom: '1px solid #164e63', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1e293b' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#0e7490' },
  },
  copper: {
    name: 'Copper', category: 'Professional',
    description: 'Copper bronze tones. Warm and memorable — good for engineering roles.',
    headerBg: null, headerAlign: 'left', headerBorder: '3px solid #b45309',
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 800, color: '#78350f', letterSpacing: '-0.01em' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, color: '#92400e', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#b45309', borderBottom: '1px solid #fde68a', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1c1917' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#78350f' },
  },
  zen: {
    name: 'Zen', category: 'Creative',
    description: 'Japanese-inspired minimal. Maximum whitespace, zero clutter.',
    headerBg: null, headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 18, fontWeight: 300, color: '#000', letterSpacing: '0.15em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 9.5, color: '#999', marginTop: 8, letterSpacing: '0.08em' },
    sectionHeaderStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 8, fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#bbb', marginBottom: 10, marginTop: 24, paddingBottom: 6, borderBottom: '0.5px solid #eee' },
    bodyStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 10.5, lineHeight: 1.7, color: '#444' },
    dateStyle: { fontFamily: 'Helvetica,Arial,sans-serif', fontSize: 9.5, color: '#bbb' },
  },
  impact: {
    name: 'Impact', category: 'Creative',
    description: 'High-contrast black & orange. Impossible to ignore. For bold careers.',
    headerBg: '#111', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 24, fontWeight: 900, color: '#f97316', letterSpacing: '-0.02em', textTransform: 'uppercase' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#9ca3af', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#f97316', borderBottom: '2px solid #f97316', paddingBottom: 3, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#111' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#666', fontWeight: 700 },
  },
  slate: {
    name: 'Slate', category: 'Professional',
    description: 'Slate gray with indigo highlights. Versatile for any industry.',
    headerBg: '#334155', headerAlign: 'left', headerBorder: null,
    nameStyle: { fontFamily: 'Inter,sans-serif', fontSize: 22, fontWeight: 700, color: '#f8fafc', letterSpacing: '0' },
    contactStyle: { fontFamily: 'Inter,sans-serif', fontSize: 11, color: '#94a3b8', marginTop: 4 },
    sectionHeaderStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6366f1', borderLeft: '3px solid #6366f1', paddingLeft: 8, marginBottom: 8, marginTop: 16 },
    bodyStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10.5, lineHeight: 1.55, color: '#1e293b' },
    dateStyle: { fontFamily: 'Inter,sans-serif', fontSize: 10, color: '#64748b' },
  },
};

function Section({ title, t, children }) {
  return (
    <div>
      <div style={t.sectionHeaderStyle}>{title}</div>
      {children}
    </div>
  );
}

function renderSections(resumeData, sectionOrder, t) {
  const d = resumeData || {};
  const p = d.personal || {};
  const order = sectionOrder || ['personal','summary','skills','experience','projects','education','certifications','achievements'];

  return order.map(sec => {
    if (sec === 'personal') return null;

    if (sec === 'summary' && p.summary) return (
      <Section key="summary" title="Professional Summary" t={t}>
        <p style={{ ...t.bodyStyle, margin: 0 }}>{p.summary}</p>
      </Section>
    );

    if (sec === 'experience' && d.experience?.length) return (
      <Section key="experience" title="Professional Experience" t={t}>
        {d.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{exp.title}{exp.company ? ` | ${exp.company}` : ''}</strong>
              <span style={t.dateStyle}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}</span>
            </div>
            {exp.location && <div style={{ ...t.bodyStyle, color: '#666', fontSize: 9.5 }}>{exp.location}</div>}
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {(exp.bullets || []).filter(Boolean).map((b, j) => <li key={j} style={{ ...t.bodyStyle, marginBottom: 2 }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </Section>
    );

    if (sec === 'skills' && d.skills) {
      const cats = Object.entries(d.skills).filter(([, v]) => v?.length);
      if (!cats.length) return null;
      return (
        <Section key="skills" title="Technical Skills" t={t}>
          {cats.map(([cat, vals]) => (
            <p key={cat} style={{ ...t.bodyStyle, marginBottom: 3 }}>
              <strong style={{ textTransform: 'capitalize' }}>{cat}:</strong> {vals.join(', ')}
            </p>
          ))}
        </Section>
      );
    }

    if (sec === 'education' && d.education?.length) return (
      <Section key="education" title="Education" t={t}>
        {d.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{edu.school}</strong>
              <span style={t.dateStyle}>{edu.endDate}</span>
            </div>
            <div style={{ ...t.bodyStyle, color: '#555' }}>{[edu.degree, edu.field].filter(Boolean).join(', ')}{edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>
        ))}
      </Section>
    );

    if (sec === 'projects' && d.projects?.length) return (
      <Section key="projects" title="Projects" t={t}>
        {d.projects.map((proj, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{proj.name}</strong>
              {proj.link && !proj.link.includes('github.com') && (
                <span style={{ ...t.dateStyle, color: '#2563eb' }}>{proj.link}</span>
              )}
            </div>
            {proj.techStack?.length > 0 && (
              <div style={{ ...t.bodyStyle, fontSize: 9.5, color: '#666', marginTop: 1 }}>{proj.techStack.join(' · ')}</div>
            )}
            {proj.description && <p style={{ ...t.bodyStyle, color: '#444', marginTop: 2, marginBottom: 2 }}>{proj.description}</p>}
            <ul style={{ margin: '2px 0 0 16px', padding: 0 }}>
              {(proj.bullets || []).filter(Boolean).map((b, j) => <li key={j} style={{ ...t.bodyStyle, marginBottom: 2 }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </Section>
    );

    if (sec === 'certifications' && d.certifications?.length) return (
      <Section key="certifications" title="Certifications" t={t}>
        {d.certifications.map((c, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ ...t.bodyStyle, fontWeight: 600 }}>{c.name}</span>
            <span style={t.dateStyle}>{[c.issuer, c.year].filter(Boolean).join(' · ')}</span>
          </div>
        ))}
      </Section>
    );

    if (sec === 'achievements' && d.achievements?.length) return (
      <Section key="achievements" title="Achievements" t={t}>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {d.achievements.map((a, i) => <li key={i} style={{ ...t.bodyStyle, marginBottom: 2 }}>{a}</li>)}
        </ul>
      </Section>
    );

    if (sec === 'awards' && d.awards?.length) return (
      <Section key="awards" title="Awards & Honors" t={t}>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {d.awards.map((a, i) => <li key={i} style={{ ...t.bodyStyle, marginBottom: 2 }}>{typeof a === 'string' ? a : `${a.title || ''} — ${a.issuer || ''} ${a.year || ''}`.trim()}</li>)}
        </ul>
      </Section>
    );

    if (sec === 'volunteer' && d.volunteer?.length) return (
      <Section key="volunteer" title="Volunteer Experience" t={t}>
        {d.volunteer.map((v, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{v.role}{v.organization ? ` | ${v.organization}` : ''}</strong>
              <span style={t.dateStyle}>{v.date || ''}</span>
            </div>
            {v.description && <p style={{ ...t.bodyStyle, color: '#555', marginTop: 2 }}>{v.description}</p>}
          </div>
        ))}
      </Section>
    );

    if (sec === 'languages' && d.languages?.length) return (
      <Section key="languages" title="Languages" t={t}>
        <p style={{ ...t.bodyStyle, margin: 0 }}>
          {d.languages.map(l => typeof l === 'string' ? l : `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · ')}
        </p>
      </Section>
    );

    if (sec === 'extracurricular' && d.extracurricular?.length) return (
      <Section key="extracurricular" title="Extracurricular Activities" t={t}>
        {d.extracurricular.map((a, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            {typeof a === 'string' ? (
              <p style={{ ...t.bodyStyle, margin: 0 }}>{a}</p>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{a.activity}{a.role ? ` — ${a.role}` : ''}</strong>
                  <span style={t.dateStyle}>{a.duration || ''}</span>
                </div>
                {a.description && <p style={{ ...t.bodyStyle, color: '#555', marginTop: 2 }}>{a.description}</p>}
              </>
            )}
          </div>
        ))}
      </Section>
    );

    if (sec === 'interests' && d.interests?.length) return (
      <Section key="interests" title="Interests" t={t}>
        <p style={{ ...t.bodyStyle, margin: 0 }}>
          {d.interests.map(x => typeof x === 'string' ? x : x.name).join(' · ')}
        </p>
      </Section>
    );

    if (sec === 'publications' && d.publications?.length) return (
      <Section key="publications" title="Publications" t={t}>
        {d.publications.map((pub, i) => (
          <div key={i} style={{ marginBottom: 6 }}>
            <strong style={{ ...t.bodyStyle, fontWeight: 700 }}>{typeof pub === 'string' ? pub : pub.title}</strong>
            {pub.journal && <span style={{ ...t.bodyStyle, color: '#666' }}> — {pub.journal}{pub.year ? `, ${pub.year}` : ''}</span>}
          </div>
        ))}
      </Section>
    );

    if (sec === 'references') return (
      <Section key="references" title="References" t={t}>
        <p style={{ ...t.bodyStyle, color: '#666', margin: 0, fontStyle: 'italic' }}>Available upon request.</p>
      </Section>
    );

    return null;
  });
}

export default function ResumePreview({ resumeData, sectionOrder, selectedTemplate = 'classic' }) {
  const t = TEMPLATES[selectedTemplate] || TEMPLATES.classic;
  const p = resumeData?.personal || {};
  const isDark = !!t.headerBg;

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  const linkParts = [p.linkedin, p.website].filter(p.github ? Boolean : Boolean).filter(Boolean);
  if (p.github) linkParts.push(p.github);

  return (
    <div className="bg-white text-[#111827] resume-shadow rounded overflow-hidden relative selection:bg-blue-100" style={{ minHeight: 800 }}>
      <div style={{ padding: '48px', fontFamily: 'Arial,sans-serif', fontSize: '10pt', lineHeight: 1.5 }}>
        {/* Header */}
        {isDark ? (
          <div style={{ background: t.headerBg, padding: '20px 48px', margin: '-48px -48px 16px' }}>
            <div style={t.nameStyle}>{p.name || 'Your Name'}</div>
            {contactParts.length > 0 && <div style={t.contactStyle}>{contactParts.join(' | ')}</div>}
            {linkParts.length > 0 && <div style={{ ...t.contactStyle, opacity: 0.8 }}>{linkParts.join(' | ')}</div>}
          </div>
        ) : (
          <div style={{ textAlign: t.headerAlign || 'left', borderBottom: t.headerBorder || 'none', paddingBottom: t.headerBorder ? 16 : 0, marginBottom: 16 }}>
            <div style={t.nameStyle}>{p.name || 'Your Name'}</div>
            {contactParts.length > 0 && <div style={t.contactStyle}>{contactParts.join(' | ')}</div>}
            {linkParts.length > 0 && <div style={{ ...t.contactStyle, color: '#2563EB' }}>{linkParts.join(' | ')}</div>}
          </div>
        )}

        {/* Sections */}
        {renderSections(resumeData, sectionOrder, t)}
      </div>

      <div className="absolute top-2 right-2 bg-surface-container border border-outline-variant text-on-surface-variant font-label-sm text-label-sm px-xs py-0.5 rounded opacity-60">
        Preview
      </div>
    </div>
  );
}
