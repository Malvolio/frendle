import { cn } from "@/lib/utils";
import { FC, PropsWithChildren } from "react";

export const ThickBorderShadowDiv: FC<
  PropsWithChildren<{ className?: string }>
> = ({ className, children }) => (
  <div
    className={cn("border-4 border-black rounded-lg p-6 bg-white", className)}
    style={{ boxShadow: "8px 8px 0px 0px black" }}
  >
    {children}
  </div>
);
