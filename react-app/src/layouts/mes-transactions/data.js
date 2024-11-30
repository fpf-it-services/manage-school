import { useEffect, useState } from "react";

import StudentService from "services/student-service";


export const fetchChildrens = async () => {
  try {
    const response = await StudentService.getMyChildrenRegistred();
    return response ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants", error);
    return [];
  }
};
