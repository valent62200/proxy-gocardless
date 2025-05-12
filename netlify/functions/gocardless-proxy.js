const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { path, method, headers = {}, body } = JSON.parse(event.body || "{}");

    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' or 'method' in request body." }),
      };
    }

    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${path.replace(/^\/+/, "")}`;

    // Ajouter l'Authorization depuis variable d'environnement
    const apiKey = process.env.VITE_GOCARDLESS_API_KEY;

    const requestOptions = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        ...headers
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined,
    };

    const response = await fetch(apiUrl, requestOptions);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erreur proxy GoCardless :", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};
