import ClassService from '../../services/class-service';
import StudentService from '../../services/student-service';
import SchoolService from '../../services/school-service'; 
import FinanceService from '../../services/finance-service'; 
import AcademicYearService from '../../services/academic-years-service';

export const getStudents = async (query) => {
  try {
    // const response = await StudentService.getStudents(query);  
    // if (response && response.data) {
    //   return response.data;
    // }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return []; 
  }
};

export const getFees = async () => {
  try {
    // const response = await FinanceService.getFinances(); 
    // if (response && response.data) {
    //   return response.data;
    // }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des frais:", error);
    return [];
  }
};

export const getSchools = async () => {
  try {
    // const response = await SchoolService.getSchools();  
    // if (response && response.data) {
    //   return response.data;
    // }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des écoles:", error);
    return [];
  }
};

export const getAcademicYears = async () => {
  try {
    // const response = await AcademicYearService.getAcademicYears();
    // if (response && response.data) {
    //   return response.data;
    // }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des années académiques:", error);
    return [];
  }
};

export const getClassesBySchool = async (schoolId) => {
  if (!schoolId) {
    console.warn("Aucun ID d'école fourni");
    return [];
  }
  try {
    // const response = await ClassService.getClassesBySchool(schoolId);  
    // if (response && response.data) {
    //   return response.data;
    // }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des classes pour l'école:", error);
    return [];
  }
};
