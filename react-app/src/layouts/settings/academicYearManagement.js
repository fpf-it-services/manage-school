import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import AcademicYearService from "../../services/academic-years-service"; 

const AcademicYearManagement = () => {
  const [date_debut, setDateDebut] = useState("");
  const [date_fin, setDateFin] = useState("");

  const [dateDebut, setDateDebutFormat] = useState("");
  const [dateFin, setDateFinFormat] = useState("");
  const [academicYears, setAcademicYears] = useState([]); 

  const formatDate = (date) => {
    const [year, month, day] = date.split("-").map(Number)
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');

    return `${formattedDay}/${formattedMonth}/${year}`
  }

  const handleStartDateChange = (e) => {
    setDateDebutFormat(e.target.value)
    setDateDebut(formatDate(e.target.value));
  };



  const handleEndDateChange = (e) => {
    setDateFinFormat(e.target.value)
    setDateFin(formatDate(e.target.value));
  };

  const handleAddYear = async () => {
    try {
      console.log({ date_debut, date_fin })
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
      console.log(response.data)
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
          value={dateDebut}
          onChange={handleStartDateChange}
          fullWidth 
        />
        <MDInput
          type="date"
          label="Date de Fin"
          value={dateFin}
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
                padding="10px"
                textAlign="center"
                boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"  
                backgroundColor="#f9f9f9" 
              >
                <MDTypography variant="body2" fontSize="15px" fontWeight="medium">
                  {`Du ${yearItem.date_debut} au ${yearItem.date_fin}`}
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
