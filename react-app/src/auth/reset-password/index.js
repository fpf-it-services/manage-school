import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-sign-up-cover.jpeg";

import AuthService from "services/auth-service";

// pour la réinitialisation, je devrais prendre le token et l'email envoyés dans l'url
const PasswordReset = () => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [notification, setNotification] = useState(false);

  const [inputs, setInputs] = useState({
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({
    passwordError: false,
    confirmationError: false,
    error: false,
    textError: "",
  });

  const changeHandler = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    // obtenir le token et l'email envoyés dans l'url
    const queryParams = new URLSearchParams(window.location.search);
    setToken(queryParams.get("token"));
    setEmail(queryParams.get("email"));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (inputs.password.trim().length < 6) {
      setErrors({ ...errors, passwordError: true });
      return;
    }

    if (inputs.password_confirmation.trim() !== inputs.password.trim()) {
      setErrors({ ...errors, confirmationError: true });
      return;
    }

    const formData = {
      password: inputs.password,
      password_confirmation: inputs.password_confirmation,
      email: email,
      token: token,
    };

    const myData = {
      data: {
        type: "password-reset",
        attributes: { ...formData },
      },
    };

    try {
      const response = await AuthService.resetPassword(myData);

      setInputs({
        password: "",
        password_confirmation: "",
      });

      setErrors({
        passwordError: false,
        confirmationError: false,
        error: false,
        textError: "",
      });

      if (errors.passwordError === false && errors.confirmationError === false) {
        setNotification(true);
      }
    } catch (err) {
      if (err.hasOwnProperty("errors")) {
        setErrors({ ...errors, error: true, textError: err.errors.password[0] });
      }
      return null;
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
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
          {/* <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Rejoignez-nous aujourd'hui
          </MDTypography> */}
          <MDTypography display="block" variant="button" color="white" my={1}>
            Entrez votre nouveau mot de passe et sa confirmation pour mise à jour
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={submitHandler}>
            <MDBox mb={2}>
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
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirmation du mot de passe"
                variant="standard"
                fullWidth
                name="password_confirmation"
                value={inputs.password_confirmation}
                onChange={changeHandler}
                error={errors.confirmationError}
              />
            </MDBox>

            {errors.error && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {errors.textError}
              </MDTypography>
            )}

            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Changer
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
      {notification && (
        <MDAlert color="info" mt="20px" dismissible>
          <MDTypography variant="body2" color="white">
            Le changement de votre mot de passe a été réussi. Retournez à
            <MDTypography
              component={Link}
              to="/auth/login"
              variant="body2"
              fontWeight="medium"
              color="white"
            >
              &nbsp;connexion&nbsp;
            </MDTypography>
            pour vous authentifier.
          </MDTypography>
        </MDAlert>
      )}
    </CoverLayout>
  );
};

export default PasswordReset;
