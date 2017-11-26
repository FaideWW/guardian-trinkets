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

module.exports.apl = `
potion=old_war
flask=seventh_demon
food=lavish_suramar_feast
augmentation=defiled

# Executed before combat begins. Accepts non-harmful actions only.
actions.precombat=flask
actions.precombat+=/food
actions.precombat+=/augmentation
actions.precombat+=/bear_form
actions.precombat+=/snapshot_stats
actions.precombat+=/potion
actions.precombat+=/variable,name=latc_or_fon_equipped,value=equipped.lady_and_the_child|equipped.fury_of_nature
actions.precombat+=/variable,name=max_thrash_stacks,value=3,if=!equipped.elizes_everlasting_encasement
actions.precombat+=/variable,name=max_thrash_stacks,value=5,if=equipped.elizes_everlasting_encasement

# Executed every time the actor is available.
actions=auto_attack
actions+=/call_action_list,name=cooldowns
actions+=/maul,if=active_enemies<6&(rage.deficit<8|cooldown.thrash_bear.remains>gcd&rage.deficit<20)
actions+=/pulverize,if=cooldown.thrash_bear.remains<2&dot.thrash_bear.stack=variable.max_thrash_stacks
actions+=/moonfire,if=!talent.galactic_guardian.enabled&(!dot.moonfire.ticking|(buff.incarnation.up&dot.moonfire.refreshable))&active_enemies=1
actions+=/thrash_bear,if=((buff.incarnation.up&(dot.thrash_bear.refreshable|(equipped.luffa_wrappings|artifact.jagged_claws.rank>4)))|dot.thrash_bear.stack<variable.max_thrash_stacks|(equipped.luffa_wrappings&artifact.jagged_claws.rank>5))&!talent.soul_of_the_forest.enabled|active_enemies>1
actions+=/mangle,if=active_enemies<4
actions+=/thrash_bear
actions+=/moonfire,if=!variable.latc_or_fon_equipped&buff.galactic_guardian.up&(active_enemies<4|dot.moonfire.refreshable&active_enemies<5),cycle_targets=1
actions+=/moonfire,if=variable.latc_or_fon_equipped&buff.galactic_guardian.up&(active_enemies<5|dot.moonfire.refreshable&active_enemies<6),cycle_targets=1
actions+=/moonfire,if=dot.moonfire.refreshable&!talent.galactic_guardian.enabled,cycle_targets=1
actions+=/maul,if=active_enemies<6&(cooldown.rage_of_the_sleeper.remains>10|buff.rage_of_the_sleeper.up)
actions+=/moonfire,if=dot.moonfire.refreshable&active_enemies<3,cycle_targets=1
actions+=/swipe_bear

actions.cooldowns=bristling_fur,if=!buff.rage_of_the_sleeper.up
actions.cooldowns+=/potion,if=buff.rage_of_the_sleeper.up
actions.cooldowns+=/berserking,if=buff.rage_of_the_sleeper.up
actions.cooldowns+=/rage_of_the_sleeper,if=(talent.rend_and_tear.enabled&dot.thrash_bear.stack=variable.max_thrash_stacks)|!talent.rend_and_tear.enabled
actions.cooldowns+=/incarnation,if=(talent.rend_and_tear.enabled&dot.thrash_bear.stack=variable.max_thrash_stacks)|!talent.rend_and_tear.enabled
actions.cooldowns+=/barkskin,if=talent.brambles.enabled&(buff.rage_of_the_sleeper.up|talent.survival_of_the_fittest.enabled)
actions.cooldowns+=/proc_sephuz,if=cooldown.thrash_bear.remains=0
actions.cooldowns+=/use_items,if=cooldown.rage_of_the_sleeper.remains>12|buff.rage_of_the_sleeper.up|target.time_to_die<22
`;

module.exports.furyString = 'back=,id=151802,stats=0agi_0stamina_0armor_0crit_0mastery'
