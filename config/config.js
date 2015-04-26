var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
  , notifier = {
      service: 'postmark',
      APN: false,
      email: false, // true
      actions: ['comment'],
      tplPath: templatePath,
      key: 'POSTMARK_KEY',
      parseAppId: 'PARSE_APP_ID',
      parseApiKey: 'PARSE_MASTER_KEY'
    };

module.exports = {
  development: {
    //db: 'mongodb://222.186.44.11:27017/vpidb',
    db: 'mongodb://localhost:27017/ncnlldb',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '开发'
    }
  },
  test: {
    db: 'mongodb://localhost:27017/ncnlldb',
    root: rootPath,
    notifier: notifier,
    app: {
      name: '测试'
    }
  },
  production: {
      //db: 'mongodb://222.186.44.11:27017/vpidb',
      db: 'mongodb://localhost:27017/ncnlldb',
      root: rootPath,
      notifier: notifier,
      app: {
          name: 'NCNLL'
      }
  }
};
