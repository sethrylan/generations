const csv=require('csvtojson')
const fs=require('fs')
const _=require('lodash')
const async=require('async')
const deepmerge=require('deepmerge')
const util = require('util')

var argv = require('yargs')
  .usage('Usage: $0 [options...]')
  // .demand(['dir'])
  // .describe('dir', 'directory with np files.')
  .argv;


Array.prototype.subarray=function(start,end){
     if(!end){ end=-1;} 
    return this.slice(start, this.length+1-(end*-1));
}

console.log('starting')

var file = __dirname + '/../np/np2014_d2.csv';
if (!fs.existsSync(file)) {
  console.error(file + ' does not exist.');
}


async.parallel({
  d2: function(callback) {
    var years = {};
    csv()
      .fromFile(__dirname + '/../np/np2014_d2.csv')
      .on('csv', (row) => {
        if (row[0] === '0' && row[0] === '0' ) {
          row = row.map(Number);
          years[row[2]] = { birth: row[3] };
        }
      })
      .on('done', (error) => {
          console.log('end');
          callback(error, years);
      });
  },
  d3: function(callback) {
    var years = {};
    csv()
      .fromFile(__dirname + '/../np/np2014_d3.csv')
      .on('csv', (row) => {
        if (row[0] === '0' && row[0] === '0' ) {
          row = row.map(Number);
          years[row[2]] = { death: {} }
          years[row[2]].death.net = row[3];
          _.each(row.subarray(4), function (val, i) {
            years[row[2]].death[i] = val;
          });
        }
      })
      .on('done', (error) => {
          console.log('end')
          callback(error, years);
      });
  },
  d4: function(callback) {
    var years = {};
    csv()
      .fromFile(__dirname + '/../np/np2014_d4.csv')
      .on('csv', (row) => {
        if (row[0] === '0' && row[0] === '0' ) {
          row = row.map(Number);
          years[row[2]] = { immigration: {} }
          years[row[2]].immigration.net = row[3];
          _.each(row.subarray(4), function (val, i) {
            years[row[2]].immigration[i] = val;
          });
        }
      })
      .on('done', (error) => {
          console.log('end')
          callback(error, years);
      });
  }
}, function(err, results) {
  // console.log(util.inspect(results.d2, false, null));
  var merged = deepmerge.all([results.d2, results.d3, results.d4]);
  console.log(util.inspect(merged, false, null));
});


// csv()
//   .fromFile(__dirname + '/../np/np2014_d3.csv')
//   .on('csv', (row) => {
//     if (row[0] === '0' && row[0] === '0' ) {
//       row = row.map(Number);
//       years[row[2]].death = {}
//       years[row[2]].death.net = row[3];
//       // _.each(row.subarray(4), function (val, i) {
//       //   years[row[2]].death[i] = val;
//       // });
//     }
//   })
//   .on('done', (error) => {
//       console.log('end')
//   });



