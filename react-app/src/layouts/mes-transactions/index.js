import React, { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import { Tab, Tabs, Card, Grid, Box } from "@mui/material";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { fetchChildrens } from "./data";
import useTransactionTable from "./useTransactionTable";

const MesTransactions = () => {
  const [activeTab, setActiveTab] = useState(null); 
  const [childrenData, setChildrenData] = useState([]);
  const tableData = useTransactionTable(activeTab); 

  useEffect(() => {
    const getChilds = async () => {
      try {
        const response = await fetchChildrens();
        if (response) {
          const { acceptes = [], inscrits = [] } = response;
          const childrenArray = [...inscrits];
          setChildrenData(childrenArray);

          if (childrenArray.length > 0) {
            setActiveTab(childrenArray[0].id);
          }
        } else {
          console.error("Données manquantes dans la réponse.");
          setChildrenData([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des enfants :", error);
        setChildrenData([]);
      }
    };

    getChilds();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
                <Box sx={{ borderBottom: 1, borderColor: "divider", overflowX: "auto" }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                  >
                    {childrenData.map((child) => (
                      <Tab
                        key={child.id}
                        value={child.id}
                        label={`${child.nom} ${child.prenoms}`}
                        sx={{ fontSize: "0.8rem" }}
                      />
                    ))}
                  </Tabs>
                </Box>

                <DataTable
                  table={{ columns: tableData.columns, rows: tableData.rows }}
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

