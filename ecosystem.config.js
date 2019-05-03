module.exports = {
  deploy: {
    production: {
      user: 'davejump',
      host: ['107.191.52.76'],
      port: '9001',
      ref: 'origin/master',
      repo: 'git@github.com:DaveJump/todo-app-client-ts.git',
      path: '/www/todo-app/todo-app-client-ts',
      ssh_options: 'StrictHostKeyChecking=no',
      'post-deploy': 'yarn install && yarn build'
    }
  }
}
