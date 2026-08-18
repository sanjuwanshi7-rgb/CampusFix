import { useEffect, useState } from "react";
import "./App.css";
import Admin from "./Admin";

const API_URL =
  "https://campusfix-backend-k5jr.onrender.com/api/reports";

function App() {
  // =========================
  // ADMIN ROUTE
  // =========================

  if (window.location.pathname === "/admin") {
    return <Admin />;
  }

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    category: "",
    location: "",
    description: "",
    priority: "Medium",
  });

  const [reports, setReports] = useState([]);

  // =========================
  // LOAD REPORTS
  // =========================

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setReports(data);
      }
    } catch (error) {
      console.error("Error loading reports:", error);
    }
  };

  // =========================
  // FORM INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT REPORT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit report"
        );
      }

      alert("Your issue has been submitted successfully! 🎉");

      setReports((currentReports) => [
        data,
        ...currentReports,
      ]);

      setFormData({
        category: "",
        location: "",
        description: "",
        priority: "Medium",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error submitting report:", error);

      alert(
        "Unable to connect to CampusFix server. Please try again."
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
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">C</div>
          <span>CampusFix</span>
        </div>

        <nav className="sidebar-nav">

          <button className="nav-item active">
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={() => setShowForm(true)}
          >
            <span>＋</span>
            Report Issue
          </button>

          <button className="nav-item">
            <span>▣</span>
            My Reports
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <span>⚙</span>
            Settings
          </button>

          <button className="nav-item">
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* HEADER */}

        <header className="topbar">

          <div>

            <p className="small-heading">
              STUDENT DASHBOARD
            </p>

            <h1>
              Good morning, <span>Sanjana</span> 👋
            </h1>

            <p className="welcome-text">
              Keep your campus better, one report at a time.
            </p>

          </div>

          <div className="profile">

            <div className="profile-avatar">
              S
            </div>

            <div>
              <strong>Sanjana</strong>
              <small>Student</small>
            </div>

          </div>

        </header>

        {/* STATISTICS */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon purple">
              📋
            </div>

            <div>
              <p>Total Reports</p>
              <h2>{reports.length}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon orange">
              ⏳
            </div>

            <div>
              <p>Pending</p>
              <h2>{pendingCount}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon blue">
              🔄
            </div>

            <div>
              <p>In Progress</p>
              <h2>{inProgressCount}</h2>
            </div>

          </div>

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <p>Resolved</p>
              <h2>{resolvedCount}</h2>
            </div>

          </div>

        </section>

        {/* ACTION BANNER */}

        <section className="action-banner">

          <div>

            <p className="banner-label">
              HAVE A CAMPUS ISSUE?
            </p>

            <h2>
              Help make your campus better.
            </h2>

            <p>
              Report maintenance, Wi-Fi, water or
              other campus problems.
            </p>

          </div>

          <button
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            + Report an Issue
          </button>

        </section>

        {/* RECENT REPORTS */}

        <section className="reports-section">

          <div className="section-header">

            <div>

              <p className="small-heading">
                ACTIVITY
              </p>

              <h2>
                Recent Reports
              </h2>

            </div>

            <button
              className="view-button"
              onClick={fetchReports}
            >
              Refresh ↻
            </button>

          </div>

          {reports.length === 0 ? (

            <div className="empty-state">

              <div className="empty-icon">
                📋
              </div>

              <h3>
                No reports yet
              </h3>

              <p>
                Your submitted campus issues
                will appear here.
              </p>

              <button
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                Report your first issue
              </button>

            </div>

          ) : (

            <div className="report-list">

              {reports.map((report, index) => (

                <div
                  className="report-card"
                  key={report._id || index}
                >

                  <div className="report-main">

                    <div className="report-icon">

                      {report.category === "Wi-Fi"
                        ? "📶"
                        : report.category === "Water"
                        ? "💧"
                        : report.category === "Electrical"
                        ? "⚡"
                        : "🔧"}

                    </div>

                    <div>

                      <h3>
                        {report.description}
                      </h3>

                      <p>
                        {report.category} •{" "}
                        {report.location}
                      </p>

                    </div>

                  </div>

                  <div className="report-right">

                    <span
                      className={`status ${
                        report.status
                          ?.toLowerCase()
                          .replace(" ", "-")
                      }`}
                    >
                      {report.status}
                    </span>

                    <span className="priority">
                      {report.priority}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

      {/* REPORT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="report-form">

            <button
              className="close-button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>

            <p className="small-heading">
              CAMPUSFIX
            </p>

            <h2>
              Report a Campus Issue
            </h2>

            <p className="form-description">
              Tell us about the problem and we'll
              help get it resolved.
            </p>

            <form onSubmit={handleSubmit}>

              <label>
                Issue Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a category
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

                <option value="Wi-Fi">
                  Wi-Fi & Network
                </option>

                <option value="Water">
                  Water & Sanitation
                </option>

                <option value="Electrical">
                  Electrical
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Example: Classroom 204"
                value={formData.location}
                onChange={handleChange}
                required
              />

              <label>
                Description
              </label>

              <textarea
                name="description"
                placeholder="Describe the problem..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />

              <label>
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

              <div className="form-buttons">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="submit-button"
                >
                  Submit Report
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;