const fs = require('fs');
const util = require('util')
const exec = util.promisify(require('child_process').exec);

const args = require('yargs').argv;
const {
  prefix = '',
    dryrun = false,
} = args;

async function runSim(inputFile) {
  const timeStart = Date.now();
  if (dryrun === 'true') {
    await exec(`./simc input/${inputFile} iterations=1 output=log.txt`).stdout.pipe(process.stdout);
  } else {
    await exec(`./simc input/${inputFile} output=log.txt`).stdout.pipe(process.stdout);
  }
  const timeEnd = Date.now();
  const elapsed = (timeEnd - timeStart) / 1000;
  return elapsed;
}

const files = fs.readdirSync('input');
const prefixedFiles = files.filter(f => f.includes(prefix));

const times = [];
async function runAll() {
  for (let i = 0; i < prefixedFiles.length; i += 1) {
    console.log(`Simming chunk ${i + 1} of ${prefixedFiles.length} (${prefixedFiles[i]})`);
    const time = await runSim(prefixedFiles[i]);

    times.push(time);
    const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
    console.log(`--Done - took ${formatTime(time)} (ETA: ${formatTime(avg * (prefixedFiles.length - (i + 1)))})`);
  }
}

runAll();

function formatTime(n) {
  const d = Math.floor(n / (60 * 60 * 24));
  const h = Math.floor((n % (60 * 60 * 24)) / (60 * 60));
  const m = Math.floor((n % (60 * 60)) / 60);
  const s = Math.floor(n % 60);
  if (d > 0) {
    return `${d}d${h}h${m}m${s}s`;
  } else if (h > 0) {
    return `${h}h${m}m${s}s`;
  } else if (m > 0) {
    return `${m}m${s}s`;
  }
  return `${n}s`;
}
