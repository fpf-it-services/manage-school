import AcademicYearService from '../../services/academic-years-service';
import TransactionService from 'services/transaction-service';
import ClassService from 'services/class-service';

export const getClassesAndTransactionByYear = async (year, classe) => {
    if (!year) {
        return [];
    }
  try {
    const response = await TransactionService.getAllTransactions(year, classe);
    if (response && response.data) {  
      return response.data;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des classes et transactions:", error);
    return []; 
  }
};

export const getAcademicYears = async () => {
  try {
    const response = await AcademicYearService.getAcademicYears();
    console.log(response)
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des années académiques:", error);
    return [];
  }
};


export const getClasses = async (an) => {
  try {
    const response = await ClassService.getClasses(an);
    console.log(response)
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des classes:", error);
    return [];
  }
};
