import { Button } from "@/components/ui/button";

export type ChangeCategoryButtonProps = {
  onClick: () => void;
};

export default function ChangeCategoryButton({ onClick }: ChangeCategoryButtonProps) {
  return (
    <Button type="button" variant="ghost" onClick={onClick} className="gap-2 self-start">
      <span aria-hidden="true">←</span>
      <span>Change category</span>
    </Button>
  );
}
