const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "reports.json");

// Create reports.json automatically
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

function getReports() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    return [];
  }
}

function saveReports(reports) {
  fs.writeFileSync(
    dataFile,
    JSON.stringify(reports, null, 2)
  );
}

// GET reports
app.get("/api/reports", (req, res) => {
  res.json(getReports());
});

// CREATE report
app.post("/api/reports", (req, res) => {
  const {
    category,
    location,
    description,
    priority
  } = req.body;

  if (!category || !location || !description) {
    return res.status(400).json({
      message: "Please fill all required fields."
    });
  }

  const reports = getReports();

  const newReport = {
    _id: Date.now().toString(),
    category,
    location,
    description,
    priority: priority || "Medium",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  reports.unshift(newReport);

  saveReports(reports);

  res.status(201).json(newReport);
});

// UPDATE status
app.put("/api/reports/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const reports = getReports();

  const index = reports.findIndex(
    (report) => report._id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Report not found."
    });
  }

  reports[index].status = status;

  saveReports(reports);

  res.json(reports[index]);
});

// START SERVER
app.listen(PORT, () => {
  console.log("================================");
  console.log("CampusFix backend is running!");
  console.log("http://localhost:5000");
  console.log("================================");
});