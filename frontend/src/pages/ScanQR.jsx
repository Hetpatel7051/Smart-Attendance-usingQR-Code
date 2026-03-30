import React, { useEffect, useState } from 'react';
import { QrCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

const ScanQR = ({ user }) => {
  const [scanResult, setScanResult] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);
  const [manualToken, setManualToken] = useState('');
  const navigate = useNavigate();

  const handleScanSuccess = async (decodedText) => {
    // Prevent multiple requests
    if (scanResult) return; 
    setScanResult('processing');
    
    // We send the scanned token to the backend
    try {
      const res = await fetch('http://localhost:3000/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          qrToken: decodedText,
          latitude: 0, // In production, grab real geolocation
          longitude: 0
        })
      });

      const data = await res.json();
      if (res.ok) {
        setScanResult('success');
      } else {
        setScanResult(null);
        setErrorStatus(data.error || 'Failed to verify QR Code.');
      }
    } catch (err) {
      setScanResult(null);
      setErrorStatus('Network error while recording attendance.');
    }
  };

  useEffect(() => {
    // Only initialize the scanner if we haven't succeeded yet
    if (scanResult === 'success') return;

    const scanner = new Html5QrcodeScanner(
      "reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }, 
      /* verbose= */ false
    );

    scanner.render(
      (text) => {
        scanner.clear(); // Stop scanning on success
        handleScanSuccess(text);
      },
      (error) => {
        // Ignored. HTML5QRCode throws an error every frame the QR is not found.
      }
    );

    return () => {
      // Cleanup scanner on unmount
      scanner.clear().catch(e => console.error(e));
    };
  }, [scanResult]);

  return (
    <div>
      <div className="content-header">
        <div>
          <h1 className="page-title">Scan Attendance Code</h1>
          <p className="page-subtitle">Align the professor's QR code securely within the frame.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        
        {/* Camera View */}
        <div className="card" style={{ flex: '1', minWidth: '350px', padding: '24px' }}>
          {scanResult === 'success' ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#10b981' }}>
              <CheckCircle size={80} style={{ marginBottom: '24px' }} />
              <h2>Attendance Recorded!</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>You have been successfully marked present.</p>
              <button className="btn btn-outline" style={{ marginTop: '32px' }} onClick={() => navigate('/student-dashboard')}>
                Return to Dashboard
              </button>
            </div>
          ) : scanResult === 'processing' ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '48px', color: 'var(--primary-color)' }}>↻</div>
              <h3 style={{ marginTop: '24px' }}>Verifying...</h3>
            </div>
          ) : (
             <div id="reader" width="100%"></div>
          )}
        </div>

        {/* Fallback / Status View */}
        <div className="card" style={{ flex: '1', minWidth: '300px', padding: '32px', height: 'fit-content' }}>
          <h3>Having Camera Issues?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
            If your browser blocks the camera or you lack hardware, manually enter the QR Token underneath the code if provided.
          </p>
          
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. QR-TOKEN-XYZ-123" 
              value={manualToken} 
              onChange={e => setManualToken(e.target.value)}
            />
          </div>
          <button 
             className="btn btn-primary btn-full" 
             onClick={() => handleScanSuccess(manualToken)}
             disabled={!manualToken || scanResult}
          >
            Submit Token
          </button>

          {errorStatus && (
            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <AlertTriangle size={18} />
              {errorStatus}
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        /* Minimal styling overrides for the clunky html5-qrcode UI elements */
        #reader { border-radius: 12px; overflow: hidden; border: none !important; }
        #reader__dashboard_section_csr button { padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ScanQR;
