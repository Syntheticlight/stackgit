export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  const clientId = url.searchParams.get("clientId");
  const code = url.searchParams.get("code");
  const redirectUri = url.searchParams.get("redirectUri");

  // Configuration for different providers
  const providers = {
    githubToken: {
      url: "https://github.com/login/oauth/access_token",
      clientSecret: env.GITHUB_CLIENT_SECRET,
      needRedirectUri: false
    },
    giteeToken: {
      url: "https://gitee.com/oauth/token",
      clientSecret: env.GITEE_CLIENT_SECRET,
      needRedirectUri: true
    },
    giteaToken: {
      url: `${env.GITEA_URL}/login/oauth/access_token`,
      clientSecret: env.GITEA_CLIENT_SECRET,
      needRedirectUri: false
    },
    gitlabToken: {
      url: `${env.GITLAB_URL}/oauth/token`,
      clientSecret: env.GITLAB_CLIENT_SECRET,
      needRedirectUri: false
    }
  };

  // Determine provider from URL path (e.g. /oauth2/githubToken -> githubToken)
  const pathParts = url.pathname.split('/');
  const providerKey = pathParts[pathParts.length - 1];
  const provider = providers[providerKey];

  if (!provider) {
    return new Response("Unknown provider", { status: 400 });
  }

  // Construct request parameters
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("client_secret", provider.clientSecret);
  params.append("code", code);
  
  // Some providers (like Gitee) strictly require grant_type and redirect_uri
  if (providerKey !== 'githubToken') {
     params.append("grant_type", "authorization_code");
  }
  
  if (provider.needRedirectUri && redirectUri) {
    params.append("redirect_uri", redirectUri);
  }

  try {
    const response = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded" // Standard OAuth2 content type
      },
      body: params
    });

    const data = await response.json();
    
    // Check for errors in the upstream response
    if (data.error) {
       return new Response(JSON.stringify(data), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    
    // Normalize response: StackEdit expects raw token string or JSON with access_token?
    // Looking at original python code:
    // Github: returns token string (but python code returns body['access_token'] if simple return) 
    // Wait, the original python code:
    // github: return token (string)
    // gitee: return jsonify(token_body) (json)
    // gitea: return jsonify(token_body) (json)
    // gitlab: return jsonify(token_body) (json)
    
    // Let's adjust based on provider
    if (providerKey === 'githubToken') {
        return new Response(data.access_token);
    } else {
        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" }
        });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
}
