import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";
import { motion } from "motion/react";
import React, {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from "react";

export interface PaneStyle {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

const MovablePaneStyles = ({
  paneStyles,
  setPaneStyles,
  panes: components,
  children,
}: PropsWithChildren<{
  paneStyles: Record<string, PaneStyle>;
  setPaneStyles: Dispatch<SetStateAction<Record<string, PaneStyle>>>;
  panes: Record<string, JSX.Element>;
}>) => {
  const [resizing, setResizing] = useState(false);
  const updateBlock = (id: string, updates: Partial<PaneStyle>) => {
    setPaneStyles((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
  };

  const handleDrag = (id: string, info: any) => {
    updateBlock(id, { x: info.point.x, y: info.point.y });
  };

  const handleResize = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setResizing(true);
    const paneStyle = paneStyles[id];
    if (!paneStyle) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = paneStyle.width;
    const startHeight = paneStyle.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(100, startWidth + (e.clientX - startX));
      const newHeight = Math.max(80, startHeight + (e.clientY - startY));
      updateBlock(id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const parentRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={parentRef} className="w-full flex-1 relative overflow-hidden">
      {Object.entries(paneStyles).map(([id, paneStyle]) => (
        <motion.div
          key={id}
          drag={!resizing}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={parentRef}
          onDrag={(_, info) => handleDrag(id, info)}
          className={cn(
            `absolute rounded-md shadow-lg border border-[#666161] bg-[#ebe3cf] select-none overflow-hidden h-auto p-4`,
            { "cursor-move": !resizing, "cursor-se-resize": resizing }
          )}
          style={{
            ...paneStyle,
          }}
          whileHover={{ scale: 1.02 }}
          whileDrag={{ scale: 1.05, rotate: 2 }}
        >
          {/* Block Content */}
          {components[id]}

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-black bg-opacity-30 rounded-tl-md flex items-center justify-center hover:bg-opacity-50 transition-all"
            onMouseDown={(e) => handleResize(id, e)}
          >
            <Maximize2 size={12} className="text-white rotate-90" />
          </div>
        </motion.div>
      ))}
      <div className="flex items-center justify-center inset-0 absolute">
        {children}
      </div>
    </div>
  );
};

export default MovablePaneStyles;
