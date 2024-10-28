import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress"; 
import FinanceService from "../../services/finance-service"; 

export default function FinanceTable() {
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
    { Header: "Niveau", accessor: "niveau", align: "left" },
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

  const handleInputChange = (id, field, value) => {
    setFinances((prevFinances) =>
      prevFinances.map((finance) =>
        finance.id === id ? { ...finance, [field]: value } : finance
      )
    );
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

  // Vérifiez que finances est bien un tableau avant de faire la boucle
  const rows = Array.isArray(finances) && finances.length > 0
    ? finances.map((finance) => ({
        niveau: finance.niveau,
        fraisInscription: finance.isEditing ? (
          <input
            type="number"
            value={finance.fraisInscription}
            onChange={(e) => handleInputChange(finance.id, "fraisInscription", e.target.value)}
          />
        ) : (
          finance.fraisInscription
        ),
        fraisReinscription: finance.isEditing ? (
          <input
            type="number"
            value={finance.fraisReinscription}
            onChange={(e) => handleInputChange(finance.id, "fraisReinscription", e.target.value)}
          />
        ) : (
          finance.fraisReinscription
        ),
        fraisScolarite: finance.isEditing ? (
          <input
            type="number"
            value={finance.fraisScolarite}
            onChange={(e) => handleInputChange(finance.id, "fraisScolarite", e.target.value)}
          />
        ) : (
          finance.fraisScolarite
        ),
        fraisAnnexes: finance.isEditing ? (
          <input
            type="number"
            value={finance.fraisAnnexes}
            onChange={(e) => handleInputChange(finance.id, "fraisAnnexes", e.target.value)}
          />
        ) : (
          finance.fraisAnnexes
        ),
        action: (
          <MDTypography
            component="button"
            variant="caption"
            color="primary"
            onClick={() => handleEditClick(finance.id)}
          >
            {finance.isEditing ? "Enregistrer" : "Editer"}
          </MDTypography>
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

  return {
    columns: getColumns(),
    rows,
  };
}
