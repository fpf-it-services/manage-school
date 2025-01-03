import ClassService from '../../services/class-service';
import LevelService from '../../services/level-service';
import AcademicYearService from '../../services/academic-years-service';


export const getLevels = async () => {
  try {
    const response = await LevelService.getLevelsVerified();
    if (response && response.data) {
      return response.data;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des niveaux", error);
    return []; 
  }
};

export const getClassesByLevel = async (levelId) => {
  if (!levelId) {
    return []; 
  }
  try {
    const response = await ClassService.getClasses();
    if (response && response.data) {
      const classesByLevel = response.data.filter(classe => classe.levelId === levelId);
      return classesByLevel;
    }
    return []; 
  } catch (error) {
    console.error("Erreur lors de la récupération des classes", error);
    return []; 
  }
};


export const uploadStudents = async (className, classSize, data, level, serie = null) => {
  if (!className || !classSize || !level) {
    console.error("Données manquantes pour la création de la classe");
    return;
  }

  try {
    const classData = { nom: className, effectif_max: classSize, niveau_id: level, serie_id: serie };  
    const createClassResponse = await ClassService.createClass(classData);
    if (createClassResponse && createClassResponse.data) {
      const classId = createClassResponse.data;
      if (data.length !== 0) {
        await ClassService.uploadStudents(classId, { eleves: data });
        console.log("Fichier uploadé avec succès pour la classe:", classId);
      }
      return createClassResponse;
    } else {
      console.warn("Aucune réponse valide après la création de la classe");
    }
  } catch (error) {
    console.error("Erreur lors de la création de la classe et de l'upload des élèves:", error);
  }
};

export const getSeriesByLevel = async (levelId) => {
  try {
    const series = await LevelService.getSeriesByLevel(levelId);
    return series;  
  } catch (error) {
    console.error("Erreur lors de la récupération des séries:", error);
    return [];  
  }
};

export const getClassesByLevelAndSerie = async (levelId, serieId, selectedYear) => {
  try {
    const classes = await LevelService.getClassesByLevelAndSerie(levelId, serieId, selectedYear);
    return classes; 
  } catch (error) {
    console.error("Erreur lors de la récupération des classes:", error);
    return [];  
  }
};

export const getAcademicYears = async () => {
  try {
    const response = await AcademicYearService.getAcademicYears();
    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Erreur lors de la récupération des années académiques:", error);
    return [];
  }
};

