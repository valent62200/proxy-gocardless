const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const secretId = process.env.VITE_GOCARDLESS_SECRET_ID;
  const secretKey = process.env.VITE_GOCARDLESS_SECRET_KEY;
  const refreshToken = process.env.VITE_GOCARDLESS_REFRESH_TOKEN;

  try {
    const response = await fetch('https://bankaccountdata.gocardless.com/api/v2/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret_id: secretId,
        secret_key: secretKey,
        refresh: refreshToken
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Refresh token error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
