<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carte de Certification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f4f4f4;
    }

    .card {
      width: 380px;
      height: 250px;
      background: linear-gradient(135deg, #007bbf 0%, #00aaff 100%);
      background-size: cover;
      border-radius: 15px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      color: white;
      padding: 15px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
    }

    .header img {
      width: 50px;
      height: auto;
    }

    .content {
      display: flex;
      margin-top: -15px;
    }

    .photo {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: #fff;
      overflow: hidden;
      margin-right: 10px;
    }

    .photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .details {
      font-size: 10px;
      line-height: 1.3;
      margin: 0;
      margin-top: -10px;
    }

    .rank {
      font-weight: bold;
      font-size: 12px;
      color: #ffcc00;
      margin-top: 5px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
    }

    .barcode {
      width: 80px;
      height: 30px;
      background: white;
      border-radius: 5px;
    }

    .footer p {
      margin: 0;
      flex: 1;
      margin-right: 10px;
    }
  </style>
</head>

<body>

  <div class="card">
    <div class="header">
      <h2>OPEN WATER DIVER</h2>
      <img src="school.jpeg" alt="Logo EDF">
    </div>

    <div class="content">
      <div class="photo">
        <img src="Florian.jpeg" alt="Photo du plongeur">
      </div>
      <div class="details">
        <p><strong>Nom :</strong> Miranda GOLDMAN</p>
        <p><strong>Adresse :</strong> 111 Bluewater Lane,<br> SEATON, EV 12345</p>
        <p><strong>Numéro de plongeur :</strong> 123456789</p>
        <p><strong>Date de naissance :</strong> 10/10/1980</p>
        <p><strong>Date de certification :</strong> 25/06/2001</p>
        <div class="rank">RANK 5</div>
      </div>
    </div>

    <div class="footer">
      <p>Ce plongeur a satisfait aux exigences de certification.</p>
      <div class="barcode"></div>
    </div>
  </div>

</body>

</html>
