import fs from "fs";
import multer from "multer";
import path from "path";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  },
});

// File filter for images
const imageFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

// File filter for resume (PDF, DOC, DOCX)
const resumeFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype =
    /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml/.test(
      file.mimetype
    );

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

// Image upload middleware
export const uploadImage = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("image");

// Resume upload middleware
export const uploadResume = multer({
  storage: storage,
  fileFilter: resumeFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("resume");

// General file upload (for any type)
export const uploadFile = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("file");
