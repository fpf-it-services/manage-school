import HttpService from "./htttp.service";

class SchoolService {

  // Récupérer la liste des écoles ou une école spécifique
  getSchools = async () => {
    const endpoint = `ecoles`;
    return await HttpService.get(endpoint);
  };

  getSchoolsAndStudents = async () => {
    const endpoint = `ecoles_eleves`;
    return await HttpService.get(endpoint);
  };

  getSchoolsAndLevels = async () => {
    const endpoint = `niveaux-ecoles`;
    return await HttpService.get(endpoint);
  };

  // Créer une nouvelle école
  createSchool = async (schoolData) => {
    const endpoint = 'ecoles';
    return await HttpService.post(endpoint, schoolData);
  };

  // Supprimer une école
  deleteSchool = async (schoolId) => {
    const endpoint = `ecoles/${schoolId}`;
    return await HttpService.delete(endpoint);
  };

  getSchoolsAndStudentsAndClassesWithYears = async () => {
    const endpoint = `ecoles_annees_classes_eleves`;
    return await HttpService.get(endpoint);
  };
}



export default new SchoolService();
