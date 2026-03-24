import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "elevated";
  onClick?: () => void;
}

export function Card({ children, className, variant = "default", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl transition-all duration-300",
        variant === "default" && "bg-white/[0.03] border border-white/[0.08]",
        variant === "glass" && "bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl",
        variant === "elevated" && "bg-white/[0.06] border border-white/[0.12] shadow-lg shadow-black/10",
        onClick && "cursor-pointer hover:bg-white/[0.05] active:scale-[0.99]",
        className
      )}
    >
      {children}
    </div>
  );
}
