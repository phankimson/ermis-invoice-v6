module.exports = {
  apps: [
    {
      name: 'web-app',
      script: './build/server.js', // The entry file after building
      instances: 'max',             // Run maximum instances for load balancing
      exec_mode: 'cluster',         // Enable cluster mode
      autorestart: true,            // Automatically restart if it crashes
      // Optional: Set the ENV_PATH to a secure location for your .env file
      // env_production: {
      //   ENV_PATH: '/etc/secrets/.env'
      // }
    },
  ],
};