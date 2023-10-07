let itemsRef = [
    {
      "itemName": "chainmail",
      "passiveStats": [{stat:'life', value:6}, {stat:'def', value:1}],
      "actions": "",
      "itemType": "Body armor"
    },
    {
      "itemName": "water potion",
      "passiveStats": "",
      "actions": ['water potion'],
      "itemType": ""
    },
    {
      "itemName": "poison potion",
      "passiveStats": "",
      "actions": ['poison'],
      "itemType": ""
    },
    {
      "itemName": "leather cape",
      "passiveStats": "",
      "actions": ['dodge'],
      "itemType": ""
    },
    {
      "itemName": "spiked shield",
      "passiveStats": "",
      "actions": ['bash'],
      "itemType": ""
    },
    {
      "itemName": "shield",
      "passiveStats": "",
      "actions": ['deflect'],
      "itemType": ""
    },
    {
      "itemName": "woolen boots",
      "passiveStats": "",
      "actions": ['sprint'],
      "itemType": ""
    },
    {
      "itemName": "curse of chains",
      "passiveStats": "",
      "actions": ['curse of chain'],
      "itemType": ""
    },
    {
      "itemName": "curse of wounds",
      "passiveStats": "",
      "actions": ['wound'],
      "itemType": ""
    },
    {
      "itemName": "scroll of repetition",
      "passiveStats": "",
      "actions": ['charge'],
      "itemType": ""
    },
    {
      "itemName": "curse of slowness",
      "passiveStats": "",
      "actions": ['slow'],
      "itemType": ""
    },
    {
      "itemName": "curse of weakness",
      "passiveStats": "",
      "actions": ['weaken'],
      "itemType": ""
    },
    {
      "itemName": "scroll of fortification",
      "passiveStats": "",
      "actions": ['fortify'],
      "itemType": ""
    },
    {
      "itemName": "woolen gloves",
      "passiveStats": "",
      "actions": ['critical hit'],
      "itemType": ""
    },
    {
      "itemName": "leather gloves",
      "passiveStats": "",
      "actions": ['precision'],
      "itemType": ""
    },
    {
      "itemName": "leather boots",
      "passiveStats": "",
      "actions": ['roll'],
      "itemType": ""
    },
    {
      "itemName": "gloves",
      "passiveStats": "",
      "actions": ['combo'],
      "itemType": ""
    },
    {
      "itemName": "chain",
      "passiveStats": "",
      "actions": ['stun'],
      "itemType": "Secondary weapon"
    },
    {
      "itemName": "healing potion",
      "passiveStats": "",
      "actions": ['healing potion'],
      "itemType": ""
    },
    {
      "itemName": "iron dagger",
      "passiveStats": "",
      "actions": ['backstab'],
      "itemType": ""
    },
    {
      "itemName": "axe",
      "passiveStats": "",
      "actions": ['axe attack'],
      "itemType": ""
    },
    {
      "itemName": "hammer",
      "passiveStats": "",
      "actions": ['hammer attack'],
      "itemType": "Weapon"
    },
    {
      "itemName": "mace",
      "passiveStats": "",
      "actions": ['mace attack'],
      "itemType": ""
    },
    {
      "itemName": "tower shield",
      "passiveStats": "",
      "actions": ['block'],
      "itemType": ""
    },
    {
      "itemName": "knife",
      "passiveStats": "",
      "actions": ['knife attack'],
      "itemType": "Secondary weapon"
    },
    {
      "itemName": "cape",
      "passiveStats": "",
      "actions": ['static'],
      "itemType": ""
    },
    {
      "itemName": "boots",
      "passiveStats": "",
      "actions": ['dash'],
      "itemType": ""
    },
    {
      "itemName": "dagger pair",
      "passiveStats": "",
      "actions": ['dagger attack'],
      "itemType": "Weapon"
    },
    {
      "itemName": "sword",
      "passiveStats": "",
      "actions": ['sword attack'],
      "itemType": "Weapon"
    },
    {
      "itemName": "bow",
      "passiveStats": "",
      "actions": ['bow attack'],
      "itemType": "Weapon"
    },
    {
      "itemName": "dice 4",
      "passiveStats": [{stat:'dice', value:4}, {stat:'def', value:1}],
      "actions": "",
      "itemType": "Dice"
    },
    {
      "itemName": "dice 8",
      "passiveStats": [{stat:'dice', value:8}],
      "actions": "",
      "itemType": "Dice"
    },
    {
      "itemName": "dice 10",
      "passiveStats": [{stat:'dice', value:10}],
      "actions": "",
      "itemType": "Dice"
    },
    {
      "itemName": "dice 12",
      "passiveStats": [{stat:'dice', value:12}, {stat:'def', value:-1}],
      "actions": "",
      "itemType": "Dice"
    },
    {
      "itemName": "ring of endurance",
      "passiveStats": "",
      "actions": ['endurance charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of power",
      "passiveStats": "",
      "actions": ['power charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of protection",
      "passiveStats": "",
      "actions": ['defence charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of twilight",
      "passiveStats": "",
      "actions": ['order charge', 'chaos charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of order",
      "passiveStats": "",
      "actions": ['order charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of chaos",
      "passiveStats": "",
      "actions": ['chaos charge'],
      "itemType": ""
    },
    {
      "itemName": "ring of life",
      "passiveStats": "",
      "actions": ['life charge'],
      "itemType": ""
    },
    {
      "itemName": "book of fire",
      "passiveStats": "",
      "actions": ['fireball', 'pyroblast'],
      "itemType": "Weapon"
    },
    {
      "itemName": "book of lightning",
      "passiveStats": [{stat:'power', value:2}],
      "actions": ['lightning'],
      "itemType": "Weapon"
    },
    {
      "itemName": "book of ice",
      "passiveStats": "",
      "actions": ['lance', 'shards'],
      "itemType": "Weapon"
    },
    {
      "itemName": "gambison",
      "passiveStats": [{stat:'life', value:12}],
      "actions": "",
      "itemType": "Body armor"
    },
    {
      "itemName": "robe",
      "passiveStats": [{stat:'power', value:1}],
      "actions": "",
      "itemType": "Body armor"
    },
    {
      "itemName": "plate armor",
      "passiveStats": [{stat:'def', value:2}],
      "actions": "",
      "itemType": "Body armor"
    },
    {
      "itemName": "book of order",
      "passiveStats": "",
      "actions": ['chains', 'barrier'],
      "itemType": "Weapon"
    },
    {
      "itemName": "bag",
      "passiveStats": [{stat:'equipmentSlots', value:2}],
      "actions": "",
      "itemType": "Bag"
    },
    {
      "itemName": "leather bag",
      "passiveStats": [{stat:'equipmentSlots', value:4}],
      "actions": "",
      "itemType": "Bag"
    },
    {
      "itemName": "woolem bag",
      "passiveStats": [{stat:'equipmentSlots', value:6}, {stat:'power', value:-2}],
      "actions": "",
      "itemType": "Bag"
    },
    {
      "itemName": "thorns crown",
      "passiveStats": "",
      "actions": ['rage'],
      "itemType": ""
    }
  ]