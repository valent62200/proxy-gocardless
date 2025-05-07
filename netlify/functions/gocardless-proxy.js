const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    const { path, method, headers = {}, body } = JSON.parse(event.body || '{}');

    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' or 'method' in request body." }),
      };
    }

    const allowedHeaders = ['Content-Type', 'Authorization'];
    const filteredHeaders = Object.keys(headers)
      .filter(k => allowedHeaders.includes(k))
      .reduce((acc, key) => {
        acc[key] = headers[key];
        return acc;
      }, {});

    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${path.replace(/^\/+/, '')}`;

    const response = await fetch(apiUrl, {
      method,
      headers: filteredHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};
