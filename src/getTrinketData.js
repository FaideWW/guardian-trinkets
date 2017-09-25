
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
export default function getTrinketData(trinketJSON, { ilevel = 940, talents = 'gg', targetCount = '1t', isFoN = 'false' } = {}) {
  // Quick workaround for dungeon sims
  const patchTalents = (targetCount === '5t' && talents === 'incarn') ? 'incarnup' : talents;

  const trinketCategory = trinketJSON[ilevel][patchTalents][targetCount];
  const result = [];
  const baseline = trinketCategory.Baseline;

  Object.keys(trinketCategory).forEach((trinketName) => {
    if (trinketName === 'Baseline' || trinketName === 'csv') {
      return;
    }
    let trinket = trinketCategory[trinketName];
    if (isFoN && trinket.fon) {
      trinket = trinket.fon;
    }

    const trinketResult = { name: trinketName };
    let sum = 0;

    Object.keys(trinket).forEach((ilevel) => {
      if (ilevel === 'fon') {
        return;
      }

      const dps = trinket[ilevel];
      const gainFromBaseline = dps - baseline;
      const gainFromPrevious = dps - (trinket[Number(ilevel) - 5] || baseline);
      trinketResult[ilevel] = gainFromPrevious;
      trinketResult[`${ilevel}-gain`] = gainFromBaseline;
      sum += gainFromPrevious;
    });

    trinketResult.sum = sum;
    result.push(trinketResult);
  });

  return result.sort((a, b) => b.sum - a.sum);
}
