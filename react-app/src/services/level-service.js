import HttpService from "./htttp.service"; 

class LevelService {
  // Récupérer la liste des niveaux académiques
  getLevels = async () => {
    const endpoint = `niveaux`; 
    return await HttpService.get(endpoint);
  };

  // Créer un nouveau niveau académique
  createLevel = async (levelData) => {
    const endpoint = 'niveaux'; 
    return await HttpService.post(endpoint, levelData);
  };

  // Supprimer un niveau académique
  deleteLevel = async (levelId) => {
    const endpoint = `levels/${levelId}`; 
    return await HttpService.delete(endpoint);
  };

  // Récupérer les séries d'un niveau spécifique
  getSeriesByLevel = async (levelId) => {
    if (!levelId) {
      console.error("ID de niveau manquant");
      return [];
    } 
    try {
      const endpoint = `series`; // Endpoint à ajuster si nécessaire
      const response = await HttpService.get(endpoint);
      return response?.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des séries:", error);
      return [];
    }
  };

  // Récupérer les classes d'un niveau et d'une série spécifique
  getClassesByLevelAndSerie = async (levelId, serieId) => {
    if (!levelId) {
      console.error("ID de niveau ou de série manquant");
      return [];
    }
    try {
      const endpoint = serieId ? `classesByLevelAndSerie?level=${levelId}&serie=${serieId}` : `classesByLevelAndSerie?level=${levelId}`; // Endpoint à ajuster si nécessaire
      const response = await HttpService.get(endpoint);
      return response?.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des classes:", error);
      return [];
    }
  };
}

export default new LevelService();
