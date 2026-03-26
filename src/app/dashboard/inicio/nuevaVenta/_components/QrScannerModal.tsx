"use client";

import { useEffect, useRef, useState } from "react";
import { X, Upload, Camera, QrCode } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
}

export default function QrScannerModal({ isOpen, onClose, onScan }: QrScannerModalProps) {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define scanner element ID
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    if (!isOpen) {
      stopScanner();
      return;
    }

    // Initialize scanner instance when modal opens
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrcodeRegionId);
    }

    // Try starting the camera immediately if we don't know yet, or if we have one
    checkCamerasAndStart();

    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const checkCamerasAndStart = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setHasCamera(true);
        startScanner();
      } else {
        setHasCamera(false);
      }
    } catch (err) {
      console.warn("No camera found or permission denied:", err);
      setHasCamera(false);
    }
  };

  const startScanner = async () => {
    if (isScanning || !scannerRef.current) return;
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          stopScanner();
          onScan(decodedText);
        },
        (errorMessage) => {
          // just ignore read errors as they happen constantly during scanning empty frames
        }
      );
      setIsScanning(true);
    } catch (err) {
      console.error("Failed to start scanner:", err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(qrcodeRegionId);
    }

    try {
      // Temporarily stop live scanning if active
      if (isScanning) await stopScanner();

      const decodedText = await scannerRef.current.scanFile(file, true);
      onScan(decodedText);
    } catch (err) {
      console.error("Error scanning file:", err);
      alert("No se pudo detectar un código QR en la imagen. Intenta con otra.");
      
      // Resume live scanning if they had a camera
      if (hasCamera) startScanner();
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = async () => {
    await stopScanner();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-[#F8F6F2] rounded-3xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200 border border-black/10">
        {/* Accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-[#b76e79]" />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-black/5 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-[#b76e79]/10 p-2 rounded-xl text-[#b76e79]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium text-[#708090]">
                Escanear Producto
              </h2>
              <p className="text-xs text-gray-500">Cámara o imagen</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Region */}
        <div className="p-6 flex flex-col items-center">
          
          <div 
            id={qrcodeRegionId} 
            className="w-full max-w-[300px] overflow-hidden rounded-2xl bg-black/5 border-2 border-dashed border-[#b76e79]/30"
          >
            {!isScanning && hasCamera === false && (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center">
                <Camera className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">Cámara no disponible o sin permisos.</p>
              </div>
            )}
          </div>
          
          {hasCamera === false && (
             <p className="text-xs text-center text-orange-400 mt-2">
               Puedes usar la opción de subir imagen.
             </p>
          )}

          <div className="mt-8 w-full flex flex-col gap-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#F8F6F2] text-gray-400 font-medium text-xs">O EXAMINA UN ARCHIVO</span>
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex justify-center items-center gap-2 bg-white border border-[#b76e79]/30 text-[#b76e79] py-3 px-4 rounded-xl font-medium focus:ring-offset-2 hover:bg-[#b76e79]/5 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Subir Imagen del QR</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Scoped styles to hide default html5-qrcode UI if possible */}
      <style dangerouslySetInnerHTML={{__html: `
        #${qrcodeRegionId} a { display: none !important; }
        #${qrcodeRegionId} img { margin: 0 auto; }
        #${qrcodeRegionId} select { padding: 4px; border-radius: 4px; margin-bottom: 10px; width: 100%; border: 1px solid #ccc; }
        #${qrcodeRegionId} button { padding: 6px 12px; border-radius: 4px; border: 1px solid #b76e79; background: white; color: #b76e79; cursor: pointer; margin-bottom: 10px; font-size: 14px; }
      `}} />
    </div>
  );
}
