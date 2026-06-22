import { TEMPLATES } from './ResumePreview.jsx';

const styleStr = (obj) => Object.entries(obj)
  .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
  .join(';');

export function renderResumeToTarget(resumeData, sectionOrder, templateKey = 'classic') {
  const el = document.getElementById('resume-export-target');
  if (!el) return;

  const t = TEMPLATES[templateKey] || TEMPLATES.classic;
  const d = resumeData || {};
  const p = d.personal || {};
  const order = sectionOrder || ['personal', 'summary', 'experience', 'skills', 'education', 'projects', 'certifications'];

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  const linkParts = [p.linkedin, p.github, p.website].filter(Boolean);

  const sH = (text) => `<div style="${styleStr(t.sectionHeaderStyle)}">${text}</div>`;

  // Build header HTML per template
  let headerHtml = '';
  if (templateKey === 'executive') {
    headerHtml = `
      <div style="background:#111827;padding:20px 48px;margin:-48px -48px 16px;">
        <div style="${styleStr(t.nameStyle)}">${p.name || ''}</div>
        ${contactParts.length ? `<div style="${styleStr(t.contactStyle)}">${contactParts.join(' | ')}</div>` : ''}
        ${linkParts.length ? `<div style="${styleStr({ ...t.contactStyle, color: '#93c5fd' })}">${linkParts.join(' | ')}</div>` : ''}
      </div>`;
  } else {
    const hAlign = templateKey === 'classic' ? 'text-align:center;' : '';
    headerHtml = `
      <div style="${hAlign}border-bottom:${templateKey === 'modern' ? '2px solid #2563eb' : templateKey === 'accent' ? '1px solid #d1d5db' : '2px solid #111'};padding-bottom:16px;margin-bottom:16px;">
        <div style="${styleStr(t.nameStyle)}">${p.name || ''}</div>
        ${contactParts.length ? `<div style="${styleStr(t.contactStyle)}">${contactParts.join(' | ')}</div>` : ''}
        ${linkParts.length ? `<div style="${styleStr({ ...t.contactStyle, color: '#2563EB' })}">${linkParts.join(' | ')}</div>` : ''}
      </div>`;
  }

  let html = `<div style="font-family:Arial,sans-serif;font-size:10pt;line-height:1.5;color:#111;padding:48px;">${headerHtml}`;

  for (const sec of order) {
    if (sec === 'personal') continue;

    if (sec === 'summary' && p.summary) {
      html += sH('Professional Summary') + `<p style="${styleStr(t.bodyStyle)};margin:0;">${p.summary}</p>`;
    }

    if (sec === 'experience' && d.experience?.length) {
      html += sH('Professional Experience');
      for (const exp of d.experience) {
        html += `
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <strong style="${styleStr(t.bodyStyle)};font-weight:700;">${exp.title || ''}${exp.company ? ` | ${exp.company}` : ''}</strong>
              <span style="${styleStr(t.dateStyle)}">${exp.startDate || ''}${exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}${exp.current ? 'Present' : (exp.endDate || '')}</span>
            </div>
            ${exp.location ? `<div style="${styleStr(t.bodyStyle)};color:#666;font-size:9.5pt;">${exp.location}</div>` : ''}
            <ul style="margin:4px 0 0 16px;padding:0;">
              ${(exp.bullets || []).filter(Boolean).map(b => `<li style="${styleStr(t.bodyStyle)};margin-bottom:2px;">${b}</li>`).join('')}
            </ul>
          </div>`;
      }
    }

    if (sec === 'skills' && d.skills) {
      const cats = Object.entries(d.skills).filter(([, v]) => v?.length);
      if (cats.length) {
        html += sH('Technical Skills');
        for (const [cat, vals] of cats) {
          html += `<p style="${styleStr(t.bodyStyle)};margin:0 0 3px;"><strong style="text-transform:capitalize;">${cat}:</strong> ${vals.join(', ')}</p>`;
        }
      }
    }

    if (sec === 'education' && d.education?.length) {
      html += sH('Education');
      for (const edu of d.education) {
        html += `
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;">
              <strong style="${styleStr(t.bodyStyle)};font-weight:700;">${edu.school || ''}</strong>
              <span style="${styleStr(t.dateStyle)}">${edu.endDate || ''}</span>
            </div>
            <div style="${styleStr(t.bodyStyle)};color:#555;">${[edu.degree, edu.field].filter(Boolean).join(', ')}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>`;
      }
    }

    if (sec === 'projects' && d.projects?.length) {
      html += sH('Projects');
      for (const proj of d.projects) {
        html += `
          <div style="margin-bottom:10px;">
            <strong style="${styleStr(t.bodyStyle)};font-weight:700;">${proj.name || ''}</strong>${proj.link ? ` <span style="${styleStr(t.dateStyle)};color:#2563eb;">${proj.link}</span>` : ''}
            ${proj.description ? `<p style="${styleStr(t.bodyStyle)};color:#555;margin:2px 0 0;">${proj.description}</p>` : ''}
            ${(proj.bullets || []).filter(Boolean).map(b => `<li style="${styleStr(t.bodyStyle)};margin-left:16px;margin-bottom:2px;">${b}</li>`).join('')}
          </div>`;
      }
    }

    if (sec === 'certifications' && d.certifications?.length) {
      html += sH('Certifications');
      for (const c of d.certifications) {
        html += `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><strong style="${styleStr(t.bodyStyle)};font-weight:700;">${c.name || ''}</strong><span style="${styleStr(t.dateStyle)}">${[c.issuer, c.year].filter(Boolean).join(' · ')}</span></div>`;
      }
    }

    if (sec === 'achievements' && d.achievements?.length) {
      html += sH('Achievements') + `<ul style="margin:0;padding-left:16px;">${d.achievements.map(a => `<li style="${styleStr(t.bodyStyle)};margin-bottom:2px;">${a}</li>`).join('')}</ul>`;
    }
  }

  html += '</div>';
  el.innerHTML = html;
}
