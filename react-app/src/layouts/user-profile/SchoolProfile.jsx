import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

const SchoolProfile = ({ user, changeHandler, submitHandler, errors, editMode, handleEditClick, handleCancelClick }) => {

  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (file) => {
    // Met à jour l'aperçu du logo
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(null); // Réinitialise l'aperçu si aucun fichier n'est sélectionné
    }

    // Appelle le gestionnaire de changement pour mettre à jour l'état principal
    changeHandler(file);
  };
  return (
    <MDBox component="form" display="flex" flexDirection="column" >
      <MDBox display="flex" flexDirection="row" flexWrap="wrap" mb={3} gap={2}>
        {/* Nom de l'école */}
        <MDBox display="flex" flexDirection="column" width="48%">
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Nom de l'école</MDTypography>
          <MDBox mb={2} width="100%">
            <MDInput
              type="text"
              fullWidth
              name="name"
              value={user.nom}
              onChange={changeHandler}
              error={errors.nameError}
              disabled={!editMode}
            />
            {errors.nameError && (
              <MDTypography variant="caption" color="error" fontWeight="light">Le nom de l'école ne peut pas être vide</MDTypography>
            )}
          </MDBox>
        </MDBox>
  
        {/* Adresse */}
        <MDBox display="flex" flexDirection="column" width="48%">
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Adresse</MDTypography>
          <MDBox mb={2} width="100%">
            <MDInput
              type="text"
              fullWidth
              name="adresse"
              value={user.adresse}
              onChange={changeHandler}
              error={errors.adresseError}
              disabled={!editMode}
            />
            {errors.adresseError && (
              <MDTypography variant="caption" color="error" fontWeight="light">L'adresse ne peut pas être vide</MDTypography>
            )}
          </MDBox>
        </MDBox>
      </MDBox>

      <MDBox display="flex" flexDirection="row" flexWrap="wrap" mb={3} gap={2}>
        {/* Téléphone */}
        <MDBox display="flex" flexDirection="column" width="48%">
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Téléphone</MDTypography>
          <MDBox mb={2} width="100%">
            <MDInput
              type="tel"
              fullWidth
              name="telephone"
              value={user.telephone}
              onChange={changeHandler}
              error={errors.telephoneError}
              disabled={!editMode}
            />
            {errors.telephoneError && (
              <MDTypography variant="caption" color="error" fontWeight="light">Le téléphone doit être valide</MDTypography>
            )}
          </MDBox>
        </MDBox>

        {/* Logo de l'école */}
        <MDBox display="flex" flexDirection="column" width="48%">
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Capacité de l'école</MDTypography>
          <MDBox mb={2} width="100%">
            <MDInput
              type="file"
              fullWidth
              name="logo"
              onChange={(e) => handleLogoChange(e.target.files[0])} 
              disabled={!editMode}
            />
            {logoPreview && (
              <MDBox mt={1}>
                <img src={logoPreview} alt="Logo" width="100" />
              </MDBox>
            )}
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Boutons d'action */}
      <MDBox display="flex" justifyContent="end" gap={2}>
        {!editMode ? (
          <MDButton type="button" variant="gradient" color="info" onClick={handleEditClick}>Modifier</MDButton>
        ) : (
          <>
            <MDButton variant="gradient" color="success" onClick={submitHandler}>Enregistrer</MDButton>
            <MDButton variant="outlined" color="error" onClick={handleCancelClick}>Annuler</MDButton>
          </>
        )}
      </MDBox>
    </MDBox>
    );
}

export default SchoolProfile;
