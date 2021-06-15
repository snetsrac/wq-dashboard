if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const fs = require('fs');
const readline = require('readline');
const parse = require('csv-parse/lib/sync');
const mongoose = require('mongoose');
const { SalinityRecord } = require('./src/server/models');

const uri = process.env.NODE_ENV === 'production' ? process.env.DATABASE_URL : 'mongodb://localhost:27017/wq-dashboard';

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.on('open', async () => {
  console.log(`Connected to database: ${db.host}:${db.port}/${db.name}`);

  await SalinityRecord.deleteMany({});

  await insertData('./johns.csv', 'John\'s Island');
  await insertData('./munyon.csv', 'Munyon Island');
  
  db.close()
  .then(() => console.log('Closed database connection.'))
  .catch((err) => console.error(err));
});

async function insertData(filename, siteName) {
  const file = fs.readFileSync(filename, { encoding: 'utf8'});
  const data = parse(file,
    {
      columns: ['Date', 'Salinity'],
      cast: function(value, context) {
        if (context.column === 'Date') {
          const [ m, d, y ] = value.split('/');
          return new Date(y, m - 1, d);
        } else if (context.column === 'Salinity') {
          return value.length === 0 || isNaN(value) ? null : Number(Number(value).toFixed(2));
        }
      }
    }
  );

  for (let i = 0; i < data.length; i++) {
    const record = new SalinityRecord({
      date: data[i].Date,
      site: siteName,
      salinity: data[i].Salinity
    });

    await record.save();
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Inserted ${i + 1} salinity records for ${siteName}.`);
  }

  process.stdout.write('\n');
}