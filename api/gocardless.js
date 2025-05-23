export default async function handler(req, res) {
  const API_KEY = process.env.GC_API_KEY;
  const baseUrl = "https://bankaccountdata.gocardless.com/api/v2/";

  // 1️⃣ Route de test GET
  if (req.method === "GET" && req.url.endsWith("/test")) {
    return res.status(200).json({ message: "Proxy OK" });
  }

  // 2️⃣ Route POST pour créer une réquisition GoCardless
  if (req.method === "POST" && req.url.endsWith("requisitions")) {
    const { institution_id, reference, redirect } = req.body;
    const response = await fetch(`${baseUrl}requisitions/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${API_KEY}`,
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

  // 3️⃣ Fallback si la route n'existe pas
  return res.status(404).json({ error: "Not found" });
}
