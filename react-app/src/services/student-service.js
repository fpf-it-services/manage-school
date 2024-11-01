import HttpService from "./htttp.service"; 

class StudentService {
  // Fonction pour ajouter un élève
  addStudent = async (studentData) => {
    const endpoint = `ecole/eleves`;
    return await HttpService.post(endpoint, studentData);
  };

  uploadStudents = async (studentsData) => {
    const endpoint = `students`;
    return await HttpService.post(endpoint, studentsData);
  };

}

export default new StudentService();
