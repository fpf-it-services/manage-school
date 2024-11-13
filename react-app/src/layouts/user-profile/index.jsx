import { useState, useEffect, useContext } from "react";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Header from "layouts/user-profile/Header";

import AuthService from "../../services/auth-service";
import AdminProfile from "./AdminProfile";
import SchoolProfile from "./SchoolProfile";
import { AuthContext } from "context";

const UserProfile = () => {
  const authContext = useContext(AuthContext);
  const [notification, setNotification] = useState({ show: false, type: "info", message: "" });
  const [user, setUser] = useState({
    role: authContext.role, 
    name: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
    schoolName: "",
  });

  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false); 

  const getUserData = async () => {
    const response = await AuthService.getProfile(`${authContext.role}`);
    setUser({ ...user, ...response.data });
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (notification.show) {
      setTimeout(() => setNotification({ show: false, type: "info", message: "" }), 5000);
    }
  }, [notification]);

  const changeHandler = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
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
  
    try {
      const response = await AuthService.updateProfile(JSON.stringify(userData));
      setNotification({ show: true, type: "success", message: "Votre profil a été mis à jour avec succès" });
      
      setErrors({
        nameError: false,
        emailError: false,
        passwordError: false,
        newPassError: false,
        confirmPassError: false,
      });
      
      setEditMode(false);
    } catch (error) {
      setNotification({ show: true, type: "error", message: "Une erreur est survenue lors de la mise à jour" });
    }
  };

  const handleEditClick = () => setEditMode(true);
  const handleCancelClick = () => {
    setEditMode(false);
    getUserData();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification.show && <MDAlert color={notification.type}>{notification.message}</MDAlert>}
      <Header name={user.role === "admin" ? user.name : user.nom} image={user.logo}>
        {user.role === "admin" ? (
          <AdminProfile 
            user={user} 
            changeHandler={changeHandler} 
            submitHandler={submitHandler} 
            errors={errors} 
            editMode={editMode} 
            handleEditClick={handleEditClick} 
            handleCancelClick={handleCancelClick} 
          />
        ) : (
          <SchoolProfile 
            user={user} 
            changeHandler={changeHandler} 
            submitHandler={submitHandler} 
            errors={errors} 
            editMode={editMode} 
            handleEditClick={handleEditClick} 
            handleCancelClick={handleCancelClick} 
          />
        )}
      </Header>
      <Footer />
    </DashboardLayout>
  );
};

export default UserProfile;
