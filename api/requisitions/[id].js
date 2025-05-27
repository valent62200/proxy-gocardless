export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === "OPTIONS") return res.status(200).end();

  const { id } = req.query;
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  const API_KEY = process.env.GC_API_KEY;
  try {
    const response = await fetch(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${id}/`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.status(response.status).json(data);
    } catch (e) {
      return res.status(500).json({ error: "La réponse GoCardless n'est pas du JSON", raw: text });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
