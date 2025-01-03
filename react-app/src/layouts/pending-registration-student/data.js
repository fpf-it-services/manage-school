import { useEffect, useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Swal from "sweetalert2";
import MDButton from "components/MDButton";
import CircularProgress from "@mui/material/CircularProgress";
import StudentService from "services/student-service";
import withReactContent from "sweetalert2-react-content";

export default function PendingTable({ onFileSelect }) {
  const [studentsPendings, setStudentsPendings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await StudentService.getPendingRegistration();
        setStudentsPendings(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des inscriptions en attente", error);
        setError("Une erreur est survenue lors de la récupération des inscriptions en attente.");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewFile = (file) => {
    console.log(file)
    onFileSelect(file);
  };

  const handleAccept = async (id) => {
    const result = await Swal.fire({
      title: "Accepter l'inscription ?",
      text: "Cette action acceptera l'inscription de l'élève.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, accepter",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await StudentService.acceptRegistration(id);
        Swal.fire("Accepté", "L'inscription a été acceptée avec succès.", "success");
        setStudentsPendings((prev) => prev.filter((student) => student.id !== id));
      } catch (error) {
        Swal.fire("Erreur", "Une erreur est survenue lors de l'acceptation.", "error");
      }
    }
  };

  const MySwal = withReactContent(Swal);

  const handleReject = async (id) => {
    const { value: formValues } = await MySwal.fire({
      title: "Rejeter l'inscription",
      html: `
      <div style="display: grid; grid-template-columns: 1fr; row-gap: 10px;">
        <div>
          <label for="typeRejet" style="font-weight: bold; text-align: left; margin-bottom: 3px; display: block;">Type de rejet</label>
          <select id="typeRejet" class="swal2-select" style="width: 80%; font-size: 14px; text-align: left;">
            <option value="definitif">Rejet définitif</option>
            <option value="partiel">Rejet partiel</option>
          </select>
        </div>

        <!-- Motif du rejet -->
        <div>
          <label for="motif" style="font-weight: bold; text-align: left; margin-bottom: 3px; display: block;">Motif du rejet</label>
          <textarea id="motif" class="swal2-textarea" style="width: 80%; font-size: 14px; resize: none;" placeholder="Décrivez le motif ici..."></textarea>
        </div>

        <!-- Champs à reprendre -->
        <div id="champsPartiels" style="display: none; text-align: left;">
          <label for="champs" style="font-weight: bold; margin-bottom: 3px; display: block;">Champs à reprendre</label>
          <select id="champs" class="swal2-select" style="width: 80%; font-size: 14px;" multiple>
            <option value="nom">Nom</option>
            <option value="prenoms">Prénoms</option>
            <option value="sexe">Sexe</option>
            <option value="lieu_naissance">Lieu de naissance</option>
             <option value="date_naissance">Date de naissance</option>
            <option value="nationalite">Nationalité</option>
            <option value="photo">Photo</option>
            <option value="releve_de_notes">Relevé de notes</option>
            <option value="releve_de_notes_examen">Relevé de notes examen</option>
            <option value="acte_de_naissance">Acte de naissance</option>
          </select>
        </div>
      </div>
    `,

      focusConfirm: false,
      preConfirm: () => {
        const typeRejet = document.getElementById("typeRejet").value;
        const motif = document.getElementById("motif").value.trim();
        const champs = Array.from(document.getElementById("champs").selectedOptions).map(
          (option) => option.value
        );

        if (!motif) {
          Swal.showValidationMessage("Veuillez fournir un motif de rejet.");
          return false;
        }

        if (typeRejet === "partiel" && champs.length === 0) {
          Swal.showValidationMessage("Veuillez sélectionner au moins un champ à reprendre.");
          return false;
        }

        return { typeRejet, motif, champs };
      },

      didOpen: () => {
        const typeRejet = document.getElementById("typeRejet");
        const champsPartiels = document.getElementById("champsPartiels");

        typeRejet.addEventListener("change", () => {
          champsPartiels.style.display = typeRejet.value === "partiel" ? "block" : "none";
        });
      },

      showCancelButton: true,
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    });

    if (formValues) {
      const { motif, typeRejet, champs } = formValues;
      try {
        typeRejet === "partiel" ? await StudentService.rejectRegistration(id, { motif, champs: champs, status: "rejete_partiellement" }) : await StudentService.rejectRegistration(id, { motif, status: "rejete" })
        Swal.fire("Rejeté", "L'inscription a été rejetée avec succès.", "success");
        setStudentsPendings((prev) => prev.filter((student) => student.id !== id));
      } catch (error) {
        Swal.fire("Erreur", "Une erreur est survenue lors du rejet.", "error");
      }
    }
  };

  const getColumns = () => [
    { Header: "N°", accessor: "numero", align: "center" },
    { Header: "Nom et Prénoms", accessor: "name", align: "center" },
    { Header: "Niveau", accessor: "niveau", align: "center" },
    { Header: "Sexe", accessor: "sexe", align: "center" },
    { Header: "Date de Naissance", accessor: "date", align: "center" },
    { Header: "Lieu de Naissance", accessor: "lieu", align: "center" },
    { Header: "Nationalité", accessor: "nationalite", align: "center" },
    { Header: "Nom Tuteur 1", accessor: "nom_complet_tuteur1", align: "center" },
    { Header: "Telephone Tuteur 1", accessor: "telephone_tuteur1", align: "center" },
    { Header: "Adresse Tuteur 1", accessor: "adresse_tuteur1", align: "center" },
    { Header: "Email Tuteur 1", accessor: "email_tuteur1", align: "center" },
    { Header: "Nom Tuteur 2", accessor: "nom_complet_tuteur2", align: "center" },
    { Header: "Telephone Tuteur 2", accessor: "telephone_tuteur2", align: "center" },
    { Header: "Adresse Tuteur 2", accessor: "adresse_tuteur2", align: "center" },
    { Header: "Email Tuteur 2", accessor: "email_tuteur2", align: "center" },
    { Header: "Photo", accessor: "photo", align: "center" },
    { Header: "Relevé de notes", accessor: "releve_de_notes", align: "center" },
    { Header: "Relevé de notes Examen", accessor: "releve_de_notes_examen", align: "center" },
    { Header: "Acte de naissance", accessor: "acte_de_naissance", align: "center" },
    { Header: "Action", accessor: "action", align: "center" },
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
      Array.isArray(studentsPendings) && studentsPendings.length > 0
        ? studentsPendings.map((studentsPending, index) => ({
            numero: (
              <MDTypography variant="caption" fontWeight="medium">
                {index + 1}
              </MDTypography>
            ),
            name: (
              <MDTypography variant="caption" fontWeight="medium">
                {`${studentsPending.nom} ${studentsPending.prenoms}`}
              </MDTypography>
            ),
            niveau: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.niveau_id}
              </MDTypography>
            ),
            sexe: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.sexe}
              </MDTypography>
            ),
            date: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.date_naissance}
              </MDTypography>
            ),
            lieu: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.lieu_naissance}
              </MDTypography>
            ),
            nationalite: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.nationalite}
              </MDTypography>
            ),
            nom_complet_tuteur1: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.nom_tuteur1}
              </MDTypography>
            ),
            telephone_tuteur1: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.telephone_tuteur1}
              </MDTypography>
            ),
            adresse_tuteur1: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.adresse_tuteur1}
              </MDTypography>
            ),
            email_tuteur1: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.email_tuteur1}
              </MDTypography>
            ),

            nom_complet_tuteur2: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.nom_tuteur2 ? studentsPending.nom_tuteur2 : "-"}
              </MDTypography>
            ),
            telephone_tuteur2: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.nom_tuteur2 ? studentsPending.nom_tuteur2 : "-"}
              </MDTypography>
            ),
            adresse_tuteur2: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.telephone_tuteur2 ? studentsPending.telephone_tuteur2 : "-"}
              </MDTypography>
            ),
            email_tuteur2: (
              <MDTypography variant="caption" fontWeight="medium">
                {studentsPending.email_tuteur2 ? studentsPending.email_tuteur2 : "-"}
              </MDTypography>
            ),

            photo: (
              <MDButton
                variant="text"
                color="info"
                onClick={() => handleViewFile(studentsPending.photo)}
              >
                Voir
              </MDButton>
            ),
            releve_de_notes: (
              <MDButton
                variant="text"
                color="info"
                onClick={() => handleViewFile(studentsPending.releve_de_notes)}
              >
                Voir
              </MDButton>
            ),
            releve_de_notes_examen: (
              <MDButton
                variant="text"
                color="info"
                onClick={() => handleViewFile(studentsPending.releve_de_notes_examen)}
                disabled = {!studentsPending.releve_de_notes_examen.split(".")[studentsPending.releve_de_notes_examen.length - 1]}
              >
                Voir
              </MDButton>
            ),
            acte_de_naissance: (
              <MDButton
                variant="text"
                color="info"
                onClick={() => handleViewFile(studentsPending.acte_de_naissance)}
              >
                Voir
              </MDButton>
            ),
            action: (
              <MDBox display="flex" justifyContent="center" gap={1}>
                <MDButton
                  variant="text"
                  color="success"
                  onClick={() => handleAccept(studentsPending.id)}
                >
                  Accepter
                </MDButton>
                <MDButton
                  variant="text"
                  color="error"
                  onClick={() => handleReject(studentsPending.id)}
                >
                  Rejeter
                </MDButton>
              </MDBox>
            ),
          }))
        : [
            {
              numero: (
                <MDBox display="flex" justifyContent="center" alignItems="center" height="100%">
                  <MDTypography variant="caption" color="text">
                    Aucune donnée disponible.
                  </MDTypography>
                </MDBox>
              ),
            },
          ],
  };
}
