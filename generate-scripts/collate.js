const fs = require('fs');

const args = require('yargs').argv;
const {
  inputDir,
  existingData = null,
  collationComment = '',
} = args;

  function collate(input, existingData) {
    if (!input) {
      console.log('No input dir supplied');
      process.exit(1);
    }

    let fullData = {};
    if (existingData) {
      fullData = require(`./${existingData}`);
    }

    const files = fs.readdirSync(input);
    const fullCSV = ['gearilevel,talent,targetcount,name,ilevel,fon,dps,relative'];
    let trinketCount = 0;

    const filenamePattern = /(900|920|940)_(1t|3t|5t)_(gg|incarn|incarnup|incarndown)_.+_result_(\d+).json/;

    const timestamp = new Date();
    const dateString = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}`;

    let comment = '';
    if (collationComment.length) {
      comment = `-${collationComment}`;
    }

    const dirname = dateString + comment;
    if (fs.existsSync(dirname)) {
      console.log('Dir exists somehow already');
      process.exit(1);
    }

    const jsonFiles = files.filter(f => f.includes('.json'));
    jsonFiles.forEach((f) => {
      const [fullname, ilevel, targetCount, talent, id] = f.match(filenamePattern);

      const fileContents = JSON.parse(fs.readFileSync(`${input}/${f}`));

      if (!fullData[ilevel]) {
        fullData[ilevel] = {};
      }

      if (!fullData[ilevel][talent]) {
        fullData[ilevel][talent] = {};
      }

      if (!fullData[ilevel][talent][targetCount]) {
        fullData[ilevel][talent][targetCount] = {};
        fullData[ilevel][talent][targetCount].csv = ['name,ilevel,fon,dps,relative'];
      }

      const data = fullData[ilevel][talent][targetCount];

      const baselinePlayer = fileContents.sim.players[0];
      const baselineDPS = Math.round(baselinePlayer.collected_data.dps.mean);
      if (!data.Baseline) {
        data.Baseline = baselineDPS;
        data.csv.push(`Baseline,,false,${baselineDPS},0`);
        fullCSV.push(`${ilevel},${talent},${targetCount},Baseline,,false,${baselineDPS},0`);
      } else {
        // If the baseline DPS is too far off, flag it for review
        if (Math.abs((data.Baseline / baselineDPS) - 1) > 0.01) {
          console.log(`[DEVIATION]: File ${f} has abnormal baseline DPS (Recorded: ${data.Baseline}, This: ${baselineDPS})`);
        }
      }

      const trinkets = fileContents.sim.profilesets.results;
      trinkets.forEach((trinket) => {
        const [fullstring, trinketName, trinketIlevel, fon] = trinket.name.match(/(.+)\s\((\d+)\)\s?(\(FoN\))?/);
        const trinketDPS = Math.round(trinket.mean);
        const isFoN = fon === '(FoN)';

        // console.log(`[${trinketIlevel}] ${trinketName} (${isFoN}): ${trinketDPS}`);
        if (!data[trinketName]) {
          data[trinketName] = {};
        }

        if (isFoN) {
          if (!data[trinketName].fon) {
            data[trinketName].fon = {};
          }

          if (data[trinketName].fon[trinketIlevel] !== undefined) {
            console.log(`Trinket ${trinketName} ${trinketIlevel} (FoN) already exists; overwriting (old value: ${data[trinketName].fon[trinketIlevel]}, new value: ${trinketDPS})`);
          }

          data[trinketName].fon[trinketIlevel] = trinketDPS;
        } else {
          if (data[trinketName][trinketIlevel] !== undefined) {
            console.log(`Trinket ${trinketName} ${trinketIlevel} already exists; overwriting (old value: ${data[trinketName][trinketIlevel]}, new value: ${trinketDPS})`);
          }

          data[trinketName][trinketIlevel] = trinketDPS;

        }

        data.csv.push(`${trinketName},${trinketIlevel},${isFoN},${trinketDPS},${trinketDPS - baselineDPS}`);
        trinketCount += 1;
      });


    });

    Object.keys(fullData).forEach((ilevel) => {
      Object.keys(fullData[ilevel]).forEach((talent) => {
        Object.keys(fullData[ilevel][talent]).forEach((targetCount) => {

          Object.keys(fullData[ilevel][talent][targetCount]).forEach((trinketName) => {
            if (trinketName === 'fon' || trinketName === 'Baseline' || trinketName === 'csv') {
              return;
            }

            Object.keys(fullData[ilevel][talent][targetCount][trinketName]).forEach((trinketIlevel) => {
              if (trinketIlevel === 'fon') {
                return;
              }
              const trinketDPS = fullData[ilevel][talent][targetCount][trinketName][trinketIlevel];
              let oneLower = fullData[ilevel][talent][targetCount].Baseline;
              if (fullData[ilevel][talent][targetCount][trinketName][trinketIlevel - 5]) {
                oneLower = fullData[ilevel][talent][targetCount][trinketName][trinketIlevel - 5];
              }
              if (trinketDPS - oneLower < 0) {
                const percentError = Math.abs((trinketDPS - oneLower) / trinketDPS)
                if (percentError > 0.005) {
                  process.exit(1);
                } else {
                  oneLower = trinketDPS;
                }
              }

              fullCSV.push(`${ilevel},${talent},${targetCount},${trinketName},${trinketIlevel},false,${trinketDPS},${trinketDPS - oneLower}`);

            });
            if (fullData[ilevel][talent][targetCount][trinketName].fon) {
              Object.keys(fullData[ilevel][talent][targetCount][trinketName].fon).forEach((trinketIlevel) => {
                const trinketDPS = fullData[ilevel][talent][targetCount][trinketName].fon[trinketIlevel];
                let oneLower = fullData[ilevel][talent][targetCount].Baseline;
                if (fullData[ilevel][talent][targetCount][trinketName].fon[trinketIlevel - 5]) {
                  oneLower = fullData[ilevel][talent][targetCount][trinketName].fon[trinketIlevel - 5];
                }
                if (trinketDPS - oneLower < 0) {
                  const percentError = Math.abs((trinketDPS - oneLower) / trinketDPS)
                  console.log('one lower is negative:', ilevel, talent, targetCount)
                  console.log('trinket (fon):',trinketName, trinketIlevel, trinketDPS);
                  console.log('one lower:', trinketIlevel - 5, oneLower, '(baseline', fullData[ilevel][talent][targetCount].Baseline, ')');
                  console.log('difference of:', trinketDPS - oneLower, '(', (trinketDPS - oneLower) / trinketDPS, '%)')
                  if (percentError > 0.005) {
                    process.exit(1);
                  } else {
                    oneLower = trinketDPS;
                  }
                }

                fullCSV.push(`${ilevel},${talent},${targetCount},${trinketName},${trinketIlevel},true,${trinketDPS},${trinketDPS - oneLower}`);
              })

            }

          })





          // fs.writeFileSync(`${dirname}/${ilevel}_${targetCount}_${talent}.csv`, fullData[ilevel][talent][targetCount].csv.join('\n'));
        });
      });
    });

    fs.mkdirSync(dirname);

    fs.writeFileSync(`${dirname}/full.csv`, fullCSV.join('\n'));
    fs.writeFileSync(`${dirname}/full.json`, JSON.stringify(fullData));
    console.log(`Wrote ${trinketCount} trinkets to ${dirname}`);
  }

  collate(inputDir, existingData);
