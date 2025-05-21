const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Bloc de test pour /test
  if (event.path && event.path.endsWith('/test')) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OK proxy Netlify !" }),
    };
  }

  // Proxy GoCardless pour les autres routes
  try {
    const { path, httpMethod, headers, body } = event;
    const targetPath = path.replace("/api/", "");
    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${targetPath}`; // <-- Très important

    const apiKey = process.env.GOCARDLESS_API_KEY;

    // LOGS DEBUG
    console.log('API KEY GOCARDLESS:', apiKey ? '[OK - PRÉSENTE]' : '[NON TROUVÉE]');
    console.log('API URL:', apiUrl);

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Clé API GoCardless manquante côté serveur" }),
      };
    }

    // Requête vers GoCardless API
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
