import {
  DEFAULT_ILEVEL,
  DEFAULT_TALENTS,
  DEFAULT_TARGETCOUNT,
  DEFAULT_PANTHEON,
  DEFAULT_FON,
  DEFAULT_DISPLAY,
  PANTHEON_TRINKET_NAMES,
} from '../constants';
/**
 * format:
 * {
 *  [ilevel]: {
 *    [talents]: {
 *      [targetcount]: {
 *        Baseline: dps,
 *        [trinketname]: {
 *          [ilevel]: dps
 *        },
 *        fon: {
 *          [trinketname]: {
 *            [ilevel]: dps
 *          }
 *        }
 *      }
 *    }
 *  }
 * }
 *
 */

const cache = {};

function makeChartData(trinketData, { ilevel = DEFAULT_ILEVEL, talents = DEFAULT_TALENTS, targetCount = DEFAULT_TARGETCOUNT, pantheon = DEFAULT_PANTHEON, isFoN = DEFAULT_FON, display = DEFAULT_DISPLAY } = {}, ignorePantheonTrinkets = false) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, pantheon, isFoN, display);
  const trinketCategory = trinketData[ilevel][talents][targetCount][pantheon];
  let result = [];
  const baseline = trinketCategory.Baseline;

  // Only pantheon trinkets were simmed at >p0, so fetch the p0 trinkets first and overwrite the pantheon ones
  if (pantheon !== 'p0') {
    result = makeChartData(trinketData, { ilevel, talents, targetCount, pantheon: 'p0', isFoN, display }, true);
  }

  Object.keys(trinketCategory).forEach((trinketName) => {
    if (trinketName === 'Baseline' || trinketName === 'csv' || (ignorePantheonTrinkets && PANTHEON_TRINKET_NAMES.includes(trinketName))) {
      return;
    }
    let trinket = trinketCategory[trinketName];

    if (trinket.disabled) {
      return;
    }

    if (isFoN && trinket.fon) {
      trinket = trinket.fon;
    }

    const trinketResult = { name: trinketName };
    let sum = 0;

    Object.keys(trinket).forEach((ilevel) => {
      if (ilevel === 'fon' || ilevel === 'disabled') {
        return;
      }

      let dps = trinket[ilevel];

      const gainFromBaseline = dps - baseline;
      const gainFromPrevious = dps - (trinket[Number(ilevel) - 5] || (trinket[Number(ilevel) - 30]) || baseline);
      trinketResult[ilevel] = gainFromPrevious;
      trinketResult[`${ilevel}-gain`] = gainFromBaseline;
      trinketResult[`${ilevel}-total`] = dps;
      sum += gainFromPrevious;
    });

    trinketResult.sum = sum;
    result.push(trinketResult);
  });

  const sortedResult = result.sort((a, b) => b.sum - a.sum);

  if (!ignorePantheonTrinkets) {
    cache[optionsString] = sortedResult;
  }
  return sortedResult;
}

function makeTableData(trinketData, { ilevel = DEFAULT_ILEVEL, talents = DEFAULT_TALENTS, targetCount = DEFAULT_TARGETCOUNT, pantheon = DEFAULT_PANTHEON, isFoN = DEFAULT_FON, display = DEFAULT_DISPLAY } = {}, ignorePantheonTrinkets = false) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, pantheon, isFoN, display);
  // Quick workaround for dungeon sims
  const trinketCategory = trinketData[ilevel][talents][targetCount][pantheon];
  let result = [];
  const baseline = trinketCategory.Baseline;


  // Only pantheon trinkets were simmed at >p0, so fetch the p0 trinkets first and overwrite the pantheon ones
  if (pantheon !== 'p0') {
    result = makeTableData(trinketData, { ilevel, talents, targetCount, pantheon: 'p0', isFoN, display }, true);


  Object.keys(trinketCategory).forEach((trinketName) => {
    if (trinketName === 'csv') {
      return;
    }

    if (trinketName === 'Baseline') {
      result.push({ name: 'Baseline', ilevel: 'N/A', dps: trinketCategory[trinketName], gain: 0 })
      return;
    }

    let trinket = trinketCategory[trinketName];

    if (trinket.disabled) {
      return;
    }

    if (isFoN && trinket.fon) {
      trinket = trinket.fon;
    }

    // const trinketResult = { name: trinketName };
    // let sum = 0;

    Object.keys(trinket).forEach((ilevel) => {
      if (ilevel === 'fon' || ilevel === 'disabled') {
        return;
      }

      const trinketResult = { name: trinketName, ilevel, };

      let dps = trinket[ilevel];

      const gainFromBaseline = dps - baseline;
      const gainFromPrevious = dps - (trinket[Number(ilevel) - 5] || baseline);
      trinketResult[ilevel] = gainFromPrevious;
      trinketResult[`${ilevel}-gain`] = gainFromBaseline;
      trinketResult[`${ilevel}-total`] = dps;
      // sum += gainFromPrevious;

      result.push({
        name: trinketName,
        ilevel,
        dps: trinket[ilevel],
        gain: (dps / baseline) - 1,
      });
    });

    // trinketResult.sum = sum;
    // result.push(trinketResult);
  });

  const sortedResult = result.sort((a, b) => b.dps - a.dps);

  if (!ignorePantheonTrinkets) {
    cache[optionsString] = sortedResult;
  }
  return sortedResult;
}

export default function getTrinketData(trinketData, { ilevel = DEFAULT_ILEVEL, talents = DEFAULT_TALENTS, targetCount = DEFAULT_TARGETCOUNT, pantheon = DEFAULT_PANTHEON, isFoN = DEFAULT_FON, display = DEFAULT_DISPLAY } = {}) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, pantheon, isFoN, display);
  if (cache[optionsString]) {
    return cache[optionsString];
  }

  if (display === 'chart') {
    return makeChartData(trinketData, { ilevel, talents, targetCount, pantheon, isFoN, display });
  } else if (display === 'table') {
    return makeTableData(trinketData, { ilevel, talents, targetCount, pantheon, isFoN, display });
  }
}

function encodeOptionsString(ilevel, talents, targetCount, pantheon, isFoN, display) {
  return `${ilevel}-${talents}-${targetCount}-${pantheon}-${isFoN}-${display}`;
}
