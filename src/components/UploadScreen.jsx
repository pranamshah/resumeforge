import { useState, useRef } from 'react';
import { extractTextFromPDF } from '../utils/pdfParse.js';
import { extractResumeFromText } from '../utils/groqApi.js';
import { showToast } from '../utils/toast.js';

export default function UploadScreen({ groqKey, setResumeData, setScreen, setActiveFlow }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { showToast('Please upload a PDF file', 'error'); return; }
    if (f.size > 10 * 1024 * 1024) { showToast('File too large. Max 10MB.', 'error'); return; }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    try {
      showToast('Extracting resume data...', 'info');
      const text = await extractTextFromPDF(file);
      if (!text.trim()) throw new Error('Could not extract text from PDF. Try a text-based PDF.');
      showToast('Analyzing with AI...', 'info');
      const data = await extractResumeFromText(groqKey, text);
      setResumeData(data);
      setActiveFlow('upload');
      setScreen('editExtracted');
    } catch (err) {
      if (err.message.includes('Invalid Groq')) showToast('Invalid API key. Check in settings.', 'error');
      else if (err.message.includes('Rate limit')) showToast(err.message, 'warning');
      else showToast(err.message || 'Extraction failed. Try again.', 'error');
      setLoading(false);
    }
  };

  const stepActive = (n) => n === 1 ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant';

  return (
    <main className="flex-grow flex flex-col items-center py-xl px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto w-full">
      {/* Progress Stepper */}
      <div className="w-full max-w-3xl mb-xl">
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -z-10"></div>
          <div className="absolute top-1/2 left-0 h-[2px] bg-primary transition-all duration-500 -z-10" style={{ width: '25%' }}></div>
          {[
            { icon: 'cloud_upload', label: 'Upload', n: 1 },
            { icon: 'my_location', label: 'Target', n: 2 },
            { icon: 'edit_note', label: 'Customize', n: 3 },
          ].map(s => (
            <div key={s.n} className="flex flex-col items-center bg-surface px-xs">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-xs ${stepActive(s.n)}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{s.icon}</span>
              </div>
              <span className={`font-label-sm text-label-sm ${s.n === 1 ? 'text-primary' : 'text-on-surface-variant'}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Area */}
      <div className="w-full max-w-4xl space-y-lg">
        <div className="text-center">
          <h1 className="font-headline-xl text-headline-xl mb-xs text-on-surface">Initiate Extraction</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Upload your current resume. Our AI will decompose your professional history for structural optimization.
          </p>
        </div>

        {!file ? (
          <div
            className={`relative border-2 border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center gap-md group cursor-pointer transition-all hover:bg-surface-container-low ${dragOver ? 'drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            <div className="w-16 h-16 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 32 }}>cloud_upload</span>
            </div>
            <div className="text-center">
              <p className="font-headline-lg text-headline-lg mb-xs">
                Drag & Drop or <span className="text-primary">Browse</span>
              </p>
              <p className="font-label-md text-label-md text-on-surface-variant">Supported formats: PDF (Max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-md bg-surface-container-low border border-outline-variant rounded-lg">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>description</span>
              <div>
                <p className="font-body-md text-body-md text-on-surface font-semibold">{file.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {(file.size / 1024).toFixed(0)} KB • Ready for analysis
                </p>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">close</button>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className={`flex items-center gap-xs font-label-md text-label-md px-xl py-md rounded-lg transition-all ${
              file && !loading
                ? 'bg-primary text-on-primary hover:opacity-90 electric-glow'
                : 'bg-primary/30 text-on-primary/50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>sync</span>
                Analyzing Matrix...
              </>
            ) : (
              <>
                <span>Extract & Analyze</span>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>bolt</span>
              </>
            )}
          </button>
        </div>

        <div className="flex justify-center">
          <button onClick={() => setScreen('landing')} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
