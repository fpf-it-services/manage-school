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

  getMyChildren = async () => {
    const endpoint = `parents/eleves/attente`;
    return await HttpService.get(endpoint);
  };

  getMyChildrenRegistred = async () => {
    const endpoint = `parents/eleves`;
    return await HttpService.get(endpoint);
  };

  updateInformation = async (id, data) => {
    const endpoint = `parents/eleves/attente/${id}`;
    return await HttpService.post(endpoint, data );
  };

  getFieldToChange = async (id, data) => {
    const endpoint = `parents/eleves/attente/${id}`;
    return await HttpService.get(endpoint);
  };
  //    

  acceptRegistration = async (id) => {
    const endpoint = `inscription/attente/${id}`;
    return await HttpService.put(endpoint, {status: "accepte"});
  };

  
  rejectRegistration = async (id, rejectData) => {
    const endpoint = `inscription/attente/${id}`;
    return await HttpService.put(endpoint, rejectData);
  };

}

export default new StudentService();
