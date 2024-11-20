import AcademicYearService from '../../services/academic-years-service';
import TransactionService from 'services/transaction-service';

export const getClassesAndTransactionByYear = async (year) => {
    if (!year) {
        return [];
    }
  try {
    const response = await TransactionService.getAllTransactions(year);
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
