<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reçu de paiement</title>
    <style>
        .recu-body {
            font-family: Arial, sans-serif;
            margin: 20px;
            border: 1px solid black;
            padding: 20px;
            max-width: 800px;
            height: auto;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .header .logo {
            max-width: 100px;
        }

        .header h1 {
            text-align: center;
            flex-grow: 1;
            margin: 0;
        }

        .content {
            margin-top: 20px;
        }

        .info-destinataire {
            border: 1px solid black;
            padding: 10px;
            width: 250px;
            margin-bottom: 20px;
        }

        .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .signature-box {
            border: 1px solid black;
            width: 200px;
            height: 50px;
        }
    </style>
</head>

<body>
    <div class="recu-body">
        <div class="header">
            <div class="logo">
                <img src="{{ storage_path($recu->logo_ecole) }}" alt="Logo" style="max-width: 100px;">
            </div>
            <h1>Reçu de paiement</h1>
        </div>

        <div class="content">
            <div class="info-destinataire">
                <p> {{ $recu->sexe == "M" ? "Mr" : "Mme" }} {{$recu->nom_prenoms}}  <br> {{$recu->adresse_eleve}} </p>
            </div>

            <p>Nous avons bien reçu le {{$recu->date_transaction}} la somme de {{$recu->montant_lettre}} FCFA  ( {{number_format($recu->montant)}} FCFA) pour le compte
                @if ($recu->type_frais == "frais_inscription")
                    {{"de l'inscription de "}}
                @elseif($recu->type_frais == "frais_reinscription")
                {{"de la réinscription de "}}
                @elseif($recu->type_frais == "frais_formation")
                {{"de la scolarité de "}} 
                @else
                {{"des frais annexes de "}} 
                @endif
                {{ $recu->sexe == "M" ? "Mr" : "Mme" }} {{$recu->nom_prenoms}}.
            </p>

            <div class="signature-section">
                <p>Fait à {{$recu->adresse_ecole}} le {{$recu->date_transaction}}</p>
                <div class="signature-box">Signature :</div>
            </div>
        </div>
    </div>

</body>

</html>
