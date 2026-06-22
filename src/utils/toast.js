export const showToast = (message, type = 'info') => {
  const colors = { info: '#3B82F6', success: '#10B981', error: '#EF4444', warning: '#F59E0B' };
  const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-anim';
  toast.style.cssText = `padding:12px 16px;background:#1F2937;border:1px solid ${colors[type]};border-left:3px solid ${colors[type]};border-radius:8px;color:#F9FAFB;font-size:13px;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,0.5);pointer-events:auto;`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};
