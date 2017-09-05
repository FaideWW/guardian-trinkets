const { apls, mainstat_templates, secondarystat_templates } = require('./constants');

module.exports.settings = (id, { iterations, prefix, }, dungeon_sim = false) => {
  let dungeon_override = '';
  if (dungeon_sim) {
    dungeon_override = `
override.bloodlust=0

max_time=30
vary_combat_length=0.0
fixed_time=1
    `;
  }

  return (`
optimal_raid=1
${dungeon_override}

max_time=300
vary_combat_length=0.2
iterations=${iterations}
html=output/${prefix}_result_${id}.html
json2=output/${prefix}_result_${id}.json
          `);
};

module.exports.enemies = (target_count) => {
  let str = 'enemy=Fluffy_Pillow\n';

  for (let i = 2; i <= target_count; i += 1) {
    str += `enemy=enemy${i}${'\n'}`;
  }

  return str;
};

module.exports.character = (ilevel, weaponIlevel, talents) => {
  let talentsStr = talents;
  if (talents === 'gg') {
    talentsStr = '1111321';
  }
  if (talents === 'incarn') {
    talentsStr = '1111221';
  }
  // 61 traits
  const artifact = 'artifact=57:0:0:0:0:960:1:1334:1:950:4:951:4:958:1:952:6:961:1:957:1:956:5:954:4:949:4:962:1:948:4:979:1:959:1:955:5:953:4:1366:1:1634:1:1509:4:1510:1:1511:1:1512:10';
  const gear = `neck=,id=142428,stats=${mainstat_templates[ilevel]}agi_${secondarystat_templates[ilevel]}vers_${secondarystat_templates[ilevel]}mastery_${secondarystat_templates[ilevel]}crit_${secondarystat_templates[ilevel]}haste`;
  const weapon = `
main_hand=claws_of_ursoc,id=128821,gem_id=133686/137412/137327/0,ilevel=${weaponIlevel}
off_hand=claws_of_ursoc,id=128822,ilevel=${weaponIlevel}
  `;

  return (`
druid=Baseline
level=110
race=troll
role=tank
talents=${talentsStr}
spec=guardian
${artifact}
${gear}
${weapon}
          `);
};

module.exports.apl = (aplType) => {
  const precombat = `
actions.precombat=flask,type=flask_of_the_seventh_demon
actions.precombat+=/food,type=seedbattered_fish_plate
actions.precombat+=/augmentation,type=defiled
actions.precombat+=/bear_form
actions.precombat+=/snapshot_stats
actions.precombat+=/potion,name=prolonged_power
  `;
  return (`
${precombat}
${apls[aplType]}
          `);
}

module.exports.copy = (copyName, trinketID, ilevel, gear_override = '') => {
  return (`
copy="${copyName}",Baseline
trinket1=,id=${trinketID},ilevel=${ilevel}
${gear_override}
          `);
};
