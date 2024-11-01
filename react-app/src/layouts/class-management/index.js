import { useState, useEffect } from "react";
import { Grid, Divider, Button, TextField, Card, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { getLevels, getSeriesByLevel, getClassesByLevelAndSerie, getStudentsByClass, uploadStudents, getAcademicYears } from "./data";
import * as XLSX from "xlsx";  

const ClassManagement = () => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [selectedClass, setSelectedClass] = useState(0);
  const [series, setSeries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [classSize, setClassSize] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [academicYears, setAcademicYears] = useState([]); 
  const [selectedYear, setSelectedYear] = useState(null); 

  useEffect(() => {
    const fetchLevels = async () => {
      const levelsData = await getLevels();
      setLevels(levelsData);
    };
    fetchLevels();
  }, []);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      const years = await getAcademicYears();
      setAcademicYears(years);
      if (years.length > 0) {
        setSelectedYear(years[0].id); 
      }
    };
    fetchAcademicYears();
  }, []);

  const handleChangeYear = async (event) => {
    setSelectedYear(event.target.value);
    if (selectedLevel) {
      await handleChangeLevel(null, selectedLevel, event.target.value);
    }
  };

  const handleChangeLevel = async (event, newValue, year) => {
    setSelectedLevel(newValue);
    setSelectedSerie(null);
    const level = levels[newValue];
    setSeries([]);
    setClasses([]);
    setStudents([]);

    if (["2E", "2e", "Seconde", "SECONDE", "Premiere", "PREMIERE", "Première", "1ERE", "TERMINALE", "Terminale", "TLE"].includes(level.niveau)) {
      const seriesData = await getSeriesByLevel(level.id);
      setSeries(seriesData);
    } else {
      const classesData = await getClassesByLevelAndSerie(level.id, null, year);
      setClasses(classesData);
      setStudents([]);
    }
  };

  const handleSelectSerie = async (serieId) => {
    setSelectedSerie(serieId);
    const levelId = levels[selectedLevel].id;
    const classesData = await getClassesByLevelAndSerie(levelId, serieId, selectedYear);
    setClasses(classesData);
    setStudents([]);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedClass(newValue)
    const selectedClass = classes.find(classe => classe.id === newValue);
    if (selectedClass && selectedClass.eleves !== 0) {
      setStudents(selectedClass.eleves);
    } else {
      setStudents([]);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClassName("");
    setClassSize("");
    setFile(null);
    setFileName("");
    setErrorMessage("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : ""); 
    setErrorMessage("");
  };

  const validateExcelData = (data) => {
    const requiredFields = [
      'nom',
      'prenoms',
      'date_naissance',
      'lieu_naissance',
      'nationalite',
      'sexe',
      'nom_complet_tuteur1',
      'telephone_tuteur1',
      'adresse_tuteur1',
      'email_tuteur1',
    ];

    const missingFields = [];
    requiredFields.forEach((field) => {
      if (!data[0].hasOwnProperty(field)) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      setErrorMessage(
        `Le fichier est invalide. Les champs obligatoires suivants sont manquants : ${missingFields.join(", ")}.`
      );
      return false;
    }

    return true;
  };

  const handleCreateClass = async () => {
    let data = [];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        data = XLSX.utils.sheet_to_json(worksheet);
        
        if (validateExcelData(data)) {
          uploadStudents(className, classSize, data, selectedLevel, selectedSerie);
          handleClose();
        }
      };
      reader.onerror = () => {
        setErrorMessage("Erreur lors de la lecture du fichier.");
      };
      reader.readAsBinaryString(file);
    } else {
      await uploadStudents(className, classSize, data, selectedLevel+1, selectedSerie);
      handleClose();
    }
  };

  const Author = ({ image, name, sexe }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{sexe}</MDTypography>
      </MDBox>
    </MDBox>
  );


  const handlereRegister = (id) => {
    console.log("Réinscrit")
  }
  

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <Grid container spacing={1}>
          <Grid item xs={2}>
            <Card>
              <MDBox p={2}>
                <MDBox mt={2}>
                <MDTypography variant="h4" mr={2} fontSize= "20px">Les Niveaux: </MDTypography>
                  {levels.map((level, index) => (
                    <div key={level.id}>
                      <Button
                        onClick={() => handleChangeLevel(null, index)}
                        fullWidth
                        variant="text"
                        color={index === selectedLevel ? "primary" : "inherit"}
                      >
                        {level.niveau} {index === selectedLevel && selectedSerie ? `(${series.find(serie => serie.id === selectedSerie)?.serie})` : ""}
                      </Button>
                      {index < levels.length - 1 && <Divider />}
                    </div>
                  ))}
                </MDBox>
              </MDBox>
            </Card>
          </Grid>

          <Grid item xs={10}>
            <Card>
              <MDBox p={3}>
                <MDBox display="flex" justifyContent="space-between" alignItems="center" marginBottom="25px">
                  <MDTypography variant="h6">Classes du niveau</MDTypography>

                  <MDBox display="flex" alignItems="center">
                    <MDTypography variant="h6" mr={2} fontSize= "15px">Année académique:</MDTypography>
                    <Select
                      value={selectedYear}
                      onChange={handleChangeYear}
                      variant="outlined"
                      sx={{ minWidth: 120, marginRight: 2, height: "30px" }} 
                    >
                      {academicYears.map((year) => (
                      <MenuItem key={year.id} value={year.id}>
                        {`${year.date_debut} - ${year.date_fin}`}
                      </MenuItem>
                    ))}
                    </Select>

                    <Button 
                      variant="text"
                      color="primary"
                      onClick={handleClickOpen}
                      disabled={levels.length === 0 || selectedLevel === null}
                    >
                      Créer une classe
                    </Button>
                  </MDBox>
                </MDBox>
                {series.length > 0 && !selectedSerie ? (
                  <MDBox mt={3} textAlign="center">
                    <MDTypography variant="h6" color="textSecondary">
                      Veuillez sélectionner une série.
                    </MDTypography>
                    {series.map((serie) => (
                      <Button
                        key={serie.id}
                        onClick={() => handleSelectSerie(serie.id)}
                        variant="outlined"
                        color="secondary"
                        style={{ margin: '10px 10px', color: 'blue' }}
                      >
                        {serie.serie}
                      </Button>
                    ))}
                  </MDBox>
                ) : (
                  <>
                    <Tabs
                      value={selectedClass}
                      onChange={handleTabChange}
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      {classes.map((classe, index) => (
                        <Tab value={classe.id} label={classe.nom} key={classe.id} />
                      ))}
                    </Tabs>
                    {
                      students.length > 0 ? (
                        <>
                        <br/>
                        <DataTable
                          table={{
                            columns: [
                              { Header: "Nom", accessor: "nom" },
                              { Header: "Date de Naissance", accessor: "date_naissance", align: "center" },
                              { Header: "Lieu de Naissance", accessor: "lieu_naissance", align: "center" },
                              { Header: "Nationalité", accessor: "nationalite", align: "center" },
                              { Header: "Téléphone", accessor: "telephone", align: "center" },
                              { Header: "Adresse tuteur 1", accessor: "adresse_tuteur1", align: "center" },
                              { Header: "Email Tuteur 1", accessor: "email_tuteur1", align: "center" },
                              { Header: "Adresse tuteur 2", accessor: "adresse_tuteur2", align: "center" },
                              { Header: "Email Tuteur 2", accessor: "email_tuteur2", align: "center" },
                              { Header: "Action", accessor: "action", align: "center" },
                            ],
                            rows: students.map((student) => ({
                              nom: <Author image={student.photo} name={`${student.nom} ${student.prenoms}`} sexe={student.sexe} />,
                              date_naissance: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.date_naissance}
                                </MDTypography>
                              ),
                              lieu_naissance: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.lieu_naissance}
                                </MDTypography>
                              ),
                              nationalite: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.nationalite}
                                </MDTypography>
                              ),
                              telephone: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.telephone}
                                </MDTypography>
                              ),
                              adresse_tuteur1: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.adresse_tuteur1}
                                </MDTypography>
                              ),
                              email_tuteur1: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.email_tuteur1}
                                </MDTypography>
                              ),
                              adresse_tuteur2: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.adresse_tuteur2 ? student.adresse_tuteur2 : 'Non Fourni' }
                                </MDTypography>
                              ),
                              email_tuteur2: (
                                <MDTypography variant="caption" fontWeight="medium">
                                  {student.email_tuteur2 ? student.email_tuteur2 : 'Non Fourni' }
                                </MDTypography>
                              ),
                              action: (
                                <MDBox>
                                  <MDTypography
                                    component="a"
                                    href="#"
                                    variant="caption"
                                    color="primary"
                                    fontWeight="medium"
                                    onClick={() => handlereRegister(student.id)}
                                  >
                                    Réinscrire
                                  </MDTypography>
                                </MDBox>
                              ),
                            }))
                          }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                        </>
                      ) : (
                        <MDBox textAlign="center">
                          <MDTypography variant="h6" color="textSecondary">
                            Aucune donnée d'élèves disponible.
                          </MDTypography>
                        </MDBox>
                      )
                    }
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Créer une classe</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom de la classe"
            fullWidth
            variant="outlined"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Effectif de la salle"
            fullWidth
            variant="outlined"
            value={classSize}
            onChange={(e) => setClassSize(e.target.value)}
            type="number"
          />
          <Button
            variant="text"
            component="label"
            startIcon={<UploadFileIcon />}
            sx={{ mt: 2 }}
          >
            Télécharger les élèves
            <input
              type="file"
              hidden
              accept=".xls, .xlsx"
              onChange={handleFileChange}
            />
          </Button>
          {fileName && <MDTypography variant="body2" sx={{ mt: 1 }}>{`Fichier sélectionné : ${fileName}`}</MDTypography>}
          {errorMessage && <MDTypography variant="body2" color="error">{errorMessage}</MDTypography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleCreateClass} color="primary">
            Créer
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
};

export default ClassManagement;

