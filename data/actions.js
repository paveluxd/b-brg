let actionsRef = [
  {
    "actionName": "hammer attack",
    "desc": "deal 3 dmg, on roll above 4 deal 6 instead",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 2,
    "actionType": ""
  },
  {
    "actionName": "bow attack",
    "desc": "deal dmg equal to dice roll value",
    "actionMod": "",
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 5,
    "actionType": ""
  },
  {
    "actionName": "knife attack",
    "desc": "pay 3 roll, deal 1 dmg (extra action)",
    "actionMod": 1,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 6,
    "actionType": "extra-action"
  },
  {
    "actionName": "scroll of repetition",
    "desc": "restore 1 action charge of all other actions",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 20,
    "actionType": ""
  },
  {
    "actionName": "ice shards",
    "desc": "pay 1 power, deal 3 dmg per empty action slot",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 3,
    "actionType": ""
  },
  {
    "actionName": "dash",
    "desc": "keep half of your roll for the next turn",
    "actionMod": "",
    "actionCharge": 16,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 18,
    "actionType": ""
  },
  {
    "actionName": "shield block",
    "desc": "block dmg equal to dice roll value",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": [],
    "keyId": 42,
    "actionType": ""
  },
  {
    "actionName": "barrier",
    "desc": "reduce incoming dmg by 75% (cooldown 3 turns)",
    "actionMod": 75,
    "actionCharge": 3,
    "cooldown": 3,
    "passiveStats": "",
    "keyId": 16,
    "actionType": ""
  },
  {
    "actionName": "healing potion",
    "desc": "restore 12 life",
    "actionMod": 12,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 33,
    "actionType": ""
  },
  {
    "actionName": "fortify",
    "desc": "+2 def until the end of encounter",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 34,
    "actionType": ""
  },
  {
    "actionName": "roll",
    "desc": "reroll your dice as an extra action",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 19,
    "actionType": "extra-action"
  },
  {
    "actionName": "curse of weakness",
    "desc": "reduce target power by 2",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 21,
    "actionType": ""
  },
  {
    "actionName": "curse of wounds",
    "desc": "reduce target def by 4",
    "actionMod": 4,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 22,
    "actionType": ""
  },
  {
    "actionName": "stun",
    "desc": "prevent enemy action, requires roll 1",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 25,
    "actionType": ""
  },
  {
    "actionName": "curse of chain",
    "desc": "reduce target dice by 1",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 23,
    "actionType": ""
  },
  {
    "actionName": "life charge",
    "desc": "+10 max life while in action bar",
    "actionMod": 10,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'life', value:10}],
    "keyId": 27,
    "actionType": ""
  },
  {
    "actionName": "endurance charge",
    "desc": "+25% life while in action bar",
    "actionMod": 25,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'life%', value:25}],
    "keyId": 28,
    "actionType": ""
  },
  {
    "actionName": "combo",
    "desc": "if you rolled 6, you can perform an additional action",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": 1,
    "passiveStats": "",
    "keyId": 17,
    "actionType": ""
  },
  {
    "actionName": "block",
    "desc": "reduce incoming dmg by 12 minus your dice",
    "actionMod": 12,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 15,
    "actionType": ""
  },
  {
    "actionName": "mace attack",
    "desc": "deal 3 dmg, gain 1 def if you rolled 4",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 1,
    "actionType": ""
  },
  {
    "actionName": "dagger attack",
    "desc": "deal 1 dmg twice",
    "actionMod": 1,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 4,
    "actionType": ""
  },
  {
    "actionName": "pyroblast",
    "desc": "pay 1 power, deal dmg equal to (power × roll)",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 14,
    "actionType": ""
  },
  {
    "actionName": "fireball",
    "desc": "deal 3 dmg",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 13,
    "actionType": ""
  },
  {
    "actionName": "freeze",
    "desc": "pay 1 power, stun the target",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 26,
    "actionType": ""
  },
  {
    "actionName": "power charge",
    "desc": "+1 power while in action bar",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'power', value:1}],
    "keyId": 32,
    "actionType": ""
  },
  {
    "actionName": "shield bash",
    "desc": "deal dmg equal to your defence multiplied by power",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 12,
    "actionType": ""
  },
  {
    "actionName": "lightning",
    "desc": "pay 2 power, deal 1-20 dmg",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 11,
    "actionType": ""
  },
  {
    "actionName": "backstab",
    "desc": "pay 5 roll, deal 2 dmg, gain 1 power (extra action)",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 10,
    "actionType": "extra-action"
  },
  {
    "actionName": "ice lance",
    "desc": "pay 1 power, deal dmg equal to power (extra action)",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 9,
    "actionType": "extra-action"
  },
  {
    "actionName": "rage strike",
    "desc": "pay 5 life, deal 1 dmg per missing life",
    "actionMod": 5,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 8,
    "actionType": ""
  },
  {
    "actionName": "sword attack",
    "desc": "deal 3 dmg, increase dmg of this weapon by 1",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 7,
    "actionType": ""
  },
  {
    "actionName": "defence charge",
    "desc": "+2 def while in action bar",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'def', value:2}],
    "keyId": 31,
    "actionType": ""
  },
  {
    "actionName": "water potion",
    "desc": "+1 power until the end of encounter",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 40,
    "actionType": ""
  },
  {
    "actionName": "sprint",
    "desc": "+2 roll",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 39,
    "actionType": ""
  },
  {
    "actionName": "chaos charge",
    "desc": "+2 dice while in action bar",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'dice-mod', value:2}],
    "keyId": 30,
    "actionType": ""
  },
  {
    "actionName": "curse of slowness",
    "desc": "reduce target roll by 4 (extra action)",
    "actionMod": 4,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 24,
    "actionType": "extra-action"
  },
  {
    "actionName": "order charge",
    "desc": "-2 dice while in action bar",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": [{stat:'dice-mod', value:-2}],
    "keyId": 29,
    "actionType": ""
  },
  {
    "actionName": "poison potion",
    "desc": "your hits apply poison",
    "actionMod": 3,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 41,
    "actionType": ""
  },
  {
    "actionName": "static",
    "desc": "gain 2 power, requires roll greater than 8",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 38,
    "actionType": ""
  },
  {
    "actionName": "precision shot",
    "desc": "pay 1 power, your next attack ignores def",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 37,
    "actionType": "extra-action"
  },
  {
    "actionName": "critical hit",
    "desc": "next attack deals 2x dmg, requires roll greater than 8",
    "actionMod": 200,
    "actionCharge": 12,
    "cooldown": 1,
    "passiveStats": "",
    "keyId": 36,
    "actionType": "extra-action"
  },
  {
    "actionName": "dodge",
    "desc": "gain (10% × roll) chance to dodge next attack",
    "actionMod": 10,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "keyId": 35,
    "actionType": ""
  }
]