<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription en attente d'une école</title>
</head>
<body>
    Bonjour Admin. J'ai fait une inscription pour une école.Voici mes informations :
        <p>Nom : {{ $mailData['nom'] }}</p>
        <p>Email : {{ $mailData['email'] }}</p>
        <p>Adresse : {{ $mailData['adresse'] }}</p>
        <p>Téléphone : {{ $mailData['telephone'] }}</p>
</body>
</html>