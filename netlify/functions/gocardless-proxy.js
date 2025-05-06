const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { path, method, headers, body } = JSON.parse(event.body);

  const gocardlessUrl = "https://bankaccountdata.gocardless.com/api/v2/" + path.replace("/api/", "");

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
