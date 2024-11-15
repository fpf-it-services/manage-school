import { useEffect, useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableRow, TableFooter, TableContainer, Paper } from "@mui/material";
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress";
import LevelService from "../../services/level-service";
import FinanceService from "services/finance-service";
import serieService from "services/serie-service";

export default function LevelsTable() {
  const [levels, setLevels] = useState([]);
  const [series, setSeries] = useState([]);
  const [serie, setSerie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [fees, setFees] = useState({
    frais_formation: 0,
    frais_inscription: 0,
    frais_reinscription: 0,
    frais_annexe: 0,
    tranche: [{ montant: 0, dueDate: "" }, { montant: 0, dueDate: "" }, { montant: 0, dueDate: "" }],
    niveau_id: null,
  });

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await LevelService.getLevels();
        setLevels(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des niveaux", error);
        setError("Une erreur est survenue lors de la récupération des niveaux.");
      } finally {
        setLoading(false);
      }
    };

    const fetchSeries = async () => {
      try {
        const response = await serieService.getSeries();
        setSeries(response.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des séries", error);
        setError("Une erreur est survenue lors de la récupération des séries.");
      } finally {
        setLoading(false);
      }
    };
    fetchLevels();
    fetchSeries();
  }, []);

  const handleAddClick = (level) => {
    setSelectedLevel(level);
    setOpenDialog(true);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedLevel(null);
    setFees({
      frais_formation: 0,
      frais_inscription: 0,
      frais_reinscription: 0,
      frais_annexe: 0,
      tranche: [{ montant: 0, dueDate: "" }, { montant: 0, dueDate: "" }, { montant: 0, dueDate: "" }],
    });
  };

  const handleFeeChange = (field, value) => {
    const numericValue = Number(value);
    setFees((prevFees) => ({
      ...prevFees,
      [field]: numericValue,
    }));
  };

  const handleTrancheChange = (index, field, value) => {
    setFees((prevFees) => {
      const newTranches = [...prevFees.tranche];
      newTranches[index][field] = field === "montant" ? Number(value) : value;
      return { ...prevFees, tranche: newTranches, niveau_id: selectedLevel.id, serie_id: serie };
    });
  };

  const isTotalValid = () => {
    const totalTranches = fees.tranche.reduce((sum, tranche) => sum + tranche.montant, 0);
    return totalTranches === fees.frais_formation && fees.frais_formation > 0;
  };

  const handleChange = (value) => {
    setSerie(value);
  };

  const secondCycleChosen = () => {
    return ["2E", "2e", "Seconde", "SECONDE", "Premiere", "PREMIERE", "Première", "1ERE", "TERMINALE", "Terminale", "TLE"].includes(selectedLevel?.niveau);
  };

  const saveFees = async () => {
    try {
      await FinanceService.saveFees(fees);
      console.log(fees)
      closeDialog();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des frais", error);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <MDTypography color="error">{error}</MDTypography>;

  return (
    <>
      <MDBox display="flex" justifyContent="center" padding={4}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableBody>
              {levels.map((level, idx) => (
                <TableRow key={level.id}>
                  <TableCell style={{ border: "1px solid #ddd", width: '10%' }}>{idx + 1}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", width: '50%' }}>{level.niveau}</TableCell>
                  <TableCell style={{ border: "1px solid #ddd" }}>
                    <Button onClick={() => handleAddClick(level)} color="primary">Ajouter</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} style={{ border: "1px solid #ddd" }}>
                  <MDTypography variant="subtitle2" color="textSecondary" align="center">
                    Fin des niveaux disponibles
                  </MDTypography>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </MDBox>

      <Dialog open={openDialog} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Définir les frais pour le niveau {selectedLevel?.niveau}</DialogTitle>
        <DialogContent sx={{ width: "600px", maxWidth: "100%" }}>
          <MDBox display="flex" flexDirection="column" marginBlockStart="20px" gap={2}>
            <MDInput label="Frais de Scolarité" type="number" value={fees.frais_formation} onChange={(e) => handleFeeChange("frais_formation", e.target.value)} />
            <MDInput label="Frais d'Inscription" type="number" value={fees.frais_inscription} onChange={(e) => handleFeeChange("frais_inscription", e.target.value)} />
            <MDInput label="Frais de Reinscription" type="number" value={fees.frais_reinscription} onChange={(e) => handleFeeChange("frais_reinscription", e.target.value)} />
            <MDInput label="Frais Annexes" type="number" value={fees.frais_annexe} onChange={(e) => handleFeeChange("frais_annexe", e.target.value)} />

            {openDialog && secondCycleChosen() && (
              <select name="serie" value={serie} onChange={(e) => handleChange(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px' }}>
                {series.length > 0 ? (
                  series.map((serie) => <option key={serie.id} value={serie.id}>{serie.serie}</option>)
                ) : (
                  <option value="" disabled>Pas de séries disponibles</option>
                )}
              </select>
            )}

            <Table>
              <TableBody>
                {fees.tranche.map((tranche, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ border: "1px solid #ddd", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>Tranche {index + 1}</TableCell>
                    <TableCell style={{ border: "1px solid #ddd", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>
                      <MDInput type="number" value={tranche.montant} onChange={(e) => handleTrancheChange(index, "montant", e.target.value)} />
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd", textAlign: "center", fontSize: "12px", fontWeight: "bold" }}>
                      <MDInput type="date" value={tranche.dueDate} onChange={(e) => handleTrancheChange(index, "dueDate", e.target.value)} />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>Total</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }} colSpan={2}>
                    <MDTypography color={isTotalValid() ? "success" : "error"}>
                      {fees.tranche.reduce((sum, tranche) => sum + tranche.montant, 0)} / {fees.frais_formation}
                    </MDTypography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button onClick={saveFees} disabled={!isTotalValid()}>Enregistrer</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
