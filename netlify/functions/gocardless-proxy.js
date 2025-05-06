const fetch = require("node-fetch");

exports.handler = async (event) => {
  let path, method, headers, body;

  try {
    const parsedBody = event.body ? JSON.parse(event.body) : {};
    path = parsedBody.path;
    method = parsedBody.method || "GET";
    headers = parsedBody.headers || {};
    body = parsedBody.body;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body", detail: error.message }),
    };
  }

  const gocardlessUrl = "https://bankaccountdata.gocardless.com/api/v2/" + path.replace("/api", "");

  try {
    const response = await fetch(gocardlessUrl, {
      method,
      headers: {
        "Authorization": headers["authorization"],
        "Content-Type": "application/json"
      },
      body: method !== "GET" ? JSON.stringify(body) : undefined
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
