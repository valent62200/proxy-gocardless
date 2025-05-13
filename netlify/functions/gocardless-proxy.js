const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { path, method, headers, body } = JSON.parse(event.body || '{}');

  if (!path || !method) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing `path` or `method` in request body.' })
    };
  }

  const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${path}`;
  
  try {
    const response = await fetch(apiUrl, {
      method,
      headers: {
        'Authorization': `Bearer ${process.env.VITE_GOCARDLESS_API_KEY}`,
        'Content-Type': 'application/json',
        ...(headers || {})
      },
      body: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
