import PackageBuilder from "@/components/PackageBuilder";

export type MixingMasteringBuilderProps = {
  onChangeCategory?: () => void;
};

export default function MixingMasteringBuilder({ onChangeCategory }: MixingMasteringBuilderProps) {
  return <PackageBuilder {...(onChangeCategory ? { onChangeCategory } : {})} />;
}
