import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function FileDialog({ open, onClose, file }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* <DialogTitle>Fichier</DialogTitle> */}
      <DialogContent dividers>
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100vh", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          {file && file.split(".")[file.length - 1] ? (
            <iframe src={file} title="Fichier" style={{ width: "100%", height: "100%" }} />
          ) : (
            <MDTypography>Aucun fichier à afficher</MDTypography>
          )}
        </MDBox>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
