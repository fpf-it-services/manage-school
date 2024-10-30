import { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableRow } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress"; 
import FinanceService from "../../services/finance-service"; 

export default function FinanceTable() {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFinance, setSelectedFinance] = useState(null);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        const response = await FinanceService.getFinances(); 
        setFinances(response.data || []); 
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des finances", error);
        setError("Une erreur est survenue lors de la récupération des finances.");
        setLoading(false);
      }
    };

    fetchFinances();
  }, []);

  const getColumns = () => [
    { Header: "Niveau", accessor: "niveau", align: "center" },
    { Header: "Frais d'inscription", accessor: "fraisInscription", align: "center" },
    { Header: "Frais de Réinscription", accessor: "fraisReinscription", align: "center" },
    { Header: "Frais de scolarité", accessor: "fraisScolarite", align: "center" },
    { Header: "Frais annexes", accessor: "fraisAnnexes", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const handleEditClick = (id) => {
    setFinances((prevFinances) =>
      prevFinances.map((finance) =>
        finance.id === id ? { ...finance, isEditing: !finance.isEditing } : finance
      )
    );
  };

  const handleSaveClick = async (finance) => {
    try {
      await FinanceService.updateFinance(finance.id, {
        fraisInscription: finance.fraisInscription,
        fraisReinscription: finance.fraisReinscription,
        fraisScolarite: finance.fraisScolarite,
        fraisAnnexes: finance.fraisAnnexes,
      });
      setFinances((prevFinances) =>
        prevFinances.map((f) => 
          f.id === finance.id ? { ...f, isEditing: false } : f
        )
      );
      alert("Les modifications ont été enregistrées avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des modifications", error);
      setError("Une erreur est survenue lors de la sauvegarde des modifications.");
    }
  };

  const handleInputChange = (id, field, value) => {
    setFinances((prevFinances) =>
      prevFinances.map((finance) =>
        finance.id === id ? { ...finance, [field]: value } : finance
      )
    );
  };

  const handleViewMoreClick = (finance) => {
    setSelectedFinance(finance);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedFinance(null);
  };

  if (loading) {
    return {
      columns: getColumns(),
      rows: [
        {
          niveau: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </MDBox>
          ),
          fraisInscription: "",
          fraisReinscription: "",
          fraisScolarite: "",
          fraisAnnexes: "",
          action: "",
        },
      ],
    };
  }

  if (error) {
    return {
      columns: getColumns(),
      rows: [
        {
          niveau: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <MDTypography variant="caption" color="error">
                {error}
              </MDTypography>
            </MDBox>
          ),
          fraisInscription: "",
          fraisReinscription: "",
          fraisScolarite: "",
          fraisAnnexes: "",
          action: "",
        },
      ],
    };
  }

  const rows = Array.isArray(finances) && finances.length > 0
    ? finances.map((finance) => ({
        niveau: (
          <MDTypography variant="caption" fontWeight="medium">
            {finance.niveau}
          </MDTypography>
        ),
        fraisInscription: finance.isEditing ? (
          <MDInput
            type="number"
            value={finance.fraisInscription}
            onChange={(e) => handleInputChange(finance.id, "fraisInscription", e.target.value)}
          />
        ) : (
          finance.fraisInscription
        ),
        fraisReinscription: finance.isEditing ? (
          <MDInput
            type="number"
            value={finance.fraisReinscription}
            onChange={(e) => handleInputChange(finance.id, "fraisReinscription", e.target.value)}
          />
        ) : (
          finance.fraisReinscription
        ),
        fraisScolarite: finance.isEditing ? (
          <MDInput
            type="number"
            value={finance.fraisScolarite}
            onChange={(e) => handleInputChange(finance.id, "fraisScolarite", e.target.value)}
          />
        ) : (
          finance.fraisScolarite
        ),
        fraisAnnexes: finance.isEditing ? (
          <MDInput
            type="number"
            value={finance.fraisAnnexes}
            onChange={(e) => handleInputChange(finance.id, "fraisAnnexes", e.target.value)}
          />
        ) : (
          finance.fraisAnnexes
        ),
        action: (
          <>
            <Button
              variant="text"
              color="primary"
              onClick={() => finance.isEditing ? handleSaveClick(finance) : handleEditClick(finance.id)}
            >
              {finance.isEditing ? "Enregistrer" : "Editer"}
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={() => handleViewMoreClick(finance)}
            >
              Voir plus
            </Button>
          </>
        ),
      }))
    : [
        {
          niveau: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <MDTypography variant="caption" color="text">
                Aucune donnée financière disponible.
              </MDTypography>
            </MDBox>
          ),
          fraisInscription: "",
          fraisReinscription: "",
          fraisScolarite: "",
          fraisAnnexes: "",
          action: "",
        },
      ];

  return (
    <>
      { /* Table component here */ }
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{selectedFinance?.niveau}</DialogTitle>
        <DialogContent>
          <Table>
            <TableBody>
              {selectedFinance?.tranches?.map((tranche, index) => (
                <TableRow key={index}>
                  <TableCell>{tranche.nom}</TableCell>
                  <TableCell align="right">{tranche.montant}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell align="right">
                  {selectedFinance?.tranches?.reduce((total, tranche) => total + tranche.montant, 0)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
