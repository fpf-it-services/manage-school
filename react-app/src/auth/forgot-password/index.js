import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import CoverLayout from "layouts/authentication/components/CoverLayout";
import bgImage from "assets/images/bg-reset-cover.jpeg";
import authService from "services/auth-service";

function ForgotPassword() {
  const [notification, setNotification] = useState(false);
  const [input, setEmail] = useState({
    email: "",
  });
  const [error, setError] = useState({
    err: false,
    textError: "",
  });

  const changeHandler = (e) => {
    setEmail({
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (input.email.trim().length === 0 || !input.email.trim().match(mailFormat)) {
      setError({ err: true, textError: "L'e-mail doit être valide" });
      return;
    }
    const myData = {
      data: {
        type: "password-forgot",
        attributes: {
          redirect_url: `${process.env.REACT_APP_URL}/auth/reset-password`,
          ...input,
        },
      },
    };

    try {
      const response = await authService.forgotPassword(myData);
      setError({ err: false, textError: "" });
      setNotification(true);
    } catch (err) {
      console.error(err);
      if (err.hasOwnProperty("errors")) {
        if (err.errors.hasOwnProperty("email")) {
          setError({ err: true, textError: err.errors.email[0] });
        } else {
          setError({ err: true, textError: "Une erreur est survenue" });
        }
      }
      return null;
    }
  };

  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h5" fontWeight="medium" color="white" mt={1}>
            Réinitialiser le mot de passe
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Vous recevrez un e-mail dans peu de temps
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" method="POST" onSubmit={handleSubmit}>
            <MDBox mb={4}>
              <MDInput
                type="email"
                label="E-mail"
                variant="standard"
                fullWidth
                value={input.email}
                name="email"
                onChange={changeHandler}
                error={error.err}
              />
            </MDBox>
            {error.err && (
              <MDTypography variant="caption" color="error" fontWeight="light">
                {error.textError}
              </MDTypography>
            )}
            <MDBox mt={6} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth type="submit">
                Réinitialiser
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {notification && (
        <MDAlert color="info" mt="20px" dismissible>
          <MDTypography variant="body2" color="white">
              Veuillez vérifier votre e-mail pour réinitialiser votre mot de passe.
          </MDTypography>
        </MDAlert>
      )}
    </CoverLayout>
  );
}

export default ForgotPassword;
