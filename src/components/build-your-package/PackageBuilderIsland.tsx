import * as React from "react";

import AudioEditingBuilder from "@/components/build-your-package/AudioEditingBuilder";
import AudioRepairBuilder from "@/components/build-your-package/AudioRepairBuilder";
import MixingAndMasteringBuilder from "@/components/build-your-package/MixingAndMasteringBuilder";
import ChangeCategoryButton from "@/components/build-your-package/ChangeCategoryButton";

type BuilderCategory = "mixingAndMastering" | "audioEditing" | "audioRepair";

const CATEGORY_HASH_TO_KEY: Record<string, BuilderCategory> = {
  "mixing-and-mastering": "mixingAndMastering",
  "audio-editing": "audioEditing",
  "audio-repair": "audioRepair",
};

const CATEGORY_META: Record<BuilderCategory, { title: string; description: string; badge?: string }> = {
  mixingAndMastering: {
    title: "Mixing & Mastering",
    description: "Full package builder for singles/albums, editing add-ons, exports, and extras.",
    badge: "Most Popular",
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

  const syncCategoryFromHash = React.useCallback(() => {
    const hash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
    const matchingCategory = CATEGORY_HASH_TO_KEY[hash];

    if (!matchingCategory) {
      return;
    }

    setActiveCategory(matchingCategory);
    setIsChoosingCategory(false);
  }, []);

  React.useEffect(() => {
    syncCategoryFromHash();
    window.addEventListener("hashchange", syncCategoryFromHash);

    return () => {
      window.removeEventListener("hashchange", syncCategoryFromHash);
    };
  }, [syncCategoryFromHash]);

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
                className="relative rounded-xl border border-border p-5 text-left hover:bg-muted/40 hover:border-primary cursor-pointer transition"
              >
                {CATEGORY_META[key].badge && (
                  <span className="absolute -top-3 right-4 z-10 inline-block rounded-md bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    {CATEGORY_META[key].badge}
                  </span>
                )}
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
        <div className={activeCategory === "mixingAndMastering" ? "block" : "hidden"}>
          <MixingAndMasteringBuilder onChangeCategory={onChangeCategory} />
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
