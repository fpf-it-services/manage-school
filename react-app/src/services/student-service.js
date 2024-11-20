import HttpService from "./htttp.service"; 

class StudentService {
  addStudent = async (studentData) => {
    const endpoint = `ecole/eleves`;
    return await HttpService.post(endpoint, studentData);
  };

  uploadStudents = async (studentsData) => {
    const endpoint = `students`;
    return await HttpService.post(endpoint, studentsData);
  };

  getPendingRegistration = async () => {
    const endpoint = `inscription/attente/eleve`;
    return await HttpService.get(endpoint);
  };

  acceptRegistration = async (id) => {
    const endpoint = `acceptRegistration`;
    return await HttpService.post(endpoint, id);
  };

  
  rejectRegistration = async (rejectData) => {
    const endpoint = `rejectRegistration`;
    return await HttpService.post(endpoint, rejectData);
  };

}

export default new StudentService();
