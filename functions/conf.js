export async function onRequest(context) {
  const { env } = context;
  
  const config = {
    dropboxAppKey: env.DROPBOX_APP_KEY || "",
    dropboxAppKeyFull: env.DROPBOX_APP_KEY_FULL || "",
    githubClientId: env.GITHUB_CLIENT_ID || "",
    googleClientId: env.GOOGLE_CLIENT_ID || "",
    googleApiKey: env.GOOGLE_API_KEY || "",
    wordpressClientId: env.WORDPRESS_CLIENT_ID || "",
    allowSponsorship: false,
    giteaClientId: env.GITEA_CLIENT_ID || "",
    giteaUrl: env.GITEA_URL || "",
    gitlabClientId: env.GITLAB_CLIENT_ID || "",
    gitlabUrl: env.GITLAB_URL || "",
  };

  return new Response(JSON.stringify(config), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
