const csv=require('csvtojson')
const fs=require('fs')

var argv = require('yargs')
  .usage('Usage: $0 [options...]')
  .demand(['dir'])
  .describe('dir', 'directory with np files.')
  .argv;

console.log('starting')

var file = argv.dir + '/np2014_d1.csv';
if (!fs.existsSync(file)) {
  console.error(file + ' does not exist.')
}

csv()
  .fromFile(file)
  .on('csv',(csvRow)=>{
      console.log(csvRow)
  })
  .on('done',(error)=>{
      console.log('end')
  })
