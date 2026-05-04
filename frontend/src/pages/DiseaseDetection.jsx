import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Clipboard, X, Camera } from 'lucide-react';

const MOCK_RESULTS = [
  { disease: "Early Blight (Alternaria solani)", confidence: 94.5, status: "warning", crop: "Tomato", treatment: "Apply chlorothalonil (2g/L) or mancozeb (2.5g/L) fungicide. Remove infected leaves immediately. Ensure 60cm spacing between plants for air circulation. Avoid overhead watering — use drip irrigation. Repeat spray every 7-10 days.", prevention: "Use certified disease-free seeds. Rotate crops every 2-3 years. Apply mulch to prevent soil splash." },
  { disease: "Powdery Mildew (Erysiphe cichoracearum)", confidence: 91.2, status: "warning", crop: "Wheat", treatment: "Spray propiconazole (0.1%) or sulfur-based fungicide (3g/L). Apply in early morning or evening. Avoid high nitrogen fertilization which promotes lush growth susceptible to mildew.", prevention: "Plant resistant varieties. Maintain proper plant spacing. Avoid excess irrigation." },
  { disease: "Leaf Rust (Puccinia triticina)", confidence: 88.7, status: "warning", crop: "Wheat", treatment: "Apply tebuconazole (0.1%) or propiconazole at first sign of infection. Spray twice at 15-day intervals. Destroy infected crop residue after harvest.", prevention: "Use rust-resistant varieties. Early sowing reduces rust incidence. Monitor fields weekly." },
  { disease: "Healthy Plant", confidence: 97.3, status: "healthy", crop: "General", treatment: "No disease detected. Your plant appears healthy!", prevention: "Continue current practices. Monitor regularly for early signs of stress or infection." },
];

const DiseaseDetection = () => {
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteHint, setPasteHint] = useState(false);
  const dropRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    setResult(null);
  }, []);

  // Paste from clipboard (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          processFile(file);
          setPasteHint(true);
          setTimeout(() => setPasteHint(false), 2000);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFile]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const analyzeImage = () => {
    if (!preview) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
    }, 2800);
  };

  const reset = () => { setPreview(null); setResult(null); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Crop Disease Detection</h1>
        <p className="text-slate-500 mt-1">Upload, drag & drop, or paste a screenshot (Ctrl+V) of a plant leaf for AI analysis.</p>
      </div>

      {pasteHint && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <Clipboard size={16} /> Screenshot pasted successfully!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          <div
            ref={dropRef}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${isDragging ? 'border-green-500 bg-green-50 scale-[1.01]' : preview ? 'border-green-300 bg-green-50/50' : 'border-slate-200 hover:border-green-400 hover:bg-slate-50'}`}
          >
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-56 object-cover rounded-2xl" />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-slate-700 p-1.5 rounded-full shadow-md transition"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                  Ready to analyze
                </div>
              </div>
            ) : (
              <label htmlFor="file-upload" className="flex flex-col items-center justify-center py-12 cursor-pointer">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
                  <UploadCloud size={28} className="text-green-500" />
                </div>
                <p className="text-slate-700 font-semibold mb-1">Drop image here</p>
                <p className="text-slate-400 text-sm mb-3">or click to browse</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full">PNG / JPG</span>
                  <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full flex items-center gap-1"><Clipboard size={10} /> Ctrl+V to paste</span>
                  <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">Up to 10MB</span>
                </div>
                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={e => processFile(e.target.files[0])} />
              </label>
            )}
          </div>

          {/* Paste hint */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 text-sm text-slate-500">
            <Clipboard size={16} className="text-slate-400 flex-shrink-0" />
            <span>Take a screenshot and press <kbd className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs font-mono text-slate-700">Ctrl+V</kbd> anywhere on this page to paste it directly.</span>
          </div>

          <button
            onClick={analyzeImage}
            disabled={!preview || analyzing}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${!preview || analyzing ? 'bg-green-300 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-sm'}`}
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : 'Detect Disease'}
          </button>
        </div>

        {/* Results */}
        <div>
          {analyzing && (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-green-500 animate-spin" />
                <Camera size={24} className="absolute inset-0 m-auto text-green-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Running AI Analysis</h3>
              <p className="text-slate-500 text-sm">Scanning leaf texture, color patterns, and identifying pathogens...</p>
              <div className="mt-4 space-y-2 w-full max-w-xs">
                {['Preprocessing image...', 'Running CNN model...', 'Matching disease database...'].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                {result.status === 'healthy'
                  ? <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center"><CheckCircle className="text-green-600" size={24} /></div>
                  : <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center"><AlertTriangle className="text-amber-600" size={24} /></div>
                }
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Analysis Complete</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${result.confidence}%` }} />
                    </div>
                    <span className="text-xs text-slate-500">{result.confidence}% confidence</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl p-4 ${result.status === 'healthy' ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Detected</p>
                <p className={`font-bold text-lg ${result.status === 'healthy' ? 'text-green-800' : 'text-amber-900'}`}>{result.disease}</p>
                <p className="text-sm text-slate-500 mt-0.5">Crop: {result.crop}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Treatment Strategy</p>
                <p className="text-sm text-slate-700 leading-relaxed">{result.treatment}</p>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Prevention</p>
                <p className="text-sm text-blue-800 leading-relaxed">{result.prevention}</p>
              </div>

              <button onClick={reset} className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 py-2.5 rounded-xl text-sm font-medium transition">
                Analyze Another Image
              </button>
            </div>
          )}

          {!analyzing && !result && (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <UploadCloud size={24} className="text-slate-300" />
              </div>
              <p className="font-medium text-slate-500">Results will appear here</p>
              <p className="text-sm text-slate-400 mt-1">Upload or paste an image to start</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
