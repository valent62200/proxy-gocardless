export default async function handler(req, res) {
  // 1. Récupérer la clé API GoCardless stockée dans les variables d'environnement Vercel
  const API_KEY = process.env.GC_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "Clé API GoCardless manquante" });
  }

  // 2. Récupérer le paramètre de pays (fr par défaut)
  const { country = "fr" } = req.query;

  try {
    // 3. Appeler l’API institutions de GoCardless/Nordigen
    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${country.toLowerCase()}&payment_initiation=true`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error });
    }

    const data = await response.json();
    // 4. Retourner la liste des banques
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des institutions", details: err.toString() });
  }
}
