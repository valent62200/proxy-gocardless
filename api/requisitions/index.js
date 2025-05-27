export default async function handler(req, res) {
  // CORS pour Netlify/Bolt
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  // Clé d'API GoCardless
  const API_KEY = process.env.GC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "API_KEY manquante" });
  }

  // Logging pour debug
  console.log("REQ BODY:", req.body);

  try {
    // Requête à l'API GoCardless
    const response = await fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirect: req.body.redirect,
        institution_id: req.body.institution_id,
        reference: req.body.reference,
      }),
    });

    // Lire le body (toujours du texte !)
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text); // Essayons de parser le JSON
    } catch (e) {
      // Réponse non-JSON !
      return res.status(response.status).json({
        error: "Réponse GoCardless non JSON",
        status: response.status,
        body: text,
      });
    }

    // Si GoCardless répond avec une erreur JSON (ex : mauvais institution_id)
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error_description || data.error || "Erreur GoCardless",
        status: response.status,
        details: data,
      });
    }

    // Succès
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
