import { useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox"; 
import FormControlLabel from "@mui/material/FormControlLabel";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import SchoolService from "services/school-service";

function FormSchool() {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    adresse: "",
    telephone: "",
    logo: null,
    centre_de_composition: false,
  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    passwordError: false,
    adresseError: false,
    telephoneError: false,
    logoError: false,
  });

  const [errorMessage, setErrorMessage] = useState(""); 
  const [previewLogo, setPreviewLogo] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInputs({
      ...inputs,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInputs({ ...inputs, logo: file });
    if (file) {
      setPreviewLogo(URL.createObjectURL(file)); 
    }
  };

  const validateEmail = (email) => {
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return email.match(mailFormat);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    if (inputs.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      setErrorMessage("Le nom est requis.");
      return;
    }

    if (inputs.email.trim().length === 0 || !validateEmail(inputs.email)) {
      setErrors({ ...errors, emailError: true });
      setErrorMessage("L'adresse email est invalide.");
      return;
    }

    if (inputs.password.trim().length < 8) {
      setErrors({ ...errors, passwordError: true });
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (inputs.adresse.trim().length === 0) {
      setErrors({ ...errors, adresseError: true });
      setErrorMessage("L'adresse est requise.");
      return;
    }

    if (inputs.telephone.trim().length === 0) {
      setErrors({ ...errors, telephoneError: true });
      setErrorMessage("Le numéro de téléphone est requis.");
      return;
    }

    console.log(inputs)

    const formData = new FormData();
    formData.append("nom", inputs.name);
    formData.append("email", inputs.email);
    formData.append("password", inputs.password);
    formData.append("adresse", inputs.adresse);
    formData.append("contact", inputs.telephone);
    formData.append("centre_de_composition", inputs.centre_de_composition);
    if (inputs.logo) {
      formData.append("logo", inputs.logo);
    }

    try {
      console.log(formData)
      await SchoolService.createSchool(formData);
      setInputs({
        name: "",
        email: "",
        password: "",
        adresse: "",
        telephone: "",
        logo: null,
        centre_de_composition: false,
      });
      setErrors({});
      setPreviewLogo(null); 
    } catch (err) {
      setErrorMessage("Erreur lors de l'insertion de l'école. Veuillez réessayer.");
      console.error("Erreur lors de la création de l'école", err);
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
            Ajouter une école
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
                  name="name"
                  value={inputs.name}
                  onChange={handleInputChange}
                  error={errors.nameError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  name="email"
                  value={inputs.email}
                  onChange={handleInputChange}
                  error={errors.emailError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Mot de passe"
                  fullWidth
                  name="password"
                  value={inputs.password}
                  onChange={handleInputChange}
                  error={errors.passwordError}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Adresse"
                  fullWidth
                  name="adresse"
                  value={inputs.adresse}
                  onChange={handleInputChange}
                  error={errors.adresseError}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="tel"
                  label="Téléphone"
                  fullWidth
                  name="telephone"
                  value={inputs.telephone}
                  onChange={handleInputChange}
                  error={errors.telephoneError}
                />
              </MDBox>
              <MDBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <MDButton
                  variant="text"
                  color="info"
                  onClick={() => document.getElementById("logo-upload").click()}
                >
                  Choisir un logo
                </MDButton>
                <input
                  type="file"
                  id="logo-upload"
                  style={{ display: "none" }} 
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={inputs.centre_de_composition}
                      onChange={handleInputChange}
                      name="centre_de_composition"
                      color="primary"
                    />
                  }
                  label="Centre de Composition"
                />
              </MDBox>
              {previewLogo && (
                <MDBox mt={2}>
                  <img
                    src={previewLogo}
                    alt="Logo Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                  />
                </MDBox>
              )}
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
              Ajouter l'école
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default FormSchool;
