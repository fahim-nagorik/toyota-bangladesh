import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
  dark = false,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Use the inverted glass recipe on the dark Technology band. */
  dark?: boolean;
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        dark ? "glass-dark" : "glass",
        "rounded-[24px]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
