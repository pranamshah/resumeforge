import { TEMPLATES } from './ResumePreview.jsx';

const CATEGORIES = ['All', 'Professional', 'Technology', 'Finance', 'Leadership', 'Creative'];

const MiniPreview = ({ tmpl }) => {
  const isDark = !!tmpl.headerBg;
  const accent = tmpl.sectionHeaderStyle.color || '#2563eb';
  const nameColor = tmpl.nameStyle.color || '#111';
  const nameBold = (tmpl.nameStyle.fontWeight || 400) >= 700;
  const nameUpper = tmpl.nameStyle.textTransform === 'uppercase';
  const headerBorder = tmpl.headerBorder;

  return (
    <div className="bg-white w-full h-full overflow-hidden text-black" style={{ fontFamily: 'Arial,sans-serif' }}>
      {isDark ? (
        <div style={{ background: tmpl.headerBg, padding: '7px 10px' }}>
          <div style={{ fontSize: 7, fontWeight: nameBold ? 800 : 400, color: nameColor, textTransform: nameUpper ? 'uppercase' : 'none', letterSpacing: '0.03em' }}>ALEX MORGAN</div>
          <div style={{ fontSize: 4.5, color: tmpl.contactStyle.color || '#aaa', marginTop: 2 }}>alex@email.com · New York, NY</div>
        </div>
      ) : (
        <div style={{ padding: '7px 10px', borderBottom: headerBorder || `2px solid ${accent}`, textAlign: tmpl.headerAlign === 'center' ? 'center' : 'left' }}>
          <div style={{ fontSize: 7, fontWeight: nameBold ? 800 : 400, color: nameColor, textTransform: nameUpper ? 'uppercase' : 'none' }}>
            {nameUpper ? 'ALEX MORGAN' : 'Alex Morgan'}
          </div>
          <div style={{ fontSize: 4.5, color: tmpl.contactStyle.color || '#555', marginTop: 2 }}>alex@email.com · New York, NY</div>
        </div>
      )}
      <div style={{ padding: '0 10px 8px' }}>
        <div style={{ ...tmpl.sectionHeaderStyle, fontSize: 4.5, marginTop: 6, marginBottom: 4, padding: tmpl.sectionHeaderStyle.padding ? '1px 4px' : undefined }}>
          Experience
        </div>
        <div style={{ fontSize: 5.5, fontWeight: 700, color: '#111' }}>Software Engineer · Google</div>
        <div style={{ fontSize: 4.5, color: '#555' }}>· Shipped ML pipeline reducing latency by 45%</div>
        <div style={{ fontSize: 4.5, color: '#555' }}>· Led team of 6 across 3 product launches</div>
        <div style={{ ...tmpl.sectionHeaderStyle, fontSize: 4.5, marginTop: 6, marginBottom: 4, padding: tmpl.sectionHeaderStyle.padding ? '1px 4px' : undefined }}>
          Skills
        </div>
        <div style={{ fontSize: 4.5, color: '#444' }}>Python · React · AWS · PostgreSQL · Docker</div>
      </div>
    </div>
  );
};

export default function TemplateSelector({ selectedTemplate, setSelectedTemplate, onClose }) {
  const onSelect = setSelectedTemplate;
  const [activeCategory, setActiveCategory] = useState('All');
  const entries = Object.entries(TEMPLATES);
  const filtered = activeCategory === 'All' ? entries : entries.filter(([, t]) => t.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-xl py-md border-b border-outline-variant bg-surface-container">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Choose Template</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{entries.length} professional templates — each unique per user</p>
        </div>
        <button onClick={onClose} className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors text-3xl">close</button>
      </div>

      {/* Category tabs */}
      <div className="flex gap-sm px-xl py-sm border-b border-outline-variant bg-surface-container overflow-x-auto">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-label-sm text-label-sm px-md py-xs rounded-full whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-md max-w-6xl mx-auto">
          {filtered.map(([key, tmpl]) => (
            <button
              key={key}
              onClick={() => { onSelect(key); onClose(); }}
              className={`group flex flex-col gap-sm text-left transition-all ${selectedTemplate === key ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
            >
              <div className={`w-full rounded-lg overflow-hidden border transition-all ${selectedTemplate === key ? 'border-primary' : 'border-outline-variant group-hover:border-primary/50'}`} style={{ height: 140 }}>
                <MiniPreview tmpl={tmpl} />
              </div>
              <div className="px-xs">
                <div className="flex items-center gap-xs">
                  <span className="font-label-md text-label-md text-on-surface">{tmpl.name}</span>
                  {selectedTemplate === key && (
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </div>
                <span className="font-label-sm text-label-sm text-primary/70 uppercase tracking-wider">{tmpl.category}</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-xs leading-snug" style={{ fontSize: 11 }}>{tmpl.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// useState import
import { useState } from 'react';
