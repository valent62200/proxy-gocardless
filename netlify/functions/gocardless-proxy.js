const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { path, httpMethod, headers, body } = event;
  const targetPath = path.replace("/api/", "");

  const apiUrl = `https://bankaccountdata.gocardless.com/${targetPath}`;
  const apiKey = process.env.VITE_GOCARDLESS_API_KEY;

  try {
    const res = await fetch(apiUrl, {
      method: httpMethod,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body && httpMethod !== "GET" ? body : undefined,
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erreur proxy GoCardless:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur serveur proxy" }),
    };
  }
};
