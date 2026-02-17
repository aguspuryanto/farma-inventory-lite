
import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerModalProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onScan, onClose, isOpen }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = "barcode-scanner-region";

  useEffect(() => {
    if (isOpen) {
      const html5QrCode = new Html5Qrcode(regionId);
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 150 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // ignore scan failures
        }
      ).catch((err) => {
        console.error("Camera error:", err);
      });
    }

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current?.clear();
      }).catch(err => console.error("Stop error", err));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">Scan Barcode Obat</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">✕</button>
        </div>
        <div className="relative aspect-video bg-black">
          <div id={regionId} className="w-full h-full"></div>
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-40 border-2 border-emerald-500 rounded-lg relative overflow-hidden">
               <div className="scan-line"></div>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-slate-500 mb-4 italic">Arahkan kamera ke barcode pada kemasan obat</p>
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
