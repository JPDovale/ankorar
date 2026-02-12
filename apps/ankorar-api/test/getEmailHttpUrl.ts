export function getEmailHttpUrl() {
  const httpHost = process.env.EMAIL_HTTP_HOST || "localhost";
  const httpPort = process.env.EMAIL_HTTP_PORT || "1080";
  return `http://${httpHost}:${httpPort}`;
}
