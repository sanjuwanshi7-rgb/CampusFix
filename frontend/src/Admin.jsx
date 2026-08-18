import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL =
  "https://campusfix-backend-k5jr.onrender.com/api/reports";

function Admin() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD REPORTS FROM LIVE SERVER
  // =========================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setReports(data);
    } catch (error) {
      console.error("Error loading reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update status"
        );
      }

      // Update the report immediately on admin dashboard
      setReports((currentReports) =>
        currentReports.map((report) =>
          report._id === id
            ? { ...report, status: data.status }
            : report
        )
      );

    } catch (error) {
      console.error("Error updating status:", error);

      alert(
        "Unable to update status. Please try again."
      );
    }
  };

  // =========================
  // STATISTICS
  // =========================

  const pendingCount = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgressCount = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedCount = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-page">

      {/* HEADER */}

      <header className="admin-header">

        <div>

          <p className="admin-label">
            CAMPUSFIX ADMIN
          </p>

          <h1>
            Campus Dashboard
          </h1>

          <p className="admin-subtitle">
            Monitor and manage campus issues in one place.
          </p>

        </div>

        <div className="admin-logo">
          Campus<span>Fix</span>
        </div>

      </header>

      {/* STATISTICS */}

      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            📋
          </div>

          <div>
            <p>Total Reports</p>
            <h2>{reports.length}</h2>
          </div>

        </div>

        <div className="stat-card pending-card">

          <div className="stat-icon">
            ⏳
          </div>

          <div>
            <p>Pending</p>
            <h2>{pendingCount}</h2>
          </div>

        </div>

        <div className="stat-card progress-card">

          <div className="stat-icon">
            🔄
          </div>

          <div>
            <p>In Progress</p>
            <h2>{inProgressCount}</h2>
          </div>

        </div>

        <div className="stat-card resolved-card">

          <div className="stat-icon">
            ✓
          </div>

          <div>
            <p>Resolved</p>
            <h2>{resolvedCount}</h2>
          </div>

        </div>

      </section>

      {/* REPORTS */}

      <section className="reports-section">

        <div className="section-heading">

          <div>

            <h2>
              Recent Reports
            </h2>

            <p>
              Track and update reported campus issues.
            </p>

          </div>

          <button
            className="report-count"
            onClick={fetchReports}
          >
            {reports.length}{" "}

            {reports.length === 1
              ? "Report"
              : "Reports"}

            {" "}↻
          </button>

        </div>

        {loading ? (

          <div className="empty-state">

            <div>
              ⏳
            </div>

            <h3>
              Loading reports...
            </h3>

            <p>
              Connecting to CampusFix server.
            </p>

          </div>

        ) : reports.length === 0 ? (

          <div className="empty-state">

            <div>
              📭
            </div>

            <h3>
              No reports available
            </h3>

            <p>
              New campus issues will appear here.
            </p>

          </div>

        ) : (

          <div className="reports-grid">

            {reports.map((report, index) => {

              const reportId =
                report._id || index;

              return (

                <div
                  className="report-card"
                  key={reportId}
                >

                  {/* TOP */}

                  <div className="report-top">

                    <span className="category-badge">
                      {report.category}
                    </span>

                    <span
                      className={`status-badge ${
                        report.status
                          ?.toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {report.status}
                    </span>

                  </div>

                  {/* DESCRIPTION */}

                  <h3>
                    {report.description}
                  </h3>

                  {/* DETAILS */}

                  <div className="report-details">

                    <div>

                      <span>
                        📍
                      </span>

                      <p>

                        <small>
                          Location
                        </small>

                        {report.location}

                      </p>

                    </div>

                    <div>

                      <span>
                        ⚡
                      </span>

                      <p>

                        <small>
                          Priority
                        </small>

                        {report.priority}

                      </p>

                    </div>

                  </div>

                  {/* STATUS CONTROL */}

                  <div className="status-control">

                    <label>
                      Update Status
                    </label>

                    <select
                      value={report.status}
                      onChange={(e) =>
                        updateStatus(
                          reportId,
                          e.target.value
                        )
                      }
                    >

                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Resolved">
                        Resolved
                      </option>

                    </select>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Admin;