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
  getCurrentAcademicYear = async () => {
    const endpoint = 'annee-actuelle'; 
    return await HttpService.get(endpoint);
  };
}

export default new AcademicYearService();
