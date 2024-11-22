import HttpService from "./htttp.service"; 

class ClassService {
  // Récupérer la liste des classes
  getClasses = async (an = 0 ) => {
    const endpoint = an === 0 ? `ecole/classes` : `ecole/classes?annee_id=${an}`; 
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle classe
  createClass = async (classData) => {
    const endpoint = 'ecole/classes'; 
    console.log(classData)
    return await HttpService.post(endpoint, classData);
  };

  // Upload des élèves dans une classe via un fichier
  uploadStudents = async (classId, data) => {
    const endpoint = `ecole/eleves/classe/${classId}`;
    return await HttpService.post(endpoint, data);
  };
}

export default new ClassService();


