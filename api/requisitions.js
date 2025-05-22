export default async function handler(req, res) {
  // Remplace par ta clé API GoCardless (mieux : utilise process.env.GC_API_KEY)
  const API_KEY = process.env.GC_API_KEY;

  const response = await fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      redirect: "https://celebrated-lebkuchen-4dab66.netlify.app/dashboard", // remplace par ton vrai redirect
      institution_id: "SG_SOGEFRPP",              // remplace par une banque de test (ex : "OB-XYZ")
      reference: "user1234"                       // un identifiant unique
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  res.status(200).json(data);
}
