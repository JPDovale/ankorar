import retry from "async-retry";

export async function waitForAllServices() {
  await waitForWebServer();
  await waitForEmailServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:9090/v1/status");

      if (response.status !== 200) {
        throw new Error(
          `Web server is not ready. Status code: ${response.status}`,
        );
      }
    }
  }

  async function waitForEmailServer() {
    return retry(fetchEmailServer, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchEmailServer() {
      const response = await fetch("http://localhost:1080/");

      if (response.status !== 200) {
        throw new Error(
          `Email server is not ready. Status code: ${response.status}`,
        );
      }
    }
  }
}
