const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

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
            className="flex items-center gap-xs bg-white hover:bg-gray-100 text-gray-900 font-label-md text-label-md px-md py-xs rounded-lg transition-all active:scale-95 duration-200"
          >
            <GoogleIcon />
            Sign in with Google
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
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full ring-1 ring-outline-variant" />
              : <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">account_circle</span>
            }
            <button onClick={onSignOut} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors">
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
