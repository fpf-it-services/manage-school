/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import CircularProgress from "@mui/material/CircularProgress"; 
import SchoolService from "services/school-service";

export default function Data() {
  const [schools, setSchools] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await SchoolService.getSchools();
        if (response.data.length === 0) {
          setSchools([]); 
        } else {
          setSchools(response.data); 
        }
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des écoles", error);
        setError("Une erreur est survenue lors de la récupération des écoles.");
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  const Author = ({ image, name, email }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
        <MDTypography variant="caption">{email}</MDTypography>
      </MDBox>
    </MDBox>
  );

  const getColumns = () => [
    { Header: "Nom", accessor: "nom", width: "35%", align: "left" },
    { Header: "Adresse", accessor: "adresse", align: "center" },
    { Header: "Téléphone", accessor: "phone", align: "center" },
    { Header: "Centre de composition", accessor: "centre", align: "center" },
    { Header: "Date d'ajout", accessor: "creationdate", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
  ];
  
  if (loading) {
    return {
      columns: getColumns(),
      rows: [
        {
          nom: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress /> 
            </MDBox>
          ),
          adresse: "",
          phone: "",
          capacite: "",
          centre: "",
          creationdate: "",
          action: "",
        },
      ],
    };
  }

  if (error) {
    return {
      columns: getColumns(),
      rows: [
        {
          nom: (
            <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
              <MDTypography variant="caption" color="error">
                {error} 
              </MDTypography>
            </MDBox>
          ),
          adresse: "",
          phone: "",
          capacite: "",
          centre: "",
          creationdate: "",
          action: "",
        },
      ],
    };
  }

  return {
    columns: getColumns(),
    rows: schools.length > 0
      ? schools.map((school) => ({
          nom: <Author image={school.logo} name={school.nom} email={school.email} />,
          adresse: (
            <MDTypography variant="caption" fontWeight="medium">
              {school.adresse}
            </MDTypography>
          ),
          phone: (
            <MDTypography variant="caption" fontWeight="medium">
              {school.telephone}
            </MDTypography>
          ),
          centre: (
            <MDTypography variant="caption" fontWeight="medium">
              {school.centre_de_composition ? "Oui" : "Non"}
            </MDTypography>
          ),
          creationdate: (
            <MDTypography variant="caption" fontWeight="medium">
              {new Date(school.created_at.split(" ")[0]).toLocaleDateString()}
            </MDTypography>
          ),
          action: (
            <MDBox>
              <MDTypography
                component="a"
                href="#"
                variant="caption"
                color="error"
                fontWeight="medium"
                onClick={() => handleDelete(school.id)}
              >
                Supprimer
              </MDTypography>
            </MDBox>
          ),
        }))
      : [
          {
            nom: (
              <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                <MDTypography variant="caption" color="text">
                  Aucune école disponible pour le moment.
                </MDTypography>
              </MDBox>
            ),
            adresse: "",
            phone: "",
            capacite: "",
            centre: "",
            creationdate: "",
            action: "",
          },
        ],
  };
}

const handleDelete = async (schoolId) => {
  try {
    await SchoolService.deleteSchool(schoolId);
    setSchools((prevSchools) => prevSchools.filter((school) => school.id !== schoolId));
  } catch (error) {
    console.error("Erreur lors de la suppression de l'école", error);
  }
};
