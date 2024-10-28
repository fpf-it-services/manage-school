import HttpService from "./htttp.service";

class TransactionService {
  async getTransactions(studentId) {
    try {
      const response = await HttpService.get(`/students/${studentId}/transactions`);
      return response.data; 
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions pour l'élève avec ID ${studentId}:`, error);
      throw error; 
    }
  }
}

export default new TransactionService();
