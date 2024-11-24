import SchoolService from '../../services/school-service'; 
import AcademicYearService from '../../services/academic-years-service';
import TransationService from 'services/transaction-service';
import StudentService from 'services/student-service';

export const getSchoolsAndStudents = async () => {
  try {
    const response = await SchoolService.getSchoolsAndStudentsAndClassesWithYears();  
    if (response && response.data) {  
      return response.data;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return []; 
  }
};


export const getAcademicYears = async () => {
  try {
    const response = await AcademicYearService.getCurrentAcademicYear();
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des années académiques:", error);
    return [];
  }
};

export const getMyChildrenRegistred = async () => {
  try {
    const response = await StudentService.getMyChildrenRegistred();
    if (response && response.data) {
      return [response.data];
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants:", error);
    return [];
  }
};


export const getStats = async (id) => {
  try {
    const response = await TransationService.getStats(id);
    if (response && response.data) {
      return [response.data];
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return [];
  }
}

export const postPaymentData = async (paymentData) => {
  try {
    const response = await TransationService.sendPaymentData(paymentData); 
    return true;
  } catch (error) {
    console.error("Erreur :", error);
    return false;
  }
};



export const sendRegisterPaymentData = async (id, paymentData) => {
  try {
    const response = await TransationService.sendRegisterPaymentData(id, paymentData); 
    return true;
  } catch (error) {
    console.error("Erreur :", error);
    return false;
  }
};
