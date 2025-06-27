import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface ExpanderProps {
  children: React.ReactNode;
  maxLines?: number;
  className?: string;
  expandButtonText?: string;
  collapseButtonText?: string;
  onChange?: (isExpanded: boolean) => void;
}

const Expander: React.FC<ExpanderProps> = ({
  children,
  maxLines = 3,
  className = "",
  expandButtonText = "Show more",
  collapseButtonText = "Show less",
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (measureRef.current) {
        const lineHeight = parseInt(
          getComputedStyle(measureRef.current).lineHeight
        );
        const maxHeight = lineHeight * maxLines;
        const actualHeight = measureRef.current.scrollHeight;
        setShouldShowButton(actualHeight > maxHeight);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [children, maxLines]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    onChange?.(!isExpanded);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Hidden element for measuring content height */}
      <div
        ref={measureRef}
        className="absolute invisible pointer-events-none"
        style={{ top: "-9999px" }}
      >
        <div>{children}</div>
      </div>

      {/* Visible content */}
      <motion.div
        ref={contentRef}
        className="text-gray-700 leading-relaxed overflow-hidden "
        initial={false}
        animate={{
          height: isExpanded
            ? "auto"
            : shouldShowButton
              ? `${maxLines * 1.5}rem`
              : "auto",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className={!isExpanded && shouldShowButton ? "line-clamp-none " : ""}
        >
          {children}
        </div>
      </motion.div>

      {/* Gradient fade effect when collapsed */}
      <AnimatePresence>
        {!isExpanded && shouldShowButton && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none "
          />
        )}
      </AnimatePresence>

      {/* Expand/Collapse Button */}
      {shouldShowButton && (
        <motion.button
          onClick={toggleExpanded}
          className="mt-3 inline-flex items-center gap-1  font-medium text-sm duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isExpanded ? collapseButtonText : expandButtonText}
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      )}
    </div>
  );
};

export default Expander;
