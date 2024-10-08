import HttpService from "./htttp.service"; 

class AcademicYearService {
  // Récupérer la liste des années académiques
  getAcademicYears = async () => {
    const endpoint = `annees`; 
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle année académique
  createAcademicYear = async (yearData) => {
    const endpoint = 'annees'; 
    console.log(yearData)
    return await HttpService.post(endpoint, yearData);
  };

  // Récupérer l'année académique en cours
  getCurrentAcademicYear = async (yearData) => {
    const endpoint = 'annees'; 
    return await HttpService.post(endpoint, yearData);
  };

  // Supprimer une année académique
  deleteAcademicYear = async (yearId) => {
    const endpoint = `academic-years/${yearId}`; 
    return await HttpService.delete(endpoint);
  };
}

export default new AcademicYearService();
