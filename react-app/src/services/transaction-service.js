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

  sendPaymentData = async (paymentData) => {
    const endpoint = `payment-data`;
    return await HttpService.post(endpoint, paymentData);
  };
}

export default new TransactionService();
