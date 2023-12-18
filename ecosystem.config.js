module.exports = {
  apps: [
    {
      name: 'trimtech',
      script: './dist/src/index.js',
      instances: 2,
      exec_mode: 'cluster',
      watch: true,
      increment_var: 'PORT',
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
      },
      env_production: {
        PORT: 80,
        NODE_ENV: 'production',
      },
    },
  ],
}
