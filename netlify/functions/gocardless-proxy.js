export const handler = async (event) => {
  try {
    const { path, method, headers, body } = JSON.parse(event.body || '{}');

    if (!path || !method) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing 'path' or 'method' in request body." }),
      };
    }

    const apiUrl = `https://bankaccountdata.gocardless.com/api/v2/${path.replace(/^\/+/, '')}`;

    const response = await fetch(apiUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, stack: error.stack }),
    };
  }
};
