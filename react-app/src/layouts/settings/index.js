import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import AcademicYearManagement from "./academicYearManagement";
import LevelManagement from "./levelManagement";
import SeriesManagement from "./seriesManagement";
import Divider  from '@mui/material/Divider';

const Settings = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox p={3}>
        <Card>
          <MDBox p={3}>
            {/* Gestion des Années Académiques */}
            <AcademicYearManagement />
            <Divider />
            {/* Gestion des Niveaux */}
            <LevelManagement />
            <Divider />
            {/* Gestion des Séries */}
            <SeriesManagement />
          </MDBox>
        </Card>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Settings;
