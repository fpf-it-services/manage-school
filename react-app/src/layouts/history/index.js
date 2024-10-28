import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { Grid, Card, Select, MenuItem, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";


// Assume the following functions fetch data from backend
import { getStudents, getTransactionHistory } from "./data";


function Historique() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the students list with associated schools from the backend
    async function fetchStudents() {
      const studentsData = await getStudents();
      setStudents(studentsData);
    }
    fetchStudents();
  }, []);

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (query) {
      const results = students.filter((student) =>
        student.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStudents(results);
    } else {
      setFilteredStudents([]);
    }
  };

  const handleStudentSelect = async (student) => {
    setSelectedStudent(student);
    setSearchTerm(student.name);

    // Fetch transaction history of the selected student
    const historyData = await getTransactionHistory(student.id);
    setTransactions(historyData);
  };

  const calculateTotalPaid = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const calculateRemainingAmount = () => {
    const totalPaid = calculateTotalPaid();
    const totalDue = transactions.reduce((total, transaction) => total + transaction.totalFee, 0);
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
          {/* Search Bar */}
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

              {/* Student Search */}
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
                {/* Display the student options */}
                {filteredStudents.length > 0 && (
                  <MDBox mt={1} style={{ maxHeight: "150px", overflowY: "auto" }}>
                    {filteredStudents.map((student) => (
                      <MenuItem
                        key={student.id}
                        onClick={() => handleStudentSelect(student)}
                        style={{ cursor: "pointer" }}
                      >
                        {student.name} ({student.school})
                      </MenuItem>
                    ))}
                  </MDBox>
                )}
              </MDBox>

              {/* Transaction History Table */}
              {selectedStudent && (
                <>
                  <MDTypography variant="h5" fontWeight="bold" textAlign="left" mb={2}>
                    Transactions de {selectedStudent.name} ({selectedStudent.school})
                  </MDTypography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Numéro de Transaction</TableCell>
                        <TableCell>Montant Payé</TableCell>
                        <TableCell>Type de Frais</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Heure</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.transactionNumber}</TableCell>
                          <TableCell>{transaction.amount} €</TableCell>
                          <TableCell>{transaction.feeType}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.time}</TableCell>
                        </TableRow>
                      ))}
                      {/* Total and Remaining Amount */}
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <strong>Total Payé:</strong>
                        </TableCell>
                        <TableCell>{calculateTotalPaid()} €</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={4} align="right">
                          <strong>Montant Restant:</strong>
                        </TableCell>
                        <TableCell>{calculateRemainingAmount()} €</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </>
              )}
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Historique;



