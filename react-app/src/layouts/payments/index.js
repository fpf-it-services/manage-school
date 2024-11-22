import React, { useState, useEffect, useCallback } from "react";
import { Grid, Card, Select, MenuItem, Button, TextField } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import { useNavigate, useLocation } from "react-router-dom";
import { getSchoolsAndStudents, getAcademicYears, postPaymentData, getMyChildrenRegistred } from "./data";
import { useKKiaPay } from "kkiapay-react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

const Payment = () => {
  const { state } = useLocation();
  const [child, setChild] = useState(state?.child);
  const [children, setChildren] = useState([]);
  // const [acceptes, setAcceptes] = useState([]);
  const [isFromMyChildren, setIsFromMyChildren] = useState(state?.isFromMyChildren);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedFee, setSelectedFee] = useState("");
  const [niveau, setNiveau] = useState("");
  const [amount, setAmount] = useState("");
  const [schoolsData, setSchoolsData] = useState([]);
  const [academicYears, setAcademicYears] = useState({});
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [errors, setErrors] = useState({});
  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } = useKKiaPay();

  const navigate = useNavigate();

  const resetForm = () => {
    setSelectedStudent("");
    setSelectedSchool("");
    setSelectedLevel("");
    setSelectedYear("");
    setSelectedClass("");
    setSelectedFee("");
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
    if (!selectedStudent) newErrors.student = "Sélectionnez un élève";
    if (!selectedSchool) newErrors.school = "Sélectionnez une école";
    // if (!selectedClass) newErrors.class = "Sélectionnez une classe";
    if (!selectedFee) newErrors.fee = "Sélectionnez un type de frais";
    if (!amount) newErrors.amount = "Le montant est requis";
    if (!selectedYear) newErrors.year = "Sélectionnez une année académique";


    console.log(newErrors)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const successHandler = useCallback(
    (response) => {
      console.log(selectedStudent, selectedFee, selectedYear, selectedSchool, niveau, amount) 
      if (true
        // postPaymentData({
        //   eleve_id: selectedStudent,
        //   type_frais: selectedFee,
        //   ecole_id: selectedSchool,
        //   annee_id: selectedYear,
        //   classe_id: niveau,
        //   montant: amount,
        //   reference: response.transactionId,
        // })
      ) {
        resetForm();
        navigate("/my-transactions");
      }
    },
    [amount, selectedStudent, selectedFee, selectedSchool, selectedYear, selectedClass, navigate]
  );

  const failureHandler = useCallback((error) => {
    console.log(error);
  }, []);

  useEffect(() => {
    if (state?.child) {
      setChild(state.child);
    }
    if (state?.isFromMyChildren) {
      setIsFromMyChildren(state.isFromMyChildren);
    }
  }, [state]);

  useEffect(() => {
    if (child) {
      setSelectedStudent(child.id);
      setSelectedSchool(child.ecole_id);
      setSelectedLevel(child.niveau);
      setNiveau(child.niveau_id)
      setSelectedFee("frais_inscription")
      setAmount(child.montant_inscription);
    }
  }, [child]);

  useEffect(() => {
    addKkiapayListener("success", successHandler);
    addKkiapayListener("failed", failureHandler);

    return () => {
      removeKkiapayListener("success", successHandler);
      removeKkiapayListener("failed", failureHandler);
    };
  }, [addKkiapayListener, removeKkiapayListener, successHandler, failureHandler]);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await getMyChildrenRegistred();
        if (response && response[0]) {
          const { acceptes = [], inscrits = [] } = response[0];
          const childrenArray = [...acceptes, ...inscrits];
          setChildren(childrenArray);
        } else {
          console.error("Données manquantes dans la réponse.");
          setChildren([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des enfants :", error);
        setChildren([]);
      }
    };

    const fetchSchools = async () => {
      const response = await getSchoolsAndStudents();
      setSchoolsData(response);
    };

    const fetchAcademicsYears = async () => {
      const response = await getAcademicYears();
      setAcademicYears(response);
      setSelectedYear(response.annee_academique);

    };

    fetchAcademicsYears();
    fetchChildren();
    fetchSchools();
  }, []);

  const handleStudentChange = (e) => {
    const selected = e.target.value;
    setSelectedStudent(selected);

    if (selected) {
      const student = students.find((s) => s.eleve_id === selected);
      if (student) {
        setSelectedSchool(student.school);
        setSelectedLevel(student.level);
        setSelectedYear(student.year);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateFields()) {
      openKkiapayWidget({
        amount,
        api_key: "f11e39e0652511efbf02478c5adba4b8",
        sandbox: true,
        phone: "97000000",
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
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
                      <MDBox mb={1} textAlign="left">
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          Élève
                        </MDTypography>
                        <Select
                          fullWidth
                          displayEmpty
                          value={selectedStudent}
                          onChange={handleStudentChange}
                          variant="outlined"
                          error={!!errors.student}
                          helperText={errors.student}
                          style={{ borderRadius: "8px", height: "40px" }}
                        >
                          {children.length !== 0 && children.map((chil) => (
                            <MenuItem key={chil.id} value={chil.id}>
                              {`${chil.nom} ${chil.prenoms}`}
                            </MenuItem>
                          ))}
                        </Select>
                      </MDBox>
                      <MDBox mb={1}>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          École
                        </MDTypography>
                        <Select
                          fullWidth
                          displayEmpty
                          value={selectedSchool || ""}
                          disabled={!selectedStudent}
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
                      <MDBox mb={1}>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          Année Academique
                        </MDTypography>
                        <MDInput
                          type="text"
                          label=""
                          fullWidth
                          disabled
                          value={academicYears.annee_academique}
                          variant="outlined"
                          error={!!errors.year}
                          helperText={errors.year}
                          style={{ borderRadius: "8px", height: "40px" }}
                        />
                      </MDBox>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <MDBox mb={1}>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          Frais
                        </MDTypography>
                        <Select
                          fullWidth
                          displayEmpty
                          value={selectedFee}
                          disabled={!selectedStudent}
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
                      <MDBox mb={1}>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          {isFromMyChildren ? "Niveau" : "Classe"}
                        </MDTypography>

                        {isFromMyChildren ? (
                          <MDInput
                            type="text"
                            label="Niveau"
                            fullWidth
                            value={selectedLevel || ""}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            error={!!errors.level}
                            helperText={errors.level}
                          />
                        ) : (
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
                        )}
                      </MDBox>
                      <MDBox mb={1}>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color="textSecondary"
                          mb={1}
                        >
                          Montant à payer
                        </MDTypography>
                        <MDInput
                          type="number"
                          label="Montant"
                          fullWidth
                          disabled={!selectedStudent}
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          error={!!errors.amount}
                          helperText={errors.amount}
                        />
                      </MDBox>

                      <MDBox mt={4} mb={1}>
                        <Button
                          variant="text"
                          color="primary"
                          fullWidth
                          type="submit"
                          disabled={!selectedStudent}
                        >
                          Valider le paiement
                        </Button>
                      </MDBox>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Payment;
