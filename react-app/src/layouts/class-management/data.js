import ClassService from '../../services/class-service';
import LevelService from '../../services/level-service';


export const getLevels = async () => {
  try {
    const response = await LevelService.getLevels();
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

export const getStudentsByClass = async (classId) => {
  if (!classId) {
    console.warn("Aucun ID de classe fourni");
    return [];
  }
  try {
    const response = await ClassService.getStudentsByClass(classId);
    return response?.data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des élèves:", error);
    return [];
  }
};


export const uploadStudents = async (className, classSize, file, level, serie = null) => {
  console.log(className, classSize, file, level, serie)
  if (!className || !classSize || !level) {
    console.error("Données manquantes pour la création de la classe");
    return;
  }

  try {
    const classData = { nom: className, effectif_max: classSize, niveau_id: level, serie_id: serie };  
    const createClassResponse = await ClassService.createClass(classData);

    if (createClassResponse && createClassResponse.data) {
      console.log("Classe créée avec succès:", createClassResponse.data);

      const classId = createClassResponse.data.id;

      // Uploader le fichier si fourni
      if (file) {
        await ClassService.uploadStudents(classId, file);
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

// Récupérer les classes d'un niveau et d'une série spécifique
export const getClassesByLevelAndSerie = async (levelId, serieId) => {
  try {
    const classes = await LevelService.getClassesByLevelAndSerie(levelId, serieId);
    console.log(classes)
    return classes; 
  } catch (error) {
    console.error("Erreur lors de la récupération des classes:", error);
    return [];  
  }
};