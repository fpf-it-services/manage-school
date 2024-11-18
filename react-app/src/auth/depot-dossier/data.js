import SchoolService from 'services/school-service';

export const getSchoolsAndLevels = async () => {

  try {
    const response = await SchoolService.getSchoolsAndLevels();
    if (response && response.data) {  
      return response.data;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des classes et transactions:", error);
    return []; 
  }
};