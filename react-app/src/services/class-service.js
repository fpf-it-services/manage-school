import HttpService from "./htttp.service"; 

class ClassService {
  // Récupérer la liste des classes
  getClasses = async () => {
    const endpoint = 'classes'; 
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle classe
  createClass = async (classData) => {
    const endpoint = 'classes'; 
    return await HttpService.post(endpoint, classData);
  };

  // Supprimer une classe
  deleteClass = async (classId) => {
    const endpoint = `classes/${classId}`;
    return await HttpService.delete(endpoint);
  };
}

export default new ClassService();
