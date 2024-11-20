import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { getAcademicYears, getClassesAndTransactionByYear } from "./data";
import { CircularProgress } from "@mui/material";

const TransactionHistory = () => {
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
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
    setSelectedYear(event.target.value);
    setFilter(""); 
    setLoading(true);

    try {
      const response = await getClassesAndTransactionByYear(event.target.value);
      setClasses(response); 
    } catch (error) {
      console.error("Erreur lors de la récupération des classes :", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value.toLowerCase());
  };

  const filteredClasses = classes.map((classe) => ({
    ...classe,
    students: classe.students.filter((student) =>
      student.nom.toLowerCase().includes(filter) || student.prenoms.toLowerCase().includes(filter)
    ),
  }));

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
                  <Grid item xs={12} md={6}>
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
                  <Grid item xs={12} md={6}>
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
                  filteredClasses.map((classe) => (
                    <Accordion key={classe.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel-${classe.id}-content`}
                        id={`panel-${classe.id}-header`}
                      >
                        <MDTypography variant="h6">{classe.name}</MDTypography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <DataTable
                          table={{
                            columns: [
                              { Header: "N°", accessor: "index", align: "left" },
                              { Header: "Nom et Prénoms", accessor: "name", align: "center" },
                              { Header: "Référence", accessor: "reference", align: "center" },
                              { Header: "Montant Payé", accessor: "amount_paid", align: "center" },
                              { Header: "Payeur", accessor: "mail", align: "center" },
                              { Header: "Date", accessor: "date", align: "center" },
                              { Header: "Observations", accessor: "observation", align: "center" },
                            ],
                            rows: classe.students.map((student, idx) => ({
                              index: idx + 1,
                              name: `${student.nom} ${student.prenoms}`,
                              reference: student.reference,
                              amount_paid: student.montant,
                              mail: student.email,
                              date: student.date, // Assurez-vous que 'date' est présent dans vos données
                              observation: student.remainingAmount === 0 ? "Soldé" : student.remainingAmount,
                            })),
                          }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))
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


