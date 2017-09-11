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
  apltype = '1t',
  targetcount = 1,
  minilevel = MIN_ILEVEL,
  maxilevel = MAX_ILEVEL,
  trinketgroup = false,
  trinketids = '',
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
    const baseline = templates.settings(i, { iterations, prefix: `${prefix}_${gearilevel}_${apltype}_${talents}` }, Number(targetcount) === 5);
    const enemies = templates.enemies(Number(targetcount));
    const character = templates.character(gearilevel, weaponilevel, talents);

    const apl = templates.apl(apltype);

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
    fs.writeFileSync(`./input/${prefix}_input_${i}.simc`, fileData);
  }
  console.log('Done');

}

if (args.generateall) {
  generate({ chunk: args.chunk, prefix: '900_1t_gg', gearilevel: 900, weaponilevel: 910, talents: 'gg', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_1t_incarn', gearilevel: 900, weaponilevel: 910, talents: 'incarn', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_3t_gg', gearilevel: 900, weaponilevel: 910, talents: 'gg', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_3t_incarn', gearilevel: 900, weaponilevel: 910, talents: 'incarn', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_5t_gg', gearilevel: 900, weaponilevel: 910, talents: 'gg', apltype: '5t', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_5t_incarnup', gearilevel: 900, weaponilevel: 910, talents: 'incarn', apltype: '5t_incarnup', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '900_5t_incarndown', gearilevel: 900, weaponilevel: 910, talents: 'incarn', apltype: '5t_incarndown', targetcount: 5, trinketids: args.trinketids });

  generate({ chunk: args.chunk, prefix: '920_1t_gg', gearilevel: 920, weaponilevel: 930, talents: 'gg', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_1t_incarn', gearilevel: 920, weaponilevel: 930, talents: 'incarn', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_3t_gg', gearilevel: 920, weaponilevel: 930, talents: 'gg', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_3t_incarn', gearilevel: 920, weaponilevel: 930, talents: 'incarn', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_5t_gg', gearilevel: 920, weaponilevel: 930, talents: 'gg', apltype: '5t', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_5t_incarnup', gearilevel: 920, weaponilevel: 930, talents: 'incarn', apltype: '5t_incarnup', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '920_5t_incarndown', gearilevel: 920, weaponilevel: 930, talents: 'incarn', apltype: '5t_incarndown', targetcount: 5, trinketids: args.trinketids });

  generate({ chunk: args.chunk, prefix: '940_1t_gg', gearilevel: 940, weaponilevel: 950, talents: 'gg', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_1t_incarn', gearilevel: 940, weaponilevel: 950, talents: 'incarn', apltype: '1t', targetcount: 1, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_3t_gg', gearilevel: 940, weaponilevel: 950, talents: 'gg', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_3t_incarn', gearilevel: 940, weaponilevel: 950, talents: 'incarn', apltype: '3t', targetcount: 3, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_5t_gg', gearilevel: 940, weaponilevel: 950, talents: 'gg', apltype: '5t', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_5t_incarnup', gearilevel: 940, weaponilevel: 950, talents: 'incarn', apltype: '5t_incarnup', targetcount: 5, trinketids: args.trinketids });
  generate({ chunk: args.chunk, prefix: '940_5t_incarndown', gearilevel: 940, weaponilevel: 950, talents: 'incarn', apltype: '5t_incarndown', targetcount: 5, trinketids: args.trinketids });
} else {
  generate(args);

}

