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

  updateScolarite = async (financeId, scolariteData) => {
    console.log(scolariteData)
    const endpoint = `ecole/montants_frais/${financeId}`;
    return await HttpService.put(endpoint, scolariteData);
  }

  saveFees = async (financeData) => {
    console.log(financeData)
    const endpoint = `ecole/montants`; 
    return await HttpService.post(endpoint, financeData);
  };

  

}

export default new FinanceService();
