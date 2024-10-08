import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/user-profile/Header";

import AuthService from "../../services/auth-service";

const UserProfile = () => {
  const [notification, setNotification] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nameError: false,
    emailError: false,
    newPassError: false,
    confirmPassError: false,
  });

  const [editMode, setEditMode] = useState(false); // Nouvel état pour gérer le mode édition

  const getUserData = async () => {
    const response = await AuthService.getProfile();
    setUser((prevUser) => ({
      ...prevUser,
      ...response.data,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (notification === true) {
      setTimeout(() => {
        setNotification(false);
      }, 5000);
    }
  }, [notification]);

  const changeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (user.name.trim().length === 0) {
      setErrors({ ...errors, nameError: true });
      return;
    }

    if (user.email.trim().length === 0 || !user.email.trim().match(mailFormat)) {
      setErrors({ ...errors, emailError: true });
      return;
    }

    if (user.confirmPassword || user.newPassword) {
      if (user.confirmPassword.trim() !== user.newPassword.trim()) {
        setErrors({ ...errors, confirmPassError: true });
        return;
      }
      if (user.newPassword.trim().length < 8) {
        setErrors({ ...errors, newPassError: true });
        return;
      }
    }

    let userData = {
      data: {
        type: "profile",
        attributes: {
          name: user.name,
          email: user.email,
        },
      },
    };

    if (user.newPassword.length > 0) {
      userData = {
        data: {
          type: "profile",
          attributes: {
            name: user.name,
            email: user.email,
            password: user.newPassword,
            password_confirmation: user.confirmPassword,
          },
        },
      };
    }

    const response = await AuthService.updateProfile(JSON.stringify(userData));

    setErrors({
      nameError: false,
      emailError: false,
      passwordError: false,
      newPassError: false,
      confirmPassError: false,
    });

    setNotification(true);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true); 
  };

  const handleCancelClick = () => {
    setEditMode(false);
    getUserData(); 
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header name={user.name}>
        {notification && (
          <MDAlert color="info" mt="20px">
            <MDTypography variant="body2" color="white">
              Votre profil a été mis à jour
            </MDTypography>
          </MDAlert>
        )}
        <MDBox
          component="form"
          role="form"
          // onSubmit={submitHandler}
          display="flex"
          flexDirection="column"
        >
          <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              mr={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Nom
              </MDTypography>
              <MDBox mb={2} width="100%">
                <MDInput
                  type="name"
                  fullWidth
                  name="name"
                  value={user.name}
                  onChange={changeHandler}
                  error={errors.nameError}
                  disabled={!editMode} 
                />
                {errors.nameError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    Le nom ne peut pas être vide
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
            <MDBox
              display="flex"
              flexDirection="column"
              alignItems="flex-start"
              width="100%"
              ml={2}
            >
              <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                Email
              </MDTypography>
              <MDBox mb={1} width="100%">
                <MDInput
                  type="email"
                  fullWidth
                  name="email"
                  value={user.email}
                  onChange={changeHandler}
                  error={errors.emailError}
                  disabled={!editMode} 
                />
                {errors.emailError && (
                  <MDTypography variant="caption" color="error" fontWeight="light">
                    L'email doit être valide
                  </MDTypography>
                )}
              </MDBox>
            </MDBox>
          </MDBox>

          <MDBox display="flex" flexDirection="column" mb={3}>
            <MDBox display="flex" flexDirection="row">
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                mr={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Nouveau mot de passe
                </MDTypography>
                <MDBox mb={2} width="100%">
                  <MDInput
                    type="password"
                    fullWidth
                    name="newPassword"
                    placeholder="Nouveau mot de passe"
                    value={user.newPassword}
                    onChange={changeHandler}
                    error={errors.newPassError}
                    disabled={!editMode} 
                    inputProps={{
                      autoComplete: "new-password",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  {errors.newPassError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      Le mot de passe doit comporter au moins 8 caractères
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
              <MDBox
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                width="100%"
                ml={2}
              >
                <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
                  Confirmation du mot de passe
                </MDTypography>
                <MDBox mb={1} width="100%">
                  <MDInput
                    type="password"
                    fullWidth
                    name="confirmPassword"
                    placeholder="Confirmer le mot de passe"
                    value={user.confirmPassword}
                    onChange={changeHandler}
                    error={errors.confirmPassError}
                    disabled={!editMode} 
                    inputProps={{
                      autoComplete: "confirmPassword",
                      form: {
                        autoComplete: "off",
                      },
                    }}
                  />
                  {errors.confirmPassError && (
                    <MDTypography variant="caption" color="error" fontWeight="light">
                      La confirmation doit correspondre au nouveau mot de passe
                    </MDTypography>
                  )}
                </MDBox>
              </MDBox>
            </MDBox>

            <MDBox mt={4} display="flex" justifyContent="end" gap={2}>
              {!editMode ? (
                <MDButton type="button" variant="gradient" color="info" onClick={handleEditClick}>
                  Modifier
                </MDButton>
              ) : (
                <>
                  <MDButton variant="gradient" mx={2} color="success" onClick={submitHandler} >
                    Enregistrer
                  </MDButton>
                  <MDButton
                    variant="outlined"
                    color="error"
                    onClick={handleCancelClick}
                    mx={2}
                  >
                    Annuler
                  </MDButton>
                </>
              )}
            </MDBox>
          </MDBox>
        </MDBox>
      </Header>
      <Footer />
    </DashboardLayout>
  );
};

export default UserProfile;
