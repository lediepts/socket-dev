module.exports = {
  apps: [
    {
      name: "CAA-API-system",
      script: "./dist/index.js",
      exec_mode: "cluster",
      out_file: "./pm2/out.log",
      error_file: "./pm2/error.log",
      env: {
        PORT: 8080,
        NODE_ENV: "production",
        DB_HOST: "maria-db-main-eastjp-001.privatelink.mariadb.database.azure.com",
        DB_NAME: "caa",
        DB_USER_NAME: "db_adm0001@maria-db-main-eastjp-001",
        DB_PASSWORD: "S+)S9|%es)b!.8",
        BEAR_SITE_ID: "38",
        BEAR_SERVICE_ID: "38",
        BEAR_NAME: "SL006509",
        BEAR_PASSWORD: "119229ro4s-mmsi4",
        BEAR_FROM_NAME: "消費者庁",
        BEAR_FROM_EMAIL: "no-reply@cocolis.caa.go.jp",
        BEAR_FROM_ENVELOPE: "no-reply@cocolis.caa.go.jp",
      },
    }
  ],
};