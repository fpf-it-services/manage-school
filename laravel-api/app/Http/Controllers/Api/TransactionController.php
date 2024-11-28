<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\MontantVerificationRequest;
use App\Models\Transaction;
use App\Models\Classe;
use App\Models\Cursus;
use App\Models\Montant;
use App\Models\EleveEnAttente;
use App\Models\Eleve;
use App\Models\Annee;
use App\Models\Ecole;
use Illuminate\Validation\Rule;
use App\Http\Requests\AddMontantRequest;
use App\Http\Resources\TransactionResource;
use App\Http\Services\Api\MontantService;
use App\Http\Requests\AddTransactionRequest;
use App\Http\Services\Api\EleveEnAttente as ServiceEleveEnAttente;
use App\Mail\RecuMailable;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TransactionController extends Controller
{
    /**
     * Vérifie le montant restant à payer pour un élève dans une classe donnée.
     */
    public function montant_du(MontantVerificationRequest $request)
    {
        // Récupère le type de frais (ex : frais d'inscription, de scolarité, etc.) depuis la requête
        $type_frais = $request->input("type_frais");

        // Recherche la classe en fonction de l'ID fourni dans la requête
        $classe = Classe::where("classe_id", $request->classe_id)->first();

        // Si la classe n'existe pas, retourne une erreur
        if ($classe == null) {
            if ($montantModel == null) {
                return response()->json([
                    "success" => false,
                    "message" => "Classe non retrouvée"  // Message d'erreur si la classe n'est pas trouvée
                ]);
            }
        }

        // Récupère le montant total payé par l'élève pour cette classe, année et type de frais
        $montant_paye = Transaction::where("annee_id", $request->annee_id)
            ->where("eleve_id", $request->eleve_id)
            ->where("classe_id", $classe->id)
            ->where("type_frais", $type_frais)
            ->get()->sum("montant");

        // Recherche du montant total défini pour cette classe, niveau, série et année
        $montantModel = Montant::where("ecole_id", $classe->ecole_id)
            ->where("niveau_id", $classe->niveau_id)
            ->where("serie_id", $classe->serie_id)
            ->where("annee_id", $request->annee_id)
            ->first();

        // Si le montant n'est pas défini pour la classe, retourne une erreur
        if ($montantModel == null) {
            return response()->json([
                "success" => false,
                "message" => "Montant non défini pour la classe " . $classe->nom . " pour l'année choisie"
            ]);
        }

        // Récupère le montant total à payer pour le type de frais spécifié
        $montant_total = $montantModel[$type_frais];

        // Retourne la différence entre le montant total et le montant payé jusqu'à présent
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "montant" => $montant_total - $montant_paye  // Montant restant à payer
        ]);
    }
    /**
     * postPaymentData({
     */
    public function saveInscriptionFree(Request $request, $eleve_attente_id)
    {
        $eleve = EleveEnAttente::where('id', $eleve_attente_id)->with(["ecole", "niveau"])->first();
        if ($eleve == null) {
            return response()->json([
                "success" => false,
                "message" => "L'élève n'est pas retrouvé"
            ], 404);
        }
        $montant = MontantService::getMontantOfInfos($eleve->ecole_id, $eleve->niveau_id, $eleve->serie_id);
        if ($montant == null) {
            return response()->json([
                "success" => false,
                "message" => "Montant non défini pour ce niveau"
            ], 404);
        }
        if ($request->reference == null) {
            return response()->json([
                "success" => false,
                "message" => "Référence manquante"
            ], 422);
        }
        if ($request->montant == $montant->frais_inscription) {
            if ($request->reference != null) {
                $response = ServiceEleveEnAttente::acceptPendingStudent($eleve, $request->reference, $montant->frais_inscription, $request->email);
                return response()->json(["message" => $response[1] ?? ""], $response[2]);
            } else {
                return response()->json([
                    "success" => false,
                    "message" => "Référence manquante"
                ], 422);
            }
        } else {
            return response()->json([
                "success" => false,
                "message" => "Les frais d'inscription doivent être " . $montant->frais_inscription
            ], 422);
        }
    }
    public function getAllTransactions(Request $request)
    {
        /*
        { Header: "N°", accessor: "index", align: "left" },
                              { Header: "Nom et Prénoms", accessor: "name", align: "center" },
                              { Header: "Référence", accessor: "reference", align: "center" },
                              { Header: "Montant Payé", accessor: "amount_paid", align: "center" },
                              { Header: "Payeur", accessor: "mail", align: "center" },
                              { Header: "Date", accessor: "date", align: "center" },
                              { Header: "Observations", accessor: "observation", align: "center" },
*/


        if ($request->annee_id == null || $request->classe_id == null) {
            return response()->json([
                "success" => false,  // Indique que la requête a réussi
                "error" => [
                    "message" => "Le champ annee_id ou classe_id est non fourni"
                ]
            ], 422);
        } // auth()->user()->id
        $transactions = Transaction::where("annee_id", $request->annee_id)->where("classe_id", $request->classe_id)->with(["eleve", "classe"])->get();

        $data = [];

        foreach ($transactions as $transaction) {
            $montant = MontantService::getMontantOfClasse($transaction->classe, $transaction->annee_id);
            if ($montant == null) {
                return response()->json([
                    "success" => false,
                    "message" => "Le montant n'est pas défini pour la classe " . $transaction->classe->nom . " de l'école " . (Ecole::where("id", $transaction->classe->ecole_id)->first()->nom)
                ]);
            }
            $data[] = [
                "eleve" => $transaction->eleve->nom . ' ' . $transaction->eleve->prenoms,
                "ref" => $transaction->reference,
                "type" => $transaction->type_frais,
                "montant_paye" => $transaction->montant,
                "payeur" => $transaction->email,
                "date" => $transaction->created_at->format("d/m/Y"),
                "reste" => $this->getMontantPrice($montant, $transaction->type_frais) - $this->getLastTransactionsMontantSum($transactions, $transaction->type_frais, $transaction->created_at),
            ];
        }
        return response()->json([
            "success" => true,
            "data" => $data
        ], 200);
    }

    /**
     * Enregistre une nouvelle transaction.
     */
    public function save(AddTransactionRequest $request)
    {
        // Crée une nouvelle transaction avec les données validées de la requête
        $transaction = Transaction::create($request->validated());

        $recu = collect();
        $recu->push([
            "logo_ecole" => Eleve::findOrFail($request->eleve_id)->ecole->logo,
            "sexe" => Eleve::findOrFail($request->eleve_id)->sexe,
            "nom_prenoms" => Eleve::findOrFail($request->eleve_id)->nom . ' ' . Eleve::findOrFail($request->eleve_id)->prenoms,
            "adresse_eleve" => Eleve::findOrFail($request->eleve_id)->adresse_tuteur1,
            "date_transaction" => $transaction->created_at->format("d/m/Y"),
            "montant" => $transaction->montant,
            "montant_lettre" => $this->convertirEnLettres($transaction->montant),
            "type_frais" => $transaction->type_frais,
            "adresse_ecole" => Eleve::findOrFail($request->eleve_id)->ecole->adresse
        ]);
        $pdf = Pdf::loadView('pdf.recu', compact("recu"));

        $date = date('Y-m-d_H-i-s');
        $filePath = "pdf/recu_{$date}.pdf";

        // Enregistrer le fichier dans le dossier 'storage/app/public/pdf'
        Storage::disk('public')->put($filePath, $pdf->output());

        // Envoyer l'email avec le fichier attaché
        Mail::to($request->email)->send(new RecuMailable($filePath));


        // Retourne une réponse JSON indiquant le succès de l'opération
        return response()->json([
            "success" => true  // Indique que la transaction a été enregistrée avec succès
        ], 201);  // Retourne le code HTTP 201 (Créé)
    }

    function convertirEnLettres($nombre)
    {
        $unites = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
        $dizaines = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

        if ($nombre == 0) {
            return 'zéro euro';
        }

        $parties = explode('.', number_format($nombre, 2, '.', ''));
        $euros = intval($parties[0]);
        $centimes = intval($parties[1]);

        $resultat = $this->convertirNombreEnLettres($euros, $unites, $dizaines) . ' euro' . ($euros > 1 ? 's' : '');

        if ($centimes > 0) {
            $resultat .= ' et ' . $this->convertirNombreEnLettres($centimes, $unites, $dizaines) . ' centime' . ($centimes > 1 ? 's' : '');
        }

        return ucfirst($resultat);
    }

    function convertirNombreEnLettres($nombre, $unites, $dizaines)
    {
        if ($nombre < 10) {
            return $unites[$nombre];
        } elseif ($nombre < 20) {
            $specials = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
            return $specials[$nombre - 10];
        } else {
            $dizaine = intval($nombre / 10);
            $unite = $nombre % 10;
            $lettre = $dizaines[$dizaine];
            if ($unite > 0) {
                if ($dizaine == 7 || $dizaine == 9) {
                    $lettre = $dizaines[$dizaine - 1] . '-dix';
                    $unite += 10;
                }
                $lettre .= '-' . $unites[$unite];
            }
            return str_replace('-zéro', '', $lettre);
        }
    }


    /**
     * Affiche l'historique des transactions d'un élève.
     */
    public function historique(Eleve $eleve)
    {
        // Retourne l'historique des transactions de l'élève, avec les informations sur l'année et la classe
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "data" => TransactionResource::collection($eleve->transactions()->addSelect([
                "annee1" => Annee::whereColumn("id", "transactions.annee_id")->limit(1)->select("annee_academique"),  // Récupère l'année académique associée à chaque transaction
                "classe1" => Classe::whereColumn("id", "transactions.classe_id")->limit(1)->select("nom"),  // Récupère le nom de la classe associée à chaque transaction
            ])->get())
        ], 201);  // Retourne le code HTTP 201 (Créé) avec les données des transactions
    }

    /**
     * Affiche les statistiques de paiement d'un élève (montants totaux à payer, payés et dus).
     */
    public function stats_eleves(Eleve $eleve)
    {
        // Charge les classes et cursus associés à l'élève
        $eleve->load(["cursuses.classe"]);

        // Initialisation du montant total à payer
        $montant_a_payer = 0;

        // Parcours chaque cursus de l'élève pour récupérer le montant à payer pour chaque classe
        foreach ($eleve->cursuses as $cursus) {
            // Récupère le montant défini pour la classe et l'année académique de l'élève
            $montant = MontantService::getMontantOfClasse($cursus->classe, $cursus->annee_id);

            // Si le montant n'est pas défini, retourne une erreur
            if ($montant == null) {
                return response()->json([
                    "success" => false,
                    "message" => "Le montant n'est pas défini pour la classe " . $cursus->classe->nom . " de l'école " . (Ecole::where("id", $cursus->classe->ecole_id)->first()->nom)
                ]);
            }

            // Ajoute les frais à payer pour cette classe au montant total
            $montant_a_payer += $montant->frais_inscription + $montant->frais_reinscription + $montant->frais_formation + $montant->frais_annexe;
        }

        // Récupère toutes les transactions de l'élève
        $transactions = $eleve->transactions;

        // Calcul du montant total payé par l'élève
        $montant_payer = 0;

        foreach ($transactions as $transaction) {
            $montant_payer += $transaction->montant;
        }

        // Retourne les statistiques de paiement de l'élève (montant total, payé et dû)
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "data" => [
                "montant_total" => $montant_a_payer,  // Montant total à payer
                "montant_paye" => $montant_payer,  // Montant payé
                "montant_du" => $montant_a_payer - $montant_payer,  // Montant restant dû
            ]
        ]);
    }
    private function getLastTransactionsMontantSum($transactions, $type_frais, $dateTransaction)
    {
        $frais = 0;
        foreach ($transactions as $transaction) {
            if ($transaction->created_at->isBefore($dateTransaction) && $transaction->type_frais === $type_frais) {
                $frais += $transaction->montant;
            }
        }
        return $frais;
    }
    private function getMontantPrice($montant, $type_frais)
    {
        $frais = 0;
        switch ($type_frais) {
            case 'frais_inscription':
                $frais = $montant->frais_inscription;
                break;
            case 'frais_reinscription':
                $frais = $montant->frais_reinscription;
                break;
            case 'frais_formation':
                $frais = $montant->frais_formation;
                break;
            case 'frais_annexe':
                $frais = $montant->frais_annexe;
                break;
            default:
                # code...
                break;
        }
        return $frais;
    }
}
