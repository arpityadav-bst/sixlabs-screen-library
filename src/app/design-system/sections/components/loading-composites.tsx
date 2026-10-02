// The skeleton composites, each laid out like the part it stands in for: a job card (title, two lines, the
// terminal block, the tag panel), a list row and an avatar with two lines. Built from the four shapes and
// the system Card, so they are the same parts a view would use.
import { Card } from "@/components/design-system/Card";
import { Skeleton, SkeletonGroup } from "@/components/design-system/Skeleton";

export function JobCardSkeleton({ terminal = 300 }: { terminal?: number }) {
  return (
    <Card tone="surface" size="feature" className="w-[340px] max-w-full">
      <SkeletonGroup label="Loading the job">
        <span data-pin="title" className="block">
          <Skeleton shape="title" />
        </span>
        <span data-pin="lines" className="mt-3 block">
          <Skeleton lines={2} />
        </span>
        <span data-pin="terminal" className="mt-5 block">
          <Skeleton shape="rect" height={terminal} radius={16} />
        </span>
        <span data-pin="tags" className="mt-4 block">
          <Skeleton shape="rect" height={44} radius={12} />
        </span>
      </SkeletonGroup>
    </Card>
  );
}

export function ListRowSkeleton() {
  return (
    <Card tone="surface" size="row" className="w-full">
      <SkeletonGroup label="Loading the row" className="flex w-full items-center gap-3">
        <Skeleton shape="circle" width={32} />
        <span className="min-w-0 flex-1">
          <Skeleton width="55%" />
        </span>
        <Skeleton width={48} />
      </SkeletonGroup>
    </Card>
  );
}

export function AvatarSkeleton() {
  return (
    <SkeletonGroup label="Loading the profile" className="flex w-full items-center gap-3">
      <Skeleton shape="circle" />
      <span className="min-w-0 flex-1">
        <Skeleton width="45%" />
        <Skeleton width="70%" className="mt-2.5" />
      </span>
    </SkeletonGroup>
  );
}
