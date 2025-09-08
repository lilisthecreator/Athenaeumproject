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
        // Prefer back camera when available
        const pick = (() => {
          const byLabel = devices.find(d => /back|rear|environment/i.test(d.label));
          return byLabel ? byLabel.deviceId : devices[devices.length - 1].deviceId;
        })();
        controls = await reader.decodeFromVideoDevice(pick, videoRef.current, (result, err) => {
          if (cancelled) return;
          if (result) {
            const text = result.getText();
            cancelled = true; // prevent duplicate navigations
            try { controls?.stop(); } catch(_) {}
            onDetected && onDetected(text);
          }
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


