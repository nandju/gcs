import { Container as ContainerIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] flex-1 place-items-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <span className="grid size-12 place-items-center rounded-xl bg-accent text-white">
          <ContainerIcon className="size-6 animate-pulse" strokeWidth={2.2} />
        </span>
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent" />
      </div>
    </div>
  );
}
