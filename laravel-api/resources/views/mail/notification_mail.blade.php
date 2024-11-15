<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription en attente d'une école</title>
</head>
<body>
    Bonjour cher parent. Nous espérons que ce message vous trouve en pleine forme.Nous passons par ce canal vous rappeler que le paiement de la tranche  {{ $mailData['tranche'] }}
     de la contribution de votre enfant {{ $mailData['eleve'] }} qui s'élève à {{ $mailData['montant_tranche'] }} doit être payé au plus tard 
     le {{ $mailData['echeance_tranche'] }}. Actuellement vous avez à payer {{ $mailData['montant_du'] }} pour être à jour dans la contribution de cette année de votre enfant.

     Cordialement.
</body>
</html>