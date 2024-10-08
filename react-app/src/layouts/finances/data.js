/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
        setFinances(response.data);
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
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
        <MDTypography variant="caption" color="error">
          {error}
        </MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox>
      <MDTypography variant="h6" fontWeight="medium">Gestion des Finances</MDTypography>
      <MDBox>
        {finances.length > 0 ? (
          finances.map((finance) => (
            <MDBox key={finance.id} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <MDBox width="15%">{finance.niveau}</MDBox>
              <MDBox width="15%">
                {finance.isEditing ? (
                  <input
                    type="number"
                    value={finance.fraisInscription}
                    onChange={(e) => handleInputChange(finance.id, "fraisInscription", e.target.value)}
                  />
                ) : (
                  finance.fraisInscription
                )}
              </MDBox>
              <MDBox width="15%">
                {finance.isEditing ? (
                  <input
                    type="number"
                    value={finance.fraisReinscription}
                    onChange={(e) => handleInputChange(finance.id, "fraisReinscription", e.target.value)}
                  />
                ) : (
                  finance.fraisReinscription
                )}
              </MDBox>
              <MDBox width="15%">
                {finance.isEditing ? (
                  <input
                    type="number"
                    value={finance.fraisScolarite}
                    onChange={(e) => handleInputChange(finance.id, "fraisScolarite", e.target.value)}
                  />
                ) : (
                  finance.fraisScolarite
                )}
              </MDBox>
              <MDBox width="15%">
                {finance.isEditing ? (
                  <input
                    type="number"
                    value={finance.fraisAnnexes}
                    onChange={(e) => handleInputChange(finance.id, "fraisAnnexes", e.target.value)}
                  />
                ) : (
                  finance.fraisAnnexes
                )}
              </MDBox>
              <MDBox width="10%">
                <MDTypography
                  component="button"
                  variant="caption"
                  color="primary"
                  onClick={() => handleEditClick(finance.id)}
                >
                  {finance.isEditing ? "Enregistrer" : "Editer"}
                </MDTypography>
              </MDBox>
            </MDBox>
          ))
        ) : (
          <MDTypography variant="caption" color="text">
            Aucune donnée financière disponible.
          </MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
}
