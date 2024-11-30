import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { getAcademicYears, getClassesAndTransactionByYear, getClasses } from "./data";
import { CircularProgress } from "@mui/material";

const TransactionHistory = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      const response = await getAcademicYears();
      setAcademicYears(response);
    };
    fetchAcademicYears();
  }, []);

  const handleYearChange = async (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    setFilter("");
    setLoading(true);
  
    try {
      const responseClasses = await getClasses(newYear);
      setClasses(responseClasses);
      if (selectedClass) {
        const responseTransactions = await getClassesAndTransactionByYear(newYear, selectedClass);
        setData(responseTransactions);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleClassChange = async (event) => {
    setSelectedClass(event.target.value);
    setFilter("");
    setLoading(true);

    try {
      const response = await getClassesAndTransactionByYear(selectedYear, event.target.value);
      setData(response);
      console.log(response)
    } catch (error) {
      console.error("Erreur lors de la récupération des transactions :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredData = data.filter((item) => item.eleve.toLowerCase().includes(filter));

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
                  Historique des Transactions
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      value={selectedYear}
                      onChange={handleYearChange}
                      displayEmpty
                      variant="outlined"
                      style={{ borderRadius: "6px", height: "43px" }}
                    >
                      <MenuItem value="" disabled>
                        Sélectionnez une année académique
                      </MenuItem>
                      {academicYears.map((year) => (
                        <MenuItem key={year.id} value={year.id}>
                          {year.annee_academique}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Select
                      fullWidth
                      value={selectedClass}
                      onChange={handleClassChange}
                      displayEmpty
                      variant="outlined"
                      disabled={!academicYears.length}
                      style={{ borderRadius: "6px", height: "43px" }}
                    >
                      <MenuItem value="" disabled>
                        Sélectionnez une classe
                      </MenuItem>
                      {classes.map((classe) => (
                        <MenuItem key={classe.id} value={classe.id}>
                          {classe.nom}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      value={filter}
                      onChange={handleFilterChange}
                      label="Rechercher un élève"
                      variant="outlined"
                      disabled={!classes.length}
                    />
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox pt={3}>
                {loading ? (
                  <CircularProgress size={25} color="inherit" />
                ) : (
                  <DataTable
                    table={{
                      columns: [
                        { Header: "N°", accessor: "index", align: "left" },
                        { Header: "Référence", accessor: "ref", align: "left" },
                        { Header: "Nom et Prénoms", accessor: "eleve", align: "center" },
                        { Header: "Montant Payé", accessor: "montant_paye", align: "center" },
                        { Header: "Payeur", accessor: "payeur", align: "center" },
                        { Header: "Date", accessor: "date", align: "center" },
                        { Header: "Observations", accessor: "reste", align: "center" },
                        { Header: "Reçu", accessor: "recu", align: "center" }, 
                      ],
                      rows: filteredData.map((item, index) => ({
                        index: index + 1,
                        ref: item.ref,
                        eleve: item.eleve,
                        montant_paye: `${item.montant_paye} (${item.type.split("_")[1]?.charAt(0).toUpperCase() + item.type.split("_")[1]?.slice(1)})`,
                        payeur: item.payeur,
                        date: item.date,
                        reste: item.reste === 0 ? "Soldé" : `Reste ${" "}${item.reste}`,
                        recu: (
                          <MDButton variant="text" color="primary">
                            <a
                              href={item.recu_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              
                            >
                              Voir
                            </a>
                          </MDButton>
                        ),
                      })),
                    }}
                    isSorted={false}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default TransactionHistory;
