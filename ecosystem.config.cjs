module.exports = {
  apps: [
    {
      name: 'ermis-invoice',
      script: './bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}