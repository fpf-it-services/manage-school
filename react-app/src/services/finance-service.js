import HttpService from "./htttp.service";

class FinanceService {
  // Récupérer la liste des finances
  getFinances = async () => {
    const endpoint = `ecole/montants`; 
    return await HttpService.get(endpoint);
  };

  // Mettre à jour un niveau financier
  updateFinance = async (financeId, financeData) => {
    const endpoint = `ecole/montants/${financeId}`;
    return await HttpService.put(endpoint, financeData);
  }

    // Créer un nouveau niveau financier
  // createFinance = async (financeData) => {
  //   const endpoint = 'finances'; 
  //   return await HttpService.post(endpoint, financeData);
  // };

}

export default new FinanceService();
