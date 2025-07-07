﻿export type AncestryFeat = {
  name: string;
  text: string;
};

export type Ancestry = {
  name: string;
  description: string;
  feats: AncestryFeat[];
};

export const Ancestries: Ancestry[] = [
  {
    name: "Clank",
    description:
      "Clanks are sentient mechanical beings built from a variety of materials, including metal, wood, and stone. They can resemble humanoids, animals, or even inanimate objects. Like organic beings, their bodies come in a wide array of sizes. Because of their bespoke construction, many clanks have highly specialized physical configurations. Examples include clawed hands for grasping, wheels for movement, or built-in weaponry.\n\nMany clanks embrace body modifications for style as well as function, and members of other ancestries often turn to clank artisans to construct customized mobility aids and physical adornments. Other ancestries can create clanks, even using their own physical characteristics as inspiration, but it’s also common for clanks to build one another. A clank’s lifespan extends as long as they’re able to acquire or craft new parts, making their physical form effectively immortal. That said, their minds are subject to the effects of time, and deteriorate as the magic that powers them loses potency.",
    feats: [
      {
        name: "Purposeful Design",
        text: "Decide who made you and for what purpose. At character creation, choose one of your Experiences that best aligns with this purpose and gain a permanent +1 bonus to it.",
      },
      {
        name: "Efficient",
        text: "When you take a short rest, you can choose a long rest move instead of a short rest move.",
      },
    ],
  },
  {
    name: "Drakona",
    description:
      "Drakona resemble wingless dragons in humanoid form and possess a powerful elemental breath. All drakona have thick scales that provide excellent natural armor against both attacks and the forces of nature. They are large in size, ranging from 5 feet to 7 feet on average, with long sharp teeth. New teeth grow throughout a Drakona’s approximately 350-year lifespan, so they are never in danger of permanently losing an incisor. Unlike their dragon ancestors, drakona don’t have wings and can’t fly without magical aid. Members of this ancestry pass down the element of their breath through generations, though in rare cases, a drakona’s elemental power will differ from the rest of their family’s.",
    feats: [
      {
        name: "Scales",
        text: "Your scales act as natural protection. When you would take Severe damage, you can **mark a Stress** to mark 1 fewer Hit Points.",
      },
      {
        name: "Elemental Breath",
        text: "Choose an element for your breath (such as electricity, fire, or ice). You can use this breath against a target or group of targets within Very Close range, treating it as an Instinct weapon that deals **d8** magic damage using your Proficiency.",
      },
    ],
  },
  {
    name: "Dwarf",
    description:
      "Dwarves are most easily recognized as short humanoids with square frames, dense musculature, and thick hair. Their average height ranges from 4 to 5 ½ feet, and they are often broad in proportion to their stature. Their skin and nails contain a high amount of keratin, making them naturally resilient. This allows dwarves to embed gemstones into their bodies and decorate themselves with tattoos or piercings. Their hair grows thickly—usually on their heads, but some dwarves have thick hair across their bodies as well. Dwarves of all genders can grow facial hair, which they often style in elaborate arrangements. Typically, dwarves live up to 250 years of age, maintaining their muscle mass well into later life.",
    feats: [
      {
        name: "Thick Skin",
        text: "When you take Minor damage, you can **mark 2 Stress** instead of marking a Hit Point.",
      },
      {
        name: "Increased Fortitude",
        text: "**Spend 3 Hope** to halve incoming physical damage.",
      },
    ],
  },
  {
    name: "Elf",
    description:
      "Elves are typically tall humanoids with pointed ears and acutely attuned senses. Their ears vary in size and pointed shape, and as they age, the tips begin to droop. While elves come in a wide range of body types, they are all fairly tall, with heights ranging from about 6 to 6 ½ feet. All elves have the ability to drop into a celestial trance, rather than sleep. This allows them to rest effectively in a short amount of time.\n\nSome elves possess what is known as a “mystic form,” which occurs when an elf has dedicated themself to the study or protection of the natural world so deeply that their physical form changes. These characteristics can include celestial freckles, the presence of leaves, vines, or flowers in their hair, eyes that flicker like fire, and more. Sometimes these traits are inherited from parents, but if an elf changes their environment or magical focus, their appearance changes over time. Because elves live for about 350 years, these traits can shift more than once throughout their lifespan.",
    feats: [
      {
        name: "Quick Reactions",
        text: "**Mark a Stress** to gain advantage on a reaction roll.",
      },
      {
        name: "Celestial Trance",
        text: "During a rest, you can drop into a trance to choose an additional downtime move.",
      },
    ],
  },
  {
    name: "Faerie",
    description:
      "Faeries are winged humanoid creatures with insectile features. These characteristics cover a broad spectrum from humanoid to insectoid—some possess additional arms, compound eyes, lantern organs, chitinous exoskeletons, or stingers. Because of their close ties to the natural world, they also frequently possess attributes that allow them to blend in with various plants. The average height of a faerie ranges from about 2 feet to 5 feet, but some faeries grow up to 7 feet tall. All faeries possess membranous wings and they each go through a process of metamorphosis. The process and changes differ from faerie to faerie, but during this transformation each individual manifests the unique appearance they will carry throughout the rest of their approximately 50-year lifespan.",
    feats: [
      {
        name: "Luckbender",
        text: "Once per session, after you or a willing ally within Close range makes an action roll, you can **spend 3 Hope** to reroll the Duality Dice.",
      },
      {
        name: "Wings",
        text: "You can fly. While flying, you can **mark a Stress** after an adversary makes an attack against you to gain a +2 bonus to your Evasion against that attack.",
      },
    ],
  },
  {
    name: "Faun",
    description:
      "Fauns resemble humanoid goats with curving horns, square pupils, and cloven hooves. Though their appearances may vary, most fauns have a humanoid torso and a goatlike lower body covered in dense fur. Faun faces can be more caprine or more humanlike, and they have a wide variety of ear and horn shapes. Faun horns range from short with minimal curvature to much larger with a distinct curl. The average faun ranges from 4 feet to 6 ½ feet tall, but their height can change dramatically from one moment to the next based on their stance. The majority of fauns have proportionately long limbs, no matter their size or shape, and are known for their ability to deliver powerful blows with their split hooves. Fauns live for roughly 225 years, and as they age, their appearance can become increasingly goatlike.",
    feats: [
      {
        name: "Caprine Leap",
        text: "You can leap anywhere within Close range as though you were using normal movement, allowing you to vault obstacles, jump across gaps, or scale barriers with ease.",
      },
      {
        name: "Kick",
        text: "When you succeed on an attack against a target within Melee range, you can **mark a Stress** to kick yourself off them, dealing an extra **2d6** damage and knocking back either yourself or the target to Very Close range.",
      },
    ],
  },
  {
    name: "Firbolg",
    description:
      "Firbolgs are bovine humanoids typically recognized by their broad noses and long, drooping ears. Some have faces that are a blend of humanoid and bison, ox, cow, or other bovine creatures. Others, often referred to as minotaurs, have heads that entirely resemble cattle. They are tall and muscular creatures, with long tails ranging from around 3 feet to 7 feet, and possess remarkable strength no matter their age. Some firbolgs are known to use this strength to charge their adversaries, an action that is particularly effective for those who have one of the many varieties of horn styles commonly found in this ancestry. Though their unique characteristics can vary, all firbolgs are covered in fur, which can be muted and earth-toned in color, or come in a variety of pastels, such as soft pinks and blues. On average, firbolgs live for about 150 years.",
    feats: [
      {
        name: "Charge",
        text: "When you succeed on an Agility Roll to move from Far or Very Far range into Melee range with one or more targets, you can **mark a Stress** to deal **1d12** physical damage to all targets within Melee range.",
      },
      {
        name: "Unshakable",
        text: "When you would mark a Stress, roll a **d6**. On a result of 6, don’t mark it.",
      },
    ],
  },
  {
    name: "Fungril",
    description:
      "Fungril resemble humanoid mushrooms. They can be either more humanoid or more fungal in appearance, and they come in an assortment of colors, from earth tones to bright reds, yellows, purples, and blues. Fungril display an incredible variety of bodies, faces, and limbs, as there’s no single common shape among them. Even their heights range from a tiny 2 feet tall to a staggering 7 feet tall. While the common lifespan of a fungril is about 300 years, some have been reported to live much longer. They can communicate nonverbally, and many members of this ancestry use a mycelial array to chemically exchange information with other fungril across long distances.",
    feats: [
      {
        name: "Fungril Network",
        text: "Make an **Instinct Roll (12)** to use your mycelial array to speak with others of your ancestry. On a success, you can communicate across any distance.",
      },
      {
        name: "Death Connection",
        text: "While touching a corpse that died recently, you can **mark a Stress** to extract one memory from the corpse related to a specific emotion or sensation of your choice.",
      },
    ],
  },
  {
    name: "Galapa",
    description:
      "Galapa resemble anthropomorphic turtles with large, domed shells into which they can retract. On average, they range from 4 feet to 6 feet in height, and their head and body shapes can resemble any type of turtle. Galapa come in a variety of earth tones—most often shades of green and brown—and possess unique patterns on their shells. Members of this ancestry can draw their head, arms, and legs into their shell for protection to use it as a natural shield when defensive measures are needed. Some supplement their shell’s strength or appearance by attaching armor or carving unique designs, but the process is exceedingly painful. Most galapa move slowly no matter their age, and they can live approximately 150 years.",
    feats: [
      {
        name: "Shell",
        text: "Gain a bonus to your damage thresholds equal to your Proficiency.",
      },
      {
        name: "Retract",
        text: "**Mark a Stress** to retract into your shell. While in your shell, you have resistance to physical damage, you have disadvantage on action rolls, and you can’t move.",
      },
    ],
  },
  {
    name: "Giant",
    description:
      "Giants are towering humanoids with broad shoulders, long arms, and one to three eyes. Adult giants range from 6 ½ to 8 ½ feet tall and are naturally muscular, regardless of body type. They are easily recognized by their wide frames and elongated arms and necks. Though they can have up to three eyes, all giants are born with none and remain sightless for their first year of life. Until a giant reaches the age of 10 and their features fully develop, the formation of their eyes may fluctuate. Those with a single eye are commonly known as cyclops. The average giant lifespan is about 75 years.",
    feats: [
      {
        name: "Endurance",
        text: "Gain an additional Hit Point slot at character creation.",
      },
      {
        name: "Reach",
        text: "Treat any weapon, ability, spell, or other feature that has a Melee range as though it has a Very Close range instead.",
      },
    ],
  },
  {
    name: "Goblin",
    description:
      "Goblins are small humanoids easily recognizable by their large eyes and massive membranous ears. With keen hearing and sharp eyesight, they perceive details both at great distances and in darkness, allowing them to move through less-optimal environments with ease. Their skin and eye colors are incredibly varied, with no one hue, either vibrant or subdued, more dominant than another. A typical goblin stands between 3 feet and 4 feet tall, and each of their ears is about the size of their head. Goblins are known to use ear positions to very specific effect when communicating nonverbally. A goblin’s lifespan is roughly 100 years, and many maintain their keen hearing and sight well into advanced age.",
    feats: [
      {
        name: "Surefooted",
        text: "You ignore disadvantage on Agility Rolls.",
      },
      {
        name: "Danger Sense",
        text: "Once per rest, **mark a Stress** to force an adversary to reroll an attack against you or an ally within Very Close range.",
      },
    ],
  },
  {
    name: "Halfling",
    description:
      "Halflings are small humanoids with large hairy feet and prominent rounded ears. On average, halflings are 3 to 4 feet in height, and their ears, nose, and feet are larger in proportion to the rest of their body. Members of this ancestry live for around 150 years, and a halfling’s appearance is likely to remain youthful even as they progress from adulthood into old age. Halflings are naturally attuned to the magnetic fields of the Mortal Realm, granting them a strong internal compass. They also possess acute senses of hearing and smell, and can often detect those who are familiar to them by the sound of their movements.",
    feats: [
      {
        name: "Luckbringer",
        text: "At the start of each session, everyone in your party gains a Hope.",
      },
      {
        name: "Internal Compass",
        text: "When you roll a 1 on your Hope Die, you can reroll it.",
      },
    ],
  },
  {
    name: "Human",
    description:
      "Humans are most easily recognized by their dexterous hands, rounded ears, and bodies built for endurance. Their average height ranges from just under 5 feet to about 6 ½ feet. They have a wide variety of builds, with some being quite broad, others lithe, and many inhabiting the spectrum in between. Humans are physically adaptable and adjust to harsh climates with relative ease. In general, humans live to an age of about 100, with their bodies changing dramatically between their youngest and oldest years.",
    feats: [
      {
        name: "High Stamina",
        text: "Gain an additional Stress slot at character creation.",
      },
      {
        name: "Adaptability",
        text: "When you fail a roll that utilized one of your Experiences, you can mark a Stress to reroll.",
      },
    ],
  },
  {
    name: "Infernis",
    description:
      "Infernirs are humanoids who possess sharp canine teeth, pointed ears, and horns. They are the descendants of demons from the Circles Below. On average, infernirs range in height from 5 feet to 7 feet and are known to have long fingers and pointed nails. Some have long, thin, and smooth tails that end in points, forks, or arrowheads. It’s common for infernirs to have two or four horns—though some have crowns of many horns, or only one. These horns can also grow asymmetrically, forming unique, often curving, shapes that infernirs enhance with carving and ornamentation. Their skin, hair, and horns come in an assortment of colors that can include soft pastels, stark tones, or vibrant hues, such as rosy scarlet, deep purple, and pitch black.\n\nInfernirs possess a “dread visage” that manifests both involuntarily, such as when they experience fear or other strong emotions, or purposefully, such as when they wish to intimidate an adversary. This visage can briefly modify their appearance in a variety of ways, including lengthening their teeth and nails, changing the colors of their eyes, twisting their horns, or enhancing their height. On average, infernirs live up to 350 years, with some attributing this lifespan to their demonic lineage.",
    feats: [
      {
        name: "Fearless",
        text: "When you roll with Fear, you can **mark 2 Stress** to change it into a roll with Hope instead.",
      },
      {
        name: "Dread Visage",
        text: "You have advantage on rolls to intimidate hostile creatures.",
      },
    ],
  },
  {
    name: "Katari",
    description:
      "Katari are feline humanoids with retractable claws, vertically slit pupils, and high, triangular ears. They can also have small, pointed canine teeth, soft fur, and long whiskers that assist their perception and navigation. Their ears can swivel nearly 180 degrees to detect sound, adding to their heightened senses. Katari may look more or less feline or humanoid, with catlike attributes in the form of hair, whiskers, and a muzzle. About half of the katari population have tails. Their skin and fur come in a wide range of hues and patterns, including solid colors, calico tones, tabby stripes, and an array of spots, patches, marbling, or bands. Their height ranges from about 3 feet to 6 ½ feet, and they live to around 150 years.",
    feats: [
      {
        name: "Feline Instincts",
        text: "When you make an Agility Roll, you can **spend 2 Hope** to reroll your Hope Die.",
      },
      {
        name: "Retracting Claws",
        text: "Make an **Agility Roll** to scratch a target within Melee range. On a success, they become temporarily Vulnerable.",
      },
    ],
  },
  {
    name: "Orc",
    description:
      "Orcs are humanoids most easily recognized by their square features and boar-like tusks that protrude from their lower jaw. Tusks come in various sizes, and though they extend from the mouth, they aren’t used for consuming food. Instead, many orcs choose to decorate their tusks with significant ornamentation. Orcs typically live for 125 years, and unless altered, their tusks continue to grow throughout the course of their lives. Their ears are pointed, and their hair and skin typically have green, blue, pink, or gray tones. Orcs tend toward a muscular build, and their average height ranges from 5 feet to 6 ½ feet.",
    feats: [
      {
        name: "Sturdy",
        text: "When you have 1 Hit Point remaining, attacks against you have disadvantage.",
      },
      {
        name: "Tusks",
        text: "When you succeed on an attack against a target within Melee range, you can **spend a Hope** to gore the target with your tusks, dealing an extra **1d6** damage.",
      },
    ],
  },
  {
    name: "Ribbet",
    description:
      "Ribbets resemble anthropomorphic frogs with protruding eyes and webbed hands and feet. They have smooth (though sometimes warty) moist skin and eyes positioned on either side of their head. Some ribbets have hind legs more than twice the length of their torso, while others have short limbs. No matter their size (which ranges from about 3 feet to 4 ½ feet), ribbets primarily move by hopping. All ribbets have webbed appendages, allowing them to swim with ease. Some ribbets possess a natural green-and-brown camouflage, while others are vibrantly colored with bold patterns. No matter their appearance, all ribbets are born from eggs laid in the water, hatch into tadpoles, and after about 6 to 7 years, grow into amphibians that can move around on land. Ribbets live for approximately 100 years.",
    feats: [
      {
        name: "Amphibious",
        text: "You can breathe and move naturally underwater.",
      },
      {
        name: "Long Tongue",
        text: "You can use your long tongue to grab onto things within Close range. **Mark a Stress** to use your tongue as a Finesse Close weapon that deals **d12** physical damage using your Proficiency.",
      },
    ],
  },
  {
    name: "Simiah",
    description:
      "Simiah resemble anthropomorphic monkeys and apes with long limbs and prehensile feet. While their appearance reflects all simian creatures, from the largest gorilla to the smallest marmoset, their size does not align with their animal counterparts, and they can be anywhere from 2 to 6 feet tall. All simiah can use their dexterous feet for nonverbal communication, work, and combat. Additionally, some also have prehensile tails that can grasp objects or help with balance during difficult maneuvers. These traits grant members of this ancestry unique agility that aids them in a variety of physical tasks. In particular, simiah are skilled climbers and can easily transition from bipedal movement to knuckle-walking and climbing, and back again. On average, simiah live for about 100 years.",
    feats: [
      {
        name: "Natural Climber",
        text: "You have advantage on Agility Rolls that involve balancing and climbing.",
      },
      {
        name: "Nimble",
        text: "Gain a permanent +1 bonus to your Evasion at character creation.",
      },
    ],
  },
];
