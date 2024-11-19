import SchoolService from '../../services/school-service'; 
import AcademicYearService from '../../services/academic-years-service';
import transactionService from 'services/transaction-service';

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
    const response = await AcademicYearService.getAcademicYears();
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des années académiques:", error);
    return [];
  }
};

export const postPaymentData = async (paymentData) => {
  try {
    const response = await transactionService.sendPaymentData(paymentData); 
    return true;
  } catch (error) {
    console.error("Erreur :", error);
    return false;
  }
};