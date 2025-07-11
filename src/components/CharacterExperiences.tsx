"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Lightbulb } from "lucide-react";

interface Experience {
  id: string;
  name: string;
  bonus: number;
}

interface CharacterExperiencesProps {
  experiences?: Experience[];
}

export default function CharacterExperiences({
  experiences,
}: CharacterExperiencesProps) {
  const hasExperiences = experiences && experiences.length > 0;

  return (
    <Card className="border-slate-700 bg-slate-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Experiences
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasExperiences ? (
          <div className="py-8 text-center">
            <p className="text-slate-400">No experiences recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {experiences?.map((experience, index) => (
              <div
                key={experience.id}
                className="rounded-lg border border-slate-600 bg-slate-700 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${index === 0 ? "bg-sky-400" : "bg-yellow-400"}`}
                  ></div>
                  <span className="text-sm font-medium text-slate-300">
                    Experience {index + 1}
                  </span>
                </div>
                <p className="text-white">
                  {experience.name} +{experience.bonus}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
