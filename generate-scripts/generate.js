const fs = require('fs');
const { trinkets, MIN_ILEVEL, MAX_ILEVEL } = require('./trinket_data');
const { furyString } = require('./constants');
const templates = require('./templates');

const args = require('yargs').argv;

// const {
//   prefix = 'trinkets',
//   chunk = 20,
//   iterations = 10000,
//   gearilevel = '930',
//   weaponilevel = '950',
//   talents = 'gg',
//   apltype = '1t',
//   targetcount = 1,
//   minilevel = MIN_ILEVEL,
//   maxilevel = MAX_ILEVEL,
//   trinketgroup = false,
//   generateall
// } = args;

function generate({
  prefix = 'trinkets',
  chunk = 20,
  iterations = 10000,
  gearilevel = '930',
  weaponilevel = '950',
  talents = 'gg',
  targetcount = 1,
  minilevel = MIN_ILEVEL,
  maxilevel = MAX_ILEVEL,
  trinketgroup = false,
  trinketids = '',
  pantheon = 0,
  generateall
}) {
  if (trinketgroup && !trinkets[trinketgroup]) {
    console.log('Trinket group does not exist');
    process.exit(1);
  }

  let t = trinkets[trinketgroup];

  if (!trinketgroup) {
    t = Object.keys(trinkets).reduce((arr, groupname) => arr.concat(trinkets[groupname]), []);
  }

  if (trinketids !== '') {
    const trinketIDArray = trinketids.split(',').map(id => Number(id));
    t = t.filter(trink => trinketIDArray.includes(trink.id));
  }

  const bigTrinketList = t.reduce((list, trinket) => {
    const trinketCopies = [];
    if (trinket.ilevel) {
      trinketCopies.push(templates.copy(`${trinket.name} (${trinket.ilevel})`, trinket.id, trinket.ilevel));
      if (trinket.fury_empowerment) {
        trinketCopies.push(templates.copy(`${trinket.name} (${trinket.ilevel}) (FoN)`, trinket.id, trinket.ilevel, furyString));
      }
    } else {
      const min = trinket.min_ilevel || minilevel;
      const max = trinket.max_ilevel || maxilevel;
      for (let i = min; i <= max; i += 5) {
        trinketCopies.push(templates.copy(`${trinket.name} (${i})`, trinket.id, i, '', trinket.bonusID));
        if (trinket.fury_empowerment && talents === 'gg') {
          trinketCopies.push(templates.copy(`${trinket.name} (${i}) (FoN)`, trinket.id, i, furyString));
        }
      }
    }
    return list.concat(trinketCopies);
  }, []);

  const chunkSize = Math.min(chunk, bigTrinketList.length);

  const chunks = Math.ceil(bigTrinketList.length / chunkSize);

  let chunkIndex = 0;
  console.log('chunks', chunks);

  for (let i = 0; i < chunks; i += 1) {
    const baseline = templates.settings(i, { pantheon, iterations, prefix: `${prefix}_${gearilevel}_${targetcount}t_${talents}_p${pantheon}` });
    const enemies = templates.enemies(Number(targetcount));
    const character = templates.character(gearilevel, weaponilevel, talents);

    const apl = templates.apl;

    let copies = '';
    for (let j = 0; j < chunkSize; j += 1) {
      if (chunkIndex === bigTrinketList.length) {
        break;
      }
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
    fs.writeFileSync(`./input/${prefix}_input_${i}_p${pantheon}.simc`, fileData);
  }
  console.log('Done');

}
if (args.generateall) {
  [920, 940, 960].forEach((ilevel) => {
    const weaponIlevel = ilevel + 10;
    [1, 3, 5].forEach((targetcount) => {
      ['gg', 'incarn'].forEach((talents) => {
        generate({
          chunk: args.chunk,
          prefix: `${ilevel}_${targetcount}t_${talents}`,
          gearilevel: ilevel,
          weaponilevel: weaponIlevel,
          talents,
          targetcount,
          trinketids: args.trinketids,
          pantheon: 0,
        });
        [5, 10, 15, 20].forEach((pantheon) => {
          generate({
            chunk: args.chunk,
            prefix: `${ilevel}_${targetcount}t_${talents}`,
            gearilevel: ilevel,
            weaponilevel: weaponIlevel,
            talents,
            targetcount,
            trinketgroup: 'pantheon',
            pantheon,
          });
        });
      });

    });

  });
} else {
  generate(args);

}

