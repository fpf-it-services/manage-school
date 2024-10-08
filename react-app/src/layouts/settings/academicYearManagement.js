import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import AcademicYearService from "../../services/academic-years-service"; 

const AcademicYearManagement = () => {
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");
  const [academicYears, setAcademicYears] = useState([]); 

  const handleStartDateChange = (e) => {
    setDateDebut(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setDateFin(e.target.value);
  };

  const handleAddYear = async () => {
    try {
      await AcademicYearService.createAcademicYear({ date_debut, date_fin });
      setDateDebut("");
      setDateFin(""); 
      fetchAcademicYears();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'année académique :", error);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const response = await AcademicYearService.getAcademicYears(); 
      setAcademicYears(response.data || []); 
    } catch (error) {
      console.error("Erreur lors de la récupération des années académiques :", error);
      setAcademicYears([]);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  return (
    <MDBox mb={4}>
      <MDTypography variant="h6">Gestion des Années Académiques</MDTypography>
      <MDBox display="flex" flexDirection="row" gap={2} mt={2}>
        <MDInput
          type="date"
          label="Date de Début"
          value={date_debut}
          onChange={handleStartDateChange}
          fullWidth 
        />
        <MDInput
          type="date"
          label="Date de Fin"
          value={date_fin}
          onChange={handleEndDateChange}
          fullWidth 
        />
        <MDButton color="success" onClick={handleAddYear} ml={2}>
          Ajouter
        </MDButton>
      </MDBox>

      <MDBox mt={4}>
        <MDTypography variant="h6" mb={2}>
          Liste des Années Académiques
        </MDTypography>
        {academicYears.length > 0 ? (
          <MDBox 
            display="grid" 
            gridTemplateColumns={{
              xs: "repeat(1, 1fr)", 
              sm: "repeat(2, 1fr)", 
              md: "repeat(3, 1fr)", 
              lg: "repeat(4, 1fr)"  
            }} 
            gap={3} 
          >
            {academicYears.map((yearItem) => (
              <MDBox
                key={yearItem.id}
                border="1px solid #ddd"  
                borderRadius="8px"
                padding="16px"
                textAlign="center"
                boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"  
                backgroundColor="#f9f9f9" 
              >
                <MDTypography variant="subtitle1" fontWeight="medium">
                  {`Du ${new Date(yearItem.date_debut).toLocaleDateString()} au ${new Date(yearItem.date_fin).toLocaleDateString()}`}
                </MDTypography>
              </MDBox>
            ))}
          </MDBox>
        ) : (
          <MDTypography>Aucune année académique disponible.</MDTypography>
        )}
      </MDBox>
    </MDBox>
  );
};

export default AcademicYearManagement;
