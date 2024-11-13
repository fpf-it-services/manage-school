import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { getSchoolsAndStudents, getTransactionHistory } from "./data";
import { Box, Grid, Card, Select, MenuItem, TextField, CircularProgress, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow, Paper, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="next page">
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="last page">
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// Main Component
export default function Historique() {
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSchoolsAndStudents() {
      try {
        const data = await getSchoolsAndStudents();
        setSchools(data);
      } catch (err) {
        setError("Erreur de chargement des écoles et élèves");
      }
    }
    fetchSchoolsAndStudents();
  }, []);

  const handleSchoolSelect = (schoolId) => {
    setSelectedSchool(schoolId);
    setSelectedStudent(null);
    const selectedSchoolData = schools.find((school) => school.id === schoolId);
    setFilteredStudents(selectedSchoolData ? selectedSchoolData.eleves : []);
    setTransactions([]);
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (query) {
      const results = filteredStudents.filter((student) =>
        student.nom.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(results);
    } else {
      setFilteredStudents(selectedSchool ? selectedSchool.eleves : []);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setSearchTerm(`${student.nom} ${student.prenoms}`);
    setIsLoading(true);
    try {
      const historyData = await getTransactionHistory(student.id);
      setTransactions(historyData);
    } catch (err) {
      setError("Erreur de chargement des transactions");
    }
    setIsLoading(false);
  };

  const calculateTotalPaid = () => {
    return transactions.reduce((total, transaction) => total + transaction.montant, 0);
  };

  const calculateRemainingAmount = () => {
    const totalPaid = calculateTotalPaid();
    const totalDue = transactions.reduce((total, transaction) => total + transaction.total_frais, 0);
    return totalDue - totalPaid;
  };

  return (
    <BasicLayoutLanding image={bgImage}>
      <Card
        style={{
          backgroundColor: "white",
          maxWidth: "900px",
          width: "80vw",
          marginLeft: "-60%",
          marginRight: "auto",
          height: "100%",
          borderRadius: "20px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-1}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Historique de transactions
          </MDTypography>
        </MDBox>
        <Grid container>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: { xs: 2, md: 4 },
            }}
          >
            <MDBox display="flex" flexDirection="column" width="100%" maxWidth="500px">
              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Sélectionnez une école
                </MDTypography>
                <Select
                  fullWidth
                  value={selectedSchool || ""}
                  style={{ borderRadius: "8px", height: "35px" }}
                  onChange={(e) => handleSchoolSelect(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Choisir une école</MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.nom}
                    </MenuItem>
                  ))}
                </Select>
              </MDBox>
              {selectedSchool && (
                <MDBox mb={2} textAlign="left">
                  <MDTypography variant="body2" color="textSecondary" mb={1}>
                    Rechercher un élève
                  </MDTypography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Tapez le nom d'un élève"
                    style={{ borderRadius: "8px", height: "35px" }}
                  />
                  {filteredStudents.length > 0 && (
                    <MDBox mt={1} style={{ maxHeight: "150px", overflowY: "auto" }}>
                      {filteredStudents.map((student) => (
                        <MenuItem
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          style={{ cursor: "pointer" }}
                        >
                          {`${student.nom} ${student.prenoms}`}
                        </MenuItem>
                      ))}
                    </MDBox>
                  )}
                </MDBox>
              )}
              {selectedStudent && (
                <>
                  <MDTypography variant="h5" fontWeight="bold" textAlign="left" mb={2}>
                    Transactions de {`${selectedStudent.nom} ${selectedStudent.prenoms}`}
                  </MDTypography>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 500, fontSize: "10px" }} aria-label="custom pagination table">
                        <TableBody>
                          {transactions.map((transaction, index) => (
                            <TableRow key={index}>
                              <TableCell>{transaction.numero}</TableCell>
                              <TableCell align="right">{transaction.montant}</TableCell>
                              <TableCell align="right">{transaction.type_frais}</TableCell>
                              <TableCell align="right">{transaction.date}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                              count={transactions.length}
                              rowsPerPage={5}
                              page={0}
                              onPageChange={() => {}}
                              ActionsComponent={TablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  )}
                  <MDBox display="flex" justifyContent="space-between" mt={2}>
                    <MDTypography variant="h6" fontWeight="bold">Total payé :</MDTypography>
                    <MDTypography variant="h6" fontWeight="bold">{calculateTotalPaid()}</MDTypography>
                  </MDBox>
                  <MDBox display="flex" justifyContent="space-between" mt={2}>
                    <MDTypography variant="h6" fontWeight="bold">Montant restant :</MDTypography>
                    <MDTypography variant="h6" fontWeight="bold">{calculateRemainingAmount()}</MDTypography>
                  </MDBox>
                </>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </BasicLayoutLanding>
  );
}
