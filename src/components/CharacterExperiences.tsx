"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Lightbulb, Edit2, Check, X } from "lucide-react";
import { api } from "~/trpc/react";

interface Experience {
  id: string;
  name: string;
  bonus: number;
}

interface CharacterExperiencesProps {
  experiences?: Experience[];
  isOwner?: boolean;
  onUpdate?: () => void;
}

export default function CharacterExperiences({
  experiences,
  isOwner = false,
  onUpdate,
}: CharacterExperiencesProps) {
  const hasExperiences = experiences && experiences.length > 0;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const updateExperienceBonus = api.character.updateExperienceBonus.useMutation({
    onSuccess: () => {
      setEditingId(null);
      onUpdate?.();
    },
    onError: (error) => {
      console.error("Failed to update experience bonus:", error);
    },
  });

  const handleEdit = (experience: Experience) => {
    setEditingId(experience.id);
    setEditValue(experience.bonus);
  };

  const handleSave = () => {
    if (editingId) {
      updateExperienceBonus.mutate({
        experienceId: editingId,
        bonus: editValue,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue(0);
  };

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
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-white">
                    <span>{experience.name}</span>
                    {editingId === experience.id ? (
                      <div className="flex items-center gap-2">
                        <span>+</span>
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                          min={0}
                          max={10}
                          className="w-16 h-8 border-slate-500 bg-slate-600 text-white text-center"
                        />
                      </div>
                    ) : (
                      <span className="font-semibold text-yellow-400">
                        +{experience.bonus}
                      </span>
                    )}
                  </div>
                  {isOwner && (
                    <div className="flex items-center gap-1">
                      {editingId === experience.id ? (
                        <>
                          <Button
                            onClick={handleSave}
                            disabled={updateExperienceBonus.isPending}
                            size="sm"
                            className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCancel}
                            disabled={updateExperienceBonus.isPending}
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 border-slate-500 bg-slate-600 hover:bg-slate-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleEdit(experience)}
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-600"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
