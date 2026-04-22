"use client";

import React, { useState, useCallback } from 'react';
import Cropper, { Area, Point } from 'react-easy-crop';
import { FiX, FiCheck, FiZoomIn, FiMaximize } from 'react-icons/fi';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
  aspectRatio?: number; // default 3/4
}

export default function ImageCropper({ 
  image, 
  onCropComplete, 
  onCancel, 
  aspectRatio = 3/4 
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteInternal = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async () => {
    try {
      const img = await createImage(image);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx || !croppedAreaPixels) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(blob);
        }, 'image/jpeg');
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg();
    if (croppedBlob) {
      onCropComplete(croppedBlob);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-[32px] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#4a5568] tracking-tight" style={{ fontFamily: 'var(--font-display, Manrope, sans-serif)' }}>
              Ajustar <span className="text-[#b76e79]">Imagen</span>
            </h3>
            <p className="text-xs text-[#708090] font-medium uppercase tracking-widest mt-1">Proporción 3:4 establecida</p>
          </div>
          <button 
            onClick={onCancel}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#708090] hover:bg-gray-100 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative h-[450px] bg-[#f6f4ef]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-8 bg-white flex flex-col gap-6">
          <div className="flex items-center gap-6">
            <div className="text-[#b76e79]">
              <FiZoomIn size={20} />
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => onZoomChange(Number(e.target.value))}
              className="flex-1 h-1.5 bg-[#f6f4ef] rounded-lg appearance-none cursor-pointer accent-[#b76e79]"
            />
            <div className="text-[#708090]">
               <FiMaximize size={18} />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 py-4 px-6 rounded-2xl border-2 border-gray-100 text-[#708090] font-bold text-sm hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button
              onClick={handleDone}
              className="flex-2 py-4 px-10 rounded-2xl bg-[#b76e79] text-white font-bold text-sm hover:shadow-lg hover:shadow-[#b76e79]/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <FiCheck size={20} strokeWidth={3} /> Aplicar Recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
