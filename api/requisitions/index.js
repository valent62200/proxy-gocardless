export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const API_KEY = process.env.GC_API_KEY;

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

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  res.status(200).json(data);
}
