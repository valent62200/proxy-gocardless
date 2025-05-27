export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const API_KEY = process.env.GC_API_KEY;

  try {
    const response = await fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        redirect: req.body.redirect,
        institution_id: req.body.institution_id,
        reference: req.body.reference
      })
    });

    // Gestion propre de l’erreur GoCardless :
    let data;
    try {
      data = await response.json();
    } catch {
      // Réponse vide ou non JSON
      data = null;
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error || JSON.stringify(data) || "Erreur inconnue" });
    }

    // Succès : on renvoie TOUJOURS du JSON
    res.status(200).json(data);

  } catch (e) {
    // Catch toutes les erreurs d’API/serveur :
    res.status(500).json({ error: e.message || "Erreur serveur proxy" });
  }
}
