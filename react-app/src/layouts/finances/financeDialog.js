import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Snackbar,
} from "@mui/material";
import MDTypography from "components/MDTypography";
import FinanceService from "../../services/finance-service"; 

export default function FinanceDialog({ open, onClose, finance }) {
  const [frais_formation, setFraisFormation] = useState(finance.montants[0].frais_formation);
  const [tranche1, setTranche1] = useState(finance.montants[0].tranche1);
  const [tranche2, setTranche2] = useState(finance.montants[0].tranche2);
  const [tranche3, setTranche3] = useState(finance.montants[0].tranche3);
  const [error, setError] = useState("");

  const totalTranches = Number(tranche1) + Number(tranche2) + Number(tranche3);

  const handleUpdate = async () => {
    if (totalTranches !== Number(frais_formation)) {
      setError("La somme des tranches doit être égale aux frais de formation.");
      return;
    }

    const response = await FinanceService.updateScolarite(finance.montants[0].id, { frais_formation, tranche1, tranche2, tranche3 })


    onClose(); 
  };

  if (!finance) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Détails financiers pour {finance.niveau}</DialogTitle>
      <DialogContent dividers>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <MDTypography variant="body2">Frais de scolarité :</MDTypography>
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
                <MDTypography variant="body2" fontWeight="600px">Tranche n°1:</MDTypography>
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
            </TableRow>
            <TableRow>
              <TableCell>
                <MDTypography variant="body2">Tranche n°2:</MDTypography>
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
            </TableRow>
            <TableRow>
              <TableCell>
                <MDTypography variant="body2">Tranche n°3:</MDTypography>
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
