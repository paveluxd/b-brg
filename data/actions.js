let actionsRef = [
  {
    "actionName": "mace attack",
    "desc": "deal 3 dmg. Gain 1 def if your dice roll is 4",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 1,
    "actionType": ""
  },
  {
    "actionName": "armor break",
    "desc": "reduce enemy def per point of your def that exceeds the highest dice roll",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 2,
    "actionType": ""
  },
  {
    "actionName": "shards",
    "desc": "deal 3 dmg per empty action slot (cost 1 power)",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 3,
    "actionType": ""
  },
  {
    "actionName": "dagger attack",
    "desc": "deal 1 dmg twice",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 60,
    "cooldown": "",
    "keyId": 4,
    "actionType": ""
  },
  {
    "actionName": "bow attack",
    "desc": "deal dmg equal to your dice dice roll value",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 60,
    "cooldown": "",
    "keyId": 5,
    "actionType": ""
  },
  {
    "actionName": "cut",
    "desc": "deal 1 dmg (cost 3 dice roll, extra action)",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 24,
    "cooldown": "",
    "keyId": 6,
    "actionType": "extra-action"
  },
  {
    "actionName": "sword attack",
    "desc": "deal 3 dmg. Temporary +1 dmg if dice roll is 5 or 6",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 60,
    "cooldown": "",
    "keyId": 7,
    "actionType": ""
  },
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
    "actionName": "lance",
    "desc": "deal dmg equal to power (cost 1 power, extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 9,
    "actionType": "extra-action"
  },
  {
    "actionName": "backstab",
    "desc": "deal 2 dmg, gain 1 power (cost 5 dice roll, extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 10,
    "actionType": "extra-action"
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
    "actionName": "fireball",
    "desc": "deal 3 dmg",
    "passiveStats": "",
    "actionMod": 3,
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 13,
    "actionType": ""
  },
  {
    "actionName": "pyroblast",
    "desc": "deal dmg equal to power × dice roll (cost 1 power)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 14,
    "actionType": ""
  },
  {
    "actionName": "quick block",
    "desc": "reduce incoming dmg by (12 - dice)",
    "passiveStats": "",
    "actionMod": 12,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 15,
    "actionType": ""
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
    "actionName": "preparation",
    "desc": "keep half of your dice roll for the next turn",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 16,
    "cooldown": "",
    "keyId": 18,
    "actionType": ""
  },
  {
    "actionName": "roll",
    "desc": "reroll your dice (extra action)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 19,
    "actionType": "extra-action"
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
    "actionName": "weaken",
    "desc": "reduce targets power by 2",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 21,
    "actionType": ""
  },
  {
    "actionName": "wound",
    "desc": "reduce targets def by 4",
    "passiveStats": "",
    "actionMod": 4,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 22,
    "actionType": ""
  },
  {
    "actionName": "curse of chain",
    "desc": "reduce targets dice by 1",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 23,
    "actionType": ""
  },
  {
    "actionName": "slow",
    "desc": "reduce targets dice roll by 4 (extra action)",
    "passiveStats": "",
    "actionMod": 4,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 24,
    "actionType": ""
  },
  {
    "actionName": "stun",
    "desc": "stun target, requires dice roll 1",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 25,
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
    "actionName": "life charge",
    "desc": "adds 10 max life while in action bar",
    "passiveStats": "life:10",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 27,
    "actionType": ""
  },
  {
    "actionName": "endurance charge",
    "desc": "adds 25% life while in action bar",
    "passiveStats": "life%:25",
    "actionMod": 25,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 28,
    "actionType": ""
  },
  {
    "actionName": "order charge",
    "desc": "reduces dice by 2 while in action bar",
    "passiveStats": "dice-mod:-2",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 29,
    "actionType": ""
  },
  {
    "actionName": "chaos charge",
    "desc": "adds 2 dice while in action bar",
    "passiveStats": "dice-mod:2",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 30,
    "actionType": ""
  },
  {
    "actionName": "defence charge",
    "desc": "adds 2 def while in action bar",
    "passiveStats": "def:2",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 31,
    "actionType": ""
  },
  {
    "actionName": "power charge",
    "desc": "adds 1 power while in action bar",
    "passiveStats": "power:1",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 32,
    "actionType": ""
  },
  {
    "actionName": "healing potion",
    "desc": "restore half of the missing life",
    "passiveStats": "",
    "actionMod": 50,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 33,
    "actionType": ""
  },
  {
    "actionName": "fortify",
    "desc": "gain 2 def until the end of encounter",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 34,
    "actionType": ""
  },
  {
    "actionName": "dodge",
    "desc": "gain dice roll × 10% chance to evade dmg this turn",
    "passiveStats": "",
    "actionMod": 10,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 35,
    "actionType": ""
  },
  {
    "actionName": "critical hit",
    "desc": "next attack deals 2x dmg, requires dice roll greater than 8 (passive)",
    "passiveStats": "",
    "actionMod": 200,
    "actionCharge": 12,
    "cooldown": 1,
    "keyId": 36,
    "actionType": "passive"
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
    "actionName": "static",
    "desc": "gain 2 power, requires dice roll greater than 8",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 38,
    "actionType": ""
  },
  {
    "actionName": "sprint",
    "desc": "gain 2 dice roll during this turn (extra action)",
    "passiveStats": "",
    "actionMod": 2,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 39,
    "actionType": "extra-action"
  },
  {
    "actionName": "water potion",
    "desc": "gain 1 power until the end of encounter",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 40,
    "actionType": ""
  },
  {
    "actionName": "weapon poison",
    "desc": "next time you deal dmg, all hits during that turn poison",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 41,
    "actionType": ""
  },
  {
    "actionName": "block",
    "desc": "reduce incoming dmg by dice roll value",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 42,
    "actionType": ""
  },
  {
    "actionName": "rage",
    "desc": "you do and take 200% dmg (passive)",
    "passiveStats": "",
    "actionMod": 200,
    "actionCharge": 1,
    "cooldown": "",
    "keyId": 43,
    "actionType": "passive"
  },
  {
    "actionName": "restoration",
    "desc": "restore reduced dice. Set negative power and def to 0. Gain 1 life per restored point",
    "passiveStats": "",
    "actionMod": 0,
    "actionCharge": 6,
    "cooldown": "",
    "keyId": 44,
    "actionType": ""
  },
  {
    "actionName": "wooden mace attack",
    "desc": "deal 3 dmg.",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 100,
    "cooldown": "",
    "keyId": 45,
    "actionType": ""
  },
  {
    "actionName": "smoke bomb",
    "desc": "stun target. Ineffective against attacks",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 6,
    "cooldown": 2,
    "keyId": 47,
    "actionType": ""
  },
  {
    "actionName": "focus",
    "desc": "gain 1 power per 4 dice roll",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 60,
    "cooldown": 2,
    "keyId": 48,
    "actionType": ""
  },
  {
    "actionName": "zealotry",
    "desc": "reduce def by dice roll to gain that much power",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": 2,
    "keyId": 49,
    "actionType": ""
  },
  {
    "actionName": "defensive stance",
    "desc": "once per turn, reduce dice roll by 1 (extra action)",
    "passiveStats": "",
    "actionMod": 1,
    "actionCharge": 60,
    "cooldown": 1,
    "keyId": 50,
    "actionType": "extra-action"
  },
  {
    "actionName": "overload",
    "desc": "deal 100% more damage if your dice roll is greater than dice",
    "passiveStats": "",
    "actionMod": 100,
    "actionCharge": 20,
    "cooldown": "",
    "keyId": 51,
    "actionType": "passive"
  },
  {
    "actionName": "swap",
    "desc": "swap dice rolls (extra action)",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "keyId": 52,
    "actionType": "extra-action"
  },
  {
    "actionName": "transmute",
    "desc": "gain 1 coin per dice roll. Requires dice roll 1 or 2",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 40,
    "cooldown": "",
    "keyId": 53,
    "actionType": ""
  },
  {
    "actionName": "inferno",
    "desc": "deal dmg equal to your power per every coin. Loose all coins",
    "passiveStats": "",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "keyId": 54,
    "actionType": ""
  }
]