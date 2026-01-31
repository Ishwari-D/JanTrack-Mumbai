import * as faceapi from 'face-api.js';

export async function loadModels() {
    const MODEL_URL = '/models';
    try {
        console.log("Loading TinyFaceDetector...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        console.log("TinyFaceDetector loaded.");

        console.log("Loading FaceLandmark68Net...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        console.log("FaceLandmark68Net loaded.");

        console.log("Loading FaceRecognitionNet...");
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        console.log("FaceRecognitionNet loaded.");
    } catch (error) {
        console.error("Failed to load models:", error);
        throw error;
    }
}

export async function getFaceDescriptor(video: HTMLVideoElement): Promise<Float32Array | undefined> {
    // Use TinyFaceDetector for better real-time webcam performance
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });
    const detection = await faceapi.detectSingleFace(video, options).withFaceLandmarks().withFaceDescriptor();
    return detection?.descriptor;
}
