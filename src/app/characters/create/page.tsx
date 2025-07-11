"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import DomainBadge from "~/components/DomainBadge";
import { classes } from "~/lib/srd/classes";
import { Ancestries } from "~/lib/srd/ancestries";
import { Communities } from "~/lib/srd/communities";
import { Subclasses } from "~/lib/srd/subclasses";
import { classShortDescriptions } from "./constants";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const SECTIONS = {
  "getting-started": "Getting Started",
  class: "Class",
  heritage: "Heritage",
  experiences: "Experiences",
} as const;

type SectionKey = keyof typeof SECTIONS;

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters"),
  pronouns: z.string().optional(),
  class: z.string().min(1, "Class is required"),
  subclass: z.string().min(1, "Subclass is required"),
  ancestry: z.string().min(1, "Ancestry is required"),
  community: z.string().min(1, "Community is required"),
  experiences: z.array(z.string()).min(0).max(5),
});

type FormData = z.infer<typeof formSchema>;

const formatBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function NewCharacterPage() {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("getting-started");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [expandedSubclass, setExpandedSubclass] = useState<string | null>(null);
  const [expandedAncestry, setExpandedAncestry] = useState<string | null>(null);
  const [expandedCommunity, setExpandedCommunity] = useState<string | null>(
    null,
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get("characterId");
  const isEditMode = !!characterId;

  // Fetch existing character data if editing
  const { data: existingCharacter, isLoading: isLoadingCharacter } =
    api.character.getById.useQuery(
      { id: characterId! },
      {
        enabled: isEditMode,
        retry: false,
      },
    );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pronouns: "",
      class: "",
      subclass: "",
      ancestry: "",
      community: "",
      experiences: [],
    },
  });

  const watchedClass = form.watch("class");

  // Calculate number of experiences based on character level
  const getExperienceCount = (level: number): number => {
    if (level === 1) return 2;
    if (level >= 2 && level <= 4) return 3;
    if (level >= 5 && level <= 7) return 4;
    if (level >= 8 && level <= 10) return 5;
    return 2; // default fallback
  };

  // Get the character's current level
  const characterLevel = isEditMode ? (existingCharacter?.level ?? 1) : 1;
  const experienceCount = getExperienceCount(characterLevel);

  const createCharacter = api.character.create.useMutation({
    onSuccess: (newCharacter) => {
      router.push(`/characters/${newCharacter.id}`);
    },
  });

  const updateCharacter = api.character.update.useMutation({
    onSuccess: (updatedCharacter) => {
      router.push(`/characters/${updatedCharacter.id}`);
    },
  });

  const resetCharacter = api.character.resetToLevel1.useMutation({
    onSuccess: () => {
      setShowResetConfirm(false);
      // Refresh the page to show the reset character
      window.location.reload();
    },
  });

  // Handle character not found or access denied
  useEffect(() => {
    if (isEditMode && !isLoadingCharacter && !existingCharacter) {
      notFound();
    }
  }, [isEditMode, isLoadingCharacter, existingCharacter]);

  // Populate form with existing character data when editing
  useEffect(() => {
    if (existingCharacter && isEditMode) {
      form.reset({
        name: existingCharacter.name,
        pronouns: existingCharacter.pronouns ?? "",
        class: existingCharacter.class,
        subclass: existingCharacter.subclass,
        ancestry: existingCharacter.ancestry,
        community: existingCharacter.community,
        experiences:
          existingCharacter.experiences?.map((exp) => exp.name) ?? [],
      });
    }
  }, [existingCharacter, isEditMode, form]);

  const onSubmit = (data: FormData) => {
    if (isEditMode && characterId) {
      updateCharacter.mutate({
        id: characterId,
        name: data.name,
        pronouns: data.pronouns,
        class: data.class,
        subclass: data.subclass,
        ancestry: data.ancestry,
        community: data.community,
        level: existingCharacter?.level ?? 1,
        experiences: data.experiences.map((name, index) => ({
          id: existingCharacter?.experiences?.[index]?.id,
          name,
          bonus: existingCharacter?.experiences?.[index]?.bonus ?? 2,
        })),
      });
    } else {
      createCharacter.mutate({
        name: data.name,
        pronouns: data.pronouns,
        class: data.class,
        subclass: data.subclass,
        ancestry: data.ancestry,
        community: data.community,
        level: 1,
        experiences: data.experiences,
      });
    }
  };

  const availableSubclasses = watchedClass
    ? Subclasses.filter((subclass) => {
        const selectedClass = classes.find(
          (c) => c.name.toLowerCase() === watchedClass,
        );
        return (
          selectedClass &&
          (subclass.name === selectedClass.subclass_1 ||
            subclass.name === selectedClass.subclass_2)
        );
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {isEditMode ? "Edit Character" : "Create New Character"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-8">
            {/* Left Sidebar - Navigation */}
            <div className="w-64 flex-shrink-0">
              <nav className="space-y-2">
                {Object.entries(SECTIONS).map(([key, label]) => (
                  <Button
                    key={key}
                    type="button"
                    onClick={() => setActiveSection(key as SectionKey)}
                    variant={activeSection === key ? "default" : "secondary"}
                    className={`w-full justify-start font-medium ${
                      activeSection === key
                        ? "bg-sky-500 text-white hover:bg-sky-600"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {label}
                  </Button>
                ))}
              </nav>

              {/* Create Character Button */}
              <div className="mt-8">
                <Button
                  type="submit"
                  disabled={
                    createCharacter.isPending || updateCharacter.isPending
                  }
                  className="w-full bg-sky-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50"
                >
                  {createCharacter.isPending || updateCharacter.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </div>
                  ) : isEditMode ? (
                    "Update Character"
                  ) : (
                    "Create Character"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Content - Form Section */}
            <div className="flex-1">
              <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
                {isEditMode && isLoadingCharacter ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-slate-400">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                      Loading character data...
                    </div>
                  </div>
                ) : (
                  <>
                    {activeSection === "getting-started" && (
                      <div className="space-y-6">
                        <FormField
                          key="getting-started-name"
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your character's name"
                                  {...field}
                                  className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                                />
                              </FormControl>
                              <FormDescription className="text-slate-400">
                                Choose a name that fits your character&apos;s
                                personality and background.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          key="getting-started-pronouns"
                          control={form.control}
                          name="pronouns"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">
                                Pronouns
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., they/them, she/her, he/him"
                                  {...field}
                                  className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                                />
                              </FormControl>
                              <FormDescription className="text-slate-400">
                                Optional: How would you like others to refer to
                                your character?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {isEditMode &&
                          existingCharacter &&
                          existingCharacter.level > 1 && (
                            <div className="space-y-3">
                              <div className="font-medium text-white">
                                Character Level: {existingCharacter.level}
                              </div>
                              <Dialog
                                open={showResetConfirm}
                                onOpenChange={setShowResetConfirm}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset to Level 1
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="border-slate-700 bg-slate-800 text-white">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">
                                      Reset Character to Level 1
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-300">
                                      This will permanently remove all:
                                      <ul className="mt-2 list-inside list-disc space-y-1">
                                        <li>
                                          All level progression (CharacterLevel
                                          entries)
                                        </li>
                                        <li>
                                          All experiences beyond the first 2
                                        </li>
                                        <li>All domain cards</li>
                                      </ul>
                                      <span className="mt-2 block font-semibold text-red-400">
                                        This action cannot be undone.
                                      </span>
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowResetConfirm(false)}
                                      className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600"
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => {
                                        if (characterId) {
                                          resetCharacter.mutate({
                                            id: characterId,
                                          });
                                        }
                                      }}
                                      disabled={resetCharacter.isPending}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      {resetCharacter.isPending
                                        ? "Resetting..."
                                        : "Reset Character"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                      </div>
                    )}

                    {activeSection === "class" && (
                      <div className="space-y-6">
                        <FormField
                          key="class-class"
                          control={form.control}
                          name="class"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-4 block text-lg font-semibold text-white">
                                Choose Your Class
                              </FormLabel>
                              <FormDescription className="mb-6 text-slate-400">
                                Your character&apos;s primary class determines
                                their core abilities and playstyle. Click on a
                                class to learn more about it.
                              </FormDescription>

                              <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                                {classes
                                  .sort((a, b) => {
                                    // Put selected class first
                                    const aSelected =
                                      field.value === a.name.toLowerCase();
                                    const bSelected =
                                      field.value === b.name.toLowerCase();
                                    if (aSelected && !bSelected) return -1;
                                    if (!aSelected && bSelected) return 1;
                                    return 0;
                                  })
                                  .map((classItem) => (
                                    <Card
                                      key={classItem.name.toLowerCase()}
                                      className={`cursor-pointer border py-2 transition-all duration-200 ${
                                        field.value ===
                                        classItem.name.toLowerCase()
                                          ? "border-sky-500 bg-sky-500/10"
                                          : "border-slate-600 bg-slate-800 hover:border-slate-500"
                                      }`}
                                      onClick={() => {
                                        setExpandedClass(
                                          expandedClass ===
                                            classItem.name.toLowerCase()
                                            ? null
                                            : classItem.name.toLowerCase(),
                                        );
                                      }}
                                    >
                                      <CardHeader className="flex items-center py-2">
                                        <div className="flex w-full items-center justify-between">
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-3">
                                              <h3 className="text-base font-semibold text-white">
                                                {classItem.name}
                                              </h3>
                                              <div className="flex gap-1.5">
                                                <DomainBadge
                                                  domain={classItem.domain_1}
                                                />
                                                <DomainBadge
                                                  domain={classItem.domain_2}
                                                />
                                              </div>
                                            </div>
                                            <p className="mt-1 truncate text-sm text-slate-400">
                                              {
                                                classShortDescriptions[
                                                  classItem.name.toLowerCase() as keyof typeof classShortDescriptions
                                                ]
                                              }
                                            </p>
                                          </div>
                                          <div className="ml-4 flex items-center gap-2">
                                            <button
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                field.onChange(
                                                  classItem.name.toLowerCase(),
                                                );
                                                form.setValue("subclass", "");
                                              }}
                                              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                                field.value ===
                                                classItem.name.toLowerCase()
                                                  ? "bg-sky-500 text-white"
                                                  : "bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white"
                                              }`}
                                            >
                                              {field.value ===
                                              classItem.name.toLowerCase()
                                                ? "Selected"
                                                : "Select"}
                                            </button>
                                            <div className="text-slate-400">
                                              {expandedClass ===
                                              classItem.name.toLowerCase() ? (
                                                <ChevronUp size={18} />
                                              ) : (
                                                <ChevronDown size={18} />
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </CardHeader>

                                      {expandedClass ===
                                        classItem.name.toLowerCase() && (
                                        <CardContent className="pt-0 pb-4">
                                          <div className="space-y-4">
                                            <p className="text-sm leading-relaxed text-slate-300">
                                              {formatBoldText(
                                                classItem.description,
                                              )}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                              <div>
                                                <span className="font-medium text-slate-400">
                                                  HP:
                                                </span>
                                                <span className="ml-2 text-white">
                                                  {classItem.hp}
                                                </span>
                                              </div>
                                              <div>
                                                <span className="font-medium text-slate-400">
                                                  Evasion:
                                                </span>
                                                <span className="ml-2 text-white">
                                                  {classItem.evasion}
                                                </span>
                                              </div>
                                            </div>

                                            <div>
                                              <span className="mb-2 block font-medium text-slate-400">
                                                Hope Feat:
                                              </span>
                                              <div className="rounded bg-slate-700/50 p-3">
                                                <h4 className="text-sm font-medium text-yellow-400">
                                                  {classItem.hope_feat_name}
                                                </h4>
                                                <p className="mt-1 text-sm text-slate-300">
                                                  {formatBoldText(
                                                    classItem.hope_feat_text,
                                                  )}
                                                </p>
                                              </div>
                                            </div>

                                            <div>
                                              <span className="mb-2 block font-medium text-slate-400">
                                                Subclasses:
                                              </span>
                                              <div className="flex gap-2">
                                                <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
                                                  {classItem.subclass_1}
                                                </span>
                                                <span className="rounded bg-slate-700 px-2 py-1 text-xs text-slate-300">
                                                  {classItem.subclass_2}
                                                </span>
                                              </div>
                                            </div>

                                            <div>
                                              <span className="mb-2 block font-medium text-slate-400">
                                                Starting Equipment:
                                              </span>
                                              <p className="text-sm text-slate-300">
                                                {classItem.items}
                                              </p>
                                            </div>
                                          </div>
                                        </CardContent>
                                      )}
                                    </Card>
                                  ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          key="class-subclass"
                          control={form.control}
                          name="subclass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-4 block text-lg font-semibold text-white">
                                Choose Your Subclass
                              </FormLabel>
                              <FormDescription className="mb-6 text-slate-400">
                                {!watchedClass
                                  ? "Select a class first to see available subclasses."
                                  : "Subclasses provide specialized abilities and define your character's specific focus within their class."}
                              </FormDescription>

                              {!watchedClass ? (
                                <div className="py-8 text-center text-slate-500">
                                  Select a class to see available subclasses
                                </div>
                              ) : (
                                <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                                  {availableSubclasses
                                    .sort((a, b) => {
                                      // Put selected subclass first
                                      const aSelected =
                                        field.value ===
                                        a.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-");
                                      const bSelected =
                                        field.value ===
                                        b.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-");
                                      if (aSelected && !bSelected) return -1;
                                      if (!aSelected && bSelected) return 1;
                                      return 0;
                                    })
                                    .map((subclass) => (
                                      <Card
                                        key={subclass.name
                                          .toLowerCase()
                                          .replace(/\s+/g, "-")}
                                        className={`cursor-pointer border py-2 transition-all duration-200 ${
                                          field.value ===
                                          subclass.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            ? "border-sky-500 bg-sky-500/10"
                                            : "border-slate-600 bg-slate-800 hover:border-slate-500"
                                        }`}
                                        onClick={() => {
                                          setExpandedSubclass(
                                            expandedSubclass ===
                                              subclass.name
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")
                                              ? null
                                              : subclass.name
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-"),
                                          );
                                        }}
                                      >
                                        <CardHeader className="flex items-center py-2">
                                          <div className="flex w-full items-center justify-between">
                                            <div className="min-w-0 flex-1">
                                              <h3 className="text-base font-semibold text-white">
                                                {subclass.name}
                                              </h3>
                                              <p className="mt-1 truncate text-sm text-slate-400">
                                                {subclass.description}
                                              </p>
                                            </div>
                                            <div className="ml-4 flex items-center gap-2">
                                              <button
                                                type="button"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  field.onChange(
                                                    subclass.name
                                                      .toLowerCase()
                                                      .replace(/\s+/g, "-"),
                                                  );
                                                }}
                                                className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                                  field.value ===
                                                  subclass.name
                                                    .toLowerCase()
                                                    .replace(/\s+/g, "-")
                                                    ? "bg-sky-500 text-white"
                                                    : "bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white"
                                                }`}
                                              >
                                                {field.value ===
                                                subclass.name
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-")
                                                  ? "Selected"
                                                  : "Select"}
                                              </button>
                                              <div className="text-slate-400">
                                                {expandedSubclass ===
                                                subclass.name
                                                  .toLowerCase()
                                                  .replace(/\s+/g, "-") ? (
                                                  <ChevronUp size={18} />
                                                ) : (
                                                  <ChevronDown size={18} />
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </CardHeader>

                                        {expandedSubclass ===
                                          subclass.name
                                            .toLowerCase()
                                            .replace(/\s+/g, "-") && (
                                          <CardContent className="pt-0 pb-4">
                                            <div className="space-y-4">
                                              <p className="text-sm leading-relaxed text-slate-300">
                                                {formatBoldText(
                                                  subclass.description,
                                                )}
                                              </p>

                                              {subclass.spellcast_trait && (
                                                <div>
                                                  <span className="font-medium text-slate-400">
                                                    Spellcast Trait:
                                                  </span>
                                                  <span className="ml-2 text-white">
                                                    {subclass.spellcast_trait}
                                                  </span>
                                                </div>
                                              )}

                                              {subclass.foundations &&
                                                subclass.foundations.length >
                                                  0 && (
                                                  <div>
                                                    <span className="mb-2 block font-medium text-slate-400">
                                                      Foundations:
                                                    </span>
                                                    <div className="space-y-2">
                                                      {subclass.foundations.map(
                                                        (foundation, index) => (
                                                          <div
                                                            key={index}
                                                            className="rounded bg-slate-700/50 p-3"
                                                          >
                                                            <h4 className="text-sm font-medium text-yellow-400">
                                                              {foundation.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-slate-300">
                                                              {formatBoldText(
                                                                foundation.text,
                                                              )}
                                                            </p>
                                                          </div>
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                              {subclass.specializations &&
                                                subclass.specializations
                                                  .length > 0 && (
                                                  <div>
                                                    <span className="mb-2 block font-medium text-slate-400">
                                                      Specializations:
                                                    </span>
                                                    <div className="space-y-2">
                                                      {subclass.specializations.map(
                                                        (spec, index) => (
                                                          <div
                                                            key={index}
                                                            className="rounded bg-slate-700/50 p-3"
                                                          >
                                                            <h4 className="text-sm font-medium text-yellow-400">
                                                              {spec.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-slate-300">
                                                              {formatBoldText(
                                                                spec.text,
                                                              )}
                                                            </p>
                                                          </div>
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                )}

                                              {subclass.masteries &&
                                                subclass.masteries.length >
                                                  0 && (
                                                  <div>
                                                    <span className="mb-2 block font-medium text-slate-400">
                                                      Masteries:
                                                    </span>
                                                    <div className="space-y-2">
                                                      {subclass.masteries.map(
                                                        (mastery, index) => (
                                                          <div
                                                            key={index}
                                                            className="rounded bg-slate-700/50 p-3"
                                                          >
                                                            <h4 className="text-sm font-medium text-yellow-400">
                                                              {mastery.name}
                                                            </h4>
                                                            <p className="mt-1 text-sm text-slate-300">
                                                              {formatBoldText(
                                                                mastery.text,
                                                              )}
                                                            </p>
                                                          </div>
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </CardContent>
                                        )}
                                      </Card>
                                    ))}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {activeSection === "heritage" && (
                      <div className="space-y-6">
                        <FormField
                          key="heritage-ancestry"
                          control={form.control}
                          name="ancestry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-4 block text-lg font-semibold text-white">
                                Choose Your Ancestry
                              </FormLabel>
                              <FormDescription className="mb-6 text-slate-400">
                                Your ancestry determines your character&apos;s
                                biological heritage and inherent traits.
                              </FormDescription>

                              <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                                {Ancestries.sort((a, b) => {
                                  // Put selected ancestry first
                                  const aSelected =
                                    field.value === a.name.toLowerCase();
                                  const bSelected =
                                    field.value === b.name.toLowerCase();
                                  if (aSelected && !bSelected) return -1;
                                  if (!aSelected && bSelected) return 1;
                                  return 0;
                                }).map((ancestry) => (
                                  <Card
                                    key={ancestry.name.toLowerCase()}
                                    className={`cursor-pointer border py-2 transition-all duration-200 ${
                                      field.value ===
                                      ancestry.name.toLowerCase()
                                        ? "border-sky-500 bg-sky-500/10"
                                        : "border-slate-600 bg-slate-800 hover:border-slate-500"
                                    }`}
                                    onClick={() => {
                                      setExpandedAncestry(
                                        expandedAncestry ===
                                          ancestry.name.toLowerCase()
                                          ? null
                                          : ancestry.name.toLowerCase(),
                                      );
                                    }}
                                  >
                                    <CardHeader className="flex items-center py-2">
                                      <div className="flex w-full items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                          <h3 className="text-base font-semibold text-white">
                                            {ancestry.name}
                                          </h3>
                                          <p className="mt-1 truncate text-sm text-slate-400">
                                            {ancestry.description.split(".")[0]}
                                            .
                                          </p>
                                        </div>
                                        <div className="ml-4 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              field.onChange(
                                                ancestry.name.toLowerCase(),
                                              );
                                            }}
                                            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                              field.value ===
                                              ancestry.name.toLowerCase()
                                                ? "bg-sky-500 text-white"
                                                : "bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white"
                                            }`}
                                          >
                                            {field.value ===
                                            ancestry.name.toLowerCase()
                                              ? "Selected"
                                              : "Select"}
                                          </button>
                                          <div className="text-slate-400">
                                            {expandedAncestry ===
                                            ancestry.name.toLowerCase() ? (
                                              <ChevronUp size={18} />
                                            ) : (
                                              <ChevronDown size={18} />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </CardHeader>

                                    {expandedAncestry ===
                                      ancestry.name.toLowerCase() && (
                                      <CardContent className="pt-0 pb-4">
                                        <div className="space-y-4">
                                          <p className="text-sm leading-relaxed text-slate-300">
                                            {formatBoldText(
                                              ancestry.description,
                                            )}
                                          </p>

                                          {ancestry.feats &&
                                            ancestry.feats.length > 0 && (
                                              <div>
                                                <span className="mb-2 block font-medium text-slate-400">
                                                  Ancestry Feats:
                                                </span>
                                                <div className="space-y-2">
                                                  {ancestry.feats.map(
                                                    (feat, index) => (
                                                      <div
                                                        key={index}
                                                        className="rounded bg-slate-700/50 p-3"
                                                      >
                                                        <h4 className="text-sm font-medium text-yellow-400">
                                                          {feat.name}
                                                        </h4>
                                                        <p className="mt-1 text-sm text-slate-300">
                                                          {formatBoldText(
                                                            feat.text,
                                                          )}
                                                        </p>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          key="heritage-community"
                          control={form.control}
                          name="community"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-4 block text-lg font-semibold text-white">
                                Choose Your Community
                              </FormLabel>
                              <FormDescription className="mb-6 text-slate-400">
                                Your community shapes your character&apos;s
                                cultural background and social connections.
                              </FormDescription>

                              <div className="max-h-96 space-y-3 overflow-y-auto pr-2">
                                {Communities.sort((a, b) => {
                                  // Put selected community first
                                  const aSelected =
                                    field.value === a.name.toLowerCase();
                                  const bSelected =
                                    field.value === b.name.toLowerCase();
                                  if (aSelected && !bSelected) return -1;
                                  if (!aSelected && bSelected) return 1;
                                  return 0;
                                }).map((community) => (
                                  <Card
                                    key={community.name.toLowerCase()}
                                    className={`cursor-pointer border py-2 transition-all duration-200 ${
                                      field.value ===
                                      community.name.toLowerCase()
                                        ? "border-sky-500 bg-sky-500/10"
                                        : "border-slate-600 bg-slate-800 hover:border-slate-500"
                                    }`}
                                    onClick={() => {
                                      setExpandedCommunity(
                                        expandedCommunity ===
                                          community.name.toLowerCase()
                                          ? null
                                          : community.name.toLowerCase(),
                                      );
                                    }}
                                  >
                                    <CardHeader className="flex items-center py-2">
                                      <div className="flex w-full items-center justify-between">
                                        <div className="min-w-0 flex-1">
                                          <h3 className="text-base font-semibold text-white">
                                            {community.name}
                                          </h3>
                                          <p className="mt-1 truncate text-sm text-slate-400">
                                            {community.note}
                                          </p>
                                        </div>
                                        <div className="ml-4 flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              field.onChange(
                                                community.name.toLowerCase(),
                                              );
                                            }}
                                            className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                                              field.value ===
                                              community.name.toLowerCase()
                                                ? "bg-sky-500 text-white"
                                                : "bg-slate-600 text-slate-300 hover:bg-slate-500 hover:text-white"
                                            }`}
                                          >
                                            {field.value ===
                                            community.name.toLowerCase()
                                              ? "Selected"
                                              : "Select"}
                                          </button>
                                          <div className="text-slate-400">
                                            {expandedCommunity ===
                                            community.name.toLowerCase() ? (
                                              <ChevronUp size={18} />
                                            ) : (
                                              <ChevronDown size={18} />
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </CardHeader>

                                    {expandedCommunity ===
                                      community.name.toLowerCase() && (
                                      <CardContent className="pt-0 pb-4">
                                        <div className="space-y-4">
                                          <p className="text-sm leading-relaxed text-slate-300">
                                            {formatBoldText(
                                              community.description,
                                            )}
                                          </p>

                                          <div>
                                            <span className="mb-2 block font-medium text-slate-400">
                                              Typical Traits:
                                            </span>
                                            <p className="text-sm text-slate-300 italic">
                                              {community.note}
                                            </p>
                                          </div>

                                          {community.feats &&
                                            community.feats.length > 0 && (
                                              <div>
                                                <span className="mb-2 block font-medium text-slate-400">
                                                  Community Feats:
                                                </span>
                                                <div className="space-y-2">
                                                  {community.feats.map(
                                                    (feat, index) => (
                                                      <div
                                                        key={index}
                                                        className="rounded bg-slate-700/50 p-3"
                                                      >
                                                        <h4 className="text-sm font-medium text-yellow-400">
                                                          {feat.name}
                                                        </h4>
                                                        <p className="mt-1 text-sm text-slate-300">
                                                          {formatBoldText(
                                                            feat.text,
                                                          )}
                                                        </p>
                                                      </div>
                                                    ),
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </CardContent>
                                    )}
                                  </Card>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {activeSection === "experiences" && (
                      <div className="space-y-6">
                        <div className="mb-4 text-lg font-bold text-white">
                          Create Your Experiences
                        </div>
                        <div className="text-slate-400">
                          An <b>Experience</b> is a word or phrase used to
                          encapsulate a specific set of skills, personality
                          traits, or aptitudes your character has acquired over
                          the course of their life. When your PC makes a move,
                          they can spend a Hope to add a relevant
                          Experience&apos;s modifier to an action or reaction
                          roll.
                        </div>
                        <div className="mb-4 rounded-lg border border-sky-600 bg-sky-900/20 p-3">
                          <p className="text-sm text-sky-400">
                            At level {characterLevel}, your character has{" "}
                            {experienceCount} experiences.
                            {characterLevel > 1 && (
                              <span className="text-slate-300">
                                {" "}
                                (Started with 2 at level 1
                                {characterLevel >= 2 &&
                                  ", gained 1 more at level 2"}
                                {characterLevel >= 5 &&
                                  ", gained 1 more at level 5"}
                                {characterLevel >= 8 &&
                                  ", gained 1 more at level 8"}
                                )
                              </span>
                            )}
                          </p>
                        </div>
                        {Array.from({ length: experienceCount }, (_, index) => {
                          // Determine which level this experience was gained at
                          const getExperienceLevel = (index: number) => {
                            if (index < 2) return 1; // First 2 experiences from level 1
                            if (index === 2) return 2; // 3rd experience from level 2
                            if (index === 3) return 5; // 4th experience from level 5
                            if (index === 4) return 8; // 5th experience from level 8
                            return 1; // fallback
                          };

                          const experienceLevel = getExperienceLevel(index);
                          const isNewExperience = experienceLevel > 1;

                          return (
                            <FormField
                              key={`experiences-${index}`}
                              control={form.control}
                              name={`experiences.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-white">
                                    Experience {index + 1}
                                    {isNewExperience && (
                                      <span className="ml-2 text-sm text-yellow-400">
                                        (gained at level {experienceLevel})
                                      </span>
                                    )}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="What experience defines your character?"
                                      {...field}
                                      value={field.value ?? ""}
                                      onChange={(e) => {
                                        const currentExperiences =
                                          form.getValues("experiences") ?? [];
                                        const newExperiences = [
                                          ...currentExperiences,
                                        ];
                                        newExperiences[index] = e.target.value;
                                        form.setValue(
                                          "experiences",
                                          newExperiences,
                                        );
                                      }}
                                      className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          );
                        })}
                        <div className="text-slate-400">
                          <b>Backgrounds like:</b> Bodyguard, Con Artist,
                          Merchant, Noble, Pirate, Scholar, Thief
                          <br />
                          <br />
                          <b>Specializations like:</b> Magical Historian,
                          Navigator, Sharpshooter, Swashbuckler, Mapmaker
                          <br />
                          <br />
                          <b>Skills like:</b> Barter, Repair, Tracking, Quick
                          Hands, Incredible Strength
                          <br />
                          <br />
                          <b>Phrases like:</b> Chef to the Royal Family, I
                          Won&apos;t Let You Down, Street Doctor, This Is Not A
                          Negotiation, I&apos;ll Catch You
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
