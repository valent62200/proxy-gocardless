const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { path, method, headers, body } = JSON.parse(event.body || '{}');

    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' or 'method' in request body." }),
      };
    }

    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${path.replace(/^\/+/, '')}`;
    console.log("🔁 Appel GoCardless :", { apiUrl, method, headers, body });

    const response = await fetch(apiUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    console.log("✅ Réponse GoCardless :", data);

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("❌ Erreur proxy GoCardless :", error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};
