import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const uploadMiddleware = (req, res, next) => {
  upload.single("resume")(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const fileBuffer = req.file.buffer;
      req.fileBuffer = fileBuffer;

      next();
    } catch (error) {
      return res
        .status(500)
        .json({ error: `Error processing file: ${error.message}` });
    }
  });
};

export default uploadMiddleware;
