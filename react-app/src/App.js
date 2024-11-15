import { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import brandWhite from "assets/images/logo-ct.png";
import brandDark from "assets/images/logo-ct-dark.png";
import { setupAxiosInterceptors } from "./services/interceptor";
import ProtectedRoute from "examples/ProtectedRoute";
import ForgotPassword from "auth/forgot-password";
import ResetPassword from "auth/reset-password";
import Login from "auth/login";
import Register from "auth/register";
import { AuthContext } from "context";
import UserProfile from "layouts/user-profile";
import UserManagement from "layouts/user-management";
import { Helmet } from "react-helmet";
import func_routes from "routes";

export default function App() {
  const authContext = useContext(AuthContext);
  const routes = func_routes(authContext.role);

  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const { pathname } = useLocation();

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  const navigate = useNavigate();
  setupAxiosInterceptors(() => {
    authContext.logout();
    navigate("/auth/login");
  });

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route && route.type !== "auth") {
        return (
          <Route
            exact
            path={route.route}
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                {route.component}
              </ProtectedRoute>
            }
            key={route.key}
          />
        );
      }
      return null;
    });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content="gestion, écoles, élèves, professeurs, classes, dashboard, management, administration"
        />
        <meta
          name="description"
          content="Une application de gestion d'écoles, permettant de gérer les élèves, les professeurs, les classes et les emplois du temps."
        />
        <meta itemProp="name" content="Application de gestion d'écoles" />
        <meta
          itemProp="description"
          content="Une application complète pour la gestion des écoles, avec un tableau de bord facile à utiliser."
        />
        <meta itemProp="image" content="https://example.com/image-gestion-ecoles.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@schoolapp" />
        <meta name="twitter:title" content="Application de gestion d'écoles" />
        <meta
          name="twitter:description"
          content="Une solution tout-en-un pour la gestion des écoles, des élèves aux emplois du temps."
        />
        <meta name="twitter:creator" content="@schoolapp" />
        {/* <meta name="twitter:image" content="https://example.com/image-gestion-ecoles.jpg" /> */}
        <meta property="og:title" content="Application de gestion d'écoles" />
        <meta property="og:type" content="article" />
        <meta
          property="og:description"
          content="Une application complète pour la gestion des écoles, facilitant la gestion des classes et des emplois du temps."
        />
        <meta property="og:site_name" content="School App" />
      </Helmet>
      <ThemeProvider theme={darkMode ? themeDark : theme}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="Manage School"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          <Route path="/" element={<Navigate to="/auth/login" />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route
            exact
            path="user-profile"
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                <UserProfile />
              </ProtectedRoute>
            }
            key="user-profile"
          />
          <Route
            exact
            path="user-management"
            element={
              <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
                <UserManagement />
              </ProtectedRoute>
            }
            key="user-management"
          />
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/mes-classes" />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}
