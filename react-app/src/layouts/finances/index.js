import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import useFinanceTable from "layouts/finances/data"; // Assurez-vous que ce chemin est correct
import FinanceDialog from "./financeDialog"; 

const Finances = () => {
  const onFinanceSelect = (finance) => {
    setSelectedFinance(finance);
    setOpenDialog(true);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFinance(null);
  };
  const { columns, rows } = useFinanceTable({onFinanceSelect}); 


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
                  Mes Finances
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                  onRowClick={onFinanceSelect} 
                />
              </MDBox>
            </Card> 
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {selectedFinance && (
        <FinanceDialog
          open={openDialog}
          onClose={handleCloseDialog}
          finance={selectedFinance}
        />
      )}
    </DashboardLayout>
  );
};

export default Finances;
