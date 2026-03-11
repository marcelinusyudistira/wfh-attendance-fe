import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

const estimateBytesFromDataUrl = (dataUrl) => {
    const base64 = String(dataUrl).split(",")[1] || "";
    return Math.floor((base64.length * 3) / 4);
};

const toCompressedJpegDataUrl = ({ sourceCanvas, maxDimension, quality }) => {
    const srcW = sourceCanvas.width;
    const srcH = sourceCanvas.height;

    const scale = Math.min(1, maxDimension / Math.max(srcW, srcH));
    const destW = Math.max(1, Math.round(srcW * scale));
    const destH = Math.max(1, Math.round(srcH * scale));

    const outCanvas = document.createElement("canvas");
    outCanvas.width = destW;
    outCanvas.height = destH;

    const outCtx = outCanvas.getContext("2d");
    outCtx.drawImage(sourceCanvas, 0, 0, destW, destH);

    return outCanvas.toDataURL("image/jpeg", quality);
};

function CameraCapture({ onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [cameraOpen, setCameraOpen] = useState(false);
    const [stream, setStream] = useState(null);
    const [preview, setPreview] = useState(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "user",
                },
                audio: false,
            });

            setStream(mediaStream);
            setCameraOpen(true);
        } catch (err) {
            console.error(err);
            alert("Camera cannot be accessed");
        }
    };

    useEffect(() => {
        if (!cameraOpen || !stream) return;

        const video = videoRef.current;

        if (video) {
            video.srcObject = stream;

            video.onloadedmetadata = () => {
                video.play();
            };
        }
    }, [cameraOpen, stream]);

    const capturePhoto = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        const width = video.videoWidth;
        const height = video.videoHeight;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(video, 0, 0, width, height);

        const targetBytes = 60 * 1024; // Keep JSON body safely under 100KB
        const maxDimensions = [640, 480, 360, 280];
        const qualities = [0.7, 0.6, 0.5, 0.4, 0.35, 0.3];

        let bestDataUrl = null;
        let bestBytes = Infinity;

        for (const maxDimension of maxDimensions) {
            for (const quality of qualities) {
                const dataUrl = toCompressedJpegDataUrl({
                    sourceCanvas: canvas,
                    maxDimension,
                    quality,
                });
                const bytes = estimateBytesFromDataUrl(dataUrl);

                if (bytes < bestBytes) {
                    bestBytes = bytes;
                    bestDataUrl = dataUrl;
                }

                if (bytes <= targetBytes) break;
            }
            if (bestBytes <= targetBytes) break;
        }

        setPreview(bestDataUrl);

        try {
            const res = await fetch(bestDataUrl);
            const blob = await res.blob();
            const file = new File([blob], "attendance.jpg", {
                type: "image/jpeg",
            });
            onCapture(file);
        } catch (err) {
            console.error(err);
            alert("Failed to process photo");
        }

        stopCamera();
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        setCameraOpen(false);
    };

    const retakePhoto = () => {
        setPreview(null);
        startCamera();
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="space-y-3">
            {!cameraOpen && !preview && (
                <Button onClick={startCamera} className="w-full py-3">
                    Open Camera
                </Button>
            )}

            {cameraOpen && (
                <div className="space-y-3">
                    <div className="w-full h-[320px] rounded-lg overflow-hidden bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <Button
                        variant="success"
                        onClick={capturePhoto}
                        className="w-full py-3"
                    >
                        Take Photo
                    </Button>
                </div>
            )}

            {preview && (
                <div className="space-y-3">
                    <div className="w-full h-[320px] rounded-lg overflow-hidden">
                        <img
                            src={preview}
                            alt="preview"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <Button
                        variant="muted"
                        onClick={retakePhoto}
                        className="w-full py-3"
                    >
                        Retake Photo
                    </Button>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}

export default CameraCapture;
