﻿export type SubclassFeature = {
  name: string;
  text: string;
};

export type Subclass = {
  name: string;
  description: string;
  spellcast_trait?: string;
  extras?: string;
  foundations: SubclassFeature[];
  specializations: SubclassFeature[];
  masteries: SubclassFeature[];
};

export const Subclasses: Subclass[] = [
  {
    name: "Beastbound",
    description:
      "Play the Beastbound if you want to form a deep bond with an animal ally.",
    spellcast_trait: "Agility",
    extras:
      "# RANGER COMPANION\n\nWhen you choose the Beastbound Ranger subclass, take a companion sheet. This sheet is for tracking important information about your character’s companion and can be tucked beneath the right side of your character sheet for ease of viewing.\n\n### STEP 1: NAME YOUR COMPANION\n\nWork with the GM to decide what kind of animal you have as your companion. Give them a name and add a picture of them to the companion sheet.\n\n### STEP 2: WRITE THEIR EVASION\n\nFill in their Evasion, which starts at 10.\n\n### STEP 3: CHOOSE THEIR COMPANION EXPERIENCE\n\nCreate two Experiences for your companion based on their training and the history you have together.\n\nStart with +2 in both Experiences. Whenever you gain a new Experience, your companion also gains one. All new Experiences start at +2.\n\n> **Example Companion Experiences:** *Expert Climber, Fetch, Friendly, Guardian of the Forest, Horrifying, Intimidating, Loyal Until the End, Navigation, Nimble, Nobody Left Behind, On High Alert, Protector, Playful Companion, Scout, Seize Animal, Trusted Mount, Vigilant, We Always Find Them, You Can’t Hit What You Can’t Find*\n\n### STEP 4: CHOOSE THEIR ATTACK AND RECORD DAMAGE DIE\n\nFinally, describe your companion’s method of dealing damage (their standard attack) and record it in the “Attack & Damage” section. At level 1, your companion’s damage die is a d6 and their range is Melee.\n\n## WORKING WITH YOUR COMPANION\n\nThe following sections will run you through the basics of working with your companion.\n\n### USING SPELLCAST ROLLS, HOPE, AND EXPERIENCES\n\nMake a Spellcast Roll to connect with your companion and command them to take action. Spend a Hope to add an applicable Companion Experience to the roll. On a success with Hope, if your next action builds on their success, you gain advantage on the roll.\n\n### ATTACKING WITH YOUR COMPANION\n\nWhen you command your companion to attack, they gain any benefits that would normally only apply to you (such as the effects of “Ranger’s Focus”). On a success, their damage roll uses your Proficiency and their damage die.\n\n### TAKING DAMAGE AS STRESS\n\n- When your companion would take any amount of damage, they mark a Stress. When they mark their last Stress, they drop out of the scene (by hiding, fleeing, or a similar action). They remain unavailable until the start of your next long rest, where they return with 1 Stress cleared.\n- When you choose a downtime move that clears Stress on yourself, your companion clears an equal number of Stress.\n\n## LEVELING UP YOUR COMPANION\n\nWhen your character levels up, choose one available option for your companion from the following list and mark it on your sheet:\n\n- **Intelligent:** Your companion gains a permanent +1 bonus to a Companion Experience of your choice.\n- **Light in the Dark:** Use this as an additional Hope slot your character can mark.\n- **Creature Comfort:** Once per rest, when you take time during a quiet moment to give your companion love and attention, you can gain a Hope or you can both clear a Stress.\n- **Armored:** When your companion takes damage, you can mark one of your Armor Slots instead of marking one of their Stress.\n- **Vicious:** Increase your companion’s damage die or range by one step (d6 to d8, Close to Far, etc.).\n- **Resilient:** Your companion gains an additional Stress slot.\n- **Bonded:** When you mark your last Hit Point, your companion rushes to your side to comfort you. Roll a number of d6s equal to the unmarked Stress slots they have and mark them. If any roll a 6, your companion helps you up. Clear your last Hit Point and return to the scene.\n- **Aware:** Your companion gains a permanent +2 bonus to their Evasion.",
    foundations: [
      {
        name: "Companion",
        text: "You have an animal companion of your choice (at the GM’s discretion). They stay by your side unless you tell them otherwise.\n\nTake the Ranger Companion sheet. When you level up your character, choose a level-up option for your companion from this sheet as well.",
      },
    ],
    specializations: [
      {
        name: "Expert Training",
        text: "Choose an additional level-up option for your companion.",
      },
      {
        name: "Battle-Bonded",
        text: "When an adversary attacks you while they’re within your companion’s Melee range, you gain a +2 bonus to your Evasion against the attack.",
      },
    ],
    masteries: [
      {
        name: "Advanced Training",
        text: "Choose two additional level-up options for your companion.",
      },
      {
        name: "Loyal Friend",
        text: "Once per long rest, when the damage from an attack would mark your companion’s last Stress or your last Hit Point and you’re within Close range of each other, you or your companion can rush to the other’s side and take that damage instead.",
      },
    ],
  },
  {
    name: "Call of the Brave",
    description:
      "Play the Call of the Brave if you want to use the might of your enemies to fuel your own power.",
    foundations: [
      {
        name: "Courage",
        text: "When you fail a roll with Fear, you gain a Hope.",
      },
      {
        name: "Battle Ritual",
        text: "Once per long rest, before you attempt something incredibly dangerous or face off against a foe who clearly outmatches you, describe what ritual you perform or preparations you make. When you do, clear 2 Stress and gain 2 Hope.",
      },
    ],
    specializations: [
      {
        name: "Rise to the Challenge",
        text: "You are vigilant in the face of mounting danger. While you have 2 or fewer Hit Points unmarked, you can roll a d20 as your Hope Die.",
      },
    ],
    masteries: [
      {
        name: "Camaraderie",
        text: "Your unwavering bravery is a rallying point for your allies. You can initiate a Tag Team Roll once per additional time per session. Additionally, when an ally initiates a Tag Team Roll with you, they only need to spend 2 Hope to do so.",
      },
    ],
  },
  {
    name: "Call of the Slayer",
    description:
      "Play the Call of the Slayer if you want to strike down adversaries with immense force.",
    foundations: [
      {
        name: "Slayer",
        text: "You gain a pool of dice called Slayer Dice. On a roll with Hope, you can place a d6 on this card instead of gaining a Hope, adding the die to the pool. You can store a number of Slayer Dice equal to your Proficiency. When you make an attack roll or damage roll, you can spend any number of these Slayer Dice, rolling them and adding their result to the roll. At the end of each session, clear any unspent Slayer Dice on this card and gain a Hope per die cleared.",
      },
    ],
    specializations: [
      {
        name: "Weapon Specialist",
        text: "You can wield multiple weapons with dangerous ease. When you succeed on an attack, you can spend a Hope to add one of the damage dice from your secondary weapon to the damage roll. Additionally, once per long rest when you roll your Slayer Dice, reroll any 1s.",
      },
    ],
    masteries: [
      {
        name: "Martial Preparation",
        text: "You’re an inspirational warrior to all who travel with you. Your party gains access to the Martial Preparation downtime move. To use this move during a rest, describe how you instruct and train with your party. You and each ally who chooses this downtime move gain a d6 Slayer Die. A PC with a Slayer Die can spend it to roll the die and add the result to an attack or damage roll of their choice.",
      },
    ],
  },
  {
    name: "Divine Wielder",
    description:
      "Play the Divine Wielder if you want to dominate the battlefield with a legendary weapon.",
    spellcast_trait: "Strength",
    foundations: [
      {
        name: "Spirit Weapon",
        text: "When you have an equipped weapon with a range of Melee or Very Close, it can fly from your hand to attack an adversary within Close range and then return to you. You can mark a Stress to target an additional adversary within range with the same attack roll.",
      },
      {
        name: "Sparing Touch",
        text: "Once per long rest, touch a creature and clear 2 Hit Points or 2 Stress from them.",
      },
    ],
    specializations: [
      {
        name: "Devout",
        text: "When you roll your Prayer Dice, you can roll an additional die and discard the lowest result. Additionally, you can use your “Sparing Touch” feature twice instead of once per long rest.",
      },
    ],
    masteries: [
      {
        name: "Sacred Resonance",
        text: "When you roll damage for your “Spirit Weapon” feature, if any of the die results match, double the value of each matching die. For example, if you roll two 5s, they count as two 10s.",
      },
    ],
  },
  {
    name: "Elemental Origin",
    description:
      "Play the Elemental Origin if you want to channel raw magic to take the shape of a particular element.",
    spellcast_trait: "Instinct",
    foundations: [
      {
        name: "Elementalist",
        text: "Choose one of the following elements at character creation: air, earth, fire, lightning, water.\n\nYou can shape this element into harmless effects. Additionally, spend a Hope and describe how your control over this element helps an action roll you’re about to make, then either gain a +2 bonus to the roll or a +3 bonus to the roll’s damage.",
      },
    ],
    specializations: [
      {
        name: "Natural Evasion",
        text: "You can call forth your element to protect you from harm. When an attack roll against you succeeds, you can mark a Stress and describe how you use your element to defend you. When you do, roll a d6 and add its result to your Evasion against the attack.",
      },
    ],
    masteries: [
      {
        name: "Transcendence",
        text: "Once per long rest, you can transform into a physical manifestation of your element. When you do, describe your transformation and choose two of the following benefits to gain until your next rest:\n\n- +4 bonus to your Severe threshold\n- +1 bonus to a character trait of your choice\n- +1 bonus to your Proficiency\n- +2 bonus to your Evasion",
      },
    ],
  },
  {
    name: "Nightwalker",
    description:
      "Play the Nightwalker if you want to manipulate shadows to maneuver through the environment.",
    spellcast_trait: "Finesse",
    foundations: [
      {
        name: "Shadow Stepper",
        text: "You can move from shadow to shadow. When you move into an area of darkness or a shadow cast by another creature or object, you can **mark a Stress** to disappear from where you are and reappear inside another shadow within Far range. When you reappear, you are Cloaked.",
      },
    ],
    specializations: [
      {
        name: "Dark Cloud",
        text: "Make a Spellcast Roll (15). On a success, create a temporary dark cloud that covers any area within Close range. Anyone in this cloud can’t see outside of it, and anyone outside of it can’t see in. You’re considered Cloaked from any adversary for whom the cloud blocks line of sight.",
      },
      {
        name: "Adrenaline",
        text: "While you’re Vulnerable, add your level to your damage rolls.",
      },
    ],
    masteries: [
      {
        name: "Fleeting Shadow",
        text: "Gain a permanent +1 bonus to your Evasion. You can use your “Shadow Stepper” feature to move within Very Far range.",
      },
      {
        name: "Vanishing Act",
        text: "Mark a Stress to become Cloaked at any time. When Cloaked from this feature, you automatically clear the Restrained condition if you have it. You remain Cloaked in this way until you roll with Fear or until your next rest.",
      },
    ],
  },
  {
    name: "Primal Origin",
    description:
      "Play the Primal Origin if you want to extend the versatility of your spells in powerful ways.",
    spellcast_trait: "Instinct",
    foundations: [
      {
        name: "Manipulate Magic",
        text: "Your primal origin allows you to modify the essence of magic itself. After you cast a spell or make an attack using a weapon that deals magic damage, you can mark a Stress to do one of the following:\n\n- Extend the spell or attack’s reach by one range\n- Gain a +2 bonus to the action roll’s result\n- Double a damage die of your choice\n- Hit an additional target within range",
      },
    ],
    specializations: [
      {
        name: "Enchanted Aid",
        text: "You can enhance the magic of others with your essence. When you Help an Ally with a Spellcast Roll, you can roll a d8 as your advantage die. Once per long rest, after an ally has made a Spellcast Roll with your help, you can swap the results of their Duality Dice.",
      },
    ],
    masteries: [
      {
        name: "Arcane Charge",
        text: "You can gather magical energy to enhance your capabilities. When you take magic damage, you become Charged. Alternatively, you can spend 2 Hope to become Charged. When you successfully make an attack that deals magic damage while Charged, you can clear your Charge to either gain a +10 bonus to the damage roll or gain a +3 bonus to the Difficulty of a reaction roll the spell causes the target to make. You stop being Charged at your next long rest.",
      },
    ],
  },
  {
    name: "School of Knowledge",
    description:
      "Play the School of Knowledge if you want a keen understanding of the world around you.",
    spellcast_trait: "Knowledge",
    foundations: [
      {
        name: "Prepared",
        text: "Take an additional domain card of your level or lower from a domain you have access to.",
      },
      {
        name: "Adept",
        text: "When you Utilize an Experience, you can mark a Stress instead of spending a Hope. If you do, double your Experience modifier for that roll.",
      },
    ],
    specializations: [
      {
        name: "Accomplished",
        text: "Take an additional domain card of your level or lower from a domain you have access to.",
      },
      {
        name: "Perfect Recall",
        text: "Once per rest, when you recall a domain card in your vault, you can reduce its Recall Cost by 1.",
      },
    ],
    masteries: [
      {
        name: "Brilliant",
        text: "Take an additional domain card of your level or lower from a domain you have access to.",
      },
      {
        name: "Honed Expertise",
        text: "When you use an Experience, roll a d6. On a result of 5 or higher, you can use it without spending Hope.",
      },
    ],
  },
  {
    name: "School of War",
    description:
      "Play the School of War if you want to utilize trained magic for violence.",
    spellcast_trait: "Knowledge",
    foundations: [
      {
        name: "Battlemage",
        text: "You’ve focused your studies on becoming an unconquerable force on the battlefield. Gain an additional Hit Point slot.",
      },
      {
        name: "Face Your Fear",
        text: "When you succeed with Fear on an attack roll, you deal an extra 1d10 magic damage.",
      },
    ],
    specializations: [
      {
        name: "Conjure Shield",
        text: "You can maintain a protective barrier of magic. While you have at least 2 Hope, you add your Proficiency to your Evasion.",
      },
      {
        name: "Fueled by Fear",
        text: "The extra magic damage from your “Face Your Fear” feature increases to 2d10.",
      },
    ],
    masteries: [
      {
        name: "Thrive in Chaos",
        text: "When you succeed on an attack, you can mark a Stress after rolling damage to force the target to mark an additional Hit Point.",
      },
      {
        name: "Have No Fear",
        text: "The extra magic damage from your “Face Your Fear” feature increases to 3d10.",
      },
    ],
  },
  {
    name: "Stalwart",
    description:
      "Play the Stalwart if you want to take heavy blows and keep fighting.",
    foundations: [
      {
        name: "Unwavering",
        text: "Gain a permanent +1 bonus to your damage thresholds.",
      },
      {
        name: "Iron Will",
        text: "When you take physical damage, you can mark an additional Armor Slot to reduce the severity.",
      },
    ],
    specializations: [
      {
        name: "Unrelenting",
        text: "Gain a permanent +2 bonus to your damage thresholds.",
      },
      {
        name: "Partners-in-Arms",
        text: "When an ally within Very Close range takes damage, you can mark an Armor Slot to reduce the severity by one threshold.",
      },
    ],
    masteries: [
      {
        name: "Undaunted",
        text: "Gain a permanent +3 bonus to your damage thresholds.",
      },
      {
        name: "Loyal Protector",
        text: "When an ally within Close range has 2 or fewer Hit Points and would take damage, you can mark a Stress to sprint to their side and take the damage instead.",
      },
    ],
  },
  {
    name: "Syndicate",
    description:
      "Play the Syndicate if you want to have a web of contacts everywhere you go.",
    spellcast_trait: "Finesse",
    foundations: [
      {
        name: "Well-Connected",
        text: "When you arrive in a prominent town or environment, you know somebody who calls this place home. Give them a name, note how you think they could be useful, and choose one fact from the following list:\n\n- They owe me a favor, but they’ll be hard to find.\n- They’re going to ask for something in exchange.\n- They’re always in a great deal of trouble.\n- We used to be together. It’s a long story.\n- We didn’t part on great terms.",
      },
    ],
    specializations: [
      {
        name: "Contacts Everywhere",
        text: "Once per session, you can briefly call on a shady contact. Choose one of the following benefits and describe what brought them here to help you in this moment:\n\n- They provide 1 handful of gold, a unique tool, or a mundane object that the situation requires.\n- On your next action roll, their help provides a +3 bonus to the result of your Hope or Fear Die.\n- The next time you deal damage, they snipe from the shadows, adding 2d8 to your damage roll.",
      },
    ],
    masteries: [
      {
        name: "Reliable Backup",
        text: "You can use your “Contacts Everywhere” feature three times per session. The following options are added to the list of benefits you can choose from when you use that feature:\n\n- When you mark 1 or more Hit Points, they can rush out to shield you, reducing the Hit Points marked by 1.\n- When you make a Presence Roll in conversation, they back you up. You can roll a d20 as your Hope Die.",
      },
    ],
  },
  {
    name: "Troubadour",
    description:
      "Play the Troubadour if you want to play music to bolster your allies.",
    spellcast_trait: "Presence",
    foundations: [
      {
        name: "Gifted Performer",
        text: "You can play three different types of songs, once each per long rest; describe how you perform for others to gain the listed benefit:\n\n- **Relaxing Song:** You and all allies within Close range clear a Hit Point.\n- **Epic Song:** Make a target within Close range temporarily Vulnerable.\n- **Heartbreaking Song:** You and all allies within Close range gain a Hope.",
      },
    ],
    specializations: [
      {
        name: "Maestro",
        text: "Your rallying songs steel the courage of those who listen. When you give a Rally Die to an ally, they can gain a Hope or clear a Stress.",
      },
    ],
    masteries: [
      {
        name: "Virtuoso",
        text: "You are among the greatest of your craft and your skill is boundless. You can perform each of your “Gifted Performer” feature’s songs twice per long rest.",
      },
    ],
  },
  {
    name: "Vengeance",
    description:
      "Play the Vengeance if you want to strike down enemies who harm you or your allies.",
    foundations: [
      {
        name: "At Ease",
        text: "Gain an additional Stress slot.",
      },
      {
        name: "Revenge",
        text: "When an adversary within Melee range succeeds on an attack against you, you can mark 2 Stress to force the attacker to mark a Hit Point.",
      },
    ],
    specializations: [
      {
        name: "Act of Reprisal",
        text: "When an adversary damages an ally within Melee range, you gain a +1 bonus to your Proficiency for the next successful attack you make against that adversary.",
      },
    ],
    masteries: [
      {
        name: "Nemesis",
        text: "Spend 2 Hope to Prioritize an adversary until your next rest. When you make an attack against your Prioritized adversary, you can swap the results of your Hope and Fear Dice. You can only Prioritize one adversary at a time.",
      },
    ],
  },
  {
    name: "Warden of Renewal",
    description:
      "Play the Warden of Renewal if you want to use powerful magic to heal your party.",
    spellcast_trait: "Instinct",
    foundations: [
      {
        name: "Clarity of Nature",
        text: "Once per long rest, you can create a space of natural serenity within Close range. When you spend a few minutes resting within the space, clear Stress equal to your Instinct, distributed as you choose between you and your allies.",
      },
      {
        name: "Regeneration",
        text: "Touch a creature and spend 3 Hope. That creature clears 1d4 Hit Points.",
      },
    ],
    specializations: [
      {
        name: "Regenerative Reach",
        text: "You can target creatures within Very Close range with your “Regeneration” feature.",
      },
      {
        name: "Warden’s Protection",
        text: "Once per long rest, spend 2 Hope to clear 2 Hit Points on 1d4 allies within Close range.",
      },
    ],
    masteries: [
      {
        name: "Defender",
        text: "Your animal transformation embodies a healing guardian spirit. When you’re in Beastform and an ally within Close range marks 2 or more Hit Points, you can mark a Stress to reduce the number of Hit Points they mark by 1.",
      },
    ],
  },
  {
    name: "Warden of the Elements",
    description:
      "Play the Warden of the Elements if you want to embody the natural elements of the wild.",
    spellcast_trait: "Instinct",
    foundations: [
      {
        name: "Elemental Incarnation",
        text: "Mark a Stress to Channel one of the following elements until you take Severe damage or until your next rest:\n\n- **Fire:** When an adversary within Melee range deals damage to you, they take 1d10 magic damage.\n- **Earth:** Gain a bonus to your damage thresholds equal to your Proficiency.\n- **Water:** When you deal damage to an adversary within Melee range, all other adversaries within Very Close range must mark a Stress.\n- **Air:** You can hover, gaining advantage on Agility Rolls.",
      },
    ],
    specializations: [
      {
        name: "Elemental Aura",
        text: "Once per rest while Channeling, you can assume an aura matching your element. The aura affects targets within Close range until your Channeling ends.\n\n- **Fire:** When an adversary marks 1 or more Hit Points, they must also mark a Stress.\n- **Earth:** Your allies gain a +1 bonus to Strength.\n- **Water:** When an adversary deals damage to you, you can mark a Stress to move them anywhere within Very Close range of where they are.\n- **Air:** When you or an ally takes damage from an attack beyond Melee range, reduce the damage by 1d8.",
      },
    ],
    masteries: [
      {
        name: "Elemental Dominion",
        text: "You further embody your element. While Channeling, you gain the following benefit:\n\n- **Fire:** You gain a +1 bonus to your Proficiency for attacks and spells that deal damage.\n- **Earth:** When you would mark Hit Points, roll a d6 per Hit Point marked. For each result of 6, reduce the number of Hit Points you mark by 1.\n- **Water:** When an attack against you succeeds, you can mark a Stress to make the attacker temporarily Vulnerable.\n- **Air:** You gain a +1 bonus to your Evasion and can fly.",
      },
    ],
  },
  {
    name: "Wayfinder",
    description:
      "Play the Wayfinder if you want to hunt your prey and strike with deadly force.",
    spellcast_trait: "Agility",
    foundations: [
      {
        name: "Ruthless Predator",
        text: "When you make a damage roll, you can mark a Stress to gain a +1 bonus to your Proficiency. Additionally, when you deal Severe damage to an adversary, they must mark a Stress.",
      },
      {
        name: "Path Forward",
        text: "When you’re traveling to a place you’ve previously visited or you carry an object that has been at the location before, you can identify the shortest, most direct path to your destination.",
      },
    ],
    specializations: [
      {
        name: "Elusive Predator",
        text: "When your Focus makes an attack against you, you gain a +2 bonus to your Evasion against the attack.",
      },
    ],
    masteries: [
      {
        name: "Apex Predator",
        text: "Before you make an attack roll against your Focus, you can spend a Hope. On a successful attack, you remove a Fear from the GM’s Fear pool.",
      },
    ],
  },
  {
    name: "Winged Sentinel",
    description:
      "Play the Winged Sentinel if you want to take flight and strike crushing blows from the sky.",
    spellcast_trait: "Strength",
    foundations: [
      {
        name: "Wings of Light",
        text: "You can fly. While flying, you can do the following:\n\n- Mark a Stress to pick up and carry another willing creature approximately your size or smaller.\n- Spend a Hope to deal an extra 1d8 damage on a successful attack.",
      },
    ],
    specializations: [
      {
        name: "Ethereal Visage",
        text: "Your supernatural visage strikes awe and fear. While flying, you have advantage on Presence Rolls. When you succeed with Hope on a Presence Roll, you can remove a Fear from the GM’s Fear pool instead of gaining Hope.",
      },
    ],
    masteries: [
      {
        name: "Ascendant",
        text: "Gain a permanent +4 bonus to your Severe damage threshold.",
      },
      {
        name: "Power of the Gods",
        text: "While flying, you deal an extra 1d12 damage instead of 1d8 from your “Wings of Light” feature.",
      },
    ],
  },
  {
    name: "Wordsmith",
    description:
      "Play the Wordsmith if you want to use clever wordplay and captivate crowds.",
    spellcast_trait: "Presence",
    foundations: [
      {
        name: "Rousing Speech",
        text: "Once per long rest, you can give a heartfelt, inspiring speech. All allies within Far range clear 2 Stress.",
      },
      {
        name: "Heart of a Poet",
        text: "After you make an action roll to impress, persuade, or offend someone, you can spend a Hope to add a d4 to the roll.",
      },
    ],
    specializations: [
      {
        name: "Eloquent",
        text: "Your moving words boost morale. Once per session, when you encourage an ally, you can do one of the following:\n\n- Allow them to find a mundane object or tool they need.\n- Help an Ally without spending Hope.\n- Give them an additional downtime move during their next rest.",
      },
    ],
    masteries: [
      {
        name: "Epic Poetry",
        text: "Your Rally Die increases to a d10. Additionally, when you Help an Ally, you can narrate the moment as if you were writing the tale of their heroism in a memoir. When you do, roll a d10 as your advantage die.",
      },
    ],
  },
];
