import HttpService from "./htttp.service"; // Assurez-vous que le nom du fichier est correct

class StudentService {
  // Fonction pour ajouter un élève
  addStudent = async (studentData) => {
    const endpoint = `students`;
    return await HttpService.post(endpoint, studentData);
  };

  // Fonction pour importer une liste d'élèves
  uploadStudents = async (studentsData) => {
    const endpoint = `students`;
    return await HttpService.post(endpoint, studentsData);
  };

  // Fonction pour récupérer la liste des élèves
  getStudents = async () => {
    const endpoint = `students`;
    return await HttpService.get(endpoint);
  };

  // Fonction pour mettre à jour un élève
  updateStudent = async (studentId, updatedData) => {
    const endpoint = `students/${studentId}`;
    return await HttpService.put(endpoint, updatedData);
  };

  // Fonction pour supprimer un élève
  deleteStudent = async (studentId) => {
    const endpoint = `students/${studentId}`;
    return await HttpService.delete(endpoint);
  };
}

export default new StudentService();
