module.exports = {
  apps: [
    {
      name: 'ermis-invoice',
      script: './bin/server.ts',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}