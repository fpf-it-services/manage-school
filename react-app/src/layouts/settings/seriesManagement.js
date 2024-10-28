import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import SerieService from "../../services/serie-service"; 

const SeriesManagement = () => {
  const [serie, setSeries] = useState("");
  const [seriesList, setSeriesList] = useState([]); 

  const handleSeriesChange = (e) => {
    setSeries(e.target.value);
  };

  const handleAddSeries = async () => {
    try {
      await SerieService.createSerie({ serie }); 
      setSeries(""); 
      fetchSeries(); 
    } catch (error) {
      console.error("Erreur lors de l'ajout de la série :", error);
    }
  };

  const fetchSeries = async () => {
    try {
      const response = await SerieService.getSeries(); 
      setSeriesList(response.data || []); 
    } catch (error) {
      console.error("Erreur lors de la récupération des séries :", error);
      setSeriesList([]); 
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  return (
    <MDBox mb={4}>
      <MDTypography variant="h6">Gestion des Séries</MDTypography>
      <MDBox display="flex" flexDirection="row" gap={3} mt={2}>
        <MDInput
          type="text"
          placeholder="Nouvelle Série"
          value={serie}
          onChange={handleSeriesChange}
          fullWidth 
        />
        <MDButton color="success" onClick={handleAddSeries}>
          Ajouter
        </MDButton>
      </MDBox>
      <MDBox mt={4}>
        <MDTypography variant="h6" mb={2}>
          Liste des Séries
        </MDTypography>
        {seriesList.length > 0 ? (
          <MDBox
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(2, 1fr)", 
              sm: "repeat(3, 1fr)", 
              md: "repeat(5, 1fr)", 
              lg: "repeat(6, 1fr)", 
            }}
            gap={3} // Espace entre les éléments
          >
            {seriesList.map((serieItem) => (
              <MDBox
                key={serieItem.id}
                border="1px solid #ddd" // Bordure plus claire
                borderRadius="8px"
                padding="4px"
                textAlign="center"
                boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)" // Ajout d'une légère ombre
                backgroundColor="#f9f9f9" // Couleur de fond légère
              >
                <MDTypography variant="body2" fontSize="15px" fontWeight="medium">
                  {serieItem.serie}
                </MDTypography>
              </MDBox>
            ))}
          </MDBox>
        ) : (
          <MDTypography>Aucune série disponible.</MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
};

export default SeriesManagement;
