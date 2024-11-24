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

  async getAllTransactions(year, classe) {
    try {
      const response = await HttpService.get(`transactions?annee_id=${year}&classe_id=${classe}`);
      return response ? response.data : []; 
    } catch (error) {
      console.error(`Erreur lors de la récupération des transactions:`, error);
      throw error; 
    }
  }

  sendRegisterPaymentData = async (id, paymentData) => {
    const endpoint = `parents/eleves/accepte/${id}`;
    return await HttpService.post(endpoint, paymentData);
  };

  

  sendPaymentData = async (paymentData) => {
    const endpoint = `montants`;
    return await HttpService.post(endpoint, paymentData);
  };
}

export default new TransactionService();
