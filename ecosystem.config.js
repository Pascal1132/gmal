module.exports = {
  apps: [
    {
      name: 'gmal',
      exec_mode: 'cluster',
      instances: '1',
      script: './.output/server/index.mjs'
    }
  ]
}
