export default function Navbar({ user, onSignIn, onSignOut, onAdminClick, onLogoClick, onApiKeyClick, groqKeySet, isAdminUser }) {
  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center w-full px-margin-desktop bg-surface h-16 border-b border-outline-variant">
      <div className="flex items-center gap-md">
        <button onClick={onLogoClick} className="font-bold tracking-tighter text-on-surface hover:text-primary transition-colors text-body-md font-body-md">
          ResumeForge
        </button>
        {user && (
          <div className="hidden md:flex gap-md ml-lg">
            <button onClick={onLogoClick} className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1">
              Dashboard
            </button>
            {isAdminUser && (
              <button onClick={onAdminClick} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                Admin
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-sm">
        {!user ? (
          <button
            onClick={onSignIn}
            className="flex items-center gap-xs bg-primary text-on-primary font-label-md text-label-md px-md py-xs rounded-lg transition-all active:scale-95 hover:opacity-90"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>mail</span>
            Get Started
          </button>
        ) : (
          <>
            {!groqKeySet && (
              <button
                onClick={onApiKeyClick}
                className="flex items-center gap-xs font-label-sm text-label-sm text-tertiary border border-tertiary/30 bg-tertiary/10 px-sm py-xs rounded-lg hover:bg-tertiary/20 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>warning</span>
                Add API Key
              </button>
            )}
            {groqKeySet && (
              <button onClick={onApiKeyClick} title="Edit Groq API Key" className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors px-xs py-xs">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>key</span>
              </button>
            )}
            <span className="font-label-sm text-label-sm text-on-surface-variant hidden sm:block truncate max-w-[160px]">{user.email}</span>
            <button onClick={onSignOut} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
