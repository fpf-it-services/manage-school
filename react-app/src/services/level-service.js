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
}

export default new LevelService();
