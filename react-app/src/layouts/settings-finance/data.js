import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableFooter,
  TableContainer,
  Paper,
} from "@mui/material";
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
    tranche: [0, 0, 0],
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
        console.error("Erreur lors de la récupération des series", error);
        setError("Une erreur est survenue lors de la récupération des series.");
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
    setFees({ frais_formation: 0, frais_inscription: 0, frais_reinscription: 0, frais_annexe: 0, tranche: [0, 0, 0] });
  };

  const handleFeeChange = (field, value) => {
    const numericValue = Number(value);
    setFees((prevFees) => ({
      ...prevFees,
      [field]: numericValue,
    }));
  };

  const handleTrancheChange = (index, value) => {
    setFees((prevFees) => {
      const newTranches = [...prevFees.tranche];
      newTranches[index] = Number(value);
      return { ...prevFees, tranche: newTranches, niveau_id: selectedLevel.id, serie_id: serie };
    });
  };

  const isTotalValid = () => {
    const totalTranches = fees.tranche.reduce((sum, tranche) => sum + tranche, 0);
    return totalTranches === fees.frais_formation && fees.frais_formation > 0;
  };

  const handleChange = (value) => {
    setSerie(value)
  };


  const secondCycleChosen = () => {
    if (["2E", "2e", "Seconde", "SECONDE", "Premiere", "PREMIERE", "Première", "1ERE", "TERMINALE", "Terminale", "TLE"].includes(selectedLevel.niveau)) {
      return true;
    } 
    return false;
  }

  const saveFees = async () => {
    try {
      await FinanceService.saveFees(fees);
      closeDialog();
      alert("Frais enregistrés avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des frais", error);
      alert("Une erreur est survenue lors de l'enregistrement des frais.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <MDTypography color="error">{error}</MDTypography>;

  return (
    <>
      <MDBox display="flex" justifyContent="center" padding={4}>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            {/* <TableHead>
              <TableRow>
                <TableCell style={{ border: "1px solid #ddd", width: '10%' }}><strong>#</strong></TableCell>
                <TableCell style={{ border: "1px solid #ddd", width: '50%' }}><strong>Niveau</strong></TableCell>
                <TableCell style={{ border: "1px solid #ddd" }}><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead> */}
            <TableBody>
              {levels.map((level, idx) => (
                <TableRow key={level.id}>
                    <TableCell style={{ border: "1px solid #ddd", width: '10%' }}>{idx + 1}</TableCell>
                    <TableCell style={{ border: "1px solid #ddd", width: '50%' }}>{level.niveau}</TableCell>
                    <TableCell style={{ border: "1px solid #ddd" }}>
                        <Button onClick={() => handleAddClick(level)} color="primary">
                            Ajouter
                        </Button>
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

      {/* Boîte de dialogue pour définir les frais */}
      <Dialog open={openDialog} onClose={closeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Définir les frais pour le niveau {selectedLevel?.niveau}</DialogTitle>
        <DialogContent sx={{ width: "600px", maxWidth: "100%" }}>
          <MDBox display="flex" flexDirection="column" marginBlockStart="20px" gap={2}>
            <MDInput
              label="Frais de Scolarité"
              type="number"
              value={fees.frais_formation}
              onChange={(e) => handleFeeChange("frais_formation", e.target.value)}
            />
            <MDInput
              label="Frais d'Inscription"
              type="number"
              value={fees.frais_inscription}
              onChange={(e) => handleFeeChange("frais_inscription", e.target.value)}
            />
            <MDInput
              label="Frais de Reinscription"
              type="number"
              value={fees.reinscription}
              onChange={(e) => handleFeeChange("reinscription", e.target.value)}
            />
            <MDInput
              label="Frais Annexes"
              type="number"
              value={fees.frais_annexe}
              onChange={(e) => handleFeeChange("frais_annexe", e.target.value)}
            />
            { openDialog ? secondCycleChosen() ? 
              <select
                name="serie"
                value={serie}
                onChange={(e) => handleChange(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
              >
                {
                  series.length > 0 ? (
                    series.map((serie) => (
                      <option key={serie.id} value={serie.id}>{serie.serie}</option>
                    ))
                  ) : (
                    <option value="" disabled>Pas de séries disponibles</option>
                  )
                }
              </select> : <></> : <></> 
            }

            {/* Tableau des tranches */}
            <Table>
              <TableBody>
                {fees.tranche.map((tranche, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>
                      Tranche {index + 1}
                    </TableCell>
                    <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>
                      <MDInput
                        type="number"
                        value={tranche}
                        onChange={(e) => handleTrancheChange(index, e.target.value)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>Total</TableCell>
                  <TableCell style={{ border: "1px solid #ddd", textAlign: "center" }}>
                    <MDTypography color={isTotalValid() ? "success" : "error"}>
                      {fees.tranche.reduce((sum, tranche) => sum + tranche, 0)} / {fees.frais_formation}
                    </MDTypography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Annuler</Button>
          <Button color="primary" disabled={!isTotalValid()} onClick={saveFees}>
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
