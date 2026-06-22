import { TEMPLATES } from './ResumePreview.jsx';

const styleStr = (obj) => Object.entries(obj)
  .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${typeof v === 'number' ? v : v}`)
  .join(';');

export function renderResumeToTarget(resumeData, sectionOrder, templateKey = 'classic') {
  const el = document.getElementById('resume-export-target');
  if (!el) return;

  const t = TEMPLATES[templateKey] || TEMPLATES.classic;
  const d = resumeData || {};
  const p = d.personal || {};
  const order = sectionOrder || ['personal','summary','skills','experience','projects','education','certifications','achievements'];

  const contactParts = [p.email, p.phone, p.location].filter(Boolean);
  const linkParts = [p.linkedin, p.website, p.github].filter(Boolean);

  const sH = (text) => `<div style="${styleStr(t.sectionHeaderStyle)}">${text}</div>`;

  // Generic header — works for all 15 templates
  let headerHtml = '';
  if (t.headerBg) {
    headerHtml = `
      <div style="background:${t.headerBg};padding:20px 48px;margin:-48px -48px 16px;">
        <div style="${styleStr(t.nameStyle)}">${p.name || ''}</div>
        ${contactParts.length ? `<div style="${styleStr(t.contactStyle)}">${contactParts.join(' | ')}</div>` : ''}
        ${linkParts.length ? `<div style="${styleStr(t.contactStyle)};opacity:0.8;">${linkParts.join(' | ')}</div>` : ''}
      </div>`;
  } else {
    const align = t.headerAlign === 'center' ? 'text-align:center;' : '';
    const border = t.headerBorder ? `border-bottom:${t.headerBorder};padding-bottom:16px;` : '';
    headerHtml = `
      <div style="${align}${border}margin-bottom:16px;">
        <div style="${styleStr(t.nameStyle)}">${p.name || ''}</div>
        ${contactParts.length ? `<div style="${styleStr(t.contactStyle)}">${contactParts.join(' | ')}</div>` : ''}
        ${linkParts.length ? `<div style="${styleStr(t.contactStyle)};color:#2563EB;">${linkParts.join(' | ')}</div>` : ''}
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
        const showLink = proj.link && !proj.link.includes('github.com');
        html += `
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;">
              <strong style="${styleStr(t.bodyStyle)};font-weight:700;">${proj.name || ''}</strong>
              ${showLink ? `<span style="${styleStr(t.dateStyle)};color:#2563eb;">${proj.link}</span>` : ''}
            </div>
            ${proj.techStack?.length ? `<div style="${styleStr(t.bodyStyle)};font-size:9.5pt;color:#666;margin-top:1px;">${proj.techStack.join(' · ')}</div>` : ''}
            ${proj.description ? `<p style="${styleStr(t.bodyStyle)};color:#444;margin:2px 0 0;">${proj.description}</p>` : ''}
            <ul style="margin:2px 0 0 16px;padding:0;">
              ${(proj.bullets || []).filter(Boolean).map(b => `<li style="${styleStr(t.bodyStyle)};margin-bottom:2px;">${b}</li>`).join('')}
            </ul>
          </div>`;
      }
    }

    if (sec === 'certifications' && d.certifications?.length) {
      html += sH('Certifications');
      for (const c of d.certifications) {
        html += `<div style="display:flex;justify-content:space-between;margin-bottom:4px;"><span style="${styleStr(t.bodyStyle)};font-weight:600;">${c.name || ''}</span><span style="${styleStr(t.dateStyle)}">${[c.issuer, c.year].filter(Boolean).join(' · ')}</span></div>`;
      }
    }

    if (sec === 'achievements' && d.achievements?.length) {
      html += sH('Achievements') + `<ul style="margin:0;padding-left:16px;">${d.achievements.map(a => `<li style="${styleStr(t.bodyStyle)};margin-bottom:2px;">${a}</li>`).join('')}</ul>`;
    }

    if (sec === 'awards' && d.awards?.length) {
      html += sH('Awards & Honors') + `<ul style="margin:0;padding-left:16px;">${d.awards.map(a => `<li style="${styleStr(t.bodyStyle)};margin-bottom:2px;">${typeof a === 'string' ? a : `${a.title || ''} — ${a.issuer || ''} ${a.year || ''}`.trim()}</li>`).join('')}</ul>`;
    }

    if (sec === 'volunteer' && d.volunteer?.length) {
      html += sH('Volunteer Experience');
      for (const v of d.volunteer) {
        html += `
          <div style="margin-bottom:8px;">
            <div style="display:flex;justify-content:space-between;">
              <strong style="${styleStr(t.bodyStyle)};font-weight:700;">${v.role || ''}${v.organization ? ` | ${v.organization}` : ''}</strong>
              <span style="${styleStr(t.dateStyle)}">${v.date || ''}</span>
            </div>
            ${v.description ? `<p style="${styleStr(t.bodyStyle)};color:#555;margin:2px 0 0;">${v.description}</p>` : ''}
          </div>`;
      }
    }

    if (sec === 'languages' && d.languages?.length) {
      html += sH('Languages') + `<p style="${styleStr(t.bodyStyle)};margin:0;">${d.languages.map(l => typeof l === 'string' ? l : `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}`).join(' · ')}</p>`;
    }

    if (sec === 'extracurricular' && d.extracurricular?.length) {
      html += sH('Extracurricular Activities');
      for (const a of d.extracurricular) {
        if (typeof a === 'string') {
          html += `<p style="${styleStr(t.bodyStyle)};margin:0 0 4px;">${a}</p>`;
        } else {
          html += `<div style="margin-bottom:6px;"><div style="display:flex;justify-content:space-between;"><strong style="${styleStr(t.bodyStyle)};font-weight:700;">${a.activity || ''}${a.role ? ` — ${a.role}` : ''}</strong><span style="${styleStr(t.dateStyle)}">${a.duration || ''}</span></div>${a.description ? `<p style="${styleStr(t.bodyStyle)};color:#555;margin:2px 0 0;">${a.description}</p>` : ''}</div>`;
        }
      }
    }

    if (sec === 'interests' && d.interests?.length) {
      html += sH('Interests') + `<p style="${styleStr(t.bodyStyle)};margin:0;">${d.interests.map(x => typeof x === 'string' ? x : x.name).join(' · ')}</p>`;
    }

    if (sec === 'publications' && d.publications?.length) {
      html += sH('Publications');
      for (const pub of d.publications) {
        html += `<div style="margin-bottom:6px;"><strong style="${styleStr(t.bodyStyle)};font-weight:700;">${typeof pub === 'string' ? pub : pub.title || ''}</strong>${pub.journal ? `<span style="${styleStr(t.bodyStyle)};color:#666;"> — ${pub.journal}${pub.year ? `, ${pub.year}` : ''}</span>` : ''}</div>`;
      }
    }

    if (sec === 'references') {
      html += sH('References') + `<p style="${styleStr(t.bodyStyle)};color:#666;margin:0;font-style:italic;">Available upon request.</p>`;
    }
  }

  html += '</div>';
  el.innerHTML = html;
}
