let actionsRef = [
  {
    "actionName": "hammer attack",
    "desc": "deal 3 dmg, on roll above 4 deal 6 instead",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "id": "a2"
  },
  {
    "actionName": "bow attack",
    "desc": "deal dmg equal to dice roll value",
    "actionMod": "",
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "id": "a5"
  },
  {
    "actionName": "knife attack",
    "desc": "pay 3 roll, deal 1 dmg (extra action)",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a6"
  },
  {
    "actionName": "scroll of repetition",
    "desc": "restore 1 action charge of all other actions",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a20"
  },
  {
    "actionName": "ice shards",
    "desc": "pay 1 power, deal 3 dmg, repeat for per empty action slot",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a3"
  },
  {
    "actionName": "dash",
    "desc": "keep half of your roll for the next turn",
    "actionMod": "",
    "actionCharge": 16,
    "cooldown": "",
    "passiveStats": "",
    "id": "a18"
  },
  {
    "actionName": "barrier",
    "desc": "reduce incoming dmg by 75% (cooldown 3 turns)",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": 3,
    "passiveStats": "",
    "id": "a16"
  },
  {
    "actionName": "healing potion",
    "desc": "restore 12 life",
    "actionMod": 12,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a33"
  },
  {
    "actionName": "fortify scroll",
    "desc": "+2 def until the end of encounter",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a34"
  },
  {
    "actionName": "reroll",
    "desc": "reroll your dice as an extra action",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a19"
  },
  {
    "actionName": "curse of weakness",
    "desc": "reduce target power by 2",
    "actionMod": 2,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a21"
  },
  {
    "actionName": "curse of wound",
    "desc": "reduce target def by 4",
    "actionMod": 4,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a22"
  },
  {
    "actionName": "stun",
    "desc": "prevent enemy action, requires roll 1",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a25"
  },
  {
    "actionName": "curse of chain",
    "desc": "reduce target dice by 1",
    "actionMod": 1,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a23"
  },
  {
    "actionName": "life charge",
    "desc": "+8 max life while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "[{stat:'life', value:10}]",
    "id": "a27"
  },
  {
    "actionName": "endurance charge",
    "desc": "+25% life while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "[{stat:'life%', value:25}]",
    "id": "a28"
  },
  {
    "actionName": "combo",
    "desc": "if you rolled 6, you can perform an additional action",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a17"
  },
  {
    "actionName": "block",
    "desc": "reduce incoming dmg by 12 minus your dice",
    "actionMod": 12,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a15"
  },
  {
    "actionName": "mace attack",
    "desc": "deal 3 dmg, gain 1 def if you rolled 4",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "id": "a1"
  },
  {
    "actionName": "dagger attack",
    "desc": "deal 1 dmg twice",
    "actionMod": "",
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "id": "a4"
  },
  {
    "actionName": "pyroblast",
    "desc": "pay 1 power, deal dmg equal to (power × roll)",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a14"
  },
  {
    "actionName": "fireball",
    "desc": "deal 3 dmg",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a13"
  },
  {
    "actionName": "freeze",
    "desc": "pay 1 power, stun the target",
    "actionMod": "",
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a26"
  },
  {
    "actionName": "power charge",
    "desc": "+1 power while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a32"
  },
  {
    "actionName": "shield bash",
    "desc": "deal dmg equal to your defence multiplied by power",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a12"
  },
  {
    "actionName": "lightning",
    "desc": "pay 2 power, deal 1-20 dmg",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a11"
  },
  {
    "actionName": "backstab",
    "desc": "pay 5 roll, deal 2 dmg, gain 1 power (extra action)",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a10"
  },
  {
    "actionName": "ice lance",
    "desc": "pay 1 power, deal dmg equal to power (extra action)",
    "actionMod": 3,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a9"
  },
  {
    "actionName": "rage strike",
    "desc": "pay 5 life, deal 1 dmg per missing life",
    "actionMod": 5,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a8"
  },
  {
    "actionName": "sword attack",
    "desc": "deal 3 dmg, increase dmg of this weapon by 1",
    "actionMod": 3,
    "actionCharge": 40,
    "cooldown": "",
    "passiveStats": "",
    "id": "a7"
  },
  {
    "actionName": "defence charge",
    "desc": "+2 def while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a31"
  },
  {
    "actionName": "water potion",
    "desc": "+1 power until the end of encounter",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a40"
  },
  {
    "actionName": "sprint",
    "desc": "+2 roll",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a39"
  },
  {
    "actionName": "chaos charge",
    "desc": "+2 dice while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "[{stat:'life', value:10}]",
    "id": "a30"
  },
  {
    "actionName": "curse of slowness",
    "desc": "reduce target roll by 2",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a24"
  },
  {
    "actionName": "order charge",
    "desc": "-2 dice while in action bar",
    "actionMod": "",
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a29"
  },
  {
    "actionName": "poison potion",
    "desc": "your hits apply poison",
    "actionMod": 3,
    "actionCharge": 1,
    "cooldown": "",
    "passiveStats": "",
    "id": "a41"
  },
  {
    "actionName": "static",
    "desc": "gain 2 power, requires roll greater than 8",
    "actionMod": 2,
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a38"
  },
  {
    "actionName": "precision shot",
    "desc": "pay 1 power, your next attack ignores def",
    "actionMod": 1,
    "actionCharge": 3,
    "cooldown": "",
    "passiveStats": "",
    "id": "a37"
  },
  {
    "actionName": "critical hit",
    "desc": "next attack deals 2x dmg, requires roll greater than 8",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a36"
  },
  {
    "actionName": "dodge",
    "desc": "gain (10% × roll) chance to dodge next attack",
    "actionMod": "",
    "actionCharge": 12,
    "cooldown": "",
    "passiveStats": "",
    "id": "a35"
  }
]