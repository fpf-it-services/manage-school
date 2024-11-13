import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress"; 
import FinanceService from "../../services/finance-service"; 

export default function FinanceTable({ onFinanceSelect }) {
  const [finances, setFinances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    { Header: "Frais d'inscription", accessor: "frais_inscription", align: "center" },
    { Header: "Frais de Réinscription", accessor: "frais_reinscription", align: "center" },
    { Header: "Frais de scolarité", accessor: "frais_formation", align: "center" },
    { Header: "Frais annexes", accessor: "frais_annexe", align: "center" },
    { Header: "Mise à jour le", accessor: "mise_a_jour", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const handleEditClick = (id) => {
    setFinances((prevFinances) =>
      prevFinances.map((finance) =>
        finance.montants[0].id === id ? { ...finance, isEditing: !finance.isEditing } : finance
      )
    );
  };

  const handleSaveClick = async (finance) => {
    try {
      await FinanceService.updateFinance(finance.montants[0].id, {
        frais_inscription: finance.montants[0].frais_inscription,
        frais_reinscription: finance.montants[0].frais_reinscription, 
        frais_formation: finance.montants[0].frais_formation, 
        frais_annexe: finance.montants[0].frais_annexe, 
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
      prevFinances.map((finance) => {
        if (finance.montants[0].id === id) {
          return {
            ...finance,
            montants: finance.montants.map((montant) => 
              montant.id === id ? { ...montant, [field]: value } : montant
            ),
          };
        }
        return finance;
      })
    );
  };  

  const handleViewMoreClick = (finance) => {
    onFinanceSelect(finance); 
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
          frais_inscription: "",
          frais_reinscription: "",
          frais_formation: "",
          frais_annexe: "",
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
          frais_inscription: "",
          frais_reinscription: "",
          frais_formation: "",
          frais_annexe: "",
          action: "",
        },
      ],
    };
  }

  return {
    columns: getColumns(),
    rows: Array.isArray(finances) && finances.length > 0
      ? finances.map((finance) => ({
          niveau: (
            <MDTypography variant="caption" fontWeight="medium">
              {finance.niveau}
            </MDTypography>
          ),
          frais_inscription: finance.isEditing ? (
            <MDInput
              type="number"
              value={finance.montants[0].frais_inscription}
              onChange={(e) => handleInputChange(finance.montants[0].id, "frais_inscription", e.target.value)}
            />
          ) : (
            finance.montants[0].frais_inscription
          ),
          frais_reinscription: finance.isEditing ? (
            <MDInput
              type="number"
              value={finance.montants[0].frais_formation}
              onChange={(e) => handleInputChange(finance.montants[0].id, "frais_reinscription", e.target.value)}
            />
          ) : (
            finance.montants[0].frais_formation
          ),
          frais_formation: (
            <MDTypography variant="caption" fontWeight="medium">
              {finance.montants[0].frais_formation} 
            </MDTypography>
          ),
          frais_annexe: finance.isEditing ? (
            <MDInput
              type="number"
              value={finance.montants[0].frais_annexe}
              onChange={(e) => handleInputChange(finance.montants[0].id, "frais_annexe", e.target.value)}
            />
          ) : (
            finance.montants[0].frais_annexe
          ),
          mise_a_jour: (
            <MDTypography variant="caption" fontWeight="medium">
              {finance.montants[0].mise_a_jour} 
            </MDTypography>
          ),
          action: (
            <>
              <Button
                variant="text"
                color="primary"
                onClick={() => finance.isEditing ? handleSaveClick(finance) : handleEditClick(finance.montants[0].id)}
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
            frais_inscription: "",
            frais_reinscription: "",
            frais_formation: "",
            frais_annexe: "",
            action: "",
          },
        ],
  };
}
