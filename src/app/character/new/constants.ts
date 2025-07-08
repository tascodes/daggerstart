export const Heritage = {
  Clank: "Clank",
  Firbolg: "Firbolg",
  Human: "Human",
  Drakona: "Drakona",
  Fungril: "Fungril",
  Infernis: "Infernis",
  Dwarf: "Dwarf",
  Galapa: "Galapa",
  Katari: "Katari",
  Elf: "Elf",
  Giant: "Giant",
  Orc: "Orc",
  Faerie: "Faerie",
  Goblin: "Goblin",
  Ribbet: "Ribbet",
  Faun: "Faun",
  Halfling: "Halfling",
  Simiah: "Simiah",
} as const;
export type HeritageKeys = (typeof Heritage)[keyof typeof Heritage];

export const Community = {
  highborne: "highborne",
  loreborne: "loreborne",
  orderborne: "orderborne",
  ridgeborne: "ridgeborne",
  seaborne: "seaborne",
  slyborne: "slyborne",
  underborne: "underborne",
  wanderborne: "wanderborne",
  wildborne: "wildborne",
} as const;
export type CommunityKeys = (typeof Community)[keyof typeof Community];

export const Class = {
  bard: "bard",
  druid: "druid",
  guardian: "guardian",
  ranger: "ranger",
  rogue: "rogue",
  seraph: "seraph",
  sorcerer: "sorcerer",
  warrior: "warrior",
  wizard: "wizard",
} as const;
export type ClassKeys = (typeof Class)[keyof typeof Class];

export const classShortDescriptions = {
  bard: "Charismatic performers who use music and tales to captivate.",
  druid: "Nature's guardians who transform into beasts and wield wilderness forces.",
  guardian: "Steadfast defenders with unshakeable fortitude who protect allies.",
  ranger: "Skilled hunters who bond with animal companions and master wilderness.",
  rogue: "Cunning scoundrels who manipulate shadows and use stealth tactics.",
  seraph: "Divine warriors serving as both healers and terrifying holy fighters.",
  sorcerer: "Innate magic wielders who control powerful elemental abilities.",
  warrior: "Dedicated fighters who master weapons through lifetime training.",
  wizard: "Scholarly mages who acquire power through arcane study.",
} as const;

export const subclassesByClass = {
  bard: [
    { value: "troubadour", label: "Troubadour" },
    { value: "wordsmith", label: "Wordsmith" },
  ],
  druid: [
    { value: "warden-of-the-elements", label: "Warden of the Elements" },
    { value: "warden-of-renewal", label: "Warden of Renewal" },
  ],
  guardian: [
    { value: "stalwart", label: "Stalwart" },
    { value: "vengeance", label: "Vengeance" },
  ],
  ranger: [
    { value: "beastbound", label: "Beastbound" },
    { value: "wayfinder", label: "Wayfinder" },
  ],
  rogue: [
    { value: "nightwalker", label: "Nightwalker" },
    { value: "syndicate", label: "Syndicate" },
  ],
  seraph: [
    { value: "divine-wielder", label: "Divine Wielder" },
    { value: "winged-sentinel", label: "Winged Sentinel" },
  ],
  sorcerer: [
    { value: "elemental-origin", label: "Elemental Origin" },
    { value: "primal-origin", label: "Primal Origin" },
  ],
  warrior: [
    { value: "call-of-the-brave", label: "Call of the Brave" },
    { value: "call-of-the-slayer", label: "Call of the Slayer" },
  ],
  wizard: [
    { value: "school-of-knowledge", label: "School of Knowledge" },
    { value: "school-of-war", label: "School of War" },
  ],
};
