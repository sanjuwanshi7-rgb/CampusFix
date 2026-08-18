const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataFile = path.join(__dirname, "reports.json");

// Create reports.json automatically
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, "[]");
}

function getReports() {
  try {
    return JSON.parse(
      fs.readFileSync(dataFile, "utf8")
    );
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

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.send("CampusFix Backend is Running 🚀");
});

// ===============================
// GET REPORTS
// ===============================

app.get("/api/reports", (req, res) => {
  res.json(getReports());
});

// ===============================
// CREATE REPORT
// ===============================

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

// ===============================
// UPDATE REPORT STATUS
// ===============================

app.put("/api/reports/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Resolved"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid status."
    });
  }

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

// ===============================
// START SERVER
// ===============================

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log("CampusFix backend is running!");
  console.log(`Port: ${PORT}`);
  console.log("================================");
});