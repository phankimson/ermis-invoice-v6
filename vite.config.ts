import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/js/app.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
  server: {
      allowedHosts: [
        'ermis.vn', // Replace with your exact host
       // '.your-subdomain-wildcard.com', // Use a leading dot for subdomains
        // or true to allow all hosts (less secure)
      ],
    },
})