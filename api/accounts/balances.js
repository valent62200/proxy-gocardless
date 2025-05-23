export default async function handler(req, res) {
  const { account_id } = req.query;
  const API_KEY = process.env.GC_API_KEY; 

  if (!account_id) {
    return res.status(400).json({ error: "account_id requis" });
  }

  const gcUrl = `https://bankaccountdata.gocardless.com/api/v2/accounts/${account_id}/balances/`;

  const response = await fetch(gcUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  const data = await response.json();
  return res.status(200).json(data);
}
