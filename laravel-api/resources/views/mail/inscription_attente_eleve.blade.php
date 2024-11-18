<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription en attente d'une école</title>
</head>
<body>
    Bonjour Tuteur.Nous avons reçu une demande d'inscription pour un enfant dans l'école {{ $mailData['ecole'] }}.Pour suivre cette demande,un compte vous a été crée et les informations de connexion sont:
        <p>Email : {{ $mailData['email'] }}</p>
        <p>Mot de passe : {{ $mailData['password'] }}</p>
</body>
</html>