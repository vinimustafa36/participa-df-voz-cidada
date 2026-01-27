import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressStepper({
  currentStep,
  totalSteps,
}: ProgressStepperProps) {
  return (
    <nav
      className="progress-stepper"
      aria-label={`Etapa ${currentStep} de ${totalSteps}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
    >
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <motion.div
            key={stepNumber}
            initial={false}
            animate={{
              width: isActive ? 32 : 12,
              backgroundColor: isCompleted
                ? "hsl(var(--success))"
                : isActive
                ? "hsl(var(--primary))"
                : "hsl(var(--muted))",
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("progress-step", {
              active: isActive,
              completed: isCompleted,
            })}
            aria-hidden="true"
          />
        );
      })}
    </nav>
  );
}
