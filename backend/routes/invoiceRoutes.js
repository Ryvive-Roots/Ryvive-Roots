import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/preview/:fileName", (req, res) => {
  const { fileName } = req.params;

  const filePath = path.join(__dirname, "../invoices", fileName);

  return res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Invoice open error:", err);
      return res.status(404).send("Invoice not found");
    }
  });
});

export default router;
