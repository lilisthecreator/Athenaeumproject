import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function Scanner({ onDetected, onError }) {
  const videoRef = useRef(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let controls;
    let cancelled = false;

    async function start() {
      try {
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices || devices.length === 0) {
          throw new Error('No camera devices found');
        }
        const deviceId = devices[0].deviceId;
        controls = await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (cancelled) return;
          if (result) {
            const text = result.getText();
            // ISBN barcodes are usually EAN-13; pass raw text
            onDetected && onDetected(text);
          }
          if (err) {
            // Swallow frequent decode errors
          }
        });
      } catch (e) {
        onError && onError(e);
      }
    }

    if (isActive) start();

    return () => {
      cancelled = true;
      setIsActive(false);
      if (controls && typeof controls.stop === 'function') {
        controls.stop();
      }
      try { codeReader.reset(); } catch (_) {}
    };
  }, [isActive, onDetected, onError]);

  return (
    <div className="w-full">
      <div className="aspect-video w-full bg-black/80 overflow-hidden rounded-lg">
        <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
      </div>
    </div>
  );
}


