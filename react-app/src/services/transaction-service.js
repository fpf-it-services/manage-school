import HttpService from "./htttp.service";

class TransactionService {
  async getTransactions(studentId) {
    try {
      const response = await HttpService.get(`montants/historique/${studentId}`);
      console.log(response)
      return response.data; 
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions pour l'élève avec ID ${studentId}:`, error);
      throw error; 
    }
  }

  async getStats(studentId) {
    try {
      const response = await HttpService.get(`montants/statistiques/${studentId}`);
      return response.data; 
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions pour l'élève avec ID ${studentId}:`, error);
      throw error; 
    }
  }

  sendPaymentData = async (paymentData) => {
    const endpoint = `montants`;
    console.log(paymentData)
    return await HttpService.post(endpoint, paymentData);
  };
}

export default new TransactionService();
