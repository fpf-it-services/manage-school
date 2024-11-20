<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription en attente d'une école</title>
</head>
<body>
    Bonjour Parent.Nous avons reçu une demande d'inscription pour votre enfant {{ $mailData['eleve'] }} dans l'école {{ $mailData['ecole'] }}.
    @if($mailData['nouveau'])
    Pour suivre cette demande,un compte vous a été crée et les informations de connexion sont:
        <p>Email : {{ $mailData['email'] }}</p>
        <p>Mot de passe : {{ $mailData['password'] }}</p>
    @else       
    Vos informations de connexion restent les mêmes. 
    @endif
</body>
</html>