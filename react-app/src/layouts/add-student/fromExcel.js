import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import ClassService  from 'services/class-service';

function UploadStudentExcel() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [students, setStudents] = useState([]);
  const [classe, setClasse] = useState(""); 
  const [classes, setClasses] = useState([]); 

  // Récupération des classes (à ajuster selon votre service d'API)
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const fetchedClasses = await ClassService.getClasses();
        setClasses(fetchedClasses.data);
      } catch (error) {
        setErrorMessage("Erreur lors de la récupération des classes.");
      }
    };

    fetchClasses();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); 
    setErrorMessage("");
  };

  const validateExcelData = (data) => {
    const requiredFields = [
      "Nom",
      "Prenoms",
      "Date de Naissance",
      "Lieu de Naissance",
      "Nationalite",
      "Sexe",
      "Nom Tuteur1",
      "Téléphnone Tuteur1",
      "Email tuteur1",
    ];

    const missingFields = [];
    requiredFields.forEach((field) => {
      if (!data[0].hasOwnProperty(field)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      setErrorMessage(
        `Le fichier est invalide. Les champs obligatoires suivants sont manquants : ${missingFields.join(
          ", "
        )}.`
      );
      return false;
    }

    if (!classe) {
      setErrorMessage("Veuillez sélectionner une classe.");
      return false;
    }

    return true;
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("Veuillez sélectionner un fichier Excel.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      console.log(data)
      if (validateExcelData(data)) {
        setStudents(data);
        setErrorMessage("");
        sendDataToBackend(data);
      }
    };

    reader.onerror = () => {
      setErrorMessage("Erreur lors de la lecture du fichier.");
    };

    reader.readAsBinaryString(file);
  };

  const sendDataToBackend = async (data) => {
    try {
      await ClassService.uploadStudents({ classe, data });
      setErrorMessage("");
      alert("Les élèves ont été importés avec succès.");
      setFile(null);
      setFileName(""); 
      setStudents([]);
      setClasse(""); // Réinitialiser la classe
    } catch (error) {
      setErrorMessage("Une erreur s'est produite lors de l'importation des élèves.");
      console.error("Erreur lors de l'importation", error);
    }

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
            Importer les élèves via Excel
          </MDTypography>
        </MDBox>

        <MDBox component="form" onSubmit={handleFileUpload}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDBox mb={2}>
                <MDButton
                  variant="text"
                  color="info"
                  onClick={() => document.getElementById("excel-upload").click()}
                >
                  Choisir un fichier Excel
                </MDButton>
                <input
                  type="file"
                  id="excel-upload"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                />
              </MDBox>
              {fileName && (
                <MDTypography variant="body2" color="textSecondary">
                  Fichier sélectionné : {fileName}
                </MDTypography>
              )}

              <MDBox mb={2}>
                <select
                  name="classe"
                  value={classe}
                  onChange={(e) => setClasse(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                  required
                >
                  <option value="" disabled>Choisir la classe</option>
                  {classes.length > 0 ? (
                    classes.map((classe) => (
                      <option key={classe.id} value={classe.id}>{classe.nom}</option>
                    ))
                  ) : (
                    <option value="" disabled>Pas de classes disponibles</option>
                  )}
                </select>
              </MDBox>
            </Grid>
          </Grid>

          {errorMessage && (
            <MDBox mt={2}>
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errorMessage}
              </MDTypography>
            </MDBox>
          )}

          <MDBox mt={4} mb={1} display="flex" justifyContent="center">
            <MDButton variant="gradient" color="info" type="submit">
              Importer
            </MDButton>
          </MDBox>
        </MDBox>

        <MDBox mb={2}>
          <MDTypography variant="subtitle2">
            Format attendu du fichier Excel :
          </MDTypography>

          <Grid container spacing={1}>
            {[
              { label: "Nom", required: true },
              { label: "Prenoms", required: true },
              { label: "Date de Naissance (YYYY-MM-DD)", required: true },
              { label: "Lieu de Naissance", required: true },
              { label: "Nationalite", required: true },
              { label: "Sexe", required: true },
              { label: "Nom Tuteur1", required: true },
              { label: "Téléphone Tuteur1", required: true },
              { label: "Email Tuteur1", required: true },
              { label: "Nom Tuteur2", required: false },
              { label: "Téléphone Tuteur2", required: false },
              { label: "Email Tuteur2", required: false },
            ].map((field, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <MDTypography variant="caption">
                  <strong>{field.label}</strong> {field.required ? "(obligatoire)" : "(facultatif)"}
                </MDTypography>
              </Grid>
            ))}
          </Grid>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default UploadStudentExcel;
