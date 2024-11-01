import HttpService from "./htttp.service"; 

class LevelService {
  // Récupérer la liste des niveaux académiques
  getLevels = async () => {
    const endpoint = `niveaux`; 
    return await HttpService.get(endpoint);
  };

  getLevelsVerified = async () => {
    const endpoint = `ecole/mes-niveaux`; 
    return await HttpService.get(endpoint);
  };

  createLevel = async (levelData) => {
    const endpoint = 'niveaux'; 
    return await HttpService.post(endpoint, levelData);
  };

  deleteLevel = async (levelId) => {
    const endpoint = `niveaux/${levelId}`; 
    return await HttpService.delete(endpoint);
  };

  getSeriesByLevel = async (levelId) => {
    if (!levelId) {
      console.error("ID de niveau manquant");
      return [];
    } 
    try {
      const endpoint = `series`; 
      const response = await HttpService.get(endpoint);
      return response?.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des séries:", error);
      return [];
    }
  };

  // Récupérer les classes d'un niveau et d'une série spécifique
  getClassesByLevelAndSerie = async (levelId, serieId, selectedYear) => {
    if (!levelId) {
      console.error("ID de niveau ou de série manquant");
      return [];
    }
    try {
      // const endpoint = serieId ? `getClassesByLevelAndSerie?niveau_id=${levelId}&serie_id=${serieId}&annee_id=${selectedYear}` : `getClassesByLevelAndSerie?niveau_id=${levelId}&annee_id=${selectedYear}`; 
      const endpoint = `ecole/classes`
      const response = await HttpService.get(endpoint);
      console.log(response)
      return response?.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des classes:", error);
      return [];
    }
  };
}

export default new LevelService();
