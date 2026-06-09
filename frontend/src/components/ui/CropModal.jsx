import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

async function getCroppedImg(imageSrc, croppedAreaPixels, outputSize = 400) {
  const image = await createImageBitmap(await fetch(imageSrc).then(r => r.blob()));
  const canvas = document.createElement('canvas');
  canvas.width  = outputSize;
  canvas.height = outputSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(
    image,
    croppedAreaPixels.x, croppedAreaPixels.y,
    croppedAreaPixels.width, croppedAreaPixels.height,
    0, 0, outputSize, outputSize
  );
  return new Promise(resolve =>
    canvas.toBlob(blob => resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.92)
  );
}

export default function CropModal({ imageSrc, onConfirm, onCancel, shape = 'round' }) {
  const [crop,     setCrop]     = useState({ x: 0, y: 0 });
  const [zoom,     setZoom]     = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving,   setSaving]   = useState(false);

  const onCropComplete = useCallback((_, pixels) => setCroppedAreaPixels(pixels), []);

  const handleConfirm = async () => {
    setSaving(true);
    try {
      const file = await getCroppedImg(imageSrc, croppedAreaPixels);
      onConfirm(file);
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white text-sm">Crop Image</h3>
          <button onClick={onCancel} className="text-white/40 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Crop area */}
        <div className="relative h-72 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape={shape}
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Zoom slider */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-white/5">
          <ZoomOut size={16} className="text-white/30 flex-shrink-0" />
          <input
            type="range" min={1} max={3} step={0.05} value={zoom}
            onChange={e => setZoom(Number(e.target.value))}
            className="flex-1 accent-lime-500"
          />
          <ZoomIn size={16} className="text-white/30 flex-shrink-0" />
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm font-medium hover:bg-white/10 transition-colors">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-lime-500 hover:bg-lime-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
            <Check size={16} /> {saving ? 'Saving…' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
}
