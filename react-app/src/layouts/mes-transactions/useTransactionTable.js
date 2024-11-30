import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TransactionService from "services/transaction-service";
import CircularProgress from "@mui/material/CircularProgress";

const useTransactionTable = (activeTab) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const formatText = (text) => {
    return text
      .replace(/_/g, " ")
      .toLowerCase() 
      .replace(/^\w|\s\w/g, (match) => match.toUpperCase()); 
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log(activeTab)
        if (activeTab !== null) {
          const response = await TransactionService.getTransactions(activeTab);
          setTransactions(response || []);
        } else {
          setTransactions([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des transactions", err);
        setError("Une erreur est survenue lors de la récupération des transactions.");
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [activeTab]);

  const getColumns = () => [
    { Header: "N°", accessor: "numero", align: "center" },
    { Header: "Année", accessor: "annee", align: "center" },
    { Header: "École", accessor: "ecole", align: "center" },
    { Header: "Classe", accessor: "classe", align: "center" },
    { Header: "Payé le", accessor: "date", align: "center" },
    { Header: "Montant Payé", accessor: "montant_paye", align: "center" },
    { Header: "Le Payeur", accessor: "payeur", align: "center" },
    { Header: "Observations", accessor: "frais", align: "center" },
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
    rows: transactions.map((transaction, index) => ({
      numero: (
        <MDTypography variant="caption" fontWeight="medium">
          {index+1}
        </MDTypography>
      ),
      annee: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.annee}
        </MDTypography>
      ),
      ecole: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.ecole}
        </MDTypography>
      ),
      classe: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.classe}
        </MDTypography>
      ),
      date: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.date.split(" ")[0]}
        </MDTypography>
      ),
      montant_paye: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.montant}
        </MDTypography>
      ),
      payeur: (
        <MDTypography variant="caption" fontWeight="medium">
          {transaction.email}
        </MDTypography>
      ),
      frais: (
        <MDTypography
          variant="caption"
          fontWeight="medium"
        >
          {formatText(transaction.type_frais)}
        </MDTypography>
      ),
    })),
  };
};

export default useTransactionTable;
