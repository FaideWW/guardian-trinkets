const { apl, mainstat_templates, secondarystat_templates } = require('./constants');

module.exports.settings = (id, { pantheon, iterations, prefix, }) => {

  let pantheonStr = '';
  if (Number(pantheon) > 0) {
    pantheonStr = 'legion.pantheon_trinket_users=am';
    for (let i = 1; i < pantheon; i += 1 ) {
      pantheonStr += '/am';
    }
  }

  return (`
optimal_raid=1

max_time=300
vary_combat_length=0.2
iterations=${iterations}
html=output/${prefix}_result_${id}.html
json2=output/${prefix}_result_${id}.json
${pantheonStr}
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
  // 75 traits
  const artifact = 'artifact=57:0:0:0:0:960:1:1334:1:950:4:951:4:958:1:952:4:961:1:957:1:956:4:954:4:949:4:962:1:948:4:979:1:959:1:955:4:953:4:1366:1:1634:1:1509:4:1510:1:1511:1:1512:23';
  // 2x Dark Sorrows, 1 Shadowbind
  const crucible = 'crucible=1739:1781:950/1739:1781:953/1739:1778:948';
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
${crucible}
${gear}
${weapon}
          `);
};

module.exports.apl = apl;

module.exports.copy = (copyName, trinketID, ilevel, gear_override = '', bonusID = null) => {
  let addGearOverride = '';
  if (gear_override !== '') {
    addGearOverride = `profileset."${copyName}"+=${gear_override}`;
  }
  let bonusIDString = ``;
  if (bonusID !== null) {
    bonusIDString = `,bonus_id=${bonusID}`
  }
  return (`
profileset."${copyName}"=trinket1=,id=${trinketID}${bonusIDString},ilevel=${ilevel}
${addGearOverride}
          `);
};
