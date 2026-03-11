import PackageBuilder from "@/components/PackageBuilder";

export type MixingAndMasteringBuilderProps = {
  onChangeCategory?: () => void;
};

export default function MixingAndMasteringBuilder({ onChangeCategory }: MixingAndMasteringBuilderProps) {
  return <PackageBuilder {...(onChangeCategory ? { onChangeCategory } : {})} />;
}
