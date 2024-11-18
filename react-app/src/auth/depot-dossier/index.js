import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAlert from "components/MDAlert";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

function DepotDossier() {
  const [inputs, setInputs] = useState({
    school: "",
    level: "",
    lastName: "",
    firstName: "",
    birthDate: "",
    birthPlace: "",
    nationality: "",
    gender: "",
    photo: null,
    guardian1Name: "",
    guardian1Phone: "",
    guardian1Email: "",
    guardian2Name: "",
    guardian2Phone: "",
    guardian2Email: "",
    prevTranscript: null,
    examTranscript: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [enabledFields, setEnabledFields] = useState({
    school: true,
    level: false,
    remaining: false,
    examTranscript: false,
  });

  const [alert, setAlert] = useState({ open: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => setAlert({ open: false, message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setInputs({ ...inputs, [name]: type === "file" ? files[0] : value });

    if (name === "school" && value) {
      setEnabledFields({ ...enabledFields, level: true });
    }

    if (name === "level" && value) {
      setEnabledFields({
        ...enabledFields,
        remaining: true,
        examTranscript: value === "6e" || value === "2nde",
      });
    }
  };

  const validateInputs = () => {
    let hasErrors = false;
    const newErrors = {
      schoolError: false,
      levelError: false,
      lastNameError: false,
      firstNameError: false,
      birthDateError: false,
      birthPlaceError: false,
      nationalityError: false,
      genderError: false,
      photoError: false,
      guardian1NameError: false,
      guardian1PhoneError: false,
      guardian1EmailError: false,
      photoError: false,
      prevTranscriptError: false,
      examTranscriptError: false,
    };

    if (inputs.lastName.trim().length === 0) {
      newErrors.lastNameError = true;
      setErrorMessage("Le nom est requis.");
      hasErrors = true;
    }

    if (inputs.lastName.trim().length === 0) {
      newErrors.firstNameError = true;
      setErrorMessage("Les prénoms sont requis.");
      hasErrors = true;
    }

    if (!inputs.birthDate) {
      newErrors.birthDateError = true;
      setErrorMessage("La date de naissance est requise.");
      hasErrors = true;
    }

    if (inputs.birthPlace.trim().length === 0) {
      newErrors.birthPlaceError = true;
      setErrorMessage("Le lieu de naissance est requis.");
      hasErrors = true;
    }

    if (inputs.nationality.trim().length === 0) {
      newErrors.nationalityError = true;
      setErrorMessage("La nationalité est requise.");
      hasErrors = true;
    }

    if (!inputs.gender || inputs.gender.trim().length === 0) {
      newErrors.genderError = true;
      setErrorMessage("Le sexe est requis.");
      hasErrors = true;
    }

    if (inputs.guardian1Name.trim().length === 0) {
      newErrors.guardian1NameError = true;
      setErrorMessage("Les informations du tuteur 1 sont requises.");
      hasErrors = true;
    }

    if (inputs.guardian1Phone.trim().length === 0) {
      newErrors.guardian1PhoneError = true;
      setErrorMessage("Les informations du tuteur 1 sont requises.");
      hasErrors = true;
    }

    if (inputs.guardian1Email.trim().length === 0) {
      newErrors.guardian1EmailError = true;
      setErrorMessage("Les informations du tuteur 1 sont requises.");
      hasErrors = true;
    }

    if (!inputs.photo) {
      newErrors.photoError = true;
      setErrorMessage("La photo est obligatoire.");
      hasErrors = true;
    } else if (!["image/jpeg", "image/png"].includes(inputs.photo.type)) {
      newErrors.photoError = true;
      setErrorMessage("Le fichier photo doit être au format JPG ou PNG.");
      hasErrors = true;
    } else if (inputs.photo.size > 2 * 1024 * 1024) { 
      newErrors.photoError = true;
      setErrorMessage("La taille de la photo ne doit pas dépasser 2 Mo.");
      hasErrors = true;
    }
  
    if (inputs.prevTranscript && !["application/pdf"].includes(inputs.prevTranscript.type)) {
      newErrors.prevTranscriptError = true;
      setErrorMessage("Le relevé de notes doit être un fichier PDF.");
      hasErrors = true;
    } else if (inputs.prevTranscript && inputs.prevTranscript.size > 5 * 1024 * 1024) { 
      newErrors.prevTranscriptError = true;
      setErrorMessage("Le relevé de notes ne doit pas dépasser 5 Mo.");
      hasErrors = true;
    }
  
    if (inputs.examTranscript && !["application/pdf"].includes(inputs.examTranscript.type)) {
      newErrors.examTranscriptError = true;
      setErrorMessage("Le relevé de notes d'examen doit être un fichier PDF.");
      hasErrors = true;
    } else if (inputs.examTranscript && inputs.examTranscript.size > 5 * 1024 * 1024) { 
      newErrors.examTranscriptError = true;
      setErrorMessage("Le relevé de notes d'examen ne doit pas dépasser 5 Mo.");
      hasErrors = true;
    }
  

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const isValid = validateInputs();
    if (!isValid) return;
    const formData = new FormData();

    formData.append("ecole", inputs.school);
    formData.append("niveau", inputs.level);
    formData.append("nom", inputs.lastName);
    formData.append("prenoms", inputs.firstName);
    formData.append("date_de_naissance", inputs.birthDate);
    formData.append("lieu_de_naissance", inputs.birthPlace);
    formData.append("nationalite", inputs.nationality);
    formData.append("sexe", inputs.gender);
    formData.append("photo", inputs.photo);
    formData.append("nom_tuteur1", inputs.guardian1Name);
    formData.append("telephone_tuteur1", inputs.guardian1Phone);
    formData.append("email_tuteur1", inputs.guardian1Email);

    if (inputs.guardian2Name) {
      formData.append("nom_tuteur2", inputs.guardian2Name);
      formData.append("telephone_tuteur2", inputs.guardian2Phone);
      formData.append("email_tuteur2", inputs.guardian2Email);
    }
    if (inputs.prevTranscript) {
      formData.append("releve_de_notes", inputs.prevTranscript);
    }
    if (inputs.examTranscript) {
      formData.append("releve_de_notes_examen", inputs.examTranscript);
    }
    if (inputs.birthCertificate) {
      formData.append("acte_de_naissance", inputs.birthCertificate);
    }

    try {
      // const response = await AuthService.depotDossier(formData);
      setAlert({
        open: true,
        message: "Dossier envoyé avec succès !",
        type: "success",
      });
      // console.log(formData);
      setInputs({
        nom: "",
        prenoms: "",
        date_naissance: "",
        lieu_naissance: "",
        nationalite: "",
        sexe: "",
        classe: "",
        photo: null,
        nom_complet_tuteur1: "",
        telephone_tuteur1: "",
        adresse_tuteur1: "",
        email_tuteur1: "",
        nom_complet_tuteur2: "",
        telephone_tuteur2: "",
        adresse_tuteur2: "",
        email_tuteur2: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setAlert({
        open: true,
        message: "Une erreur est survenue. Veuillez réessayer.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card
        sx={{
          minWidth: { xs: "400px", md: "800px" },
          marginInlineStart: { xs: "0px", md: "-200px" },
        }}
      >
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" color="white">
            Dépôt de dossier d'inscription
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          {alert.open && (
            <MDBox mb={3}>
              <MDAlert color={alert.type} dismissible onClose={() => setAlert({ open: false })}>
                {alert.message}
              </MDAlert>
            </MDBox>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>École</InputLabel>
                    <Select
                      name="school"
                      value={inputs.school}
                      onChange={handleChange}
                      style={{ borderRadius: "8px", height: "45px" }}
                      disabled={!enabledFields.school}
                    >
                      <MenuItem value="Ecole1">École 1</MenuItem>
                      <MenuItem value="Ecole2">École 2</MenuItem>
                      <MenuItem value="Ecole3">École 3</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Niveau</InputLabel>
                    <Select
                      name="level"
                      value={inputs.level}
                      onChange={handleChange}
                      style={{ borderRadius: "8px", height: "45px" }}
                      disabled={!enabledFields.level}
                    >
                      <MenuItem value="6e">6e</MenuItem>
                      <MenuItem value="5e">5e</MenuItem>
                      <MenuItem value="4e">4e</MenuItem>
                      <MenuItem value="3e">3e</MenuItem>
                      <MenuItem value="2nde">2nde</MenuItem>
                      <MenuItem value="1ère">1ère</MenuItem>
                      <MenuItem value="Tle">Terminale</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nom"
                    fullWidth
                    name="lastName"
                    value={inputs.lastName}
                    onChange={handleChange}
                    error={errors.lastNameError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Prénoms"
                    fullWidth
                    name="firstName"
                    value={inputs.firstName}
                    onChange={handleChange}
                    error={errors.firstNameError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="date"
                    label="Date de naissance"
                    fullWidth
                    name="birthDate"
                    value={inputs.birthDate}
                    onChange={handleChange}
                    error={errors.birthDateError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Lieu de naissance"
                    fullWidth
                    name="birthPlace"
                    value={inputs.birthPlace}
                    onChange={handleChange}
                    error={errors.birthPlaceError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nationalité"
                    fullWidth
                    name="nationality"
                    value={inputs.nationality}
                    onChange={handleChange}
                    error={errors.nationalityError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Sexe</InputLabel>
                    <Select
                      name="gender"
                      value={inputs.gender}
                      onChange={handleChange}
                      style={{ borderRadius: "8px", height: "45px" }}
                      error={errors.genderError}
                      disabled={!enabledFields.remaining}
                    >
                      <MenuItem value="M">Masculin</MenuItem>
                      <MenuItem value="F">Féminin</MenuItem>
                    </Select>
                  </FormControl>
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="file"
                    label="Photo"
                    fullWidth
                    name="photo"
                    onChange={handleChange}
                    error={errors.photoError}
    helperText={errors.photoError ? "La photo est invalide ou manquante." : ""}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
              </Grid>

              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nom Tuteur 1"
                    fullWidth
                    name="guardian1Name"
                    value={inputs.guardian1Name}
                    onChange={handleChange}
                    error={errors.guardian1NameError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Téléphone Tuteur 1"
                    fullWidth
                    name="guardian1Phone"
                    value={inputs.guardian1Phone}
                    onChange={handleChange}
                    error={errors.guardian1PhoneError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email Tuteur 1"
                    fullWidth
                    name="guardian1Email"
                    value={inputs.guardian1Email}
                    onChange={handleChange}
                    error={errors.guardian1EmailError}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nom Tuteur 2"
                    fullWidth
                    name="guardian2Name"
                    value={inputs.guardian2Name}
                    onChange={handleChange}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Téléphone Tuteur 2"
                    fullWidth
                    name="guardian2Phone"
                    value={inputs.guardian2Phone}
                    onChange={handleChange}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email Tuteur 2"
                    fullWidth
                    name="guardian2Email"
                    value={inputs.guardian2Email}
                    onChange={handleChange}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="file"
                    label="Acte de naissance"
                    fullWidth
                    name="birthCertificate"
                    onChange={handleChange}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>

                {/* Relevés */}
                <MDBox mb={2}>
                  <MDInput
                    type="file"
                    label="Acte de naissance"
                    fullWidth
                    name="prevTranscript"
                    onChange={handleChange}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="file"
                    label="Relevé de notes de la classe précédente"
                    fullWidth
                    name="prevTranscript"
                    onChange={handleChange}
                    error={errors.prevTranscriptError}
                    helperText={errors.prevTranscriptError ? "Le fichier doit être un PDF valide." : ""}
                    disabled={!enabledFields.remaining}
                  />
                </MDBox>
                {enabledFields.examTranscript && (
                  <MDBox mb={2}>
                    <MDInput
                      type="file"
                      label="Relevé de notes de l'examen (CEP ou BEPC)"
                      fullWidth
                      name="examTranscript"
                      onChange={handleChange}
                      error={errors.examTranscript}
                      helperText={errors.examTranscript ? "Le fichier doit être un PDF valide." : ""}
                      disabled={!enabledFields.remaining}
                    />
                  </MDBox>
                )}
              </Grid>
            </Grid>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={!enabledFields.remaining || isLoading}
                startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? "Chargement..." : "Soumettre"}
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default DepotDossier;
