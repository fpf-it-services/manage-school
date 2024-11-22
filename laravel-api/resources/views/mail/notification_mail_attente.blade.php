<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription en attente dans {{ $mailData['ecole'] }}</title>
</head>
<body>
    Bonjour Parent.Nous avons reçu une demande d'inscription pour votre enfant {{ $mailData['eleve'] }} dans l'école {{ $mailData['ecole'] }}.
    La demande a été traitée et est {{ $mailData['etat'] }}.
    @if($mailData['motif'])
    <p>Motif : {{ $mailData['motif'] }}</p>
    @endif
    @if(count($mailData["champs"]) != 0)
    <p>Vous devez modifier : </p>
    <ul>
        @foreach($mailData["champs1"] as $champ)
        <li> {{ $champ ?? "" }} </li>
        @endforeach
    </ul>
    @endif
</body>
</html>