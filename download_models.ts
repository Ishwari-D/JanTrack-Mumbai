import fs from 'fs';
import path from 'path';
import https from 'https';

const modelsArgs = [
    "ssd_mobilenetv1_model-weights_manifest.json",
    "ssd_mobilenetv1_model-shard1",
    "ssd_mobilenetv1_model-shard2",
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "tiny_face_detector_model-weights_manifest.json",
    "tiny_face_detector_model-shard1"
];

const baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/";
const targetDir = path.join(process.cwd(), "client", "public", "models");

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

async function download(file) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(targetDir, file);
        const fileStream = fs.createWriteStream(filePath);
        https.get(baseUrl + file, (res) => {
            if (res.statusCode !== 200) {
                res.resume();
                console.error(`Failed to download ${file}: ${res.statusCode}`);
                // Don't reject for shards, maybe it only has 1 shard?
                // But generally keys are needed.
                return resolve(false);
            }
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                console.log(`Downloaded ${file}`);
                resolve(true);
            });
        }).on('error', (err) => {
            fs.unlink(filePath, () => { });
            console.error(`Error downloading ${file}:`, err.message);
            reject(err);
        });
    });
}

async function run() {
    for (const file of modelsArgs) {
        await download(file);
    }
}

run();
