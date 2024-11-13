import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import LevelService from "../../services/level-service"; 

const LevelManagement = () => {
  const [niveau, setLevel] = useState("");
  const [levels, setLevels] = useState([]); 
  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const handleAddLevel = async () => {
    try {
      await LevelService.createLevel({ niveau }); 
      setLevel(""); 
      fetchLevels(); 
    } catch (error) {
      console.error("Erreur lors de l'ajout du niveau :", error);
    }
  };

  const fetchLevels = async () => {
    try {
      const response = await LevelService.getLevels(); 
      setLevels(response.data || []); 
    } catch (error) {
      console.error("Erreur lors de la récupération des niveaux :", error);
      setLevels([]); 
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  return (
    <MDBox mb={4}>
      <MDTypography variant="h6">Gestion des Niveaux</MDTypography>
      <MDBox display="flex" flexDirection="row" gap={3} mt={2}>
        <MDInput
          type="text"
          placeholder="Nouveau Niveau"
          value={niveau}
          onChange={handleLevelChange}
          fullWidth 
        />
        <MDButton color="success" onClick={handleAddLevel}>
          Ajouter
        </MDButton>
      </MDBox>
      <MDBox mt={4}>
        <MDTypography variant="h6" mb={2}>
          Liste des Niveaux
        </MDTypography>
        {levels.length > 0 ? (
          <MDBox
            display="grid"
            gridTemplateColumns={{
              xs: "repeat(2, 1fr)", 
              sm: "repeat(3, 1fr)", 
              md: "repeat(5, 1fr)", 
              lg: "repeat(6, 1fr)",
            }}
            gap={3} 
          >
            {levels.map((levelItem) => (
              <MDBox
                key={levelItem.id}
                border="1px solid #ddd" 
                borderRadius="8px"
                padding="5px"
                textAlign="center"
                boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)" 
                backgroundColor="#f9f9f9" 
              >
                <MDTypography variant="body2" fontSize="15px" fontWeight="medium">
                  {levelItem.niveau}
                </MDTypography>
              </MDBox>
            ))}
          </MDBox>
        ) : (
          <MDTypography>Aucun niveau disponible.</MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
};

export default LevelManagement;
