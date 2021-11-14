// http://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [
    {
      name: 'totem475',
      script: 'yarn start:app',
      args: [],
      watch: false,
      time: true
    }
  ]
}
