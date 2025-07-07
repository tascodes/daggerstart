﻿export type Item = {
  roll: string;
  name: string;
  description: string;
};

export const Items: Item[] = [
  {
    roll: "1",
    name: "Premium Bedroll",
    description: "During downtime, you automatically clear a Stress.",
  },
  {
    roll: "2",
    name: "Piper Whistle",
    description:
      "This handcrafted whistle has a distinctive sound. When you blow this whistle, its piercing tone can be heard within a 1-mile radius.",
  },
  {
    roll: "3",
    name: "Charging Quiver",
    description:
      "When you succeed on an attack with an arrow stored in this quiver, gain a bonus to the damage roll equal to your current tier.",
  },
  {
    roll: "4",
    name: "Alistair’s Torch",
    description:
      "You can light this magic torch at will. The flame’s light fills a much larger space than it should, enough to illuminate a cave bright as day.",
  },
  {
    roll: "5",
    name: "Speaking Orbs",
    description:
      "This pair of orbs allows any creatures holding them to communicate with each other across any distance.",
  },
  {
    roll: "6",
    name: "Manacles",
    description: "This pair of locking cuffs comes with a key.",
  },
  {
    roll: "7",
    name: "Arcane Cloak",
    description:
      "A creature with a Spellcast trait wearing this cloak can adjust its color, texture, and size at will.",
  },
  {
    roll: "8",
    name: "Woven Net",
    description:
      "You can make a Finesse Roll using this net to trap a small creature. A trapped target can break free with a successful Attack Roll (16).",
  },
  {
    roll: "9",
    name: "Fire Jar",
    description:
      "You can pour out the strange liquid contents of this jar to instantly produce fire. The contents regenerate when you take a long rest.",
  },
  {
    roll: "10",
    name: "Suspended Rod",
    description:
      "This flat rod is inscribed with runes. When you activate the rod, it is immediately suspended in place. Until the rod is deactivated, it can’t move, doesn’t abide by the rules of gravity, and remains in place.",
  },
  {
    roll: "11",
    name: "Glamour Stone",
    description:
      "Activate this pebble-sized stone to memorize the appearance of someone you can see. Spend a Hope to magically recreate this guise on yourself as an illusion.",
  },
  {
    roll: "12",
    name: "Empty Chest",
    description:
      "This magical chest appears empty. When you speak a specific trigger word or action and open the chest, you can see the items stored within it.",
  },
  {
    roll: "13",
    name: "Companion Case",
    description:
      "This case can fit a small animal companion. While the companion is inside, the animal and case are immune to all damage and harmful effects.",
  },
  {
    roll: "14",
    name: "Piercing Arrows",
    description:
      "Three times per rest when you succeed on an attack with one of these arrows, you can add your Proficiency to the damage roll.",
  },
  {
    roll: "15",
    name: "Valorstone",
    description:
      "You can attach this stone to armor that doesn’t already have a feature. The armor gains the following feature. **Resilient:** Before you mark your last Armor Slot, roll a d6. On a result of 6, reduce the severity by one threshold without marking an Armor Slot.",
  },
  {
    roll: "16",
    name: "Skeleton Key",
    description:
      "When you use this key to open a locked door, you gain advantage on the Finesse Roll.",
  },
  {
    roll: "17",
    name: "Arcane Prism",
    description:
      "Position this prism in a location of your choosing and activate it. All allies within Close range of it gain a +1 bonus to their Spellcast Rolls. While activated, the prism can’t be moved. Once the prism is deactivated, it can’t be activated again until your next long rest.",
  },
  {
    roll: "18",
    name: "Minor Stamina Potion Recipe",
    description:
      "As a downtime move, you can use the bone of a creature to craft a Minor Stamina Potion.",
  },
  {
    roll: "19",
    name: "Minor Health Potion Recipe",
    description:
      "As a downtime move, you can use a vial of blood to craft a Minor Health Potion.",
  },
  {
    roll: "20",
    name: "Homing Compasses",
    description:
      "These two compasses point toward each other no matter how far apart they are.",
  },
  {
    roll: "21",
    name: "Corrector Sprite",
    description:
      "This tiny sprite sits in the curve of your ear canal and whispers helpful advice during combat. Once per short rest, you can gain advantage on an attack roll.",
  },
  {
    roll: "22",
    name: "Gecko Gloves",
    description: "You can climb up vertical surfaces and across ceilings.",
  },
  {
    roll: "23",
    name: "Lorekeeper",
    description:
      "You can store the name and details of up to three hostile creatures inside this book. You gain a +1 bonus to action rolls against those creatures.",
  },
  {
    roll: "24",
    name: "Vial of Darksmoke Recipe",
    description:
      "As a downtime move, you can mark a Stress to craft a Vial of Darksmoke.",
  },
  {
    roll: "25",
    name: "Bloodstone",
    description:
      "You can attach this stone to a weapon that doesn’t already have a feature. The weapon gains the following feature. ***Brutal:*** When you roll the maximum value on a damage die, roll an additional damage die.",
  },
  {
    roll: "26",
    name: "Greatstone",
    description:
      "You can attach this stone to a weapon that doesn’t already have a feature. The weapon gains the following feature. ***Powerful:*** On a successful attack, roll an additional damage die and discard the lowest result.",
  },
  {
    roll: "27",
    name: "Glider",
    description:
      "While falling, you can mark a Stress to deploy this small parachute and glide safely to the ground.",
  },
  {
    roll: "28",
    name: "Ring of Silence",
    description:
      "Spend a Hope to activate this ring. Your footsteps are silent until your next rest.",
  },
  {
    roll: "29",
    name: "Calming Pendant",
    description:
      "When you would mark your last Stress, roll a d6. On a result of 5 or higher, don’t mark it.",
  },
  {
    roll: "30",
    name: "Dual Flask",
    description:
      "This flask can hold two different liquids. You can swap between them by flipping a small switch on the flask’s side.",
  },
  {
    roll: "31",
    name: "Bag of Ficklesand",
    description:
      "You can convince this small bag of sand to be much heavier or lighter with a successful Presence Roll (10). Additionally, on a successful Finesse Roll (10), you can blow a bit of sand into a target’s face to make them temporarily **Vulnerable**.",
  },
  {
    roll: "32",
    name: "Ring of Resistance",
    description:
      "Once per long rest, you can activate this ring after a successful attack against you to halve the damage.",
  },
  {
    roll: "33",
    name: "Phoenix Feather",
    description:
      "If you have at least one Phoenix Feather on you when you fall unconscious, you gain a +1 bonus to the roll you make to determine whether you gain a scar.",
  },
  {
    roll: "34",
    name: "Box of Many Goods",
    description:
      "Once per long rest, you can open this small box and roll a d12. On a result of 1–6, it’s empty. On a result of 7–10, it contains one random common consumable. On a result of 11–12, it contains two random common consumables.",
  },
  {
    roll: "35",
    name: "Airblade Charm",
    description:
      "You can attach this charm to a weapon with a Melee range. Three times per rest, you can activate the charm and attack a target within Close range.",
  },
  {
    roll: "36",
    name: "Portal Seed",
    description:
      "You can plant this seed in the ground to grow a portal in that spot. The portal is ready to use in 24 hours. You can use this portal to travel to any other location where you planted a portal seed. A portal can be destroyed by dealing any amount of magic damage to it.",
  },
  {
    roll: "37",
    name: "Paragon’s Chain",
    description:
      "As a downtime move, you can meditate on an ideal or principle you hold dear and focus your will into this chain. Once per long rest, you can spend a Hope to roll a d20 as your Hope Die for rolls that directly align with that principle.",
  },
  {
    roll: "38",
    name: "Elusive Amulet",
    description:
      "Once per long rest, you can activate this amulet to become **Hidden** until you move. While **Hidden** in this way, you remain unseen even if an adversary moves to where they would normally see you.",
  },
  {
    roll: "39",
    name: "Hopekeeper Locket",
    description:
      "During a long rest, if you have 6 Hope, you can spend a Hope to imbue this locket with your bountiful resolve. When you have 0 Hope, you can use the locket to immediately gain a Hope. The locket must be re-imbued before it can be used this way again.",
  },
  {
    roll: "40",
    name: "Infinite Bag",
    description:
      "When you store items in this bag, they are kept in a pocket dimension that never runs out of space. You can retrieve an item at any time.",
  },
  {
    roll: "41",
    name: "Stride Relic",
    description:
      "You gain a +1 bonus to your Agility. You can only carry one relic.",
  },
  {
    roll: "42",
    name: "Bolster Relic",
    description:
      "You gain a +1 bonus to your Strength. You can only carry one relic.",
  },
  {
    roll: "43",
    name: "Control Relic",
    description:
      "You gain a +1 bonus to your Finesse. You can only carry one relic.",
  },
  {
    roll: "44",
    name: "Attune Relic",
    description:
      "You gain a +1 bonus to your Instinct. You can only carry one relic.",
  },
  {
    roll: "45",
    name: "Charm Relic",
    description:
      "You gain a +1 bonus to your Presence. You can only carry one relic.",
  },
  {
    roll: "46",
    name: "Enlighten Relic",
    description:
      "You gain a +1 bonus to your Knowledge. You can only carry one relic.",
  },
  {
    roll: "47",
    name: "Honing Relic",
    description:
      "You gain a +1 bonus to an Experience of your choice. You can only carry one relic.",
  },
  {
    roll: "48",
    name: "Flickerfly Pendant",
    description:
      "While you carry this pendant, your weapons with a Melee range that deal physical damage have a gossamer sheen and can attack targets within Very Close range.",
  },
  {
    roll: "49",
    name: "Lasketider Boots",
    description:
      "You can walk on the surface of water as if it were soft ground.",
  },
  {
    roll: "50",
    name: "Clay Companion",
    description:
      "When you sculpt this ball of clay into a clay animal companion, it behaves as that animal. For example, a clay spider can spin clay webs, while a clay bird can fly. The clay companion retains memory and identity across different shapes, but they can adopt new mannerisms with each form.",
  },
  {
    roll: "51",
    name: "Mythic Dust Recipe",
    description:
      "As a downtime move, you can use a handful of fine gold dust to craft Mythic Dust.",
  },
  {
    roll: "52",
    name: "Shard of Memory",
    description:
      "Once per long rest, you can spend 2 Hope to recall a domain card from your vault instead of paying its Recall Cost.",
  },
  {
    roll: "53",
    name: "Gem of Alacrity",
    description:
      "You can attach this gem to a weapon, allowing you to use your Agility when making an attack with that weapon.",
  },
  {
    roll: "54",
    name: "Gem of Might",
    description:
      "You can attach this gem to a weapon, allowing you to use your Strength when making an attack with that weapon.",
  },
  {
    roll: "55",
    name: "Gem of Precision",
    description:
      "You can attach this gem to a weapon, allowing you to use your Finesse when making an attack with that weapon.",
  },
  {
    roll: "56",
    name: "Gem of Insight",
    description:
      "You can attach this gem to a weapon, allowing you to use your Instinct when making an attack with that weapon.",
  },
  {
    roll: "57",
    name: "Gem of Audacity",
    description:
      "You can attach this gem to a weapon, allowing you to use your Presence when making an attack with that weapon.",
  },
  {
    roll: "58",
    name: "Gem of Sagacity",
    description:
      "You can attach this gem to a weapon, allowing you to use your Knowledge when making an attack with that weapon.",
  },
  {
    roll: "59",
    name: "Ring of Unbreakable Resolve",
    description:
      "Once per session, when the GM spends a Fear, you can spend 4 Hope to cancel the effects of that spent Fear.",
  },
  {
    roll: "60",
    name: "Belt of Unity",
    description:
      "Once per session, you can spend 5 Hope to lead a Tag Team Roll with three PCs instead of two.",
  },
];
