import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { Tab, Tabs, Card, Grid, Box } from "@mui/material";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

import { useTransactionTable, fetchChildrens } from "./data";

const MesTransactions = () => {
  // const { columns, rows } = useTransactionTable();

  // const childrenData = [
  //   { id: 1, name: "Jean Dupont" },
  //   { id: 2, name: "Claire Dupont" },
  // ];

  const [activeTab, setActiveTab] = useState(0);
  const [variables, setVariables] = useState({})
  const [childrenData, setChildrenData] = useState([])

  const { columns, rows } = useTransactionTable();

  useEffect(async () => {
    try {
      const response = await fetchChildrens();
      console.log(response)
      if (response && response[0]) {
        const { acceptes = [], inscrits = [] } = response[0];
        const childrenArray = [...inscrits];
        console.log(childrenArray)
        setChildrenData(childrenArray);
      } else {
        console.error("Données manquantes dans la réponse.");
        setChildrenData([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des enfants :", error);
      setChildrenData([]);
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // 
    setVariables(useTransactionTable())
  };

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
                  Mes Transactions
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    {childrenData.map((child, index) => (
                      <Tab key={child.id} label={`${child.nom} ${child.prenoms}`} />
                    ))}
                  </Tabs>
                </Box>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default MesTransactions;
