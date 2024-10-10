import HttpService from "./htttp.service"; 

class ClassService {
  // Récupérer la liste des classes
  getClasses = async () => {
    const endpoint = 'ecole/classes'; 
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle classe
  createClass = async (classData) => {
    const endpoint = 'ecole/classes'; 
    return await HttpService.post(endpoint, classData);
  };

  // Supprimer une classe
  deleteClass = async (classId) => {
    const endpoint = `classes/${classId}`;
    return await HttpService.delete(endpoint);
  };

  // Mettre à jour une classe
  updateClass = async (classId, classData) => {
    const endpoint = `classes/${classId}`;
    return await HttpService.put(endpoint, classData);
  };

  // Récupérer les élèves d'une classe spécifique
  getStudentsByClass = async (classId) => {
    const endpoint = `classes/${classId}/students`;
    return await HttpService.get(endpoint);
  };

  // Upload des élèves dans une classe via un fichier
  uploadStudents = async (classId, file) => {
    const endpoint = `classes/${classId}/students/upload`;
    const formData = new FormData();
    formData.append("file", file);

    return await HttpService.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };
}

export default new ClassService();
