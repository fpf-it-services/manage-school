import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Table, TableBody, TableCell, TableRow, TextField, } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import FinanceService from "../../services/finance-service"; 

export default function FinanceDialog({ open, onClose, finance }) {
  const format = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
  
  const [frais_formation, setFraisFormation] = useState(finance.montants[0].frais_formation);
  const [tranche1, setTranche1] = useState(finance.montants[0].tranches[0].montant);
  const [tranche2, setTranche2] = useState(finance.montants[0].tranches[1].montant);
  const [tranche3, setTranche3] = useState(finance.montants[0].tranches[2].montant);
  const [echeance_tranche1, setEcheanceTranche1] = useState(format(finance.montants[0].tranches[0].dueDate));
  const [echeance_tranche2, setEcheanceTranche2] = useState(format(finance.montants[0].tranches[1].dueDate));
  const [echeance_tranche3, setEcheanceTranche3] = useState(format(finance.montants[0].tranches[2].dueDate));
  const [error, setError] = useState("");

  const totalTranches = Number(tranche1) + Number(tranche2) + Number(tranche3);



  const handleUpdate = async () => {
    if (totalTranches !== Number(frais_formation)) {
      setError("La somme des tranches doit être égale aux frais de formation.");
      return;
    }

    const response = await FinanceService.updateScolarite(finance.montants[0].id, { frais_formation, tranche1, tranche2, tranche3, echeance_tranche1, echeance_tranche2, echeance_tranche3  })
    onClose(); 
  };

  const handleTEcheanceTranche1Change = (e) => {
    setEcheanceTranche1(e.target.value)
  }
  const handleTEcheanceTranche2Change = (e) => {
    setEcheanceTranche2(e.target.value)
  }
  const handleTEcheanceTranche3Change = (e) => {
    setEcheanceTranche3(e.target.value)
  }

  if (!finance) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails financiers pour {finance.niveau}</DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Frais de scolarité :</MDTypography>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={frais_formation}
                  onChange={(e) => setFraisFormation(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Tranche n°1:</MDTypography>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={tranche1}
                  onChange={(e) => setTranche1(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Avant le: </MDTypography>
              </TableCell>
              <TableCell>
                <MDInput
                  type="date"
                  label="Echéance"
                  fullWidth
                  name="echeance_tranche1"
                  value={echeance_tranche1}
                  onChange={handleTEcheanceTranche1Change}
                  // error={errors.dateNaissanceError}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Tranche n°2:</MDTypography>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={tranche2}
                  onChange={(e) => setTranche2(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Avant le: </MDTypography>
              </TableCell>
              <TableCell>
                <MDInput
                  type="date"
                  label="Echéance"
                  fullWidth
                  name="echeance_tranche2"
                  value={echeance_tranche2}
                  onChange={handleTEcheanceTranche2Change}
                  // error={errors.dateNaissanceError}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Tranche n°3:</MDTypography>
              </TableCell>
              <TableCell>
                <TextField
                  type="number"
                  value={tranche3}
                  onChange={(e) => setTranche3(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <MDTypography variant="caption" fontWeight="bold">Avant le: </MDTypography>
              </TableCell>
              <TableCell>
                <MDInput
                  type="date"
                  label="Echéance"
                  fullWidth
                  name="echeance_tranche3"
                  value={echeance_tranche3}
                  onChange={handleTEcheanceTranche3Change}
                  // error={errors.dateNaissanceError}
                />
              </TableCell>
            </TableRow>
            {error && (
              <TableRow>
                <TableCell colSpan={2}>
                  <MDTypography variant="body2" color="error">{error}</MDTypography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Fermer</Button>
        <Button onClick={handleUpdate} color="primary" disabled={totalTranches !== Number(frais_formation)}>Mettre à jour</Button>
      </DialogActions>
    </Dialog>
  );
}
