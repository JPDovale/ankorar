const { exec } = require("node:child_process");

function checkPostgresConnection() {
  exec(
    "docker exec ankorar_dev_database pg_isready --host localhost",
    handleReturn,
  );

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresConnection();
      return;
    }

    console.log("\n[✓] Postgres is ready to accept connections!\n\n");
  }
}

process.stdout.write("\n\n[X] Waiting for postgres accepted connections");
checkPostgresConnection();
