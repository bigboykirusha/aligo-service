module.exports = {
   apps: [
      {
         name: 'nuxt-app-prod',
         script: '.output/server/index.mjs',
         instances: 'max',
         exec_mode: 'cluster',
         args: '--dotenv .env.production',
         env: {
            NODE_ENV: 'production',
            PORT: 3077
         }
      },
      {
         name: 'nuxt-app-dev',
         script: '.output/server/index.mjs',
         instances: 1,
         exec_mode: 'fork',
         args: '--dotenv .env.development',
         env: {
            NODE_ENV: 'development',
            PORT: 3000
         }
      },
      {
         name: 'nuxt-app-devlocal',
         script: '.output/server/index.mjs',
         instances: 1,
         exec_mode: 'fork',
         args: '--dotenv .env.devlocal',
         env: {
            NODE_ENV: 'development',
            PORT: 3000
         }
      }
   ]
}
