import * as React from "react";

import AudioEditingBuilder from "@/components/build-your-package/AudioEditingBuilder";
import AudioRepairBuilder from "@/components/build-your-package/AudioRepairBuilder";
import MixingMasteringBuilder from "@/components/build-your-package/MixingMasteringBuilder";
import ChangeCategoryButton from "@/components/build-your-package/ChangeCategoryButton";

type BuilderCategory = "mixingMastering" | "audioEditing" | "audioRepair";

const CATEGORY_META: Record<BuilderCategory, { title: string; description: string }> = {
  mixingMastering: {
    title: "Mixing & Mastering",
    description: "Full package builder for singles/albums, editing add-ons, exports, and extras.",
  },
  audioEditing: {
    title: "Audio Editing",
    description: "Per-track editing services with track-length surcharges and extras.",
  },
  audioRepair: {
    title: "Audio Repair",
    description: "Per-track repair services (hiss, clicks/pops, etc.) with track-length surcharges and extras.",
  },
};

export default function PackageBuilderIsland() {
  const [activeCategory, setActiveCategory] = React.useState<BuilderCategory | null>(null);
  const [isChoosingCategory, setIsChoosingCategory] = React.useState(true);

  const onChangeCategory = React.useCallback(() => {
    setIsChoosingCategory(true);
  }, []);

  return (
    <div className="space-y-6">
      {isChoosingCategory && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Choose a category</h2>
            <p className="text-muted-foreground">
              Start by selecting the type of service you want to price out.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {(Object.keys(CATEGORY_META) as BuilderCategory[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setActiveCategory(key);
                  setIsChoosingCategory(false);
                }}
                className="rounded-xl border border-border p-5 text-left hover:bg-muted/40 hover:border-primary transition"
              >
                <div className="space-y-1">
                  <div className="font-semibold">{CATEGORY_META[key].title}</div>
                  <div className="text-sm text-muted-foreground">{CATEGORY_META[key].description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!isChoosingCategory && activeCategory && (
        <div className="space-y-2">
          <ChangeCategoryButton onClick={onChangeCategory} />
          <h2 className="text-2xl font-semibold">{CATEGORY_META[activeCategory].title}</h2>
          <p className="text-sm text-muted-foreground">{CATEGORY_META[activeCategory].description}</p>
        </div>
      )}

      <div className={isChoosingCategory ? "hidden" : "block"}>
        <div className={activeCategory === "mixingMastering" ? "block" : "hidden"}>
          <MixingMasteringBuilder onChangeCategory={onChangeCategory} />
        </div>
        <div className={activeCategory === "audioEditing" ? "block" : "hidden"}>
          <AudioEditingBuilder onChangeCategory={onChangeCategory} />
        </div>
        <div className={activeCategory === "audioRepair" ? "block" : "hidden"}>
          <AudioRepairBuilder onChangeCategory={onChangeCategory} />
        </div>
      </div>
    </div>
  );
}
