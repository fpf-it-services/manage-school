import HttpService from "./htttp.service"; 

class SerieService {
  // Récupérer la liste des séries académiques
  getSeries = async () => {
    const endpoint = `series`; 
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle série académique
  createSerie = async (serieData) => {
    const endpoint = 'series'; 
    return await HttpService.post(endpoint, serieData);
  };

  // Supprimer une série académique
  deleteSerie = async (serieId) => {
    const endpoint = `series/${serieId}`;
    return await HttpService.delete(endpoint);
  };
}

export default new SerieService();
