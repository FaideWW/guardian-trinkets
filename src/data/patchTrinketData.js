import mapValues from 'lodash/mapValues';

const patches = [
  {
    name: 'Add AHR damage',
    patch: (trinketData) => {
      return mapTrinketDPS(trinketData, 'Archimonde\'s Hatred Reborn', (dps, { ilevel, trinketIlevel }) => {
        const trinketDPS = {
          900: 19840,
          920: 23318,
          940: 27563,
          960: 31563,
        }
        return dps + trinketDPS[ilevel];
      });
    },
  },
  {
    name: 'Disable Terror',
    patch: (trinketData) => {
      return mapTrinket(trinketData, 'Terror From Below', (trinket) => {
        trinket.disabled = true;
        return trinket;
      })
    },
  },
];


export default function patchTrinketData(trinketData, options) {
  return patches.reduce((trinkets, { name, patch }) => patch(trinkets), trinketData);
}

function mapTrinket(trinketData, trinketName, operator) {
  return mapValues(trinketData, (ilevelGroup, ilevel) => {
    return mapValues(ilevelGroup, (talentGroup, talent) => {
      return mapValues(talentGroup, (targetGroup, targetCount) => {
        return mapValues(targetGroup, (pantheonGroup, pantheon) => {
          return mapValues(pantheonGroup, (trinket, tName) => {
            if (trinketName === tName) {
              trinket = operator(trinket, { ilevel, talent, targetCount, pantheon });
            }
            return trinket;
          });
        });
      })
    })
  })

}

function mapTrinketDPS(trinketData, trinketName, operator) {
  return mapTrinket(trinketData, trinketName, (trinket, metadata) => {
    return mapValues(trinket, (dps, trinketIlevel) => {
      return operator(dps, Object.assign(metadata, { trinketIlevel }));
    });
  });
}
