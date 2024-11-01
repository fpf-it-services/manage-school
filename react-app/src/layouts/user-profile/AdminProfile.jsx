import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";


const AdminProfile = ({ user, changeHandler, submitHandler, errors, editMode, handleEditClick, handleCancelClick }) => (
    <MDBox component="form" display="flex" flexDirection="column">
      {/* Affichage des champs pour le profil Admin */}
      <MDBox display="flex" flexDirection="row" mt={5} mb={3}>
        {/* Champ pour le Nom */}
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" width="100%" mr={2}>
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">
            Nom
          </MDTypography>
          <MDBox mb={2} width="100%">
            <MDInput
              type="name"
              fullWidth
              name="name"
              value={user.name}
              onChange={changeHandler}
              error={errors.nameError}
              disabled={!editMode}
            />
            {errors.nameError && <MDTypography variant="caption" color="error" fontWeight="light">Le nom ne peut pas être vide</MDTypography>}
          </MDBox>
        </MDBox>
        {/* Champ pour l'Email */}
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" width="100%" ml={2}>
          <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Email</MDTypography>
          <MDBox mb={1} width="100%">
            <MDInput
              type="email"
              fullWidth
              name="email"
              value={user.email}
              onChange={changeHandler}
              error={errors.emailError}
              disabled={!editMode}
            />
            {errors.emailError && <MDTypography variant="caption" color="error" fontWeight="light">L'email doit être valide</MDTypography>}
          </MDBox>
        </MDBox>
      </MDBox>
      {/* Mot de passe */}
      <MDBox display="flex" flexDirection="column" mb={3}>
        <MDTypography variant="body2" color="text" ml={1} fontWeight="regular">Nouveau mot de passe</MDTypography>
        <MDBox mb={2} width="100%">
          <MDInput
            type="password"
            fullWidth
            name="newPassword"
            placeholder="Nouveau mot de passe"
            value={user.newPassword}
            onChange={changeHandler}
            error={errors.newPassError}
            disabled={!editMode}
          />
        </MDBox>
      </MDBox>
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



  export default AdminProfile;
  