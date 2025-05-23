export default async function handler(req, res) {
  const API_KEY = process.env.GC_API_KEY;
  const { country } = req.query;

  if (!country) {
    return res.status(400).json({ error: 'Country parameter missing' });
  }

  const url = `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${country}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(response.status).json({ error: data });
  }

  return res.status(200).json(data);
}
