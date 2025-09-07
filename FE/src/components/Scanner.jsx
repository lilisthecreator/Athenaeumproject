import { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function Scanner({ onDetected, onError }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let controls;
    let cancelled = false;
    async function start() {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices.length) throw new Error('No camera');
        controls = await reader.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (result, err) => {
          if (cancelled) return;
          if (result) onDetected && onDetected(result.getText());
        });
      } catch (e) {
        onError && onError(e);
      }
    }
    start();
    return () => { cancelled = true; try { controls?.stop(); reader.reset(); } catch(_){} };
  }, [onDetected, onError]);

  return (
    <div className="aspect-video w-full bg-black/80 rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
    </div>
  );
}


