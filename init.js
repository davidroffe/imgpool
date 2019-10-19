const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const rootPath = path.dirname(require.main.filename);
const publicDir = rootPath + '/public';
const uploadsDir = rootPath + '/public/uploads';
const thumbDir = uploadsDir + '/thumbnails';

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(thumbDir)) {
  fs.mkdirSync(thumbDir);
}

const sequelizeMigration = new Promise((resolve, reject) => {
  const migrate = exec(
    'sequelize db:migrate',
    { env: process.env },
    (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    }
  );

  // Forward stdout+stderr to this process
  migrate.stdout.pipe(process.stdout);
  migrate.stderr.pipe(process.stderr);
});

sequelizeMigration.then(() => {
  const Models = require('./models');

  Models.Setting.findOrCreate({ where: {} });
});
