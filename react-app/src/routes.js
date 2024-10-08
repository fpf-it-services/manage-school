import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";

import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import AddSchool from "layouts/add-school";
// import Settings from "layouts/settings";

import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";

import Icon from "@mui/material/Icon";
import Settings from "layouts/settings";
import AddStudent from "layouts/add-student";
import Finances from "layouts/finances";


// const routes = [
//   {
//     type: "collapse",
//     name: "Dashboard",
//     key: "dashboard",
//     icon: <Icon fontSize="small">dashboard</Icon>,
//     route: "/dashboard",
//     component: <Dashboard />,
//   },
//   {
//     type: "collapse",
//     name: "Tables",
//     key: "tables",
//     icon: <Icon fontSize="small">table_view</Icon>,
//     route: "/tables",
//     component: <Tables />,
//   },
//   {
//     type: "collapse",
//     name: "Billing",
//     key: "billing",
//     icon: <Icon fontSize="small">receipt_long</Icon>,
//     route: "/billing",
//     component: <Billing />,
//   },
//   {
//     type: "collapse",
//     name: "Notifications",
//     key: "notifications",
//     icon: <Icon fontSize="small">notifications</Icon>,
//     route: "/notifications",
//     component: <Notifications />,
//   },
//   {
//     type: "collapse",
//     name: "Profile",
//     key: "profile",
//     icon: <Icon fontSize="small">person</Icon>,
//     route: "/profile",
//     component: <Profile />,
//   },
//   {
//     type: "collapse",
//     name: "Sign In",
//     key: "sign-in",
//     icon: <Icon fontSize="small">login</Icon>,
//     route: "/authentication/sign-in",
//     component: <SignIn />,
//   },

//   {
//     type: "examples",
//     name: "User Management",
//     key: "user-management",
//     icon: <Icon fontSize="small">list</Icon>,
//     route: "/user-management",
//     component: <UserManagement />,
//   },
//   {
//     type: "collapse",
//     name: "Sign Up",
//     key: "sign-up",
//     icon: <Icon fontSize="small">assignment</Icon>,
//     route: "/authentication/sign-up",
//     component: <SignUp />,
//   },



//   {
//     type: "auth",
//     name: "Reset Password",
//     key: "reset-password",
//     icon: <Icon fontSize="small">assignment</Icon>,
//     route: "/auth/reset-password",
//     component: <ResetPassword />,
//   },
// ];
const func_routes = (role) => {
  const commonRoutes = [
    {
      type: "auth",
      name: "Login",
      key: "login",
      icon: <Icon fontSize="small">login</Icon>,
      route: "/auth/login",
      component: <Login />,
    }, {
      type: "auth",
      name: "Register",
      key: "register",
      icon: <Icon fontSize="small">reigster</Icon>,
      route: "/auth/register",
      component: <Register />,
    }, {
      type: "auth",
      name: "Forgot Password",
      key: "forgot-password",
      icon: <Icon fontSize="small">assignment</Icon>,
      route: "/auth/forgot-password",
      component: <ForgotPassword />,
    }, {
      type: "examples",
      name: "Mon Profil",
      key: "mon-profil",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/mon-profil",
      component: <UserProfile />,
    }
  ];

  const adminRoutes = [
    {
      type: "examples",
      name: "Gestion des Écoles",
      key: "user-management",
      icon: <Icon fontSize="small">list</Icon>,
      route: "/gestion-ecoles",
      component: <UserManagement />,
    }, {
      type: "examples",
      name: "Ajout d'école",
      key: "ajout-ecoles",
      icon: <Icon fontSize="small">add</Icon>,
      route: "/ajouter-ecole",
      component: <AddSchool />,
    }, {
      type: "examples",
      name: "Paramètres scolaires",
      key: "settings-management",
      icon: <Icon fontSize="small">settings</Icon>,
      route: "/settings-management",
      component: <Settings />,
    }, {
      type: "collapse",
      name: "Programmer une session d'examen",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
  ];

  const schoolRoutes = [
    {
      type: "examples",
      name: "Mes classes",
      key: "mes-classes",
      icon: <Icon fontSize="small">list</Icon>,
      route: "/mes-classes",
      component: <UserManagement />,
    }, {
      type: "examples",
      name: "Ajouter un élève",
      key: "ajouter-eleve",
      icon: <Icon fontSize="small">add</Icon>,
      route: "/ajouter-eleve",
      component: <AddStudent />,
    }, {
      type: "examples",
      name: "Finances",
      key: "finances",
      icon: <Icon fontSize="small">attach_money</Icon>,
      route: "/mes-finances",
      component: <Finances />,
    }, {
      type: "collapse",
      name: "Participer à une session",
      key: "dashboard",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
  ];


  return role === "admin" ? [...commonRoutes, ...adminRoutes] : [...commonRoutes, ...schoolRoutes]
};

export default func_routes;

