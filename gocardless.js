export default async function handler(req, res) {
  // Route de test pour vérifier si l’API répond
  if (req.query.test) {
    return res.status(200).json({ message: "OK proxy Vercel !" });
  }

  // Proxy vers GoCardless (exemple GET)
  const apiKey = process.env.GOCARDLESS_API_KEY; // À définir dans tes variables d’environnement Vercel
  const goCardlessUrl = "https://bankaccountdata.gocardless.com/api/v2/requisitions/";

  try {
    const response = await fetch(goCardlessUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Erreur proxy GoCardless:", error);
    res.status(500).json({ message: "Erreur serveur proxy", details: error.message });
  }
}
