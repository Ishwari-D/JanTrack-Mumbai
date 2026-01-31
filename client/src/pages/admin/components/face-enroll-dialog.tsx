import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { loadModels, getFaceDescriptor } from "@/lib/face-auth";
import { Loader2, Camera, CheckCircle, AlertCircle } from "lucide-react";

interface FaceEnrollDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    username: string;
    onSuccess: () => void;
}

export function FaceEnrollDialog({ isOpen, onOpenChange, username, onSuccess }: FaceEnrollDialogProps) {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [descriptor, setDescriptor] = useState<Float32Array | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const init = async () => {
                setIsLoadingModels(true);
                try {
                    await loadModels();
                    setIsLoadingModels(false);
                    startCamera();
                } catch (error) {
                    console.error(error);
                    toast({ title: "Error", description: "Failed to load face recognition models", variant: "destructive" });
                }
            };
            init();
        } else {
            stopCamera();
            setDescriptor(null);
        }
        return () => stopCamera();
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            toast({ title: "Camera Error", description: "Could not access webcam", variant: "destructive" });
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setIsCameraActive(false);
        }
    };

    const handleCapture = async () => {
        if (!videoRef.current) return;
        setIsProcessing(true);
        try {
            const desc = await getFaceDescriptor(videoRef.current);
            if (desc) {
                setDescriptor(desc);
                toast({ title: "Face Detected", description: "Face captured successfully. You can now save." });
            } else {
                toast({ title: "No Face Detected", description: "Please look directly at the camera", variant: "destructive" });
            }
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Face detection failed", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSave = async () => {
        if (!descriptor) return;
        setIsProcessing(true);
        try {
            const res = await fetch("/api/admin/enroll-face", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username,
                    descriptor: Array.from(descriptor)
                })
            });

            if (!res.ok) throw new Error("Failed to save face data");

            toast({ title: "Success", description: "Face enrolled successfully" });
            onSuccess();
            onOpenChange(false);
        } catch (err) {
            toast({ title: "Error", description: "Failed to enroll face", variant: "destructive" });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Enroll Face for {username}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-4">
                    {isLoadingModels ? (
                        <div className="flex flex-col items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="mt-2 text-sm text-muted-foreground">Loading AI models...</p>
                        </div>
                    ) : (
                        <div className="relative rounded-lg overflow-hidden bg-black aspect-video w-full max-h-[300px]">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                className={`w-full h-full object-cover ${descriptor ? 'opacity-50' : ''}`}
                            />
                            {!isCameraActive && !descriptor && (
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <AlertCircle className="h-8 w-8 mb-2" />
                                    <p>Camera inactive</p>
                                </div>
                            )}
                            {descriptor && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 bg-white rounded-full" />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2 w-full">
                        {!descriptor ? (
                            <Button
                                onClick={handleCapture}
                                disabled={!isCameraActive || isProcessing || isLoadingModels}
                                className="w-full"
                            >
                                {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Camera className="mr-2 h-4 w-4" />}
                                Capture Face
                            </Button>
                        ) : (
                            <div className="flex gap-2 w-full">
                                <Button variant="outline" onClick={() => setDescriptor(null)} className="flex-1">
                                    Retake
                                </Button>
                                <Button onClick={handleSave} disabled={isProcessing} className="flex-1">
                                    {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Save Face Data"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
