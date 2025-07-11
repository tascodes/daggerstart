import { PrismaClient, LevelChoice } from "@prisma/client";
import { classes } from "../src/lib/srd/classes";

const prisma = new PrismaClient();

async function recalculateAllCharacterHp() {
  const characters = await prisma.character.findMany({
    select: {
      id: true,
      class: true,
      maxHp: true,
    },
  });

  console.log(`Found ${characters.length} characters to update`);

  for (const character of characters) {
    const classData = classes.find(
      (cls) => cls.name.toLowerCase() === character.class.toLowerCase(),
    );

    const baseHp = classData ? parseInt(classData.hp, 10) : 5;

    const hitPointChoices = await prisma.characterLevel.count({
      where: {
        characterId: character.id,
        choices: {
          some: {
            choice: LevelChoice.HIT_POINT_SLOT,
          },
        },
      },
    });

    const newMaxHp = baseHp + hitPointChoices;

    if (newMaxHp !== character.maxHp) {
      await prisma.character.update({
        where: { id: character.id },
        data: { maxHp: newMaxHp },
      });

      console.log(
        `Updated ${character.class} character ${character.id}: ${character.maxHp} -> ${newMaxHp}`,
      );
    }
  }

  console.log("HP recalculation complete!");
}

recalculateAllCharacterHp()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
