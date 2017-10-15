
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

function makeChartData(trinketData, { ilevel = 940, talents = 'gg', targetCount = '1t', isFoN = 'false', display = 'chart' } = {}) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, isFoN, display);
  // Quick workaround for dungeon sims
  const patchTalents = (targetCount === '5t' && talents === 'incarn') ? 'incarnup' : talents;



  const trinketCategory = trinketData[ilevel][patchTalents][targetCount];
  const result = [];
  const baseline = trinketCategory.Baseline;

  Object.keys(trinketCategory).forEach((trinketName) => {
    if (trinketName === 'Baseline' || trinketName === 'csv') {
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
      const gainFromPrevious = dps - (trinket[Number(ilevel) - 5] || baseline);
      trinketResult[ilevel] = gainFromPrevious;
      trinketResult[`${ilevel}-gain`] = gainFromBaseline;
      trinketResult[`${ilevel}-total`] = dps;
      sum += gainFromPrevious;
    });

    trinketResult.sum = sum;
    result.push(trinketResult);
  });

  const sortedResult = result.sort((a, b) => b.sum - a.sum);

  cache[optionsString] = sortedResult;
  return sortedResult;
}

function makeTableData(trinketData, { ilevel = 940, talents = 'gg', targetCount = '1t', isFoN = 'false', display = 'chart' } = {}) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, isFoN, display);
  // Quick workaround for dungeon sims
  const patchTalents = (targetCount === '5t' && talents === 'incarn') ? 'incarnup' : talents;
  const trinketCategory = trinketData[ilevel][patchTalents][targetCount];
  const result = [];
  const baseline = trinketCategory.Baseline;

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

  cache[optionsString] = sortedResult;
  return sortedResult;
}

export default function getTrinketData(trinketData, { ilevel = 940, talents = 'gg', targetCount = '1t', isFoN = 'false', display = 'chart' } = {}) {
  const optionsString = encodeOptionsString(ilevel, talents, targetCount, isFoN, display);
  if (cache[optionsString]) {
    return cache[optionsString];
  }

  if (display === 'chart') {
    return makeChartData(trinketData, { ilevel, talents, targetCount, isFoN, display });
  } else if (display === 'table') {
    return makeTableData(trinketData, { ilevel, talents, targetCount, isFoN, display });
  }
}

function encodeOptionsString(ilevel, talents, targetCount, isFoN, display) {
  return `${ilevel}-${talents}-${targetCount}-${isFoN}-${display}`;
}
