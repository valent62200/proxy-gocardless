// /api/gocardless.js

export default async function handler(req, res) {
  // Récupère la clé API depuis les variables d'environnement Vercel
  const apiKey = process.env.GOCARDLESS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "Clé API GoCardless manquante côté serveur" });
  }

  // Prépare l'URL cible en fonction de la requête
  const targetPath = req.url.replace("/api/gocardless", "");
  const apiUrl = `https://bankaccountdata.gocardless.com${targetPath}`;

  try {
    // Forward la requête vers l'API GoCardless
    const fetchResponse = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...req.headers,
      },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    });

    // Récupère les données et les renvoie
    const data = await fetchResponse.json();
    res.status(fetchResponse.status).json(data);
  } catch (error) {
    console.error("Erreur proxy GoCardless:", error);
    res.status(500).json({ message: "Erreur serveur proxy" });
  }
}
