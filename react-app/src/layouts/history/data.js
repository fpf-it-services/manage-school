import TransactionService from '../../services/transaction-service'; 
import SchoolService from '../../services/school-service';

export const getTransactionHistory = async (studentId) => {
  try {
    const response = await TransactionService.getTransactions(studentId);
    const resp = await TransactionService.getStats(studentId)
    return response || []; 
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des transactions:", error);
    return [];
  }
};

export const getSchoolsAndStudents = async () => {
  try {
    const response = await SchoolService.getSchoolsAndStudents();  
    if (response && response.data) {
      return response.data;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error);
    return []; 
  }
};