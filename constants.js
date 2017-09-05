module.exports.mainstat_templates = {
  750: 4609, 755: 4833,
  760: 5065, 765: 5301,
  770: 5555, 775: 5823,
  780: 6100, 785: 6390,
  790: 6694, 795: 7013,
  800: 7362, 805: 7789,
  810: 8243, 815: 8716,
  820: 9262, 825: 9737,
  830: 10196, 835: 10688,
  840: 11195, 845: 11723,
  850: 12292, 855: 12877,
  860: 13485, 865: 14134,
  870: 14809, 875: 15507,
  880: 16253, 885: 17028,
  890: 17833, 895: 18693,
  900: 19584, 905: 20507,
  910: 21498, 915: 22522,
  920: 23582, 925: 24723,
  930: 25900, 935: 27122,
  940: 28432, 945: 29787,
  950: 31193, 955: 32697,
  960: 34252, 965: 35876,
  970: 37600, 975: 39389,
  980: 41258, 985: 43239,
};

module.exports.secondarystat_templates = {
  750: 2072, 755: 2175,
  760: 2277, 765: 2384,
  770: 2498, 775: 2618,
  780: 2743, 785: 2873,
  790: 3010, 795: 3154,
  800: 3309, 805: 3415,
  810: 3531, 815: 3647,
  820: 3767, 825: 3882,
  830: 3973, 835: 4066,
  840: 4160, 845: 4258,
  850: 4356, 855: 4458,
  860: 4561, 865: 4668,
  870: 4779, 875: 4891,
  880: 5006, 885: 5122,
  890: 5244, 895: 5367,
  900: 5493, 905: 5624,
  910: 5757, 915: 5894,
  920: 6033, 925: 6179,
  930: 6326, 935: 6476,
  940: 6631, 945: 6790,
  950: 6951, 955: 7118,
  960: 7289, 965: 7463,
  970: 7644, 975: 7828,
  980: 8014, 985: 8210,
};

const apls = {
  '1t': `
actions=auto_attack
actions+=/bristling_fur
actions+=/potion,name=old_war,if=buff.rage_of_the_sleeper.up
actions+=/rage_of_the_sleeper,if=(talent.rend_and_tear.enabled&((dot.thrash_bear.stack=3&!equipped.137067)|(dot.thrash_bear.stack=5&equipped.137067)))|!talent.rend_and_tear.enabled
actions+=/incarnation,if=(cooldown.thrash_bear.remains>gcd&!action.thrash_bear.usable|cooldown.mangle.remains>gcd&!action.mangle.usable)
actions+=/proc_sephuz
actions+=/use_items
actions+=/moonfire,if=buff.incarnation.remains>15&!dot.moonfire.ticking
actions+=/barkskin,if=talent.brambles.enabled&buff.rage_of_the_sleeper.up
actions+=/maul,if=(cooldown.rage_of_the_sleeper.remains>4&((rage>90&cooldown.thrash_bear.remains>gcd)|(cooldown.thrash_bear.remains<gcd&!action.thrash_bear.usable|cooldown.mangle.remains<gcd&!action.mangle.usable)&rage>80))|(cooldown.rage_of_the_sleeper.remains<4&((rage>80&cooldown.thrash_bear.remains>gcd)|(cooldown.thrash_bear.remains<gcd&!action.thrash_bear.usable|cooldown.mangle.remains<gcd&!action.mangle.usable)&rage>70))
actions+=/pulverize,if=((cooldown.thrash_bear.remains<2&((dot.thrash_bear.stack=5&equipped.137067)|(dot.thrash_bear.stack=3&!equipped.137067)))|(dot.thrash_bear.stack>=2&target.time_to_die<2)|(dot.thrash_bear.stack>=4&target.time_to_die<4))
actions+=/thrash_bear
actions+=/mangle
actions+=/moonfire,if=buff.galactic_guardian.up&target.adds=0|(dot.moonfire.remains<5&!(talent.galactic_guardian.enabled))
actions+=/maul
actions+=/swipe_bear
  `,

  '3t': `
actions=auto_attack
actions+=/bristling_fur
actions+=/potion,name=old_war,if=buff.rage_of_the_sleeper.up
actions+=/rage_of_the_sleeper,if=(talent.rend_and_tear.enabled&((dot.thrash_bear.stack=3&!equipped.137067)|(dot.thrash_bear.stack=5&equipped.137067)))|!talent.rend_and_tear.enabled
actions+=/incarnation,if=(cooldown.thrash_bear.remains>gcd&!action.thrash_bear.usable|cooldown.mangle.remains>gcd&!action.mangle.usable)
actions+=/proc_sephuz
actions+=/use_items
actions+=/moonfire,if=buff.incarnation.remains>15&!dot.moonfire.ticking
actions+=/barkskin,if=talent.brambles.enabled&buff.rage_of_the_sleeper.up
actions+=/maul,if=(cooldown.rage_of_the_sleeper.remains>4&((rage>90&cooldown.thrash_bear.remains>gcd)|(cooldown.thrash_bear.remains<gcd&!action.thrash_bear.usable|cooldown.mangle.remains<gcd&!action.mangle.usable)&rage>80))|(cooldown.rage_of_the_sleeper.remains<4&((rage>80&cooldown.thrash_bear.remains>gcd)|(cooldown.thrash_bear.remains<gcd&!action.thrash_bear.usable|cooldown.mangle.remains<gcd&!action.mangle.usable)&rage>70))
actions+=/pulverize,if=((cooldown.thrash_bear.remains<2&((dot.thrash_bear.stack=5&equipped.137067)|(dot.thrash_bear.stack=3&!equipped.137067)))|(dot.thrash_bear.stack>=2&target.time_to_die<2)|(dot.thrash_bear.stack>=4&target.time_to_die<4))
actions+=/thrash_bear
actions+=/mangle
actions+=/moonfire,if=buff.galactic_guardian.up&target.adds=0|(dot.moonfire.remains<5&!(talent.galactic_guardian.enabled))
actions+=/maul
actions+=/moonfire,if=equipped.151802&equipped.144295&target.adds<2
actions+=/moonfire,if=buff.galactic_guardian.up
actions+=/swipe_bear
  `,

  '5t': `
actions=auto_attack
actions+=/potion,name=prolonged_power,if=buff.rage_of_the_sleeper.up
actions+=/barkskin,if=talent.brambles.enabled&buff.rage_of_the_sleeper.up
actions+=/berserking,if=buff.rage_of_the_sleeper.up
actions+=/bristling_fur,if=buff.rage_of_the_sleeper.down
actions+=/lunar_beam,if=buff.rage_of_the_sleeper.up
actions+=/incarnation,if=cooldown.thrash_bear.remains>0
actions+=/rage_of_the_sleeper,if=buff.bear_form.up
actions+=/proc_sephuz,if=cooldown.thrash_bear.remains=0
actions+=/use_items
actions+=/thrash_bear
actions+=/maul
actions+=/swipe_bear
  `,

  '5t_incarnup': `
actions=auto_attack
actions+=/potion,name=prolonged_power,if=buff.rage_of_the_sleeper.up
actions+=/barkskin,if=talent.brambles.enabled&buff.rage_of_the_sleeper.up
actions+=/berserking,if=buff.rage_of_the_sleeper.up
actions+=/bristling_fur,if=buff.rage_of_the_sleeper.down
actions+=/lunar_beam,if=buff.rage_of_the_sleeper.up
actions+=/incarnation,if=cooldown.thrash_bear.remains>0
actions+=/rage_of_the_sleeper,if=buff.bear_form.up
actions+=/proc_sephuz,if=cooldown.thrash_bear.remains=0
actions+=/use_items
actions+=/thrash_bear
actions+=/moonfire,if=dot.moonfire.remains<4.8&!buff.incarnation.up,cycle_targets=1
actions+=/maul
actions+=/swipe_bear
  `,

  '5t_incarndown': `
actions=auto_attack
actions+=/potion,name=prolonged_power,if=buff.rage_of_the_sleeper.up
actions+=/berserking,if=buff.rage_of_the_sleeper.up
actions+=/bristling_fur,if=buff.rage_of_the_sleeper.down
actions+=/proc_sephuz,if=cooldown.thrash_bear.remains=0
actions+=/use_items
actions+=/thrash_bear
actions+=/moonfire,if=dot.moonfire.remains<4.8&!buff.incarnation.up&(target.time_to_die*1.6)>(16+dot.moonfire.remains),cycle_targets=1
actions+=/maul
actions+=/swipe_bear
  `,
};

module.exports.apls = apls;

