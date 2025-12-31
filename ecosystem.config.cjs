module.exports = {
  apps: [
    {
      name: 'ermis-invoice',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
    },
  ],
}