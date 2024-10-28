import TransactionService from '../../services/transaction-service'; 
import StudentService from '../../services/student-service';

export const getTransactionHistory = async (studentId) => {
  try {
    const response = await TransactionService.getTransactions(studentId);

    if (response.status !== 200) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = response.data;  

    return data.transactions || []; 
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des transactions:", error);
    return [];
  }
};

export const getStudents = async (query) => {
    try {
      const response = await StudentService.getStudents(query);  
      if (response && response.data) {
        return response.data;
      }
      return []; 
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      return []; 
    }
  };
