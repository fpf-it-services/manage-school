import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Card, Select, MenuItem, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BasicLayoutLanding from "layouts/authentication/components/BasicLayoutLanding";
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { getSchoolsAndStudents, getAcademicYears, postPaymentData } from "./data";
import { useKKiaPay } from 'kkiapay-react';

function Paiement() {
  const [students, setStudents] = useState([]);
  const [schools, setSchools] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedFee, setSelectedFee] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [email, setEmail] = useState(""); 
  const [amount, setAmount] = useState(""); 
  const [errors, setErrors] = useState({}); 
  const navigate = useNavigate();
  const { 
    openKkiapayWidget,
    addKkiapayListener,
    removeKkiapayListener
  } = useKKiaPay();

  useEffect(() => {
    async function fetchData() {
      const schoolsData = await getSchoolsAndStudents();
      const yearsData = await getAcademicYears();

      setSchools(schoolsData);
      setAcademicYears(yearsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    addKkiapayListener('success',successHandler)
    addKkiapayListener('failed', failureHandler)
    
    return () => {
      removeKkiapayListener('success',successHandler)
      removeKkiapayListener('failed', failureHandler)
    };
  }, [addKkiapayListener,removeKkiapayListener]);

  function successHandler(response) {
    // console.log(response);
    postPaymentData({
      email,
      selectedStudent,
      selectedFee,
      selectedSchool,
      selectedYear,
      selectedClass,
      amount
    });
    resetForm();
    navigate("/public/historique");
  }
  
  function failureHandler(error) {
    console.log(error);
  }

  const resetForm = () => {
    setEmail("");
    setSelectedStudent("");
    setSelectedFee("");
    setSelectedSchool(null);
    setSelectedYear("");
    setSelectedClass("");
    setAmount("");
    setErrors({});
  };

  const feesList = [
    { name: "Frais de formation", id: "frais_formation" },
    { name: "Frais de réinscription", id: "frais_reinscription" },
    { name: "Frais d'inscription", id: "frais_inscription" },
    { name: "Frais annexes", id: "frais_annexe" },
  ];


  const validateFields = () => {
    const newErrors = {};

    if (!email) newErrors.email = "L'adresse email est requise";
    if (!selectedStudent) newErrors.student = "Sélectionnez un élève";
    if (!selectedSchool) newErrors.school = "Sélectionnez une école";
    if (!selectedClass) newErrors.class = "Sélectionnez une classe";
    if (!selectedFee) newErrors.fee = "Sélectionnez un type de frais";
    if (!amount) newErrors.amount = "Le montant est requis";
    if (!selectedYear) newErrors.year = "Sélectionnez une année académique";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const open = () => {
    if (validateFields()) {
      openKkiapayWidget({
        amount: amount,
        api_key: "f11e39e0652511efbf02478c5adba4b8",
        sandbox: true,
        email,
        phone: "97000000",
      });
    }
  };
  const handleSearchStudents = async (query) => {
    const studentData = students.find((student) => student.id === query);
    setSearchTerm(studentData);
    setSelectedStudent(studentData)
  };

  const handleSchoolChange = async (schoolId) => {
    setSelectedSchool(schoolId);
    const selectedSchoolData = schools.find((school) => school.id === schoolId);
    if (selectedSchoolData) {
      setStudents(selectedSchoolData.eleves || []);
      setClasses(selectedSchoolData.classes || []);
    } else {
      setClasses([]);
      setStudents([]);
    }
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
            Paiement de frais
          </MDTypography>
        </MDBox>
        <Grid container spacing={3} padding={4}>
          {/* Partie gauche : Informations personnelles */}
          <Grid item xs={12} md={6}>
            <MDBox display="flex" flexDirection="column" width="100%" maxWidth="500px">
              <MDTypography variant="h4" fontWeight="bold" textAlign="left" mb={2}>
                Informations personnelles
              </MDTypography>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Adresse email
                </MDTypography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez l'email"
                  error={!!errors.email}
                  helperText={errors.email}
                  style={{ borderRadius: "8px", height: "40px" }}
                />
              </MDBox>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Rechercher un élève
                </MDTypography>
                <Select
                  fullWidth
                  onChange={(e) => handleSearchStudents(e.target.value)}
                  displayEmpty
                  defaultValue=""
                  variant="outlined"
                  error={!!errors.student}
                  helperText={errors.student}
                  style={{ borderRadius: "8px", height: "40px" }}
                >
                  {students.length > 0 ? (
                    students.map((student) => (
                      <MenuItem key={student.id} value={student.id}>
                        {`${student.nom} ${student.prenoms}`}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>Aucun élève trouvé</MenuItem>
                  )}
                </Select>
              </MDBox>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  École
                </MDTypography>
                <Select
                  fullWidth
                  displayEmpty
                  defaultValue=""
                  onChange={(e) => handleSchoolChange(e.target.value)}
                  variant="outlined"
                  error={!!errors.school}
                  helperText={errors.school}
                  style={{ borderRadius: "8px", height: "40px" }}
                >
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
                    Classe
                  </MDTypography>
                  <Select
                    fullWidth
                    displayEmpty
                    defaultValue=""
                    onChange={(e) => setSelectedClass(e.target.value)}
                    variant="outlined"
                    error={!!errors.class}
                    helperText={errors.class}
                    style={{ borderRadius: "8px", height: "40px" }}
                  >
                    {classes.map((classItem) => (
                      <MenuItem key={classItem.id} value={classItem.id}>
                        {classItem.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </MDBox>
              )}
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6}>
            <MDBox display="flex" flexDirection="column" width="100%" maxWidth="500px">
              <MDTypography variant="h4" fontWeight="bold" textAlign="left" mb={2}>
                Détails du paiement
              </MDTypography>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Type de frais
                </MDTypography>
                <Select
                  fullWidth
                  displayEmpty
                  defaultValue=""
                  onChange={(e) => setSelectedFee(e.target.value)}
                  variant="outlined"
                  error={!!errors.fee}
                  helperText={errors.fee}
                  style={{ borderRadius: "8px", height: "40px" }}
                >
                  {feesList.map((fee) => (
                    <MenuItem key={fee.id} value={fee.id}>
                      {fee.name}
                    </MenuItem>
                  ))}
                </Select>
              </MDBox>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Année académique
                </MDTypography>
                <Select
                  fullWidth
                  displayEmpty
                  defaultValue=""
                  onChange={(e) => setSelectedYear(e.target.value)}
                  variant="outlined"
                  error={!!errors.year}
                  helperText={errors.year}
                  style={{ borderRadius: "8px", height: "40px" }}
                >
                  {academicYears.map((year) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.annee_academique}
                    </MenuItem>
                  ))}
                </Select>
              </MDBox>

              <MDBox mb={2} textAlign="left">
                <MDTypography variant="body2" color="textSecondary" mb={1}>
                  Montant
                </MDTypography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Entrez le montant"
                  error={!!errors.amount}
                  helperText={errors.amount}
                  style={{ borderRadius: "8px", height: "40px" }}
                />
              </MDBox>

              <MDBox textAlign="center" mt={3}>
                <Button onClick={open} variant="text" color="primary">
                  Payer
                </Button>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </BasicLayoutLanding>
  );
}

export default Paiement;
