import { useEffect, useState } from "react";
import "./Admin.css";

function Admin() {
  const [reports, setReports] = useState([]);

  // =========================
  // LOAD REPORTS
  // =========================

  useEffect(() => {
    const savedReports = localStorage.getItem("campusfix_reports");

    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (error) {
        console.error("Error loading reports:", error);
      }
    }
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================

  const updateStatus = (id, status) => {
    const savedReports = localStorage.getItem("campusfix_reports");

    const currentReports = savedReports
      ? JSON.parse(savedReports)
      : [];

    const updatedReports = currentReports.map((report) =>
      (report._id || report.id) === id
        ? { ...report, status: status }
        : report
    );

    localStorage.setItem(
      "campusfix_reports",
      JSON.stringify(updatedReports)
    );

    setReports(updatedReports);
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

          <span className="report-count">

            {reports.length}{" "}

            {reports.length === 1
              ? "Report"
              : "Reports"}

          </span>

        </div>

        {reports.length === 0 ? (

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
                report._id || report.id || index;

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