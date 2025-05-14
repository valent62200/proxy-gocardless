const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Méthode non autorisée",
    };
  }

  try {
    const { refresh } = JSON.parse(event.body);

    const res = await fetch("https://bankaccountdata.gocardless.com/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh,
        secret_id: process.env.VITE_GOCARDLESS_SECRET_ID,
        secret_key: process.env.VITE_GOCARDLESS_SECRET_KEY,
      }),
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Erreur refresh token:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Erreur serveur proxy refresh" }),
    };
  }
};
