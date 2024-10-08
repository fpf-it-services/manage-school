import HttpService from "./htttp.service";

class FinanceService {
  // Récupérer la liste des finances
  getFinances = async () => {
    const endpoint = `finances`; 
    return await HttpService.get(endpoint);
  };

  // Créer un nouveau niveau financier
  createFinance = async (financeData) => {
    const endpoint = 'finances'; 
    return await HttpService.post(endpoint, financeData);
  };

  // Supprimer un niveau financier
  deleteFinance = async (financeId) => {
    const endpoint = `finances/${financeId}`; 
    return await HttpService.delete(endpoint);
  };

  // Mettre à jour un niveau financier
  updateFinance = async (financeId, financeData) => {
    const endpoint = `finances/${financeId}`;
    return await HttpService.put(endpoint, financeData);
  }
}

export default new FinanceService();
