import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import { execSync } from "child_process";
import fs from "fs";

// Python environment no longer forces pip install since fpdf is removed
console.log("Starting server. fpdf has been removed. UI relies exclusively on JSON reporting.");

// Setup Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Keep it named 'logs_syslog.ndjson' for the script
    cb(null, 'logs_syslog.ndjson');
  }
});
const upload = multer({ storage });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Serve the uploads and ensure directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  // Handle file upload
  app.post("/api/upload", upload.single("logFile"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ status: "error", message: "No file uploaded" });
    }
    
    // Automatically trigger Python backend so data is ready for the UI
    const pythonScript = path.join(process.cwd(), 'server', 'backend.py');
    const logPath = path.join(process.cwd(), 'uploads', 'logs_syslog.ndjson');
    const scenarioPath = path.join(process.cwd(), 'server', 'scenarios.csv');
    // Using outPath directly as the expected JSON output
    const outPath = path.join(process.cwd(), 'uploads', 'Forensic_Report.json');

    try {
      console.log(`Executing python backend after upload (JSON and PDF MODE)...`);
      execSync(`python3 "${pythonScript}" "${logPath}" "${scenarioPath}" "${outPath}"`, { stdio: 'inherit' });
    } catch (error) {
      console.error("Error executing Python script during setup:", error);
      res.status(500).json({ status: "error", message: "Error running Python Forensic Engine. Consult server logs." });
    }
  });

  // Archive endpoints for Python generated PDFs
  app.get("/api/archives", (req, res) => {
    const archivesDir = path.join(process.cwd(), 'uploads', 'archives');
    if (!fs.existsSync(archivesDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(archivesDir)
      .filter(f => f.endsWith('.pdf'))
      .map(f => {
        const stats = fs.statSync(path.join(archivesDir, f));
        return { name: f, url: `/api/archives/${f}`, date: stats.birthtime };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    res.json(files);
  });

  app.use("/api/archives", express.static(path.join(process.cwd(), 'uploads', 'archives')));

  // Since Python now makes PDFs again, old html generator path can return latest url or message
  app.get("/api/reports/pdf", (req, res) => {
    res.status(501).send("<body><h2>PDF handled via archives API.</h2></body>");
  });

  // Handle JSON report data fetch
  app.get("/api/reports/data", (req, res) => {
    const jsonPath = path.join(process.cwd(), 'uploads', 'Forensic_Report.json');
    if (fs.existsSync(jsonPath)) {
      res.sendFile(jsonPath);
    } else {
      res.status(404).json({ error: "Report not found" });
    }
  });

  // Vite middleware for development or Static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4 and below: app.get('*', ...)
    // Note: If using Express 5 beta, it would be app.get('*all', ...)
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
