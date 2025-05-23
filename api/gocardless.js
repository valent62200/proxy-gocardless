export default async function handler(req, res) {
  const API_KEY = process.env.GC_API_KEY;
  const baseUrl = "https://bankaccountdata.gocardless.com/api/v2/";

  // Exemple : route POST /api/gocardless/requisitions/
  if (req.method === "POST" && req.url.endsWith("requisitions")) {
    const { institution_id, reference, redirect } = req.body;
    const response = await fetch(`${baseUrl}requisitions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        institution_id,
        reference,
        redirect
      })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  }

  // Ajoute d'autres routes GoCardless ici (ex : GET requisitions/id etc)
  return res.status(404).json({ error: "Not found" });
}
