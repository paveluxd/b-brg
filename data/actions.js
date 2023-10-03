let actionsRef = [
  {
    "actionName": "axe attack",
    "desc": "deal 1 dmg per missing life (cost 5 life)",
    "passiveStats": "",
    "actionMod": 5,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 8,
    "actionType": ""
  },
  {
    "actionName": "backstab",
    "desc": "deal 2 dmg, gain 1 power (cost 5 roll, extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 10,
    "actionType": "extra-action"
  },
  {
    "actionName": "barrier",
    "desc": "reduce incoming dmg by 75% (cooldown 3 turns)",
    "passiveStats": "",
    "actionMod": 75,
    "actionCharge": 3,
    "cooldown": 3,
    "keyId": 16,
    "actionType": ""
  },
  {
    "actionName": "bash",
    "desc": "deal dmg equal to your def × power",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 12,
    "actionType": ""
  },
  {
    "actionName": "block",
    "desc": "reduce incoming dmg by (12 - dice)",
    "passiveStats": "",
    "actionMod": 12,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 15,
    "actionType": ""
  },
  {
    "actionName": "bow attack",
    "desc": "deal dmg equal to your dice roll value",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 5,
    "actionType": ""
  },
  {
    "actionName": "chains",
    "desc": "stun the target (cost 1 power)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 26,
    "actionType": ""
  },
  {
    "actionName": "chaos charge",
    "desc": "adds 2 dice while in action bar",
    "passiveStats": [{stat:'dice-mod', value:10}],
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 30,
    "actionType": ""
  },
  {
    "actionName": "charge",
    "desc": "add 1 action charge to all other actions",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 20,
    "actionType": ""
  },
  {
    "actionName": "combo",
    "desc": "if you rolled 6, perform two actions this turn (passive)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": 1,
    "keyId": 17,
    "actionType": "passive"
  },
  {
    "actionName": "critical hit",
    "desc": "next attack deals 2x dmg, requires roll greater than 8 (passive)",
    "passiveStats": "",
    "actionMod": 200,
    "actionCharge": 12,
    "cooldown": 1,
    "keyId": 36,
    "actionType": "passive"
  },
  {
    "actionName": "curse of chain",
    "desc": "reduce target dice by 1",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 23,
    "actionType": ""
  },
  {
    "actionName": "dagger attack",
    "desc": "deal 1 dmg twice",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 4,
    "actionType": ""
  },
  {
    "actionName": "dash",
    "desc": "keep half of your roll for the next turn",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 16,
    "cooldown": "",
    "keyId": 18,
    "actionType": ""
  },
  {
    "actionName": "defence charge",
    "desc": "adds 2 def while in action bar",
    "passiveStats": [{stat:'def', value:2}],
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 31,
    "actionType": ""
  },
  {
    "actionName": "deflect",
    "desc": "reduce incoming dmg by dice roll value",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 42,
    "actionType": ""
  },
  {
    "actionName": "dodge",
    "desc": "gain roll × 10% chance to evade dmg this turn",
    "passiveStats": "",
    "actionMod": 10,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 35,
    "actionType": ""
  },
  {
    "actionName": "endurance charge",
    "desc": "adds 25% life while in action bar",
    "passiveStats": [{stat:'life%', value:25}],
    "actionMod": 25,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 28,
    "actionType": ""
  },
  {
    "actionName": "fireball",
    "desc": "deal 3 dmg",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 13,
    "actionType": ""
  },
  {
    "actionName": "fortify",
    "desc": "gain 2 def until the end of encounter",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 34,
    "actionType": ""
  },
  {
    "actionName": "hammer attack",
    "desc": "deal 3 dmg. Deal 6 instead if your roll is greater than 4",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 2,
    "actionType": ""
  },
  {
    "actionName": "healing potion",
    "desc": "restore 12 life",
    "passiveStats": "",
    "actionMod": 12,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 33,
    "actionType": ""
  },
  {
    "actionName": "knife attack",
    "desc": "deal 1 dmg (cost 3 roll, extra action)",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 6,
    "actionType": "extra-action"
  },
  {
    "actionName": "lance",
    "desc": "deal dmg equal to power (cost 1 power, extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 9,
    "actionType": "extra-action"
  },
  {
    "actionName": "life charge",
    "desc": "adds 10 max life while in action bar",
    "passiveStats": [{stat:'life', value:10}],
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 27,
    "actionType": ""
  },
  {
    "actionName": "lightning",
    "desc": "deal 1-20 dmg (cost 2 power)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 11,
    "actionType": ""
  },
  {
    "actionName": "mace attack",
    "desc": "deal 3 dmg. Gain 1 def if your roll is 4",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 1,
    "actionType": ""
  },
  {
    "actionName": "order charge",
    "desc": "reduces dice by 2 while in action bar",
    "passiveStats": [{stat:'dice-mod', value:-2}],
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 29,
    "actionType": ""
  },
  {
    "actionName": "poison",
    "desc": "your hits apply poison during this turn",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 2,
    "cooldown": "",
    "keyId": 41,
    "actionType": "extra-action"
  },
  {
    "actionName": "power charge",
    "desc": "adds 1 power while in action bar",
    "passiveStats": [{stat:'power', value:1}],
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 32,
    "actionType": ""
  },
  {
    "actionName": "precision",
    "desc": "your next attack ignores def (cost 1 power, extra action)",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 37,
    "actionType": "extra-action"
  },
  {
    "actionName": "pyroblast",
    "desc": "deal dmg equal to power × roll (cost 1 power)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 14,
    "actionType": ""
  },
  {
    "actionName": "roll",
    "desc": "reroll your dice (extra action)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 19,
    "actionType": "extra-action"
  },
  {
    "actionName": "shards",
    "desc": "deal 3 dmg per empty action slot (cost 1 power)",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 3,
    "actionType": ""
  },
  {
    "actionName": "slow",
    "desc": "reduce target roll by 4 (extra action)",
    "passiveStats": "",
    "actionMod": 4,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 24,
    "actionType": ""
  },
  {
    "actionName": "sprint",
    "desc": "gain 2 roll during this turn (extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 39,
    "actionType": "extra-action"
  },
  {
    "actionName": "static",
    "desc": "gain 2 power, requires roll greater than 8",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 38,
    "actionType": ""
  },
  {
    "actionName": "stun",
    "desc": "stun target, requires roll 1",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 25,
    "actionType": ""
  },
  {
    "actionName": "sword attack",
    "desc": "deal 3 dmg, +1 sword dmg during this encounter",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 7,
    "actionType": ""
  },
  {
    "actionName": "water potion",
    "desc": "gain 1 power until the end of encounter",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 40,
    "actionType": ""
  },
  {
    "actionName": "weaken",
    "desc": "reduce target power by 2",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 21,
    "actionType": ""
  },
  {
    "actionName": "wound",
    "desc": "reduce target def by 4",
    "passiveStats": "",
    "actionMod": 4,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 22,
    "actionType": ""
  }
]