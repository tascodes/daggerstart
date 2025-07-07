﻿export type Consumable = {
  roll: string;
  name: string;
  description: string;
};

export const Consumables: Consumable[] = [
  {
    roll: "1",
    name: "Stride Potion",
    description: "You gain a +1 bonus to your next Agility Roll.",
  },
  {
    roll: "2",
    name: "Bolster Potion",
    description: "You gain a +1 bonus to your next Strength Roll.",
  },
  {
    roll: "3",
    name: "Control Potion",
    description: "You gain a +1 bonus to your next Finesse Roll.",
  },
  {
    roll: "4",
    name: "Attune Potion",
    description: "You gain a +1 bonus to your next Instinct Roll.",
  },
  {
    roll: "5",
    name: "Charm Potion",
    description: "You gain a +1 bonus to your next Presence Roll.",
  },
  {
    roll: "6",
    name: "Enlighten Potion",
    description: "You gain a +1 bonus to your next Knowledge Roll.",
  },
  {
    roll: "7",
    name: "Minor Health Potion",
    description: "Clear 1d4 HP.",
  },
  {
    roll: "8",
    name: "Minor Stamina Potion",
    description: "Clear 1d4 Stress.",
  },
  {
    roll: "9",
    name: "Grindeltooth Venom",
    description:
      "You can apply this venom to a weapon that deals physical damage to add a d6 to your next damage roll with that weapon.",
  },
  {
    roll: "10",
    name: "Varik Leaves",
    description: "You can eat these paired leaves to immediately gain 2 Hope.",
  },
  {
    roll: "11",
    name: "Vial of Moondrip",
    description:
      "When you drink the contents of this vial, you can see in total darkness until your next rest.",
  },
  {
    roll: "12",
    name: "Unstable Arcane Shard",
    description:
      "You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 1d20 magic damage.",
  },
  {
    roll: "13",
    name: "Potion of Stability",
    description:
      "You can drink this potion to choose one additional downtime move.",
  },
  {
    roll: "14",
    name: "Improved Grindeltooth Venom",
    description:
      "You can apply this venom to a weapon that deals physical damage to add a d8 to your next damage roll with that weapon.",
  },
  {
    roll: "15",
    name: "Morphing Clay",
    description:
      "You can spend 4 Hope to use this clay, altering your face enough to make you unrecognizable until your next rest.",
  },
  {
    roll: "16",
    name: "Vial of Darksmoke",
    description:
      "When an adversary attacks you, use this vial and roll a number of d6 equal to your Agility. Add the highest result to your Evasion against the attack.",
  },
  {
    roll: "17",
    name: "Jumping Root",
    description:
      "Eat this root to leap up to Far range once without needing to roll.",
  },
  {
    roll: "18",
    name: "Snap Powder",
    description: "Mark a Stress and clear a HP.",
  },
  {
    roll: "19",
    name: "Health Potion",
    description: "Clear 1d4+1 HP.",
  },
  {
    roll: "20",
    name: "Stamina Potion",
    description: "Clear 1d4+1 Stress.",
  },
  {
    roll: "21",
    name: "Armor Stitcher",
    description:
      "You can use this stitcher to spend any number of Hope and clear that many Armor Slots.",
  },
  {
    roll: "22",
    name: "Gill Salve",
    description:
      "You can apply this salve to your neck to breathe underwater for a number of minutes equal to your level.",
  },
  {
    roll: "23",
    name: "Replication Parchment",
    description:
      "By touching this piece of parchment to another, you can perfectly copy the second parchment’s contents. Once used, this parchment becomes mundane paper.",
  },
  {
    roll: "24",
    name: "Improved Arcane Shard",
    description:
      "You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 2d20 magic damage.",
  },
  {
    roll: "25",
    name: "Major Stride Potion",
    description: "You gain a +1 bonus to your Agility until your next rest.",
  },
  {
    roll: "26",
    name: "Major Bolster Potion",
    description: "You gain a +1 bonus to your Strength until your next rest.",
  },
  {
    roll: "27",
    name: "Major Control Potion",
    description: "You gain a +1 bonus to your Finesse until your next rest.",
  },
  {
    roll: "28",
    name: "Major Attune Potion",
    description: "You gain a +1 bonus to your Instinct until your next rest.",
  },
  {
    roll: "29",
    name: "Major Charm Potion",
    description: "You gain a +1 bonus to your Presence until your next rest.",
  },
  {
    roll: "30",
    name: "Major Enlighten Potion",
    description: "You gain a +1 bonus to your Knowledge until your next rest.",
  },
  {
    roll: "31",
    name: "Blood of the Yorgi",
    description:
      "You can drink this blood to disappear from where you are and immediately reappear at a point you can see within very Far range.",
  },
  {
    roll: "32",
    name: "Hornet’s Secret Potion",
    description:
      "After drinking this potion, the next successful attack you make critically succeeds.",
  },
  {
    roll: "33",
    name: "Redthorn Saliva",
    description:
      "You can apply this saliva to a weapon that deals physical damage to add a d12 to your next damage roll with that weapon.",
  },
  {
    roll: "34",
    name: "Channelstone",
    description:
      "You can use this stone to take a spell or grimoire from your vault, use it once, and return it to your vault.",
  },
  {
    roll: "35",
    name: "Mythic Dust",
    description:
      "You can apply this dust to a weapon that deals magic damage to add a d12 to your next damage roll with that weapon.",
  },
  {
    roll: "36",
    name: "Acidpaste",
    description:
      "This paste eats away walls and other surfaces in bright flashes.",
  },
  {
    roll: "37",
    name: "Hopehold Flare",
    description:
      "When you use this flare, allies within Close range roll a d6 when they spend a Hope. On a result of 6, they gain the effect of that Hope without spending it. The flare lasts until the end of the scene.",
  },
  {
    roll: "38",
    name: "Major Arcane Shard",
    description:
      "You can make a Finesse Roll to throw this shard at a group of adversaries within Far range. Targets you succeed against take 4d20 magic damage.",
  },
  {
    roll: "39",
    name: "Featherbone",
    description:
      "You can use this bone to control your falling speed for a number of minutes equal to your level.",
  },
  {
    roll: "40",
    name: "Circle of the Void",
    description:
      "Mark a Stress to create a void that extends up to Far range. No magic can be cast inside the void, and creatures within the void are immune to magic damage.",
  },
  {
    roll: "41",
    name: "Sun Tree Sap",
    description:
      "Consume this sap to roll a d6. On a result of 5–6, clear 2 HP. On a result of 2–4, clear 3 Stress. On a result of 1, see through the veil of death and return unscathed, gaining one scar.",
  },
  {
    roll: "42",
    name: "Dripfang Poison",
    description:
      "A creature who consumes this poison takes 2d10 direct magic damage.",
  },
  {
    roll: "43",
    name: "Major Health Potion",
    description: "Clear 1d4+2 HP.",
  },
  {
    roll: "44",
    name: "Major Stamina Potion",
    description: "Clear 1d4+2 Stress.",
  },
  {
    roll: "45",
    name: "Ogre Musk",
    description:
      "You can use this musk to prevent anyone from tracking you by mundane or magical means until your next rest.",
  },
  {
    roll: "46",
    name: "Wingsprout",
    description:
      "You gain magic wings that allow you to fly for a number of minutes equal to your level.",
  },
  {
    roll: "47",
    name: "Jar of Lost Voices",
    description:
      "You can open this jar to release a deafening echo of voices for a number of minutes equal to your Instinct. Creatures within Far range unprepared for the sound take 6d8 magic damage.",
  },
  {
    roll: "48",
    name: "Dragonbloom Tea",
    description:
      "You can drink this tea to unleash a fiery breath attack. Make an Instinct Roll against all adversaries in front of you within Close range. Targets you succeed against take 2d20 physical damage using your Proficiency.",
  },
  {
    roll: "49",
    name: "Bridge Seed",
    description:
      "Thick vines grow from your location to a point of your choice within Far range, allowing you to climb up or across them. The vines dissipate on your next short rest.",
  },
  {
    roll: "50",
    name: "Sleeping Sap",
    description:
      "You can drink this potion to fall asleep for a full night’s rest. You clear all Stress upon waking.",
  },
  {
    roll: "51",
    name: "Feast of Xurla",
    description:
      "You can eat this meal to clear all HP and Stress and gain 1d4 Hope.",
  },
  {
    roll: "52",
    name: "Bonding Honey",
    description:
      "This honey can be used to glue two objects together permanently.",
  },
  {
    roll: "53",
    name: "Shrinking Potion",
    description:
      "You can drink this potion to halve your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Agility and a –1 penalty to your Proficiency.",
  },
  {
    roll: "54",
    name: "Growing Potion",
    description:
      "You can drink this potion to double your size until you choose to drop this form or your next rest. While in this form, you have a +2 bonus to Strength and a +1 bonus to your Proficiency.",
  },
  {
    roll: "55",
    name: "Knowledge Stone",
    description:
      "If you die while holding this stone, an ally can take a card from your loadout to place in their loadout or vault. After they take this knowledge, the stone crumbles.",
  },
  {
    roll: "56",
    name: "Sweet Moss",
    description:
      "You can consume this moss during a rest to clear 1d10 HP or 1d10 Stress.",
  },
  {
    roll: "57",
    name: "Blinding Orb",
    description:
      "You can activate this orb to create a flash of bright light. All targets within Close range become Blinded until they mark HP.",
  },
  {
    roll: "58",
    name: "Death Tea",
    description:
      "After you drink this tea, you instantly kill your target when you critically succeed on an attack. If you don’t critically succeed on an attack before your next long rest, you die.",
  },
  {
    roll: "59",
    name: "Mirror of Marigold",
    description:
      "When you take damage, you can spend a Hope to negate that damage, after which the mirror shatters.",
  },
  {
    roll: "60",
    name: "Stardrop",
    description:
      "You can use this stardrop to summon a hailstorm of comets that deals 8d20 physical damage to all targets within Very Far range.",
  },
];
