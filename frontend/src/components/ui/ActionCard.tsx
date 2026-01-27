import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { forwardRef } from "react";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

const ActionCard = forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ icon: Icon, title, description, onClick, delay = 0 }, ref) => {
    return (
      <motion.button
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay, ease: "easeOut" }}
        whileHover={{ 
          y: -6, 
          transition: { duration: 0.2 } 
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="action-card w-full text-left group"
        aria-label={`${title}: ${description}`}
      >
        <motion.div 
          className="action-card-icon"
          aria-hidden="true"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="w-8 h-8" strokeWidth={2} />
        </motion.div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-200">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </motion.button>
    );
  }
);

ActionCard.displayName = "ActionCard";

export default ActionCard;
