"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { subclassesByClass } from "./constants";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
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
  level: z
    .number()
    .min(1, "Level must be at least 1")
    .max(10, "Level must be at most 10"),
  experience1: z.string().max(50, "Experience must be less than 50 characters"),
  experience2: z.string().max(50, "Experience must be less than 50 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function NewCharacterPage() {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("getting-started");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      pronouns: "",
      class: "",
      subclass: "",
      ancestry: "",
      community: "",
      level: 1,
      experience1: "",
      experience2: "",
    },
  });

  const watchedClass = form.watch("class");

  const createCharacter = api.character.create.useMutation({
    onSuccess: () => {
      router.push("/");
    },
  });

  const onSubmit = (data: FormData) => {
    createCharacter.mutate({
      name: data.name,
      pronouns: data.pronouns,
      class: data.class,
      subclass: data.subclass,
      ancestry: data.ancestry,
      community: data.community,
      level: data.level,
      experience1: data.experience1,
      experience2: data.experience2,
    });
  };

  const availableSubclasses =
    (watchedClass &&
      subclassesByClass[watchedClass as keyof typeof subclassesByClass]) ||
    [];

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Create New Character
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
                  disabled={createCharacter.isPending}
                  className="w-full bg-sky-500 text-white hover:bg-yellow-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50"
                >
                  {createCharacter.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </div>
                  ) : (
                    "Create Character"
                  )}
                </Button>
              </div>
            </div>

            {/* Right Content - Form Section */}
            <div className="flex-1">
              <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
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
                          <FormLabel className="text-white">Pronouns</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., they/them, she/her, he/him"
                              {...field}
                              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            Optional: How would you like others to refer to your
                            character?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      key="getting-started-level"
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Level</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                                <SelectItem
                                  key={level}
                                  value={level.toString()}
                                  className="text-white focus:bg-slate-600"
                                >
                                  Level {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-slate-400">
                            Choose your character&apos;s starting level (1-10).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                          <FormLabel className="text-white">Class</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              form.setValue("subclass", "");
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              <SelectItem
                                value="bard"
                                className="text-white focus:bg-slate-600"
                              >
                                Bard
                              </SelectItem>
                              <SelectItem
                                value="druid"
                                className="text-white focus:bg-slate-600"
                              >
                                Druid
                              </SelectItem>
                              <SelectItem
                                value="guardian"
                                className="text-white focus:bg-slate-600"
                              >
                                Guardian
                              </SelectItem>
                              <SelectItem
                                value="ranger"
                                className="text-white focus:bg-slate-600"
                              >
                                Ranger
                              </SelectItem>
                              <SelectItem
                                value="rogue"
                                className="text-white focus:bg-slate-600"
                              >
                                Rogue
                              </SelectItem>
                              <SelectItem
                                value="seraph"
                                className="text-white focus:bg-slate-600"
                              >
                                Seraph
                              </SelectItem>
                              <SelectItem
                                value="sorcerer"
                                className="text-white focus:bg-slate-600"
                              >
                                Sorcerer
                              </SelectItem>
                              <SelectItem
                                value="warrior"
                                className="text-white focus:bg-slate-600"
                              >
                                Warrior
                              </SelectItem>
                              <SelectItem
                                value="wizard"
                                className="text-white focus:bg-slate-600"
                              >
                                Wizard
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-slate-400">
                            Your character&apos;s primary class determines their
                            core abilities and playstyle.
                          </FormDescription>
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
                          <FormLabel className="text-white">Subclass</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!watchedClass}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={`border-slate-600 bg-slate-700 text-white ${!watchedClass ? "cursor-not-allowed opacity-50" : ""}`}
                              >
                                <SelectValue
                                  placeholder={
                                    !watchedClass
                                      ? "Select a class first"
                                      : "Select a subclass"
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              {availableSubclasses.map((subclass) => (
                                <SelectItem
                                  key={subclass.value}
                                  value={subclass.value}
                                  className="text-white focus:bg-slate-600"
                                >
                                  {subclass.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-slate-400">
                            Subclasses provide specialized abilities and define
                            your character&apos;s specific focus within their
                            class.
                          </FormDescription>
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
                          <FormLabel className="text-white">Ancestry</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                                <SelectValue placeholder="Select an ancestry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              <SelectItem
                                value="drakona"
                                className="text-white focus:bg-slate-600"
                              >
                                Drakona
                              </SelectItem>
                              <SelectItem
                                value="dwarf"
                                className="text-white focus:bg-slate-600"
                              >
                                Dwarf
                              </SelectItem>
                              <SelectItem
                                value="elf"
                                className="text-white focus:bg-slate-600"
                              >
                                Elf
                              </SelectItem>
                              <SelectItem
                                value="faerie"
                                className="text-white focus:bg-slate-600"
                              >
                                Faerie
                              </SelectItem>
                              <SelectItem
                                value="firbolg"
                                className="text-white focus:bg-slate-600"
                              >
                                Firbolg
                              </SelectItem>
                              <SelectItem
                                value="galappa"
                                className="text-white focus:bg-slate-600"
                              >
                                Galappa
                              </SelectItem>
                              <SelectItem
                                value="giant"
                                className="text-white focus:bg-slate-600"
                              >
                                Giant
                              </SelectItem>
                              <SelectItem
                                value="goblin"
                                className="text-white focus:bg-slate-600"
                              >
                                Goblin
                              </SelectItem>
                              <SelectItem
                                value="halfling"
                                className="text-white focus:bg-slate-600"
                              >
                                Halfling
                              </SelectItem>
                              <SelectItem
                                value="human"
                                className="text-white focus:bg-slate-600"
                              >
                                Human
                              </SelectItem>
                              <SelectItem
                                value="katari"
                                className="text-white focus:bg-slate-600"
                              >
                                Katari
                              </SelectItem>
                              <SelectItem
                                value="orc"
                                className="text-white focus:bg-slate-600"
                              >
                                Orc
                              </SelectItem>
                              <SelectItem
                                value="ribbet"
                                className="text-white focus:bg-slate-600"
                              >
                                Ribbet
                              </SelectItem>
                              <SelectItem
                                value="simiah"
                                className="text-white focus:bg-slate-600"
                              >
                                Simiah
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-slate-400">
                            Your ancestry determines your character&apos;s
                            biological heritage and inherent traits.
                          </FormDescription>
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
                          <FormLabel className="text-white">
                            Community
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-slate-600 bg-slate-700 text-white">
                                <SelectValue placeholder="Select a community" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="border-slate-600 bg-slate-700">
                              <SelectItem
                                value="highborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Highborne
                              </SelectItem>
                              <SelectItem
                                value="loreborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Loreborne
                              </SelectItem>
                              <SelectItem
                                value="orderborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Orderborne
                              </SelectItem>
                              <SelectItem
                                value="ridgeborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Ridgeborne
                              </SelectItem>
                              <SelectItem
                                value="seaborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Seaborne
                              </SelectItem>
                              <SelectItem
                                value="slyborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Slyborne
                              </SelectItem>
                              <SelectItem
                                value="underborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Underborne
                              </SelectItem>
                              <SelectItem
                                value="wanderborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Wanderborne
                              </SelectItem>
                              <SelectItem
                                value="wildborne"
                                className="text-white focus:bg-slate-600"
                              >
                                Wildborne
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-slate-400">
                            Your community shapes your character&apos;s cultural
                            background and social connections.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {activeSection === "experiences" && (
                  <div className="space-y-6">
                    <FormField
                      key="experiences-experience1"
                      control={form.control}
                      name="experience1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Experience 1
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe a formative experience"
                              {...field}
                              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      key="experiences-experience2"
                      control={form.control}
                      name="experience2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">
                            Experience 2
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Describe another formative experience"
                              {...field}
                              className="border-slate-600 bg-slate-700 text-white placeholder-slate-400"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            Backgrounds like: Bodyguard, Con Artist, Merchant,
                            Noble, Pirate, Scholar, Thief
                            <br />
                            Specializations like: Magical Historian, Navigator,
                            Sharpshooter, Swashbuckler, Mapmaker
                            <br />
                            Skills like: Barter, Repair, Tracking, Quick Hands,
                            Incredible Strength
                            <br />
                            Phrases like: Chef to the Royal Family, I Won&apos;t
                            Let You Down, Street Doctor, This Is Not A
                            Negotiation, I&apos;ll Catch You
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
