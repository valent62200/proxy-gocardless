export default async function handler(req, res) {
  const API_KEY = process.env.GC_API_KEY;

  const response = await fetch('https://bankaccountdata.gocardless.com/api/v2/requisitions/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      redirect: "https://celebrated-lebkuchen-4dab66.netlify.app/dashboard",
      institution_id: "SG_SOGEFRPP",
      reference: "uservds12345"
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  res.status(200).json(data);
}
