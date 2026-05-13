const express = require("express");

const upload =
  require("../config/multer");

const router =
  express.Router();



/* =========================
   FILE UPLOAD
========================= */

router.post(
  "/",
  upload.single("file"),

  async (req, res) => {

    try {

      res.json({

        fileUrl:
          `/uploads/${req.file.filename}`,

        fileType:
          req.file.mimetype
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Upload failed"
      });
    }
  }
);

module.exports = router;