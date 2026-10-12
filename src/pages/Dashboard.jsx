import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAllProjects, createProject, updateProject, updateStatus, deleteProject, } from "../API/projectapi";

import ProjectModel from "../components/ProjectModel.jsx";
//import { createProject } from "../API/projectapi";
import "./Dashboard.css";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch all projects
    async function fetchAllData() {
        try {
            setLoading(true);
            const data = await getAllProjects();
            setProjects(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching projects:", error);
            alert("Unable to load projects.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    // Change selected status
    function handleChange(id, value) {
        setSelectedStatus((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    // Update status in the dashboard
    // Note: This updates local state only.
    // Connect your backend update API to save it permanently.
    function handleStatusUpdate(id) {
        const newStatus = selectedStatus[id];

        if (!newStatus) {
            alert("Please select a status first.");
            return;
        }

        setProjects((prev) =>
            prev.map((p) => {
                const projectId = p.id ?? p._id;

                return String(projectId) === String(id)
                    ? { ...p, status: newStatus }
                    : p;
            })
        );

        setSelectedStatus((prev) => {
            const updated = { ...prev };
            delete updated[id];
            return updated;
        });

        alert("Status updated in the dashboard!");
    }

    // Delete project
    async function handleDelete(id) {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this project?"
        );

        if (!confirmDelete) return;

        try {
            await deleteProject(id);

            setProjects((prev) =>
                prev.filter((p) => {
                    const projectId = p.id ?? p._id;
                    return String(projectId) !== String(id);
                })
            );

            alert("Project deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Unable to delete project.");
        }
    }

    // Unique departments
    const departments = [
        ...new Set(
            projects
                .map((p) => p.Department || p.department)
                .filter(Boolean)
        ),
    ];

    // Search and filters
    const filteredProjects = projects.filter((p) => {
        const name = String(p.ProjectName || p.projectName || "");
        const projectStatus = String(p.status || p.Status || "Pending");
        const priority = String(p.Priority || p.priority || "");
        const department = String(p.Department || p.department || "");

        const matchesSearch = name
            .toLowerCase()
            .includes(search.trim().toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            projectStatus.toLowerCase() === statusFilter.toLowerCase();

        const matchesPriority =
            priorityFilter === "All" ||
            priority.toLowerCase() === priorityFilter.toLowerCase();

        const matchesDepartment =
            departmentFilter === "All" ||
            department.toLowerCase() === departmentFilter.toLowerCase();

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesDepartment
        );
    });

    return (
        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Project Dashboard</h1>
                    <p>Manage and track all your projects.</p>
                </div>

                <button
                    type="button"
                    className="add-project-btn"
                    onClick={() => setModalOpen(true)}
                >
                    + Add New Project
                </button>
            </div>

            {/* Search and Filters */}
            <div className="search-filter">
                <input
                    type="search"
                    placeholder="Search project name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                    <option value="All">All Departments</option>
                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="In-progress">In-progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                >
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
            </div>

            {/* Projects Table */}
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Project Name</th>
                            <th>Department</th>
                            <th>Priority</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8">Loading projects...</td>
                            </tr>
                        ) : filteredProjects.length === 0 ? (
                            <tr>
                                <td colSpan="8">No projects found.</td>
                            </tr>
                        ) : (
                            filteredProjects.map((p, i) => {
                                const id = p.id ?? p._id;
                                const currentStatus =
                                    p.status || p.Status || "Pending";

                                return (
                                    <tr key={id ?? i}>
                                        <td>{i + 1}</td>

                                        <td>
                                            {p.ProjectName || p.projectName || "—"}
                                        </td>

                                        <td>
                                            {p.Department || p.department || "—"}
                                        </td>

                                        <td>
                                            {p.Priority || p.priority || "—"}
                                        </td>

                                        <td>
                                            {p.startDate || p.StartDate || "—"}
                                        </td>

                                        <td>
                                            {p.endDate || p.EndDate || p.Enddate || "—"}
                                        </td>

                                        <td>
                                            <div className="status-actions">
                                                <select
                                                    value={
                                                        selectedStatus[id] ??
                                                        currentStatus
                                                    }
                                                    onChange={(e) =>
                                                        handleChange(
                                                            id,
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="Pending">
                                                        Pending
                                                    </option>
                                                    <option value="In-progress">
                                                        In-progress
                                                    </option>
                                                    <option value="Completed">
                                                        Completed
                                                    </option>
                                                </select>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        !selectedStatus[id] ||
                                                        selectedStatus[id] === currentStatus
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(id)
                                                    }
                                                >
                                                    Update Status
                                                </button>
                                            </div>
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="delete-btn"
                                                onClick={() => handleDelete(id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <p className="project-count">
                Showing {filteredProjects.length} of {projects.length} projects
            </p>

            {/* Add New Project Modal */}
            <ProjectModel
                open={modalOpen}
                project={null}
                saving={saving}
                onClose={() => setModalOpen(false)}
                onSave={async (formData) => {
                    try {
                        setSaving(true);

                        await createProject(formData);

                        const data = await getAllProjects();
                        setProjects(Array.isArray(data) ? data : []);

                        setModalOpen(false);
                    } catch (error) {
                        console.error(
                            "Project creation failed:",
                            error
                        );
                        throw error;
                    } finally {
                        setSaving(false);
                    }
                }}
            />
        </div>
    );
};

export default Dashboard;
