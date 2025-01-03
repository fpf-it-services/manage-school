<?php

use App\Mail\RecuMailable;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

// Route::get('/', function () {

//     $pdf = Pdf::loadView('pdf.recu');
       
//     $filePath = 'pdf/recu.pdf';

//     // Enregistrer le fichier dans le dossier 'storage/app/public/pdf'
//     Storage::disk('public')->put($filePath, $pdf->output());

//     // Envoyer l'email avec le fichier attaché
//     Mail::to('amedeflorianktm@gmail.com')->send(new RecuMailable($filePath));

//     return 'Reçu envoyé avec succès !';

//     // // Générer un lien d'accès public
//     // $url = Storage::url($filePath);


//     // return redirect($url); // Retourner l'URL du fichier

//     // return view('welcome');

// });