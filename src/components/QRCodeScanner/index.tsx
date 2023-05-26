import React, { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';

interface QRCodeScannerProps {
  onScan: (result: string) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannedResult, setScannedResult] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(true);

  useEffect(() => {
    let animationFrameId: number;

    const startScanner = () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        };

        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current?.pause();
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              animationFrameId = requestAnimationFrame(scanQRCode);
            }
          })
          .catch((error) => {
            console.error('Error accessing camera:', error);
          });
      } else {
        console.error('getUserMedia not supported');
      }
    };

    const scanQRCode = () => {
      if (!isScanning) return; // 如果已经扫描到结果，则停止扫描

      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setScannedResult(code.data);
        onScan(code.data);
        setIsScanning(false); // 设置为已扫描到结果，停止扫描
      } else {
        animationFrameId = requestAnimationFrame(scanQRCode);
      }
    };

    startScanner();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScan, isScanning]);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ width: '100%' }}></canvas>
    </div>
  );
};

export default QRCodeScanner;
