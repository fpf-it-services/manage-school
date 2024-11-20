import React, { useState, useEffect, useCallback } from "react";
import { Grid, Card, Select, MenuItem, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import { useNavigate } from "react-router-dom";
import { getSchoolsAndStudents, getAcademicYears, postPaymentData } from "./data";
import { useKKiaPay } from "kkiapay-react";

function Payment() {
  const [schoolsData, setSchoolsData] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedFee, setSelectedFee] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } = useKKiaPay();

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

  const successHandler = useCallback(
    (response) => {
      if (
        postPaymentData({
          email: email,
          eleve_id: selectedStudent,
          type_frais: selectedFee,
          ecole_id: selectedSchool,
          annee_id: selectedYear,
          classe_id: selectedClass,
          montant: amount,
          reference: response.transactionId,
        })
      ) {
        resetForm();
        navigate("/public/voir-historique");
      }
    },
    [
      email,
      amount,
      selectedStudent,
      selectedFee,
      selectedSchool,
      selectedYear,
      selectedClass,
      navigate,
    ]
  );

  const failureHandler = useCallback((error) => {
    console.log(error);
  }, []);

  useEffect(() => {
    addKkiapayListener("success", successHandler);
    addKkiapayListener("failed", failureHandler);

    return () => {
      removeKkiapayListener("success", successHandler);
      removeKkiapayListener("failed", failureHandler);
    };
  }, [addKkiapayListener, removeKkiapayListener, successHandler, failureHandler]);

  useEffect(() => {
    const fetchSchools = async () => {
      const response = await getSchoolsAndStudents();
      setSchoolsData(response);
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      const selectedSchoolData = schoolsData.find((school) => school.ecole_id === selectedSchool);
      if (selectedSchoolData) {
        setAcademicYears(selectedSchoolData.annees);
      }
      setSelectedYear("");
      setClasses([]);
      setStudents([]);
    }
  }, [selectedSchool, schoolsData]);

  useEffect(() => {
    if (selectedYear) {
      const selectedSchoolData = schoolsData.find((school) => school.ecole_id === selectedSchool);
      if (selectedSchoolData) {
        const yearData = selectedSchoolData.annees.find((year) => year.annee_id === selectedYear);
        if (yearData) {
          setClasses(yearData.classes);
        }
      }
      setSelectedClass("");
      setStudents([]);
    }
  }, [selectedYear, selectedSchool, schoolsData]);

  useEffect(() => {
    if (selectedClass) {
      const selectedSchoolData = schoolsData.find((school) => school.ecole_id === selectedSchool);
      if (selectedSchoolData) {
        const yearData = selectedSchoolData.annees.find((year) => year.annee_id === selectedYear);
        if (yearData) {
          const classData = yearData.classes.find(
            (classItem) => classItem.classe_id === selectedClass
          );
          if (classData) {
            setStudents(classData.eleves);
          }
        }
      }
    }
  }, [selectedClass, selectedYear, selectedSchool, schoolsData]);

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

  const handle = (e) => {
    setSelectedSchool(e.target.value);
  };

  return (
    <Card>
      <MDBox p={6}>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mt={-9}
          p={2}
          mb={5}
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Payer les frais
          </MDTypography>
        </MDBox>
        <MDBox component="form" onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedSchool || ""}
                  onChange={(e) => handle(e)}
                  variant="outlined"
                  error={!!errors.school}
                  helperText={errors.school}
                  style={{ borderRadius: "8px", height: "40px" }}
                >
                  {schoolsData.map((school) => (
                    <MenuItem key={school.ecole_id} value={school.ecole_id}>
                      {school.nom}
                    </MenuItem>
                  ))}
                </Select>
              </MDBox>

              {selectedSchool && (
                <MDBox mb={2} textAlign="left">
                  <MDTypography variant="caption" fontWeight="bold" color="textSecondary" mb={1}>
                    Année académique
                  </MDTypography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedYear || ""}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    variant="outlined"
                    error={!!errors.year}
                    helperText={errors.year}
                    style={{ borderRadius: "8px", height: "40px" }}
                  >
                    {academicYears.map((year) => (
                      <MenuItem key={year.annee_id} value={year.annee_id}>
                        {year.annee_academique}
                      </MenuItem>
                    ))}
                  </Select>
                </MDBox>
              )}

              {selectedYear && (
                <MDBox mb={2} textAlign="left">
                  <MDTypography variant="caption" fontWeight="bold" color="textSecondary" mb={1}>
                    Classe
                  </MDTypography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedClass || ""}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    variant="outlined"
                    error={!!errors.class}
                    helperText={errors.class}
                    style={{ borderRadius: "8px", height: "40px" }}
                  >
                    {classes.map((classItem) => (
                      <MenuItem key={classItem.classe_id} value={classItem.classe_id}>
                        {classItem.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </MDBox>
              )}
              {selectedClass && (
                <MDBox mb={2} textAlign="left">
                  <MDTypography variant="caption" fontWeight="bold" color="textSecondary" mb={1}>
                    Élève
                  </MDTypography>
                  <Select
                    fullWidth
                    displayEmpty
                    value={selectedStudent || ""}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    variant="outlined"
                    error={!!errors.student}
                    helperText={errors.student}
                    style={{ borderRadius: "8px", height: "40px" }}
                  >
                    {students.map((student) => (
                      <MenuItem key={student.eleve_id} value={student.eleve_id}>
                        {`${student.nom} ${student.prenom}`}
                      </MenuItem>
                    ))}
                  </Select>
                </MDBox>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Email"
                  fullWidth
                  name="nationalite"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </MDBox>

              <MDBox mb={2}>
                <Select
                  fullWidth
                  displayEmpty
                  value={selectedFee}
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

              <MDBox mb={2}>
                <MDInput
                  type="number"
                  label="Montant"
                  fullWidth
                  name="sexe"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                />
              </MDBox>
              <MDBox display="flex" justifyContent="flex-end">
                <Button variant="text" color="primary" onClick={open}>
                  Payer
                </Button>
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default Payment;
