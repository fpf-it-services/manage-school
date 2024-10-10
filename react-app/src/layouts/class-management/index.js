import { useState, useEffect } from "react";
import { Grid, Divider, Button, TextField, Card, Tabs, Tab, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { getLevels, getSeriesByLevel, getClassesByLevelAndSerie, getStudentsByClass, uploadStudents } from "./data";

const ClassManagement = () => {
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [series, setSeries] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [className, setClassName] = useState("");
  const [classSize, setClassSize] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchLevels = async () => {
      const levelsData = await getLevels();
      setLevels(levelsData);
    };
    fetchLevels();
  }, []);

  const handleChangeLevel = async (event, newValue) => {
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
      const classesData = await getClassesByLevelAndSerie(level.id, null);
      setClasses(classesData);
      setStudents([]); 
    }
  };

  const handleSelectSerie = async (serieId) => {
    setSelectedSerie(serieId);
    const levelId = levels[selectedLevel].id;
    const classesData = await getClassesByLevelAndSerie(levelId, serieId);
    console.log(classesData)
    setClasses(classesData);
    setStudents([]);
  };

  const handleTabChange = async (event, newValue) => {
    const classId = classes[newValue].id;
    const studentsData = await getStudentsByClass(classId);
    setStudents(studentsData);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClassName("");
    setClassSize("");
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleCreateClass = async () => {
    await uploadStudents(className, classSize, file, selectedLevel, selectedSerie);
    handleClose();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} pb={3}>
        <Grid container spacing={2}>
          <Grid item xs={2}>
            <Card>
              <MDBox p={3}>
                <MDBox mt={2}>
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
                <MDBox display="flex" justifyContent="space-between" alignItems="center">
                  <MDTypography variant="h6">Classes du niveau</MDTypography>
                  <Button
                    variant="text"
                    color="primary"
                    onClick={handleClickOpen}
                    disabled={levels.length === 0 || selectedLevel === null}
                  >
                    Créer une classe
                  </Button>
                </MDBox>

                {/* Si des séries sont disponibles pour le niveau sélectionné */}
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
                      value={selectedLevel}
                      onChange={handleChangeLevel}
                      indicatorColor="primary"
                      textColor="primary"
                    >
                      {classes.map((classItem, index) => (
                        <Tab key={index} label={classItem.nom} onClick={(e) => handleTabChange(e, index)} />
                      ))}
                    </Tabs>
                    <MDBox mt={3}>
                      {students.length === 0 ? (
                        <MDBox textAlign="center">
                          <MDTypography variant="h6" color="textSecondary">
                            Aucun élève dans cette salle.
                          </MDTypography>
                        </MDBox>
                      ) : (
                        <DataTable
                          table={{
                            columns: [
                              { Header: "Nom", accessor: "name" },
                              { Header: "Âge", accessor: "age" },
                              { Header: "Classe", accessor: "class" },
                            ],
                            rows: students,
                          }}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          isSorted={false}
                          noEndBorder
                        />
                      )}
                    </MDBox>
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
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Effectif de la salle"
            value={classSize}
            onChange={(e) => setClassSize(e.target.value)}
            type="number"
            fullWidth
          />
          <MDBox mt={2}>
            <Button
              variant="text"
              color="primary"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Choisir un fichier
              <input hidden type="file" onChange={handleFileChange} />
            </Button>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Annuler</Button>
          <Button onClick={handleCreateClass} color="primary">Créer</Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
};

export default ClassManagement;
