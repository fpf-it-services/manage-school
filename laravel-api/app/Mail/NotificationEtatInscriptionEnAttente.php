<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificationEtatInscriptionEnAttente extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(public $mailData)
    {
        $mailData["champs1"] = [];
        $data = [
            "nom" => "Nom",
            "prenoms" => "Prénoms",
            "date_naissance" => "Date de naissance",
            "lieu_naissance" => "Lieu de naissance",
            "nationalite" => "Nationalité",
            "sexe" => "Sexe",
            "photo" => "Photo",
            "nom_complet_tuteur1" =>"Nom complet du tuteur1",
            "telephone_tuteur1" =>"Téléphone du tuteur1",
            "adresse_tuteur1" =>"Adresse du tuteur1",
            "email_tuteur1" =>"Adresse email du tuteur1",
            "nom_complet_tuteur2" => "Nom complet du tuteur2",
            "telephone_tuteur2" =>"Téléphone tuteur 2",
            "adresse_tuteur2" => "Adresse tuteur2",
            "email_tuteur2" => "Adresse email tuteur2",
            "releve_de_notes" =>"Relevé de notes",
            "releve_de_notes_examen" => "Relevé de notes des examens",
            "acte_de_naissance" => "Acte de naissance"
        ];
        if(count($mailData["champs"]) != 0){
            foreach($mailData["champs"] as $champ){
                $mailData["champs1"][] = $data[$champ]?? "";
            }
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notification état Inscription en attente',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mail.notification_mail_attente',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
