import { useState, useEffect, useContext } from "react";
import MDBox from "components/MDBox";
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
  const [notification, setNotification] = useState(false);
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
    console.log(response)
    setUser({ ...user, ...response.data });
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (notification) {
      setTimeout(() => setNotification(false), 5000);
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

  const handleEditClick = () => setEditMode(true);
  const handleCancelClick = () => {
    setEditMode(false);
    getUserData();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {notification && <MDAlert color="info">Votre profil a été mis à jour</MDAlert>}
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

