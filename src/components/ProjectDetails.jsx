import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllProjects } from "../API/projectAPI";
import "./ProjectDetails.css";

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadProject() {
            try {
                setLoading(true);
                setError("");

                const projects = await getAllProjects();

                const found = projects.find((item) => {
                    const projectId = item.id ?? item._id;
                    return (
                        projectId != null &&
                        String(projectId) === String(id)
                    );
                });

                if (active) {
                    setProject(found ?? null);
                }
            } catch (err) {
                console.error("Unable to load project details:", err);

                if (active) {
                    setError("Unable to load project details.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadProject();

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return (
            <main className="project-details-page">
                <p className="details-message">Loading project details...</p>
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="project-details-page">
                <Link to="/" className="back-link">
                    &larr; Back to Dashboard
                </Link>

                <div className="details-not-found">
                    <h2>{error ? "Something went wrong" : "Project not found"}</h2>
                    <p>
                        {error ||
                            "This project may have been deleted or the link is invalid."}
                    </p>
                    {error && (
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </main>
        );
    }

    const name = project.ProjectName ?? project.projectName ?? "—";
    const department = project.Department ?? project.department ?? "—";
    const priority = project.Priority ?? project.priority ?? "—";
    const status = project.status ?? project.Status ?? "Pending";

    const startDate =
        project.startDate ?? project.StartDate ?? "—";

    const endDate =
        project.endDate ??
        project.EndDate ??
        project.Enddate ??
        "—";

    const description =
        project.description ?? project.Description ?? "";

    const budget = project.budget ?? project.Budget;

    const manager =
        project.projectManager ??
        project.ProjectManager ??
        project.manager ??
        project.Manager ??
        "";

    const members =
        project.teamMembers ?? project.TeamMembers ?? [];

    return (
        <main className="project-details-page">
            <Link to="/" className="back-link">
                &larr; Back to Dashboard
            </Link>

            <header className="details-header">
                <div>
                    <span className="details-eyebrow">PROJECT OVERVIEW</span>
                    <h1>{name}</h1>
                    <p>View all information about this project.</p>
                </div>

                <span
                    className={`details-status status-${String(
                        status
                    ).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                >
                    {status}
                </span>
            </header>

            <section className="details-card">
                <h2>Project Information</h2>

                <div className="details-grid">
                    <div className="detail-item">
                        <span>Project Name</span>
                        <strong>{name}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Department</span>
                        <strong>{department}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Priority</span>
                        <strong>{priority}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Status</span>
                        <strong>{status}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Start Date</span>
                        <strong>{startDate || "—"}</strong>
                    </div>

                    <div className="detail-item">
                        <span>End Date</span>
                        <strong>{endDate || "—"}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Project Manager</span>
                        <strong>{manager || "—"}</strong>
                    </div>

                    <div className="detail-item">
                        <span>Budget</span>
                        <strong>
                            {budget !== undefined &&
                            budget !== null &&
                            budget !== ""
                                ? Number.isFinite(Number(budget))
                                    ? Number(budget).toLocaleString("en-IN", {
                                          maximumFractionDigits: 2,
                                      })
                                    : String(budget)
                                : "—"}
                        </strong>
                    </div>
                </div>
            </section>

            <section className="details-card">
                <h2>Project Description</h2>
                <p className="project-description">
                    {description || "No description has been added yet."}
                </p>
            </section>

            <section className="details-card">
                <h2>Team Members</h2>

                {Array.isArray(members) && members.length > 0 ? (
                    <ul className="team-members-list">
                        {members.map((member, index) => (
                            <li key={member.id ?? member._id ?? index}>
                                {typeof member === "string"
                                    ? member
                                    : member.name ??
                                      member.fullName ??
                                      member.email ??
                                      `Team Member ${index + 1}`}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="project-description">
                        No team members have been added.
                    </p>
                )}
            </section>
        </main>
    );
}
