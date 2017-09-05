const fs = require('fs');
const { trinkets, MIN_ILEVEL, MAX_ILEVEL } = require('./trinket_data');
const templates = require('./templates');

const args = require('yargs').argv;

const {
  prefix = 'trinkets',
  chunk = 20,
  iterations = 10000,
  gearilevel = '930',
  weaponilevel = '950',
  talents = 'gg',
  apltype = '1t',
  targetcount = 1,
  minilevel = MIN_ILEVEL,
  maxilevel = MAX_ILEVEL,
  trinketgroup,
} = args;

if (trinketgroup && !trinkets[trinketgroup]) {
  console.log('Trinket group does not exist');
  process.exit(1);
}

let t = trinkets[trinketgroup];

if (!trinketgroup) {
  t = Object.keys(trinkets).reduce((arr, groupname) => arr.concat(trinkets[groupname]), []);
}

const bigTrinketList = t.reduce((list, trinket) => {
  const trinketCopies = [];
  if (trinket.ilevel) {
    trinketCopies.push(templates.copy(trinket.name, trinket.id, trinket.ilevel));
  } else {
    const min = trinket.min_ilevel || minilevel;
    const max = trinket.max_ilevel || maxilevel;
    for (let i = min; i <= max; i += 5) {
      trinketCopies.push(templates.copy(trinket.name, trinket.id, i));
    }
  }
  return list.concat(trinketCopies);
}, []);

const chunkSize = Math.min(chunk, bigTrinketList.length);

const chunks = Math.ceil(bigTrinketList.length / chunkSize);

let chunkIndex = 0;
console.log('chunks', chunks);

for (let i = 0; i < chunks; i += 1) {
  const baseline = templates.settings(i, { iterations, prefix: `${prefix}_${gearilevel}_${apltype}_${talents}` }, targetcount === 5);
  const enemies = templates.enemies(targetcount);
  const character = templates.character(gearilevel, weaponilevel, talents);

  const apl = templates.apl(apltype);

  let copies = '';
  for (let j = 0; j < chunkSize; j += 1) {
    copies += bigTrinketList[chunkIndex];
    chunkIndex += 1;
  }

  const fileData = `
  ${baseline}
  ${enemies}
  ${character}
  ${apl}
  ${copies}
  `;

  console.log(`Writing file ${i+1} of ${chunks}`);
  fs.writeFileSync(`./input/${prefix}_input_${i}.simc`, fileData);
}
console.log('Done');
