exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  let body;

  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body" })
    };
  }

  const webhook = body.webhook;

  if (
    !webhook ||
    typeof webhook !== "string" ||
    !webhook.startsWith("https://discord.com/api/webhooks/")
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid webhook URL" })
    };
  }

  try {
    const discordResponse = await fetch(webhook, {
      method: "DELETE"
    });

    if (!discordResponse.ok) {
      return {
        statusCode: discordResponse.status,
        body: JSON.stringify({ error: "Failed to delete webhook" })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
