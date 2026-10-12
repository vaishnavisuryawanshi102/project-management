import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import ProjectDetails from "./components/ProjectDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />

                <Route
                    path="/projects/:id"
                    element={<ProjectDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;