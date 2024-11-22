import StudentService from 'services/student-service';

export const fetchChildrens = async () => {
  try {
    const response = await StudentService.getMyChildren();
    return response ? response.data : []
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants", error);
    return []
  }
}

export const updateChildInfo = async (id, data) => {
    try {
      const response = await StudentService.updateInformation(id, data);
      return response ? response : null
    } catch (error) {
      console.error("Erreur lors de la modification des informations des enfants", error);
      return []
    }
  }

  export const getFieldsToChange = async (id) => {
    try {
      const response = await StudentService.getFieldToChange(id);
      return response ? response.data : []
    } catch (error) {
      console.error("Erreur lors de la modification des informations des enfants", error);
      return []
    }
  }