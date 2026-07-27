import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Upload, CheckCircle2, AlertTriangle, XCircle, ShieldCheck, QrCode, Video, VideoOff } from 'lucide-react';
import jsQR from 'jsqr';
import { scannerAPI } from '../services/api';

const QRScannerComponent = ({ onResult }) => {
  const [mode, setMode] = useState('camera'); // 'camera', 'upload', 'simulated', 'manual'
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [gateNumber, setGateNumber] = useState('Gate 1 - Main Entrance');
  const [fileName, setFileName] = useState('');
  
  // Live Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(document.createElement('canvas'));
  const scanIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up camera on unmount or mode switch
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (mode !== 'camera') {
      stopCamera();
    }
  }, [mode]);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', true);
        await videoRef.current.play();
        setCameraActive(true);

        // Start scanning loop frame by frame
        scanIntervalRef.current = setInterval(captureAndScanFrame, 300);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Unable to access webcam. Ensure camera permissions are granted.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const captureAndScanFrame = () => {
    if (!videoRef.current || videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });

    if (code && code.data) {
      // Detected QR Code from live camera feed!
      stopCamera(); // Pause camera stream upon detection
      handleScanSubmit(code.data);
    }
  };

  const handleScanSubmit = async (codeToSubmit) => {
    if (!codeToSubmit) return;

    // Clean payload string if passed as JSON object {"ticket_code": "TICK-XXXX", ...}
    let cleanedCode = codeToSubmit.trim();
    try {
      if (cleanedCode.startsWith('{')) {
        const parsed = JSON.parse(cleanedCode);
        if (parsed.ticket_code) {
          cleanedCode = parsed.ticket_code;
        }
      }
    } catch (e) {
      // not JSON format
    }

    setScanning(true);
    setScanResult(null);
    try {
      const res = await scannerAPI.scan(cleanedCode, gateNumber);
      setScanResult(res.data);
      if (onResult) onResult(res.data);
    } catch (err) {
      if (err.response && err.response.data) {
        setScanResult(err.response.data);
        if (onResult) onResult(err.response.data);
      } else {
        setScanResult({
          status: 'REJECTED',
          message: 'Network Error or Invalid Scanner Request',
          access: false
        });
      }
    } finally {
      setScanning(false);
    }
  };

  // Optical Image File Reader
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        
        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          handleScanSubmit(code.data);
        } else {
          setScanResult({
            status: 'OPTICAL_READ_ERROR',
            message: 'No readable QR code found in image file',
            access: false
          });
        }
      };
      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 space-y-6 bg-slate-900/90 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" /> Live Gate Access & Camera QR Scanner
          </h3>
          <p className="text-xs text-slate-400">Point your device camera at a visitor's QR code or upload ticket image for gate authentication.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={gateNumber}
            onChange={(e) => setGateNumber(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="Gate 1 - Main Entrance">Gate 1 - Main Entrance</option>
            <option value="Gate 2 - VIP & Press">Gate 2 - VIP & Press</option>
            <option value="Gate 3 - Stage & Staff">Gate 3 - Stage & Staff</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scanner Inputs Container */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          
          {/* Mode Switcher Tabs */}
          <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setMode('camera')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center justify-center gap-1 ${
                mode === 'camera' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" /> Live Camera
            </button>
            <button
              onClick={() => setMode('upload')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center justify-center gap-1 ${
                mode === 'upload' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" /> Upload File
            </button>
            <button
              onClick={() => setMode('simulated')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center justify-center gap-1 ${
                mode === 'simulated' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Simulator
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-lg transition-all shrink-0 flex items-center justify-center gap-1 ${
                mode === 'manual' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manual Code
            </button>
          </div>

          {/* MODE 1: LIVE WEBCAM SCANNER */}
          {mode === 'camera' && (
            <div className="space-y-3 py-1">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Laser Overlay when active */}
                {cameraActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-blue-500/80 rounded-2xl relative shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                      <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse top-1/2" />
                    </div>
                  </div>
                )}

                {!cameraActive && (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="w-10 h-10 mx-auto text-slate-500" />
                    <p className="text-xs text-slate-300 font-semibold">Webcam Live Gate Scanner</p>
                    <p className="text-[10px] text-slate-500">Click below to activate device camera for optical scanning</p>
                  </div>
                )}
              </div>

              {cameraError && (
                <p className="text-xs text-red-400 text-center font-medium">{cameraError}</p>
              )}

              <div className="flex gap-2">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/30 flex items-center justify-center gap-1.5"
                  >
                    <Video className="w-4 h-4" /> Start Live Camera
                  </button>
                ) : (
                  <button
                    onClick={stopCamera}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-red-400 font-bold text-xs rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <VideoOff className="w-4 h-4" /> Stop Camera
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MODE 2: Upload QR Image */}
          {mode === 'upload' && (
            <div className="space-y-3 py-2 text-center">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/60 rounded-2xl p-6 cursor-pointer transition-all hover:bg-blue-600/5 group"
              >
                <Upload className="w-10 h-10 mx-auto text-blue-400 group-hover:scale-110 transition-transform mb-2" />
                <p className="text-xs font-bold text-white">Click to Upload QR Ticket Image</p>
                <p className="text-[10px] text-slate-400 mt-1">Select downloaded Pass PNG/JPG or scan snapshot</p>
                {fileName && (
                  <span className="inline-block mt-2 text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Selected: {fileName}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* MODE 3: Simulator / Preset */}
          {mode === 'simulated' && (
            <div className="space-y-3 py-2">
              <p className="text-xs text-slate-400 font-medium">Quick test scenarios for gate turnstiles:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => handleScanSubmit('TICK-DEMO2026')}
                  disabled={scanning}
                  className="py-2.5 px-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Valid Ticket
                </button>
                <button
                  onClick={() => handleScanSubmit('TICK-USED-TEST')}
                  disabled={scanning}
                  className="py-2.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Already Used
                </button>
                <button
                  onClick={() => handleScanSubmit('INVALID-9999')}
                  disabled={scanning}
                  className="py-2.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all text-center"
                >
                  Invalid Code
                </button>
              </div>
            </div>
          )}

          {/* MODE 4: Manual Entry */}
          {mode === 'manual' && (
            <div className="space-y-3 py-2">
              <label className="text-xs text-slate-400 font-medium block">Enter Ticket Code (e.g. TICK-DEMO2026):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="TICK-XXXXXX"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleScanSubmit(manualCode)}
                  disabled={!manualCode || scanning}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {scanning && (
            <div className="flex items-center justify-center gap-2 text-xs text-blue-400 py-2 font-bold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" /> Optically Decoding & Verifying Gate Pass...
            </div>
          )}
        </div>

        {/* Verification Result Output Display */}
        <div className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800 flex flex-col justify-center min-h-[220px]">
          {scanResult ? (
            <div className={`p-5 rounded-2xl border text-center space-y-3 transition-all animate-fade-in ${
              scanResult.access || scanResult.valid
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : scanResult.result === 'TICKET_ALREADY_USED' || scanResult.message?.includes('ALREADY USED')
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                : 'bg-red-500/10 border-red-500/40 text-red-400'
            }`}>
              <div className="flex justify-center">
                {scanResult.access || scanResult.valid ? (
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-bounce" />
                ) : scanResult.result === 'TICKET_ALREADY_USED' || scanResult.message?.includes('ALREADY USED') ? (
                  <AlertTriangle className="w-12 h-12 text-amber-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>

              <div>
                <h4 className="text-xl font-black uppercase tracking-wider">{scanResult.message}</h4>
                <p className="text-xs opacity-80 mt-1">{scanResult.status || (scanResult.access || scanResult.valid ? 'VALIDATED' : 'DENIED')} • Gate: {gateNumber}</p>
              </div>

              {(scanResult.access || scanResult.valid) && (
                <div className="pt-3 border-t border-emerald-500/20 text-left text-xs space-y-1.5 text-slate-100 font-medium">
                  <div className="flex justify-between"><span className="text-slate-400">Visitor Name:</span> <span className="font-bold text-white">{scanResult.visitor_name || scanResult.attendee_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Ticket ID:</span> <span className="font-mono text-blue-400 font-bold">{scanResult.ticket_id || scanResult.ticket_code}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Event:</span> <span className="font-semibold text-slate-200">{scanResult.event_name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Entry Timestamp:</span> <span>{scanResult.entry_time}</span></div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <QrCode className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs font-semibold">Ready for QR Gate Scanning</p>
              <p className="text-[10px] text-slate-600">Activate live camera, upload a pass image, or enter code to verify entry</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerComponent;
