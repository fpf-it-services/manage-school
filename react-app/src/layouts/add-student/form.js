import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import StudentService from "services/student-service";
import ClassService from "services/class-service";

function FormStudent() { 
  const [inputs, setInputs] = useState({
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

  const [errors, setErrors] = useState({
    nomError: false,
    prenomsError: false,
    dateNaissanceError: false,
    lieuNaissanceError: false,
    nationaliteError: false,
    sexeError: false,
    classeError: false,
    tuteur1Error: false,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [classes, setClasses] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

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
    const file = e.target.files[0];
    setInputs({ ...inputs, photo: file });
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (inputs.nom.trim().length === 0) {
      setErrors({ ...errors, nomError: true });
      setErrorMessage("Le nom est requis.");
      return;
    }
    if (inputs.prenoms.trim().length === 0) {
      setErrors({ ...errors, prenomsError: true });
      setErrorMessage("Les prénoms sont requis.");
      return;
    }
    if (!inputs.date_naissance) {
      setErrors({ ...errors, dateNaissanceError: true });
      setErrorMessage("La date de naissance est requise.");
      return;
    }
    if (inputs.lieu_naissance.trim().length === 0) {
      setErrors({ ...errors, lieuNaissanceError: true });
      setErrorMessage("Le lieu de naissance est requis.");
      return;
    }
    if (inputs.nationalite.trim().length === 0) {
      setErrors({ ...errors, nationaliteError: true });
      setErrorMessage("La nationalité est requise.");
      return;
    }
    if (!inputs.sexe || inputs.sexe.trim().length === 0) {
      setErrors({ ...errors, sexeError: true });
      setErrorMessage("Le sexe est requis.");
      return;
    }
    if (inputs.classe.trim().length === 0) {
      setErrors({ ...errors, classeError: true });
      setErrorMessage("La classe est requise.");
      return;
    }

    if (inputs.nom_complet_tuteur1.trim().length === 0) {
      setErrors({ ...errors, tuteur1Error: true });
      setErrorMessage("Les informations du tuteur 1 sont requises.");
      return;
    }

    const formData = new FormData();
    formData.append("nom", inputs.nom);
    formData.append("prenoms", inputs.prenoms);
    formData.append("date_naissance", inputs.date_naissance);
    formData.append("lieu_naissance", inputs.lieu_naissance);
    formData.append("nationalite", inputs.nationalite);
    formData.append("sexe", inputs.sexe);
    formData.append("classe_id", inputs.classe);
    if (inputs.photo) {
      formData.append("photo", inputs.photo);
    }
    formData.append("nom_complet_tuteur1", inputs.nom_complet_tuteur1);
    formData.append("telephone_tuteur1", inputs.telephone_tuteur1);
    formData.append("adresse_tuteur1", inputs.adresse_tuteur1);
    formData.append("email_tuteur1", inputs.email_tuteur1);

    if (inputs.nom_complet_tuteur2.trim().length > 0) {
      formData.append("nom_complet_tuteur2", inputs.nom_complet_tuteur2);
    }
    if (inputs.telephone_tuteur2.trim().length > 0) {
      formData.append("telephone_tuteur2", inputs.telephone_tuteur2);
    }
    if (inputs.adresse_tuteur2.trim().length > 0) {
      formData.append("adresse_tuteur2", inputs.adresse_tuteur2);
    }
    if (inputs.email_tuteur2.trim().length > 0) {
      formData.append("email_tuteur2", inputs.email_tuteur2);
    }

    try {
      await StudentService.addStudent(formData);
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
      setPreviewPhoto(null);
      setErrors({});
    } catch (err) {
      setErrorMessage("Erreur lors de l'ajout de l'élève. Veuillez réessayer.");
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
            Ajouter un élève
          </MDTypography>
        </MDBox>
        <MDBox component="form" onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Nom"
                  fullWidth
                  name="nom"
                  value={inputs.nom}
                  onChange={handleInputChange}
                  error={errors.nomError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Prénoms"
                  fullWidth
                  name="prenoms"
                  value={inputs.prenoms}
                  onChange={handleInputChange}
                  error={errors.prenomsError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Date de naissance"
                  fullWidth
                  name="date_naissance"
                  value={inputs.date_naissance}
                  onChange={handleInputChange}
                  error={errors.dateNaissanceError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Lieu de naissance"
                  fullWidth
                  name="lieu_naissance"
                  value={inputs.lieu_naissance}
                  onChange={handleInputChange}
                  error={errors.lieuNaissanceError}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Nationalité"
                  fullWidth
                  name="nationalite"
                  value={inputs.nationalite}
                  onChange={handleInputChange}
                  error={errors.nationaliteError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Sexe"
                  fullWidth
                  name="sexe"
                  value={inputs.sexe}
                  onChange={handleInputChange}
                  error={errors.sexeError}
                />
              </MDBox>
              <MDBox mb={2}>
                <select
                  name="classe"
                  value={inputs.classe}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
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
                {errors.classeError && <p style={{ color: 'red' }}>La classe est requise.</p>}
              </MDBox>
              <MDBox mb={2} display="flex" alignItems="center">
                <MDButton component="label" color="info">
                  Sélectionner une photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </MDButton>
                {previewPhoto && (
                  <img
                    src={previewPhoto}
                    alt="Aperçu"
                    style={{ width: '50px', height: '50px', marginLeft: '10px', borderRadius: '4px' }}
                  />
                )}
              </MDBox>
            </Grid>
          </Grid>

          {/* Informations des tuteurs */}
          <MDBox mt={4}>
            <MDTypography variant="h6" fontWeight="medium">
              Informations du Tuteur 1
            </MDTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nom Complet"
                    fullWidth
                    name="nom_complet_tuteur1"
                    value={inputs.nom_complet_tuteur1}
                    onChange={handleInputChange}
                    error={errors.tuteur1Error}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Téléphone"
                    fullWidth
                    name="telephone_tuteur1"
                    value={inputs.telephone_tuteur1}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Adresse"
                    fullWidth
                    name="adresse_tuteur1"
                    value={inputs.adresse_tuteur1}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email"
                    fullWidth
                    name="email_tuteur1"
                    value={inputs.email_tuteur1}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>

          {/* Informations du Tuteur 2 (facultatif) */}
          <MDBox mt={4}>
            <MDTypography variant="h6" fontWeight="medium">
              Informations du Tuteur 2 (facultatif)
            </MDTypography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Nom Complet"
                    fullWidth
                    name="nom_complet_tuteur2"
                    value={inputs.nom_complet_tuteur2}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Téléphone"
                    fullWidth
                    name="telephone_tuteur2"
                    value={inputs.telephone_tuteur2}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Adresse"
                    fullWidth
                    name="adresse_tuteur2"
                    value={inputs.adresse_tuteur2}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6}>
                <MDBox mb={2}>
                  <MDInput
                    type="email"
                    label="Email"
                    fullWidth
                    name="email_tuteur2"
                    value={inputs.email_tuteur2}
                    onChange={handleInputChange}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox>
          {errorMessage && <MDTypography color="red">{errorMessage}</MDTypography>}
          <MDBox mt={4}>
            <MDButton type="submit" variant="gradient" color="info" fullWidth>
              Ajouter l'élève
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default FormStudent;

