import React, { useEffect, useState } from "react";
import {
  Card,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  IconButton,
  Tooltip,
  MenuItem, 
  FormControl, 
  InputLabel,
  Select
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDAlert from "components/MDAlert";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { fetchChildrens, updateChildInfo, getFieldsToChange } from "./data";
import Payment from "layouts/payments";
import { useNavigate } from "react-router-dom";


function MyChildren() {
  const [childrenData, setChildrenData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchChildrens();
        setChildrenData(response || []);
      } catch (error) {
        setChildrenData([]);
        console.error("Erreur lors de la récupération des données", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (alert.open) {
      const timer = setTimeout(() => setAlert({ open: false, message: "", type: "" }), 2500);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleOpenDialog = async (child) => {
    setSelectedChild(child);
    const initialData = JSON.parse(JSON.parse(child.champs || "[]")).reduce((acc, field) => {
      acc[field] = child.fields[field] || "";
      return acc;
    }, {});
    setFormData(initialData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChild(null);
    setFormData({});
  };

  const handlePaymentClick = (child) => {
    navigate("/pay-fees", { state: { child: child, isFromMyChildren: true } });
  };


  const handleChange = (field, value) => {
    console.log(formData)
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setAlert({ open: false, message: "", type: "" });
    try {
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        dataToSend.append(key, value);
      });
      const response = await updateChildInfo(selectedChild.id, dataToSend);
      if (response.success) {
        setAlert({ open: true, type: "success", message: "Mise à jour réussie." });
        handleCloseDialog();

        const updatedData = await fetchChildrens();
        setChildrenData(updatedData);
      } else {
        setAlert({ open: true, type: "error", message: "Erreur lors de la mise à jour." });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      handleCloseDialog();
      setAlert({ type: "error", message: "Une erreur est survenue." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        mx={2}
        py={3}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Mes Enfants en attente
        </MDTypography>
      </MDBox>

      {alert.open && (
        <MDBox mx={2} my={2}>
          <MDAlert color={alert.type} dismissible>
            {alert.message}
          </MDAlert>
        </MDBox>
      )}

      <MDBox pt={3} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {childrenData.map((child) => (
                <Grid item xs={6} sm={4} md={3} key={child.id}>
                  <Card sx={{ minHeight: "250px" }} key={child.id}>
                    <MDBox display="flex" flexDirection="column" alignItems="center" p={3}>
                      <Avatar
                        src={child.photo}
                        alt={child.nom}
                        sx={{ width: 100, height: 100, mb: 2 }}
                      />
                      <MDTypography variant="h6" gutterBottom>
                        {child.nom} {child.prenoms} ({child.ecole})
                      </MDTypography>
                      {child.status === "accepte" && (
                        <MDTypography variant="h6" gutterBottom color="success">
                          En attente de paiement
                        </MDTypography>
                      )}
                      {child.status === "rejete" && (
                        <MDTypography variant="h6" gutterBottom color="error">
                          Rejeté : {child.motif}
                        </MDTypography>
                      )}
                      {child.status === "rejete_partiellement" && (
                        <MDTypography variant="h6" gutterBottom color="warning">
                          Rejet Partiel : {child.motif}
                        </MDTypography>
                      )}

                      {child.status === "accepte" && (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handlePaymentClick(child)}
                        >
                          Payer l'inscription
                        </Button>
                      )}

                      {child.status === "rejete_partiellement" && (
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => handleOpenDialog(child)}
                        >
                          Modifier
                        </Button>
                      )}
                    </MDBox>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>

      <Footer />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
  <DialogTitle>Modifier les Informations de {selectedChild?.nom}</DialogTitle>
  <DialogContent>
    {selectedChild && (
      <Grid container spacing={2}>
        {JSON.parse(JSON.parse(selectedChild.champs || "[]")).map((field) => (
          <Grid item xs={12} key={field}>
            {["photo", "releve_de_notes", "releve_de_notes_examen", "acte_de_naissance"].includes(field) ? (
              <MDBox mb={2} display="flex" alignItems="center" justifyContent="space-between">
                <MDBox flex={1} mr={1}>
                  <MDTypography variant="caption" display="block" fontWeight="medium">
                    {field.replace(/_/g, " ")}
                  </MDTypography> 
                  <MDInput
                    fullWidth
                    type="file"
                    name={field}
                    onChange={(e) => handleChange(field, e.target.files[0])}
                  />
                </MDBox>

                {selectedChild.fields[field] && (
                  <Tooltip title="Voir l'ancien fichier">
                    <IconButton
                      href={selectedChild.fields[field]}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </MDBox>
            ) : field === "sexe" ? (
              <MDBox mb={2}>
                <MDTypography variant="caption" display="block" fontWeight="medium">
                  Sexe
                </MDTypography>
                <Select
                  fullWidth
                  value={formData[field] || ""}
                  style={{ borderRadius: "8px", height: "40px" }}
                  onChange={(e) => handleChange(field, e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Sélectionnez le sexe
                  </MenuItem>
                  <MenuItem value="M">Masculin</MenuItem>
                  <MenuItem value="F">Féminin</MenuItem>
                </Select>
              </MDBox>
            ) : field === "date_naissance" ? (
              <MDBox mb={2}>
                <MDTypography variant="caption" display="block" fontWeight="medium">
                  Date de naissance
                </MDTypography>
                <MDInput
                  fullWidth
                  type="date"
                  name={field}
                  value={formData[field].split("T")[0] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </MDBox>
            ) : (
              <MDBox mb={2}>
                <MDTypography variant="caption" display="block" fontWeight="medium">
                  {field.replace(/_/g, " ")}
                </MDTypography>
                <MDInput
                  fullWidth
                  type="text"
                  name={field}
                  placeholder={`Saisir ${field.replace(/_/g, " ")}`}
                  value={formData[field] || ""}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </MDBox>
            )}
          </Grid>
        ))}
        <Grid item xs={12} textAlign="right">
          <Button variant="text" color="success" onClick={handleUpdate} sx={{ mr: 2 }}>
            {isLoading ? <CircularProgress size={20} /> : "Enregistrer"}
          </Button>
          <Button variant="text" onClick={handleCloseDialog}>
            Annuler
          </Button>
        </Grid>
      </Grid>
    )}
  </DialogContent>
</Dialog>

    </DashboardLayout>
  );
};

export default MyChildren;
