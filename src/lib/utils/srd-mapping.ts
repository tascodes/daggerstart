import { classes, type Class } from "@/lib/srd/classes";
import { Subclasses, type Subclass } from "@/lib/srd/subclasses";

/**
 * Normalizes a character class name to match SRD format
 * Converts lowercase to proper case (e.g., "seraph" -> "Seraph")
 */
export const normalizeClassName = (className: string): string => {
  return className.charAt(0).toUpperCase() + className.slice(1).toLowerCase();
};

/**
 * Normalizes a character subclass name to match SRD format
 * Converts kebab-case to title case (e.g., "divine-wielder" -> "Divine Wielder")
 */
export const normalizeSubclassName = (subclassName: string): string => {
  return subclassName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

/**
 * Finds SRD class data by character class name
 * Handles normalization automatically
 */
export const getClassData = (characterClass: string): Class | undefined => {
  const normalizedClass = normalizeClassName(characterClass);
  return classes.find((cls) => cls.name === normalizedClass);
};

/**
 * Finds SRD subclass data by character subclass name
 * Handles normalization automatically
 */
export const getSubclassData = (
  characterSubclass: string,
): Subclass | undefined => {
  const normalizedSubclass = normalizeSubclassName(characterSubclass);
  return Subclasses.find((sub) => sub.name === normalizedSubclass);
};

/**
 * Gets both class and subclass data for a character
 * Returns an object with both pieces of data
 */
export const getCharacterSRDData = (
  characterClass: string,
  characterSubclass: string,
) => {
  return {
    classData: getClassData(characterClass),
    subclassData: getSubclassData(characterSubclass),
  };
};

/**
 * Type guard to check if class data exists
 */
export const hasClassData = (
  classData: Class | undefined,
): classData is Class => {
  return classData !== undefined;
};

/**
 * Type guard to check if subclass data exists
 */
export const hasSubclassData = (
  subclassData: Subclass | undefined,
): subclassData is Subclass => {
  return subclassData !== undefined;
};
