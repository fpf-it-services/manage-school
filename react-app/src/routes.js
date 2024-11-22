import Dashboard from "layouts/dashboard";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import AddSchool from "layouts/add-school";
// import Settings from "layouts/settings";

import Login from "auth/login";
import Register from "auth/register";
import ForgotPassword from "auth/forgot-password";

import Icon from "@mui/material/Icon";
import Settings from "layouts/settings";
import AddStudent from "layouts/add-student";
import Finances from "layouts/finances";
import ClassManagement from "layouts/class-management";
import Paiement from "layouts/payment";
import Historique from "layouts/history";
import SettingsFinances from "layouts/settings-finance";
import DepotDossier from "auth/depot-dossier";
import TransactionHistory from "layouts/history-transaction-per-school";
import Payment from "layouts/payments";
import MesTransactions from "layouts/mes-transactions";
import PendingStudents from "layouts/pending-registration-student";
import Overview from "layouts/profile";
import MyChildren from "layouts/mes-enfants";


// const routes = [
//   {
//     type: "collapse",
//     name: "Notifications",
//     key: "notifications",
//     icon: <Icon fontSize="small">notifications</Icon>,
//     route: "/notifications",
//     component: <Notifications />,
//   },


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
      icon: <Icon fontSize="small">person_add</Icon>,
      route: "/auth/register",
      component: <Register />,
    }, {
      type: "auth",
      name: "Forgot Password",
      key: "forgot-password",
      icon: <Icon fontSize="small">lock_reset</Icon>,
      route: "/auth/forgot-password",
      component: <ForgotPassword />,
    }, {
      type: "examples",
      name: "Mon Profil",
      key: "my-profile",
      icon: <Icon fontSize="small">person</Icon>,
      route: "/my-profile",
      component: <UserProfile />,
    }, {
      type: "public",
      name: "Historique des Transcations",
      key: "view-history",
      icon: <Icon fontSize="small">history</Icon>,
      route: "/public/view-history",
      component: <Historique />,
    }, {
      type: "auth",
      name: "Document Submission",
      key: "document-submission",
      icon: <Icon fontSize="small">folder</Icon>,
      route: "/auth/document-submission",
      component: <DepotDossier />,
    },
  ];

  const adminRoutes = [
    {
      type: "examples",
      name: "School Management",
      key: "school-management",
      icon: <Icon fontSize="small">list</Icon>,
      route: "/school-management",
      component: <UserManagement />,
    }, {
      type: "examples",
      name: "Add School",
      key: "add-school",
      icon: <Icon fontSize="small">add</Icon>,
      route: "/add-school",
      component: <AddSchool />,
    }, {
      type: "examples",
      name: "School Settings",
      key: "school-settings",
      icon: <Icon fontSize="small">settings</Icon>,
      route: "/school-settings",
      component: <Settings />,
    }, {
      type: "examples",
      name: "Pending Registrations",
      key: "pending-registrations",
      icon: <Icon fontSize="small">hourglass_empty</Icon>,
      route: "/pending-registrations",
      component: <Dashboard />,
    }, {
      type: "examples",
      name: "Transaction History",
      key: "transaction-history",
      icon: <Icon fontSize="small">history</Icon>,
      route: "/transaction-history",
      component: <TransactionHistory />,
    }, {
      type: "collapse",
      name: "Schedule Exam Session",
      key: "schedule-exam-session",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
  ];

  const otherRoutes = [
    {
      type: "examples",
      name: "En Attente",
      key: "en-attente",
      icon: <Icon fontSize="small">hourglass_empty</Icon>,
      route: "/en-attente",
      component: <MyChildren />,
    }, 
    {
      type: "examples",
      name: "Mes Transactions", 
      key: "my-transactions",
      icon: <Icon fontSize="small">receipt_long</Icon>,
      route: "/my-transactions",
      component: <MesTransactions />,
    }, {
      type: "examples",
      name: "Payer Frais",
      key: "pay-fees",
      icon: <Icon fontSize="small">payment</Icon>,
      route: "/pay-fees",
      component: <Payment />,
    }, {
      type: "examples",
      name: "Academic Results",
      key: "academic-results",
      icon: <Icon fontSize="small">grading</Icon>,
      route: "/academic-results",
      component: <Dashboard />,
    },
  ];

  const schoolRoutes = [
    {
      type: "examples",
      name: "Mes Classes",
      key: "my-classes",
      icon: <Icon fontSize="small">list</Icon>,
      route: "/my-classes",
      component: <ClassManagement />,
    }, {
      type: "examples",
      name: "Inscription en Attente",
      key: "pending-registrations",
      icon: <Icon fontSize="small">hourglass_empty</Icon>,
      route: "/pending-student-registrations",
      component: <PendingStudents />,
    }, {
      type: "examples",
      name: "Ajouter Élève",
      key: "add-student",
      icon: <Icon fontSize="small">person_add</Icon>,
      route: "/add-student",
      component: <AddStudent />,
    }, {
      type: "examples",
      name: "Finances",
      key: "finances",
      icon: <Icon fontSize="small">attach_money</Icon>,
      route: "/finances",
      component: <Finances />,
    }, {
      type: "examples",
      name: "Transactions des Élèves",
      key: "student-transactions",
      icon: <Icon fontSize="small">history</Icon>,
      route: "/student-transactions",
      component: <TransactionHistory />,
    }, {
      type: "examples",
      name: "Paramètres",
      key: "school-finances",
      icon: <Icon fontSize="small">settings</Icon>,
      route: "/school-finances",
      component: <SettingsFinances />,
    }, {
      type: "collapse",
      name: "Join Exam Session",
      key: "join-exam-session",
      icon: <Icon fontSize="small">dashboard</Icon>,
      route: "/dashboard",
      component: <Dashboard />,
    },
  ];

  if (role === "admin") {
    return [...commonRoutes, ...adminRoutes];
  } else if (role === "ecole") {
    return [...commonRoutes, ...schoolRoutes];
  } else {
    return [...commonRoutes, ...otherRoutes];
  }
};

export default func_routes;

