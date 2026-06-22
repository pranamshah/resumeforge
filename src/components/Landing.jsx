const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Landing({ user, onUpload, onBuild, onSignIn }) {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-margin-mobile md:px-margin-desktop hero-gradient">
        <div className="max-w-4xl space-y-lg">
          <div className="inline-flex items-center gap-xs px-sm py-base rounded-full bg-secondary-container/30 border border-outline-variant">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Next-Gen Career Engineering</span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-white tracking-tight leading-none">
            Your Resume,{' '}
            <span className="text-primary-container">Customized</span>{' '}
            for Every Opportunity
          </h1>

          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            AI-powered resume tailoring that researches your target company and optimizes for ATS systems. Secure more interviews with precision-targeted content.
          </p>

          {!user ? (
            <div className="flex flex-col items-center gap-md pt-md">
              <button
                onClick={onSignIn}
                className="flex items-center justify-center gap-sm px-xl py-md bg-white text-gray-900 font-label-md text-label-md rounded-lg electric-glow transition-all hover:scale-105 active:scale-95"
              >
                <GoogleIcon />
                Sign in with Google — It's Free
              </button>
              <p className="font-label-sm text-label-sm text-on-surface-variant">Free to use • PDF download included • No paywall</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-md pt-md">
              <button
                onClick={onBuild}
                className="w-full md:w-auto px-xl py-md bg-primary text-on-primary font-label-md text-label-md rounded-lg electric-glow transition-all hover:scale-105 active:scale-95"
              >
                Build New Resume
              </button>
              <button
                onClick={onUpload}
                className="w-full md:w-auto px-xl py-md border border-outline-variant text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant transition-all active:scale-95"
              >
                Upload Existing Resume
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="pt-xl flex flex-wrap justify-center gap-xl opacity-60">
            {[['98%','ATS PASS RATE'],['12k+','JOBS LANDED'],['4.9/5','USER RATING']].map(([n, l]) => (
              <div key={l} className="flex flex-col items-center">
                <span className="font-headline-lg text-headline-lg text-white">{n}</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {/* Company Research — large */}
          <div className="md:col-span-2 glass-panel p-lg rounded-xl overflow-hidden relative group">
            <div className="relative z-10 space-y-md">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
              <h3 className="font-headline-lg text-headline-lg text-white">Company Research</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Our AI scans thousands of data points — from culture documents to recent press releases — to infuse your resume with the language hiring managers value.
              </p>
              <div className="flex flex-wrap gap-xs pt-sm">
                {['Market Analysis','Competitor Intelligence','Tone Matching'].map(t => (
                  <span key={t} className="px-sm py-base rounded bg-surface-variant font-label-sm text-label-sm border border-outline-variant">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ATS Optimization */}
          <div className="glass-panel p-lg rounded-xl flex flex-col justify-between">
            <div className="space-y-md">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <h3 className="font-headline-lg text-headline-lg text-white">ATS Optimization</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Every word is evaluated against industry-leading Applicant Tracking Systems to ensure you rank in the top 1%.
              </p>
            </div>
            <div className="mt-lg pt-md border-t border-outline-variant">
              <div className="w-full h-1 bg-outline-variant rounded-full overflow-hidden">
                <div className="w-[92%] h-full bg-primary shadow-[0_0_8px_#adc6ff]"></div>
              </div>
              <div className="flex justify-between mt-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Compatibility Score</span>
                <span className="font-label-sm text-label-sm text-primary">92%</span>
              </div>
            </div>
          </div>

          {/* Instant PDF */}
          <div className="glass-panel p-lg rounded-xl flex flex-col gap-md">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
            <h3 className="font-headline-lg text-headline-lg text-white">Instant PDF</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Pixel-perfect rendering optimized for both digital screen readers and physical printing. Free download, no paywall.
            </p>
            <div className="flex-grow flex items-center justify-center p-md bg-surface rounded-lg border border-dashed border-outline-variant mt-sm">
              <span className="font-label-md text-label-md text-on-surface-variant opacity-50">Preview Rendering...</span>
            </div>
          </div>

          {/* Workstation */}
          <div className="md:col-span-2 glass-panel p-lg rounded-xl flex flex-col md:flex-row gap-lg overflow-hidden">
            <div className="flex-1 space-y-md">
              <div className="flex items-center gap-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-primary uppercase">Live Editor</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg text-white">The Workstation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                AI suggestions appear in real-time as you build your professional narrative, with context-aware rewrites and ATS score tracking.
              </p>
              <ul className="space-y-sm pt-sm">
                {['Context-aware skill suggestions','Active-voice rephrasing engine','Real-time ATS score meter'].map(item => (
                  <li key={item} className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-primary">check_circle</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-surface-container rounded-lg border border-outline-variant p-sm blueprint-grid relative">
              <div className="w-full h-full rounded shadow-xl overflow-hidden bg-surface">
                <div className="h-6 w-full bg-surface-variant flex items-center px-sm gap-xs">
                  <div className="w-2 h-2 rounded-full bg-red-400/40"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-400/40"></div>
                  <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                </div>
                <div className="p-md space-y-sm">
                  <div className="h-4 w-3/4 bg-surface-variant rounded"></div>
                  <div className="h-2 w-1/2 bg-surface-variant/50 rounded"></div>
                  <div className="h-2 w-5/6 bg-surface-variant/50 rounded"></div>
                  <div className="h-2 w-2/3 bg-surface-variant/50 rounded"></div>
                  <div className="pt-md flex gap-xs">
                    <div className="h-6 w-16 bg-primary/20 rounded border border-primary/30"></div>
                    <div className="h-6 w-16 bg-primary/20 rounded border border-primary/30"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 p-md glass-panel rounded-lg shadow-2xl max-w-[200px]">
                <p className="font-label-sm text-label-sm text-primary">AI SUGGESTION</p>
                <p className="text-on-surface-variant mt-xs" style={{ fontSize: 10 }}>Swap "Managed teams" with "Spearheaded cross-functional squads" for 12% more impact.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineered section */}
      <section className="py-xl bg-surface-container-low/50 relative">
        <div className="px-margin-desktop max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-xl">
          <div className="flex-1">
            <h2 className="font-headline-lg text-headline-lg text-white mb-md">Engineered for Your Next Career Move</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
              ResumeForge isn't just a builder; it's a career strategist. Our LLMs understand the nuances of different industries, from Fintech to Creative Arts.
            </p>
            <div className="space-y-md">
              {[
                { icon: 'psychology', title: 'Semantic Role Analysis', desc: 'Matches your experience with role intent, not just keywords.' },
                { icon: 'architecture', title: 'Modular Architecture', desc: 'Re-order and re-structure your layout for different roles in one click.' },
              ].map(f => (
                <div key={f.title} className="flex items-center gap-md p-md rounded-lg border border-outline-variant hover:border-primary transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded bg-surface flex items-center justify-center border border-outline-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-all flex-shrink-0">
                    <span className="material-symbols-outlined">{f.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-white">{f.title}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-2xl border border-outline-variant glass-panel p-md relative overflow-hidden">
              <div className="w-full h-full rounded-xl bg-surface-container flex items-center justify-center blueprint-grid">
                <div className="text-center space-y-md p-lg">
                  <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 40 }}>bolt</span>
                  </div>
                  <p className="font-label-md text-label-md text-primary uppercase tracking-widest">AI Processing</p>
                  <div className="space-y-xs">
                    {['Analyzing JD requirements...','Researching company culture...','Optimizing keywords...'].map((s, i) => (
                      <div key={i} className="glass-panel rounded px-sm py-xs flex items-center gap-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute bottom-md left-md right-md">
                <div className="p-sm glass-panel rounded border border-primary/50">
                  <div className="flex justify-between items-center mb-xs">
                    <span className="font-label-sm text-label-sm text-white">Analyzing J.D. requirements...</span>
                    <span className="font-label-sm text-label-sm text-primary">85% Complete</span>
                  </div>
                  <div className="h-1 bg-outline-variant rounded-full overflow-hidden">
                    <div className="w-[85%] h-full bg-primary"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-lg px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md border-t border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col items-center md:items-start gap-xs">
          <span className="font-label-md text-label-md font-bold text-on-surface">ResumeForge</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant opacity-90">© 2025 ResumeForge AI. Career Excellence Guaranteed.</p>
        </div>
        <div className="flex gap-lg">
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </footer>
    </main>
  );
}
