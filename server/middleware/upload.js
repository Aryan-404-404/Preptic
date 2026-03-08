import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowed = [
    "audio/mpeg",
    "audio/mp3", 
    "audio/mp4",
    "audio/wav",
    "audio/webm",
    "audio/ogg",
    "audio/m4a",
  ];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Unsupported format: ${file.mimetype}. Use mp3, wav, webm, or m4a`));
};

export const uploadAudio = multer({
  storage: multer.memoryStorage(),
  fileFilter,
});