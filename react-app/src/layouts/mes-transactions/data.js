import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CircularProgress from "@mui/material/CircularProgress";
import TransactionService from "services/transaction-service";
import StudentService from "services/student-service";

export const useTransactionTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async (id = 0) => {
      try {
        if (id !== 0) {
          const response = await TransactionService.getTransactions(id);
          setTransactions(response.data || []);
        } else {
          setTransactions([])
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des transactions", error);
        setError("Une erreur est survenue lors de la récupération des transactions.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getColumns = () => [
    { Header: "N°", accessor: "numero", align: "center" },
    { Header: "Nom et Prénoms", accessor: "name", align: "center" },
    { Header: "École", accessor: "ecole", align: "center" },
    { Header: "Payé le", accessor: "date", align: "center" },
    { Header: "Montant Payé", accessor: "montant_paye", align: "center" },
    { Header: "Le Payeur", accessor: "payeur", align: "center" },
    { Header: "Obervations", accessor: "observations", align: "center" },
  ];

  if (loading) {
    return {
      columns: getColumns(),
      rows: [
        {
          numero: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </MDBox>
          ),
        },
      ],
    };
  }

  if (error) {
    return {
      columns: getColumns(),
      rows: [
        {
          numero: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <MDTypography variant="caption" color="error">
                {error}
              </MDTypography>
            </MDBox>
          ),
        },
      ],
    };
  }

  return {
    columns: getColumns(),
    rows:
      Array.isArray(transactions) && transactions.length > 0
        ? transactions.map((transaction, index) => ({
            numero: (
              <MDTypography variant="caption" fontWeight="medium">
                {index}
              </MDTypography>
            ),
            name: (
              <MDTypography variant="caption" fontWeight="medium">
                {`${transaction.nom} ${transaction.prenoms}`}
              </MDTypography>
            ),
            ecole: (
              <MDTypography variant="caption" fontWeight="medium">
                {transaction.ecole}
              </MDTypography>
            ),
            date: (
              <MDTypography variant="caption" fontWeight="medium">
                {transaction.date}
              </MDTypography>
            ),
            montant_paye: (
              <MDTypography variant="caption" fontWeight="medium">
                {transaction.montant_paye}
              </MDTypography>
            ),
            payeur: (
              <MDTypography variant="caption" fontWeight="medium">
                {transaction.payeur}
              </MDTypography>
            ),
            observations: (
              <MDTypography
                variant="caption"
                fontWeight="medium"
                color={transaction.reste_a_payer !== 0 ? "error" : "success"}
              >
                {transaction.reste_a_payer !== 0
                  ? `Reste à payer : ${finance.rest_a_payer}`
                  : "Soldé"}
              </MDTypography>
            ),
          }))
        : [
            {
              numero: (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                  <MDTypography variant="caption" fontWeight="bold" color="text">
                    Aucune donnée transactionnelle disponible.
                  </MDTypography>
                </MDBox>
              ),
            },
          ],
  };
};

export const fetchChildrens = async () => {
  try {
    const response = await StudentService.getMyChildrenRegistred();
    return response ? response.data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des enfants", error);
    return [];
  }
};
