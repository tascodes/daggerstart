"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { getCharacterSRDData } from "~/lib/utils/srd-mapping";

interface Character {
  id: string;
  class: string;
  subclass: string;
  level: number;
}

interface ClassFeaturesProps {
  character: Character;
}

const ClassFeatures = ({ character }: ClassFeaturesProps) => {
  // Get SRD data for character's class and subclass
  const { classData, subclassData } = getCharacterSRDData(
    character.class,
    character.subclass,
  );

  if (!classData && !subclassData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Class Features */}
      {classData && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl text-white">
                {classData.name} Features
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-slate-700 text-slate-300"
              >
                Class
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Hope Feat */}
            <div className="rounded-lg bg-slate-700 p-4">
              <div className="mb-2 flex items-center gap-2">
                <h4 className="font-semibold text-yellow-400">
                  {classData.hope_feat_name}
                </h4>
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-xs text-yellow-400"
                >
                  Hope
                </Badge>
              </div>
              <p className="text-sm whitespace-pre-line text-slate-300">
                {classData.hope_feat_text}
              </p>
            </div>

            {/* Class Feats */}
            {classData.class_feats && classData.class_feats.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Class Feats</h4>
                {classData.class_feats.map((feat, index) => (
                  <div key={index} className="rounded-lg bg-slate-700 p-4">
                    <h5 className="mb-2 font-semibold text-sky-400">
                      {feat.name}
                    </h5>
                    <p className="text-sm whitespace-pre-line text-slate-300">
                      {feat.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subclass Features */}
      {subclassData && (
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl text-white">
                {subclassData.name}
              </CardTitle>
              <Badge
                variant="secondary"
                className="bg-slate-700 text-slate-300"
              >
                Subclass
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subclass Description */}
            <div className="rounded-lg bg-slate-700 p-4">
              <p className="text-sm text-slate-300">
                {subclassData.description}
              </p>
            </div>

            {/* Spellcast Trait */}
            {subclassData.spellcast_trait && (
              <div className="rounded-lg bg-slate-700 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <h5 className="font-semibold text-purple-400">
                    Spellcast Trait
                  </h5>
                </div>
                <p className="text-sm text-slate-300">
                  {subclassData.spellcast_trait}
                </p>
              </div>
            )}

            {/* Foundation Features */}
            {subclassData.foundations &&
              subclassData.foundations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">
                    Foundation Features
                  </h4>
                  {subclassData.foundations.map((foundation, index) => (
                    <div key={index} className="rounded-lg bg-slate-700 p-4">
                      <h5 className="mb-2 font-semibold text-green-400">
                        {foundation.name}
                      </h5>
                      <p className="text-sm whitespace-pre-line text-slate-300">
                        {foundation.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            {/* Extras (for detailed subclass rules) */}
            {subclassData.extras && (
              <div className="rounded-lg bg-slate-700 p-4">
                <h5 className="mb-2 font-semibold text-slate-300">
                  Additional Rules
                </h5>
                <div className="text-sm whitespace-pre-line text-slate-300">
                  {subclassData.extras}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassFeatures;
