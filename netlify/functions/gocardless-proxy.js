const fetch = require("node-fetch");

const GOCARDLESS_API_BASE = "https://bankaccountdata.gocardless.com/api/v2";
const SECRET_ID = process.env.GOCARDLESS_SECRET_ID;
const SECRET_KEY = process.env.GOCARDLESS_SECRET_KEY;

exports.handler = async (event) => {
  try {
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: "",
      };
    }

    const { path, method, headers = {}, body } = JSON.parse(event.body || "{}");

    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' or 'method' in request body." }),
      };
    }

    const apiUrl = `${GOCARDLESS_API_BASE}/${path.replace(/^\/+/, "")}`;

    const sanitizedHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (sanitizedHeaders.authorization && !sanitizedHeaders.authorization.startsWith("Bearer ")) {
      sanitizedHeaders.authorization = `Bearer ${sanitizedHeaders.authorization}`;
    }

    let response = await fetch(apiUrl, {
      method,
      headers: sanitizedHeaders,
      body: body && method !== "GET" ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && body?.refresh) {
      console.log("🔁 Token expiré. Tentative de refresh...");
      const refreshResponse = await fetch(`${GOCARDLESS_API_BASE}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh: body.refresh,
          secret_id: SECRET_ID,
          secret_key: SECRET_KEY,
        }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok) {
        throw new Error("Échec du refresh token: " + JSON.stringify(refreshData));
      }

      sanitizedHeaders.authorization = `Bearer ${refreshData.access}`;
      response = await fetch(apiUrl, {
        method,
        headers: sanitizedHeaders,
        body: body && method !== "GET" ? JSON.stringify(body) : undefined,
      });
    }

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: corsHeaders(),
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("❌ Erreur proxy GoCardless:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}
