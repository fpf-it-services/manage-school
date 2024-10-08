import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import FormSchool from "./form";
import UploadStudentExcel from "./fromExcel"; 
import MDButton from "components/MDButton";

const AddStudent = () => {
  const [view, setView] = useState("form"); 

  const handleViewChange = (selectedView) => {
    setView(selectedView);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <MDBox display="flex" justifyContent="center" mb={6}>
              <MDButton
                variant={view === "form" ? "contained" : "outlined"}
                color="info"
                onClick={() => handleViewChange("form")}
                style={{ marginRight: "10px" }}
              >
                Formulaire
              </MDButton>
              <MDButton
                variant={view === "excel" ? "contained" : "outlined"}
                color="info"
                onClick={() => handleViewChange("excel")}
              >
                Import Excel
              </MDButton>
            </MDBox>
            {view === "form" ? <FormSchool /> : <UploadStudentExcel />}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default AddStudent;
