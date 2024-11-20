import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import useTable from "layouts/pending-registration-school/data"; 
// import FileDialog from "./fileDialog"; 

const PendingSchool = () => {

//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const onFileSelect = (file) => {
//     setSelectedFile(file);
//     setOpenDialog(true);
//   };

//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setSelectedFile(null);
//   };

// const { columns, rows } = useTable({onFileSelect}); 
const { columns, rows } = useTable(); 

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Inscriptions en Attente
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  onRowClick={onFileSelect} 
                />
              </MDBox>
            </Card> 
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {selectedFile && (
        <FileDialog
          open={openDialog}
          onClose={handleCloseDialog}
          file={selectedFile}
        />
      )}
    </DashboardLayout>
  );
};

export default PendingSchool;
