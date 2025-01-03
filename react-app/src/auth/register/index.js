import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Select, Card, FormControl, MenuItem, InputLabel } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import AuthService from "services/auth-service";
import { AuthContext } from "context";

function Register() {
  const authContext = useContext(AuthContext);
  const [alert, setAlert] = useState({ open: false, message: "", type: "" });

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    address: "",
    academicPeriod: "",
    phone: "",
    logo: null,
    agree: false,
  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    addressError: false,
    academicPeriodError: false,
    phoneError: false,
    logoError: false,
    agreeError: false,
    error: false,
    errorText: "",
  });

  const changeHandler = (e) => {
    const { name, value, type, files } = e.target;
    setInputs({
      ...inputs,
      [name]: type === "file" ? files[0] : value,
    });
  };

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => setAlert({ open: false, message: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const phoneFormat = /^[0-9]{10,15}$/;

    if (inputs.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    if (inputs.email.trim().length === 0 || !inputs.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (inputs.address.trim().length === 0) {
      setErrors({ ...errors, addressError: true });
      return;
    }

    if (inputs.academicPeriod.trim().length === 0) {
      setErrors({ ...errors, academicPeriodError: true });
      return;
    }

    if (!inputs.phone.match(phoneFormat)) {
      setErrors({ ...errors, phoneError: true });
      return;
    }

    if (inputs.logo === null) {
      setErrors({ ...errors, logoError: true });
      return;
    }

    if (inputs.agree === false) {
      setErrors({ ...errors, agreeError: true });
      return;
    }

    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("email", inputs.email);
    formData.append("academic_period", inputs.academicPeriod);
    formData.append("address", inputs.address);
    formData.append("phone", inputs.phone);
    formData.append("logo", inputs.logo);

    try {
      const response = await AuthService.register(formData);
      setAlert({
        open: true,
        message: "Dossier envoyé avec succès ! Un mail vous a été envoyé à l'adresse fourni.",
        type: "success",
      });
      setInputs({
        name: "",
        email: "",
        academicPeriod: "",
        address: "",
        phone: "",
        logo: null,
        agree: false,
      });

      setErrors({
        nameError: false,
        emailError: false,
        academicPeriodError: false,
        addressError: false,
        phoneError: false,
        logoError: false,
        agreeError: false,
        error: false,
        errorText: "",
      });
    } catch (err) {
      setErrors({ ...errors, error: true, errorText: err.message });
      console.error(err);
      setAlert({
        open: true,
        message: "Une erreur est survenue. Veuillez réessayer.",
        type: "error",
      });
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
          sx={{ backgroundColor: "#0D83FD" }}
        >
          <MDTypography display="block" variant="button" color="white" my={1}>
            Entrez vos informations à l'administration pour vous inscrire
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
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nom"
                variant="standard"
                fullWidth
                name="name"
                value={inputs.name}
                onChange={changeHandler}
                error={errors.nameError}
              />
              {errors.nameError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Le nom ne peut pas être vide
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                name="email"
                value={inputs.email}
                onChange={changeHandler}
                error={errors.emailError}
              />
              {errors.emailError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  L'email doit être valide
                </MDTypography>
              )}
            </MDBox>
            {/* <MDBox mb={2}>
              <MDInput
                type="password"
                label="Mot de passe"
                variant="standard"
                fullWidth
                name="password"
                value={inputs.password}
                onChange={changeHandler}
                error={errors.passwordError}
              />
              {errors.passwordError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Le mot de passe doit contenir au moins 8 caractères
                </MDTypography>
              )}
            </MDBox> */}
            
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Adresse"
                variant="standard"
                fullWidth
                name="address"
                value={inputs.address}
                onChange={changeHandler}
                error={errors.addressError}
              />
              {errors.addressError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  L'adresse ne peut pas être vide
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Téléphone"
                variant="standard"
                fullWidth
                name="phone"
                value={inputs.phone}
                onChange={changeHandler}
                error={errors.phoneError}
              />
              {errors.phoneError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Le numéro de téléphone doit être valide
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
                  <FormControl fullWidth>
                    <InputLabel>Période Académique</InputLabel>
                    <Select
                      variant="standard"
                      name="academicPeriod"
                      value={inputs.academicPeriod}
                      onChange={changeHandler}
                      style={{ borderRadius: "8px" }}
                      error={errors.academicPeriodError}
                    >
                      <MenuItem value="trimestre">Trimestre</MenuItem>
                      <MenuItem value="semestre">Semestre</MenuItem>
                    </Select>
                  </FormControl>
                  {errors.academicPeriodError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Veuillez choisir une option
                </MDTypography>
              )}
                </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="file"
                label="Logo"
                variant="standard"
                fullWidth
                name="logo"
                onChange={changeHandler}
                error={errors.logoError}
              />
              {errors.logoError && (
                <MDTypography variant="caption" color="error" fontWeight="light">
                  Vous devez télécharger un logo
                </MDTypography>
              )}
            </MDBox>
            
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox name="agree" id="agree" onChange={changeHandler} />
              <InputLabel
                variant="standard"
                fontWeight="regular"
                color="text"
                sx={{ lineHeight: "1.5", cursor: "pointer" }}
                htmlFor="agree"
              >
                &nbsp;&nbsp;J'accepte les&nbsp;
              </InputLabel>
              <MDTypography
                component={Link}
                to="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Conditions générales
              </MDTypography>
            </MDBox>
            {errors.agreeError && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                Vous devez accepter les Conditions générales
              </MDTypography>
            )}
            {errors.error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.errorText}
              </MDTypography>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" sx={{ backgroundColor: '#0D83FD' }} color="info" fullWidth type="submit">
                S'inscrire
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Vous avez déjà un compte ?{" "}
                <MDTypography
                  component={Link}
                  to="/auth/login"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Se connecter
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Register;

