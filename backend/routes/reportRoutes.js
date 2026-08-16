require("dotenv").config();

const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.post("/", async (req, res) => {
    
  try {
    const client = req.app.locals.dbClient;
    const report = req.body;

    

    const database = client.db("CampusFix");
    const reports = database.collection("reports");

    const result = await reports.insertOne({
      ...report,
      status: "Pending",
      createdAt: new Date(),
    });

    console.log("New CampusFix Report saved:", result.insertedId);

    res.status(201).json({
      message: "Report saved successfully!",
      reportId: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving report:", error);

    res.status(500).json({
      message: "Failed to save report",
    });
  }
});

router.get("/", async (req, res) => {
  console.log("GET /api/reports received");

  try {
    const client = req.app.locals.dbClient;

    const database = client.db("CampusFix");
    const reports = database.collection("reports");

    const allReports = await reports
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json(allReports);
  } catch (error) {
    console.error("Error fetching reports:", error);

    res.status(500).json({
      message: "Failed to fetch reports",
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const client = req.app.locals.dbClient;

    const database = client.db("CampusFix");
    const reports = database.collection("reports");

    const { ObjectId } = require("mongodb");

    const result = await reports.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message: "Status updated successfully!",
    });
  } catch (error) {
    console.error("Error updating status:", error);

    res.status(500).json({
      message: "Failed to update status",
    });
  }
});
module.exports = router;