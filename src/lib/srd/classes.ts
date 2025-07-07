﻿export type ClassFeat = {
  name: string;
  text: string;
};

export type ClassBackground = {
  question: string;
};
export type ClassConnection = {
  question: string;
};

export type Class = {
  name: string;
  description: string;
  domain_1: string;
  domain_2: string;
  evasion: string;
  hp: string;
  items: string;
  hope_feat_name: string;
  hope_feat_text: string;
  subclass_1: string;
  subclass_2: string;
  suggested_traits: string;
  suggested_primary: string;
  suggested_secondary?: string;
  suggested_armor: string;
  class_feats: ClassFeat[];
  backgrounds: ClassBackground[];
  connections: ClassConnection[];
  extras?: string;
};

export const classes: Class[] = [
  {
    name: "Bard",
    description:
      "Bards are the most charismatic people in all the realms. Members of this class are masters of captivation and specialize in a variety of performance types, including singing, playing musical instruments, weaving tales, or telling jokes. Whether performing for an audience or speaking to an individual, bards thrive in social situations. Members of this profession bond and train at schools or guilds, but a current of egotism runs through those of the bardic persuasion. While they may be the most likely class to bring people together, a bard of ill temper can just as easily tear a party apart.",
    domain_1: "Grace",
    domain_2: "Codex",
    evasion: "10",
    hp: "5",
    items: "A romance novel or a letter never opened",
    hope_feat_name: "Make a Scene",
    hope_feat_text:
      "Spend 3 Hope to temporarily Distract a target within Close range, giving them a -2 penalty to their Difficulty.",
    subclass_1: "Troubadour",
    subclass_2: "Wordsmith",
    suggested_traits: "0, -1, +1, 0, +2, +1",
    suggested_primary: "Rapier",
    suggested_secondary: "Small Dagger",
    suggested_armor: "Gambeson Armor",
    class_feats: [
      {
        name: "Rally",
        text: "Once per session, describe how you rally the party and give yourself and each of your allies a Rally Die. At level 1, your Rally Die is a d6. A PC can spend their Rally Die to roll it, adding the result to their action roll, reaction roll, damage roll, or to clear a number of Stress equal to the result. At the end of each session, clear all unspent Rally Dice. At level 5, your Rally Die increases to a d8.",
      },
    ],
    backgrounds: [
      {
        question:
          "Who from your community taught you to have such confidence in yourself?",
      },
      {
        question:
          "You were in love once. Who did you adore, and how did they hurt you?",
      },
      {
        question:
          "You’ve always looked up to another bard. Who are they, and why do you idolize them?",
      },
    ],
    connections: [
      {
        question:
          "What made you realize we were going to be such good friends?",
      },
      {
        question: "What do I do that annoys you?",
      },
      {
        question: "Why do you grab my hand at night?",
      },
    ],
  },
  {
    name: "Druid",
    description:
      "Becoming a druid is more than an occupation; it’s a calling for those who wish to learn from and protect the magic of the wilderness. While one might underestimate a gentle druid who practices the often-quiet work of cultivating flora, druids who channel the untamed forces of nature are terrifying to behold. Druids cultivate their abilities in small groups, often connected by a specific ethos or locale, but some choose to work alone. Through years of study and dedication, druids can learn to transform into beasts and shape nature itself.",
    domain_1: "Sage",
    domain_2: "Arcana",
    evasion: "10",
    hp: "6",
    items:
      "A small bag of rocks and bones or a strange pendant found in the dirt",
    hope_feat_name: "Evolution",
    hope_feat_text:
      "Spend 3 Hope to transform into a Beastform without marking a Stress. When you do, choose one trait to raise by +1 until you drop out of that Beastform.",
    subclass_1: "Warden of the Elements",
    subclass_2: "Warden of Renewal",
    extras:
      "# BEASTFORM OPTIONS\n\nWhen you use your “Beastform” feature, choose a creature category of your tier or lower. At the GM’s discretion, you can describe yourself transforming into any animal that reasonably fits into that category.\n\nBeastform categories are divided by tier. Each entry includes the following details:\n\n- **Creature Category:** Each category’s name describes the common role or behavior of creatures in that category (such as Agile Scout). This name is followed by a few examples of animals that fit in that category (in this example, fox, mouse, and weasel).\n- **Character Trait:** While transformed, you gain a bonus to the listed trait. For example, while transformed into an Agile Scout, you gain a +1 bonus to your Agility. When this form drops, you lose this bonus.\n- **Attack Rolls:** When you make an attack while transformed, you use the creature’s listed range, trait, and damage dice, but you use your Proficiency. For example, as an Agile Scout, you can attack a target within Melee range using your Agility. On a success, you deal d4 physical damage using your Proficiency.\n- **Evasion:** While transformed, you add the creature’s Evasion bonus to your normal Evasion. For example, if your Evasion is usually 8 and your Beastform says “Evasion +2,” your Evasion becomes 10 while you’re in that form.\n- **Advantage:** Your form makes you especially suited to certain actions. When you make an action or reaction roll related to one of the verbs listed for that creature category, you gain advantage on that roll. For example, an Agile Scout gains advantage on rolls made to sneak around, search for objects or creatures, and related activities.\n- **Features:** Each form includes unique features. For example, an Agile Scout excels at silent, dexterous movement—but they’re also fragile, making you more likely to drop out of Beastform.\n\n## TIER 1\n\n### AGILE SCOUT\n\n(Fox, Mouse, Weasel, etc.)\n\n> Agility +1 | Evasion +2 | Melee Agility d4 phy  \n> **Gain advantage on:** deceive, locate, sneak\n\n***Agile:*** Your movement is silent, and you can spend a Hope to move up to Far range without rolling.\n\n***Fragile:*** When you take Major or greater damage, you drop out of Beastform.\n\n### HOUSEHOLD FRIEND\n\n(Cat, Dog, Rabbit, etc.)\n\n> Instinct +1 | Evasion +2 | Melee Instinct d6 phy  \n> **Gain advantage on:** climb, locate, protect\n\n***Companion:*** When you Help an Ally, you can roll a d8 as your advantage die.\n\n***Fragile:*** When you take Major or greater damage, you drop out of Beastform.\n\n### NIMBLE GRAZER\n\n(Deer, Gazelle, Goat, etc.)\n\n> Agility +1 | Evasion +3 | Melee Agility d6 phy  \n> **Gain advantage on:** leap, sneak, sprint\n\n***Elusive Prey:*** When an attack roll against you would succeed, you can mark a Stress and roll a d4. Add the result to your Evasion against this attack.\n\n***Fragile:*** When you take Major or greater damage, you drop out of Beastform.\n\n### PACK PREDATOR\n\n(Coyote, Hyena, Wolf, etc.)\n\n> Strength +2 | Evasion +1 | Melee Strength d8+2 phy  \n> **Gain advantage on:** attack, sprint, track\n\n***Hobbling Strike:*** When you succeed on an attack against a target within Melee range, you can mark a Stress to make the target temporarily Vulnerable.\n\n***Pack Hunting:*** When you succeed on an attack against the same target as an ally who acts immediately before you, add a d8 to your damage roll.\n\n### AQUATIC SCOUT\n\n(Eel, Fish, Octopus, etc.)\n\n> Agility +1 | Evasion +2 | Melee Agility d4 phy  \n> **Gain advantage on:** navigate, sneak, swim\n\n***Aquatic:*** You can breathe and move naturally underwater.\n\n***Fragile:*** When you take Major or greater damage, you drop out of Beastform.\n\n### STALKING ARACHNID\n\n(Tarantula, Wolf Spider, etc.)\n\n> Finesse +1 | Evasion +2 | Melee Finesse d6+1 phy  \n> **Gain advantage on:** attack, climb, sneak\n\n***Venomous Bite:*** When you succeed on an attack against a target within Melee range, the target becomes temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.\n\n***Webslinger:*** You can create a strong web material useful for both adventuring and battle. The web is resilient enough to support one creature. You can temporarily Restrain a target within Close range by succeeding on a Finesse Roll against them.\n\n### MIGHTY STRIDER\n\n(Camel, Horse, Zebra, etc.)\n\n> Agility +1 | Evasion +2 | Melee Agility d8+1 phy  \n> **Gain advantage on:** leap, navigate, sprint\n\n***Carrier:*** You can carry up to two willing allies with you when you move.\n\n***Trample:*** Mark a Stress to move up to Close range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+1 physical damage using your Proficiency and are temporarily Vulnerable.\n\n## TIER 2\n\n### ARMORED SENTRY\n\n(Armadillo, Pangolin, Turtle, etc.)\n\n> Strength +1 | Evasion +1 | Melee Strength d8+2 phy  \n> **Gain advantage on:** dig, locate, protect\n\n***Armored Shell:*** Your hardened exterior gives you resistance to physical damage. Additionally, mark an Armor slot to retract into your shell. While in your shell, physical damage is reduced by a number equal to your Armor Score (after applying resistance), but you can't perform other actions without leaving this form.\n\n***Cannonball:*** Mark a Stress to allow an ally to throw or launch you at an adversary. To do so, the ally makes an attack roll using Agility or Strength (their choice) against a target within Close Range. On a success, the adversary takes d12+2 physical damage using the thrower’s Proficiency. You can spend a Hope to target an additional adversary within Very Close range of the first. The second target takes half the damage dealt to the first target.\n\n### POWERFUL BEAST\n\n(Bear, Bull, Moose, etc.)\n\n> Strength +3 | Evasion +1 | Melee Strength d10+4 phy  \n> **Gain advantage on:** navigate, protect, scare\n\n***Rampage:*** When you roll a 1 on a damage die, you can roll a d10 and add the result to the damage roll. Additionally, before you make an attack roll, you can mark a Stress to gain a +1 bonus to your Proficiency for that attack.\n\n***Thick Hide:*** You gain a +2 bonus to your damage thresholds.\n\n### STRIKING SERPENT\n\n(Cobra, Rattlesnake, Viper, etc.)\n\n> Finesse +1 | Evasion +2 | Very Close Finesse d8+4 phy  \n> **Gain advantage on:** climb, deceive, sprint\n\n***Venomous Strike:*** Make an attack against any number of targets within Very Close range. On a success, a target is temporarily Poisoned. A Poisoned creature takes 1d10 direct physical damage each time they act.\n\n***Warning Hiss:*** Mark a Stress to force any number of targets within Melee range to move back to Very Close range.\n\n### POUNCING PREDATOR\n\n(Cheetah, Lion, Panther, etc.)\n\n> Instinct +1 | Evasion +3 | Melee Instinct d8+6 phy  \n> **Gain advantage on:** attack, climb, sneak\n\n***Fleet:*** Spend a Hope to move up to Far range without rolling.\n\n***Takedown:*** Mark a Stress to move into Melee range of a target and make an attack roll against them. On a success, you gain a +2 bonus to your Proficiency for this attack and the target must mark a Stress.\n\n### WINGED BEAST\n\n(Hawk, Owl, Raven, etc.)\n\n> Finesse +1 | Evasion +3 | Melee Finesse d4+2 phy  \n> **Gain advantage on:** deceive, locate, scare\n\n***Bird’s-Eye View:*** You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.\n\n***Hollow Bones:*** You gain a -2 penalty to your damage thresholds.\n\n## TIER 3\n\n### GREAT PREDATOR\n\n(Dire Wolf, Velociraptor, Sabertooth Tiger, etc.)\n\n> Strength +2 | Evasion +2 | Melee Strength d12+8 phy  \n> **Gain advantage on:** attack, sneak, sprint\n\n***Carrier:*** You can carry up to two willing allies with you when you move.\n\n***Vicious Maul:*** When you succeed on an attack against a target, you can spend a Hope to make them temporarily Vulnerable and gain a +1 bonus to your Proficiency for this attack.\n\n### MIGHTY LIZARD\n\n(Alligator, Crocodile, Gila Monster, etc.)\n\n> Instinct +2 | Evasion +1 | Melee Instinct d10+7 phy  \n> **Gain advantage on:** attack, sneak, track\n\n***Physical Defense:*** You gain a +3 bonus to your damage thresholds.\n\n***Snapping Strike:*** When you succeed on an attack against a target within Melee range, you can spend a Hope to clamp that opponent in your jaws, making them temporarily Restrained and Vulnerable.\n\n### GREAT WINGED BEAST\n\n(Giant Eagle, Falcon, etc.)\n\n> Finesse +2 | Evasion +3 | Melee Finesse d8+6 phy  \n> **Gain advantage on:** deceive, distract, locate\n\n***Bird’s-Eye View:*** You can fly at will. Once per rest while you are airborne, you can ask the GM a question about the scene below you without needing to roll. The first time a character makes a roll to act on this information, they gain advantage on the roll.\n\n***Carrier:*** You can carry up to two willing allies with you when you move.\n\n### AQUATIC PREDATOR\n\n(Dolphin, Orca, Shark, etc.)\n\n> Agility +2 | Evasion +4 | Melee Agility d10+6 phy  \n> **Gain advantage on:** attack, swim, track\n\n***Aquatic:*** You can breathe and move naturally underwater.\n\n***Vicious Maul:*** When you succeed on an attack against a target, you can spend a Hope to make them Vulnerable and gain a +1 bonus to your Proficiency for this attack.\n\n### LEGENDARY BEAST\n\n(Upgraded Tier 1 Options)\n\n***Evolved:*** Pick a Tier 1 Beastform option and become a larger, more powerful version of that creature. While you’re in this form, you retain all traits and features from the original form and gain the following bonuses:\n\n- A +6 bonus to damage rolls\n- A +1 bonus to the trait used by this form\n- A +2 bonus to Evasion\n\n### LEGENDARY HYBRID\n\n(Griffon, Sphinx, etc.)\n\n> Strength +2 | Evasion +3 | Melee Strength d10+8 phy\n\n***Hybrid Features:*** To transform into this creature, mark an additional Stress. Choose any two Beastform options from Tiers 1–2. Choose a total of four advantages and two features from those options.\n\n## TIER 4\n\n### MASSIVE BEHEMOTH\n\n(Elephant, Mammoth, Rhinoceros, etc.)\n\n> Strength +3 | Evasion +1 | Melee Strength d12+12 phy  \n> **Gain advantage on:** locate, protect, scare, sprint\n\n***Carrier:*** You can carry up to four willing allies with you when you move.\n\n***Demolish:*** Spend a Hope to move up to Far range in a straight line and make an attack against all targets within Melee range of the line. Targets you succeed against take d8+10 physical damage using your Proficiency and are temporarily Vulnerable.\n\n***Undaunted:*** You gain a +2 bonus to all your damage thresholds.\n\n### TERRIBLE LIZARD\n\n(Brachiosaurus, Tyrannosaurus, etc.)\n\n> Strength +3 | Evasion +2 | Melee Strength d12+10 phy  \n> **Gain advantage on:** attack, deceive, scare, track\n\n***Devastating Strikes:*** When you deal Severe damage to a target within Melee range, you can mark a Stress to force them to mark an additional Hit Point.\n\n***Massive Stride:*** You can move up to Far range without rolling. You ignore rough terrain (at the GM’s discretion) due to your size.\n\n### MYTHIC AERIAL HUNTER\n\n(Dragon, Pterodactyl, Roc, Wyvern, etc.)\n\n> Finesse +3 | Evasion +4 | Melee Finesse d10+11 phy  \n> **Gain advantage on:** attack, deceive, locate, navigate\n\n***Carrier:*** You can carry up to three willing allies with you when you move.\n\n***Deadly Raptor:*** You can fly at will and move up to Far range as part of your action. When you move in a straight line into Melee range of a target from at least Close range and make an attack against that target in the same action, you can reroll all damage dice that rolled a result lower than your Proficiency.\n\n### EPIC AQUATIC BEAST\n\n(Giant Squid, Whale, etc.)\n\n> Agility +3 | Evasion +3 | Melee Agility d10+10 phy  \n> **Gain advantage on:** locate, protect, scare, track\n\n***Ocean Master:*** You can breathe and move naturally underwater. When you succeed on an attack against a target within Melee range, you can temporarily Restrain them.\n\n***Unyielding:*** When you would mark an Armor Slot, roll a d6. On a result of 5 or higher, reduce the severity by one threshold without marking an Armor Slot.\n\n### MYTHIC BEAST\n\n(Upgraded Tier 1 or Tier 2 Options)\n\n***Evolved:*** Pick a Tier 1 or Tier 2 Beastform option and become a larger, more powerful version of that creature. While you’re in this form, you retain all traits and features from the original form and gain the following bonuses:\n\n- A +9 bonus to damage rolls\n- A +2 bonus to the trait used by this form\n- A +3 bonus to Evasion\n- Your damage die increases by one size (d6 becomes d8, d8 becomes d10, etc.)\n\n### MYTHIC HYBRID\n\n(Chimera, Cockatrice, Manticore, etc.)\n\n> Strength +3 | Evasion +2 | Strength Melee d12+10 phy\n\n***Hybrid Features:*** To transform into this creature, mark 2 additional Stress. Choose any three Beastform options from Tiers 1-3. Choose a total of five advantages and three features from those options.",
    suggested_traits: "+1, 0, +1, +2, -1, 0",
    suggested_primary: "Shortstaff",
    suggested_secondary: "Round Shield",
    suggested_armor: "Leather Armor",
    class_feats: [
      {
        name: "Beastform",
        text: "Mark a Stress to magically transform into a creature of your tier or lower from the Beastform list. You can drop out of this form at any time. While transformed, you can’t use weapons or cast spells from domain cards, but you can still use other features or abilities you have access to. Spells you cast before you transform stay active and last for their normal duration, and you can talk and communicate as normal. Additionally, you gain the Beastform’s features, add their Evasion bonus to your Evasion, and use the trait specified in their statistics for your attack. While you’re in a Beastform, your armor becomes part of your body and you mark Armor Slots as usual; when you drop out of a Beastform, those marked Armor Slots remain marked. If you mark your last Hit Point, you automatically drop out of this form.",
      },
      {
        name: "Wildtouch",
        text: "You can perform harmless, subtle effects that involve nature—such as causing a flower to rapidly grow, summoning a slight gust of wind, or starting a campfire—at will.",
      },
    ],
    backgrounds: [
      {
        question:
          "Why was the community you grew up in so reliant on nature and its creatures?",
      },
      {
        question:
          "Who was the first wild animal you bonded with? Why did your bond end?",
      },
      {
        question:
          "Who has been trying to hunt you down? What do they want from you?",
      },
    ],
    connections: [
      {
        question:
          "What did you confide in me that makes me leap into danger for you every time?",
      },
      {
        question: "What animal do I say you remind me of?",
      },
      {
        question: "What affectionate nickname have you given me?",
      },
    ],
  },
  {
    name: "Guardian",
    description:
      "The title of guardian represents an array of martial professions, speaking more to their moral compass and unshakeable fortitude than the means by which they fight. While many guardians join groups of militants for either a country or cause, they’re more likely to follow those few they truly care for, majority be damned. Guardians are known for fighting with remarkable ferocity even against overwhelming odds, defending their cohort above all else. Woe betide those who harm the ally of a guardian, as the guardian will answer this injury in kind.",
    domain_1: "Valor",
    domain_2: "Blade",
    evasion: "9",
    hp: "7",
    items: "A totem from your mentor or a secret key",
    hope_feat_name: "Frontline Tank",
    hope_feat_text: "Spend 3 Hope to clear 2 Armor Slots.",
    subclass_1: "Stalwart",
    subclass_2: "Vengeance",
    suggested_traits: "+1, +2, -1, 0, +1, 0",
    suggested_primary: "Battleaxe",
    suggested_armor: "Chainmail Armor",
    class_feats: [
      {
        name: "Unstoppable",
        text: "Once per long rest, you can become Unstoppable. You gain an Unstoppable Die. At level 1, your Unstoppable Die is a d4. Place it on your character sheet in the space provided, starting with the 1 value facing up. After you make a damage roll that deals 1 or more Hit Points to a target, increase the Unstoppable Die value by one. When the die’s value would exceed its maximum value or when the scene ends, remove the die and drop out of Unstoppable. At level 5, your Unstoppable Die increases to a d6.\n\nWhile Unstoppable, you gain the following benefits:\n\n- You reduce the severity of physical damage by one threshold (Severe to Major, Major to Minor, Minor to None).\n- You add the current value of the Unstoppable Die to your damage roll.\n- You can’t be Restrained or Vulnerable.\n\n> ***Tip:*** *If your Unstoppable Die is a d4 and the 4 is currently facing up, you remove the die the next time you would increase it. However, if your Unstoppable Die has increased to a d6 and the 4 is currently facing up, you’ll turn it to 5 the next time you would increase it. In this case, you’ll remove the die after you would need to increase it higher than 6.*",
      },
    ],
    backgrounds: [
      {
        question:
          "Who from your community did you fail to protect, and why do you still think of them?",
      },
      {
        question:
          "You’ve been tasked with protecting something important and delivering it somewhere dangerous. What is it, and where does it need to go?",
      },
      {
        question:
          "You consider an aspect of yourself to be a weakness. What is it, and how has it affected you?",
      },
    ],
    connections: [
      {
        question: "How did I save your life the first time we met?",
      },
      {
        question:
          "What small gift did you give me that you notice I always carry with me?",
      },
      {
        question:
          "What lie have you told me about yourself that I absolutely believe?",
      },
    ],
  },
  {
    name: "Ranger",
    description:
      "Rangers are highly skilled hunters who, despite their martial abilities, rarely lend their skills to an army. Through mastery of the body and a deep understanding of the wilderness, rangers become sly tacticians, pursuing their quarry with cunning and patience. Many rangers track and fight alongside an animal companion with whom they’ve forged a powerful spiritual bond. By honing their skills in the wild, rangers become expert trackers, as likely to ensnare their foes in a trap as they are to assail them head-on.",
    domain_1: "Bone",
    domain_2: "Sage",
    evasion: "12",
    hp: "6",
    items: "A trophy from your first kill or a seemingly broken compass",
    hope_feat_name: "Hold Them Off",
    hope_feat_text:
      "Spend 3 Hope when you succeed on an attack with a weapon to use that same roll against two additional adversaries within range of the attack.",
    subclass_1: "Beastbound",
    subclass_2: "Wayfinder",
    suggested_traits: "+2, 0, +1, +1, -1, 0",
    suggested_primary: "Shortbow",
    suggested_armor: "Leather Armor",
    class_feats: [
      {
        name: "Ranger’s Focus",
        text: "Spend a Hope and make an attack against a target. On a success, deal your attack’s normal damage and temporarily make the attack’s target your Focus. Until this feature ends or you make a different creature your Focus, you gain the following benefits against your Focus:\n\n- You know precisely what direction they are in.\n- When you deal damage to them, they must mark a Stress.\n- When you fail an attack against them, you can end your Ranger’s Focus feature to reroll your Duality Dice.",
      },
    ],
    backgrounds: [
      {
        question:
          "A terrible creature hurt your community, and you’ve vowed to hunt them down. What are they, and what unique trail or sign do they leave behind?",
      },
      {
        question:
          "Your first kill almost killed you, too. What was it, and what part of you was never the same after that event?",
      },
      {
        question:
          "You’ve traveled many dangerous lands, but what is the one place you refuse to go?",
      },
    ],
    connections: [
      {
        question: "What friendly competition do we have?",
      },
      {
        question:
          "Why do you act differently when we’re alone than when others are around?",
      },
      {
        question:
          "What threat have you asked me to watch for, and why are you worried about it?",
      },
    ],
  },
  {
    name: "Rogue",
    description:
      "Rogues are scoundrels, often in both attitude and practice. Broadly known as liars and thieves, the best among this class move through the world anonymously. Utilizing their sharp wits and blades, rogues trick their foes through social manipulation as easily as breaking locks, climbing through windows, or dealing underhanded blows. These masters of magical craft manipulate shadow and movement, adding an array of useful and deadly tools to their repertoire. Rogues frequently establish guilds to meet future accomplices, hire out jobs, and hone secret skills, proving that there’s honor among thieves for those who know where to look.",
    domain_1: "Midnight",
    domain_2: "Grace",
    evasion: "12",
    hp: "6",
    items: "A set of forgery tools or a grappling hook",
    hope_feat_name: "Rogue’s Dodge",
    hope_feat_text:
      "Spend 3 Hope to gain a +2 bonus to your Evasion until the next time an attack succeeds against you. Otherwise, this bonus lasts until your next rest.",
    subclass_1: "Nightwalker",
    subclass_2: "Syndicate",
    suggested_traits: "+1, -1, +2, 0, +1, 0",
    suggested_primary: "Dagger",
    suggested_secondary: "Small Dagger",
    suggested_armor: "Gambeson Armor",
    class_feats: [
      {
        name: "Cloaked",
        text: "Any time you would be Hidden, you are instead Cloaked. In addition to the benefits of the Hidden condition, while Cloaked you remain unseen if you are stationary when an adversary moves to where they would normally see you. After you make an attack or end a move within line of sight of an adversary, you are no longer Cloaked.",
      },
      {
        name: "Sneak Attack",
        text: "When you succeed on an attack while Cloaked or while an ally is within Melee range of your target, add a number of d6s equal to your tier to your damage roll.\n\n- Level 1 → Tier 1\n- Levels 2–4 → Tier 2\n- Levels 5–7 → Tier 3\n- Levels 8–10 → Tier 4",
      },
    ],
    backgrounds: [
      {
        question:
          "What did you get caught doing that got you exiled from your home community?",
      },
      {
        question:
          "You used to have a different life, but you’ve tried to leave it behind. Who from your past is still chasing you?",
      },
      {
        question: "Who from your past were you most sad to say goodbye to?",
      },
    ],
    connections: [
      {
        question:
          "What did I recently convince you to do that got us both in trouble?",
      },
      {
        question:
          "What have I discovered about your past that I hold secret from the others?",
      },
      {
        question:
          "Who do you know from my past, and how have they influenced your feelings about me?",
      },
    ],
  },
  {
    name: "Seraph",
    description:
      "Seraphs are divine fighters and healers imbued with sacred purpose. A wide array of deities exist within the realms, and thus numerous kinds of seraphs are appointed by these gods. Their ethos traditionally aligns with the domain or goals of their god, such as defending the weak, exacting vengeance, protecting a land or artifact, or upholding a particular faith. Some seraphs ally themselves with an army or locale, much to the satisfaction of their rulers, but other crusaders fight in opposition to the follies of the Mortal Realm. It is better to be a seraph’s ally than their enemy, as they are terrifying foes to those who defy their purpose.",
    domain_1: "Splendor",
    domain_2: "Valor",
    evasion: "9",
    hp: "7",
    items: "A bundle of offerings or a sigil of your god",
    hope_feat_name: "Life Support",
    hope_feat_text:
      "Spend 3 Hope to clear a Hit Point on an ally within Close range.",
    subclass_1: "Divine Wielder",
    subclass_2: "Winged Sentinel",
    suggested_traits: "0, +2, 0, +1, +1, -1",
    suggested_primary: "Hallowed Axe",
    suggested_secondary: "Round Shield",
    suggested_armor: "Chainmail Armor",
    class_feats: [
      {
        name: "Prayer Dice",
        text: "At the beginning of each session, roll a number of d4s equal to your subclass’s Spellcast trait and place them on your character sheet in the space provided. These are your Prayer Dice. You can spend any number of Prayer Dice to aid yourself or an ally within Far range. You can use a spent die’s value to reduce incoming damage, add to a roll’s result after the roll is made, or gain Hope equal to the result. At the end of each session, clear all unspent Prayer Dice.",
      },
    ],
    backgrounds: [
      {
        question:
          "Which god did you devote yourself to? What incredible feat did they perform for you in a moment of desperation?",
      },
      {
        question: "How did your appearance change after taking your oath?",
      },
      {
        question:
          "In what strange or unique way do you communicate with your god?",
      },
    ],
    connections: [
      {
        question:
          "What promise did you make me agree to, should you die on the battlefield?",
      },
      {
        question: "Why do you ask me so many questions about my god?",
      },
      {
        question:
          "You’ve told me to protect one member of our party above all others, even yourself. Who are they and why?",
      },
    ],
  },
  {
    name: "Sorcerer",
    description:
      "Not all innate magic users choose to hone their craft, but those who do can become powerful sorcerers. The gifts of these wielders are passed down through families, even if the family is unaware of or reluctant to practice them. A sorcerer’s abilities can range from the elemental to the illusionary and beyond, and many practitioners band together into collectives based on their talents. The act of becoming a formidable sorcerer is not the practice of acquiring power, but learning to cultivate and control the power one already possesses. The magic of a misguided or undisciplined sorcerer is a dangerous force indeed.",
    domain_1: "Arcana",
    domain_2: "Midnight",
    evasion: "10",
    hp: "6",
    items: "A whispering orb or a family heirloom",
    hope_feat_name: "Volatile Magic",
    hope_feat_text:
      "Spend 3 Hope to reroll any number of your damage dice on an attack that deals magic damage.",
    subclass_1: "Elemental Origin",
    subclass_2: "Primal Origin",
    suggested_traits: "0, -1, +1, +2, +1, 0",
    suggested_primary: "Dualstaff",
    suggested_armor: "Gambeson Armor",
    class_feats: [
      {
        name: "Arcane Sense",
        text: "You can sense the presence of magical people and objects within Close range.",
      },
      {
        name: "Minor Illusion",
        text: "Make a Spellcast Roll (10). On a success, you create a minor visual illusion no larger than yourself within Close range. This illusion is convincing to anyone at Close range or farther.",
      },
      {
        name: "Channel Raw Power",
        text: "Once per long rest, you can place a domain card from your loadout into your vault and choose to either:\n\n- Gain Hope equal to the level of the card.\n- Enhance a spell that deals damage, gaining a bonus to your damage roll equal to twice the level of the card.",
      },
    ],
    backgrounds: [
      {
        question:
          "What did you do that made the people in your community wary of you?",
      },
      {
        question:
          "What mentor taught you to control your untamed magic, and why are they no longer able to guide you?",
      },
      {
        question:
          "You have a deep fear you hide from everyone. What is it, and why does it scare you?",
      },
    ],
    connections: [
      {
        question: "Why do you trust me so deeply?",
      },
      {
        question: "What did I do that makes you cautious around me?",
      },
      {
        question: "Why do we keep our shared past a secret?",
      },
    ],
  },
  {
    name: "Warrior",
    description:
      "Becoming a warrior requires years, often a lifetime, of training and dedication to the mastery of weapons and violence. While many who seek to fight hone only their strength, warriors understand the importance of an agile body and mind, making them some of the most sought-after fighters across the realms. Frequently, warriors find employment within an army, a band of mercenaries, or even a royal guard, but their potential is wasted in any position where they cannot continue to improve and expand their skills. Warriors are known to have a favored weapon; to come between them and their blade would be a grievous mistake.",
    domain_1: "Blade",
    domain_2: "Bone",
    evasion: "11",
    hp: "6",
    items: "The drawing of a lover or a sharpening stone",
    hope_feat_name: "No Mercy",
    hope_feat_text:
      "Spend 3 Hope to gain a +1 bonus to your attack rolls until your next rest.",
    subclass_1: "Call of the Brave",
    subclass_2: "Call of the Slayer",
    suggested_traits: "+2, +1, 0, +1, -1, 0",
    suggested_primary: "Longsword",
    suggested_armor: "Chainmail Armor",
    class_feats: [
      {
        name: "Attack of Opportunity",
        text: "If an adversary within Melee range attempts to leave that range, make a reaction roll using a trait of your choice against their Difficulty. Choose one effect on a success, or two if you critically succeed:\n\n- They can’t move from where they are.\n- You deal damage to them equal to your primary weapon’s damage.\n- You move with them.",
      },
      {
        name: "Combat Training",
        text: "You ignore burden when equipping weapons. When you deal physical damage, you gain a bonus to your damage roll equal to your level.",
      },
    ],
    backgrounds: [
      {
        question:
          "Who taught you to fight, and why did they stay behind when you left home?",
      },
      {
        question:
          "Somebody defeated you in battle years ago and left you to die. Who was it, and how did they betray you?",
      },
      {
        question:
          "What legendary place have you always wanted to visit, and why is it so special?",
      },
    ],
    connections: [
      {
        question:
          "We knew each other long before this party came together. How?",
      },
      {
        question:
          "What mundane task do you usually help me with off the battlefield?",
      },
      {
        question: "What fear am I helping you overcome?",
      },
    ],
  },
  {
    name: "Wizard",
    description:
      "Whether through an institution or individual study, those known as wizards acquire and hone immense magical power over years of learning using a variety of tools, including books, stones, potions, and herbs. Some wizards dedicate their lives to mastering a particular school of magic, while others learn from a wide variety of disciplines. Many wizards become wise and powerful figures in their communities, advising rulers, providing medicines and healing, and even leading war councils. While these mages all work toward the common goal of collecting magical knowledge, wizards often have the most conflict within their own ranks, as the acquisition, keeping, and sharing of powerful secrets is a topic of intense debate that has resulted in innumerable deaths.",
    domain_1: "Codex",
    domain_2: "Splendor",
    evasion: "11",
    hp: "5",
    items:
      "A book you’re trying to translate or a tiny, harmless elemental pet",
    hope_feat_name: "Not This Time",
    hope_feat_text:
      "Spend 3 Hope to force an adversary within Far range to reroll an attack or damage roll.",
    subclass_1: "School of Knowledge",
    subclass_2: "School of War",
    suggested_traits: "-1, 0, 0, +1, +1, +2",
    suggested_primary: "Greatstaff",
    suggested_armor: "Leather Armor",
    class_feats: [
      {
        name: "Prestidigitation",
        text: "You can perform harmless, subtle magical effects at will. For example, you can change an object’s color, create a smell, light a candle, cause a tiny object to float, illuminate a room, or repair a small object.",
      },
      {
        name: "Strange Patterns",
        text: "Choose a number between 1 and 12. When you roll that number on a Duality Die, gain a Hope or clear a Stress.\n\nYou can change this number when you take a long rest.",
      },
    ],
    backgrounds: [
      {
        question:
          "What responsibilities did your community once count on you for? How did you let them down?",
      },
      {
        question:
          "You’ve spent your life searching for a book or object of great significance. What is it, and why is it so important to you?",
      },
      {
        question:
          "You have a powerful rival. Who are they, and why are you so determined to defeat them?",
      },
    ],
    connections: [
      {
        question:
          "What favor have I asked of you that you’re not sure you can fulfill?",
      },
      {
        question: "What weird hobby or strange fascination do we both share?",
      },
      {
        question: "What secret about yourself have you entrusted only to me?",
      },
    ],
  },
];
