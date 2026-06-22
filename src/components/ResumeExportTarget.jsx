import { TEMPLATES } from './ResumePreview.jsx';

export function renderResumeToTarget(resumeData, sectionOrder, templateKey = 'classic') {
  const el = document.getElementById('resume-export-target');
  if (!el) return;

  const t = TEMPLATES[templateKey] || TEMPLATES.classic;
  const d = resumeData || {};
  const p = d.personal || {};
  const order = sectionOrder || ['personal','summary','experience','skills','education','projects','certifications'];

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  const linkParts = [p.linkedin, p.github, p.website].filter(Boolean);

  const sH = (text) => `<div style="font-family:Arial,sans-serif;font-size:11pt;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;border-bottom:1px solid #111;padding-bottom:2px;margin:16px 0 8px;color:#111;">${text}</div>`;

  let html = `
    <div style="font-family:Arial,sans-serif;font-size:10pt;line-height:1.5;color:#111;padding:48px;">
      <div style="text-align:center;border-bottom:2px solid #111;padding-bottom:16px;margin-bottom:16px;">
        <div style="font-family:Georgia,serif;font-size:22pt;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">${p.name || ''}</div>
        ${contactParts.length ? `<div style="font-size:10pt;color:#555;margin-top:4px;">${contactParts.join(' | ')}</div>` : ''}
        ${linkParts.length ? `<div style="font-size:10pt;color:#2563EB;margin-top:2px;">${linkParts.join(' | ')}</div>` : ''}
      </div>
  `;

  for (const sec of order) {
    if (sec === 'personal') continue;

    if (sec === 'summary' && p.summary) {
      html += sH('Professional Summary') + `<p style="font-size:10.5pt;line-height:1.55;margin:0;">${p.summary}</p>`;
    }

    if (sec === 'experience' && d.experience?.length) {
      html += sH('Professional Experience');
      for (const exp of d.experience) {
        html += `
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <strong style="font-size:10.5pt;">${exp.title || ''}${exp.company ? ` | ${exp.company}` : ''}</strong>
              <span style="font-size:10pt;color:#666;">${exp.startDate || ''}${exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}${exp.current ? 'Present' : (exp.endDate || '')}</span>
            </div>
            ${exp.location ? `<div style="font-size:9.5pt;color:#666;">${exp.location}</div>` : ''}
            <ul style="margin:4px 0 0 16px;padding:0;">
              ${(exp.bullets || []).filter(Boolean).map(b => `<li style="font-size:10.5pt;line-height:1.55;margin-bottom:2px;">${b}</li>`).join('')}
            </ul>
          </div>`;
      }
    }

    if (sec === 'skills' && d.skills) {
      const cats = Object.entries(d.skills).filter(([, v]) => v?.length);
      if (cats.length) {
        html += sH('Technical Skills');
        for (const [cat, vals] of cats) {
          html += `<p style="font-size:10.5pt;line-height:1.55;margin:0 0 3px;"><strong style="text-transform:capitalize;">${cat}:</strong> ${vals.join(', ')}</p>`;
        }
      }
    }

    if (sec === 'education' && d.education?.length) {
      html += sH('Education');
      for (const edu of d.education) {
        html += `
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;">
              <strong style="font-size:10.5pt;">${edu.school || ''}</strong>
              <span style="font-size:10pt;color:#666;">${edu.endDate || ''}</span>
            </div>
            <div style="font-size:10.5pt;color:#555;">${[edu.degree, edu.field].filter(Boolean).join(', ')}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
          </div>`;
      }
    }

    if (sec === 'projects' && d.projects?.length) {
      html += sH('Projects');
      for (const proj of d.projects) {
        html += `
          <div style="margin-bottom:10px;">
            <strong style="font-size:10.5pt;">${proj.name || ''}</strong>${proj.link ? ` <span style="font-size:10pt;color:#2563eb;">${proj.link}</span>` : ''}
            ${proj.description ? `<p style="font-size:10.5pt;color:#555;margin:2px 0 0;">${proj.description}</p>` : ''}
            ${(proj.bullets || []).filter(Boolean).map(b => `<li style="font-size:10.5pt;margin-left:16px;margin-bottom:2px;">${b}</li>`).join('')}
          </div>`;
      }
    }

    if (sec === 'certifications' && d.certifications?.length) {
      html += sH('Certifications');
      for (const c of d.certifications) {
        html += `<div style="display:flex;justify-content:space-between;margin-bottom:4px;font-size:10.5pt;"><strong>${c.name || ''}</strong><span style="color:#666;">${[c.issuer, c.year].filter(Boolean).join(' · ')}</span></div>`;
      }
    }

    if (sec === 'achievements' && d.achievements?.length) {
      html += sH('Achievements') + `<ul style="margin:0;padding-left:16px;">${d.achievements.map(a => `<li style="font-size:10.5pt;margin-bottom:2px;">${a}</li>`).join('')}</ul>`;
    }
  }

  html += '</div>';
  el.innerHTML = html;
}
