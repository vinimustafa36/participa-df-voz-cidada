import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface HeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

export default function Header({ showBackButton, onBack, title }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={showBackButton ? "mb-6" : "text-center mb-10"}
    >
      {showBackButton && onBack ? (
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-1.5 text-white hover:text-white/80 transition-colors px-3 py-2 -ml-3 rounded-xl focus-visible:ring-2 focus-visible:ring-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            aria-label="Voltar para a tela anterior"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            <span className="font-medium">Voltar</span>
          </motion.button>
          {title && (
            <h1 className="text-lg font-semibold text-white">{title}</h1>
          )}
          <div className="w-24" aria-hidden="true" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Logo - Silhueta de Ipê amarelo minimalista e geométrico */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Silhueta de Ipê com folhas em bolas */}
              <svg viewBox="0 0 80 100" className="w-20 h-24 drop-shadow-lg" fill="none">
                {/* Copa do ipê - bolas amarelas representando as flores */}
                <circle cx="40" cy="12" r="10" fill="#f0e05b"/>
                <circle cx="26" cy="20" r="9" fill="#f0e05b"/>
                <circle cx="54" cy="20" r="9" fill="#f0e05b"/>
                <circle cx="18" cy="32" r="8" fill="#f0e05b"/>
                <circle cx="40" cy="28" r="9" fill="#f0e05b"/>
                <circle cx="62" cy="32" r="8" fill="#f0e05b"/>
                <circle cx="28" cy="40" r="8" fill="#f0e05b"/>
                <circle cx="52" cy="40" r="8" fill="#f0e05b"/>
                <circle cx="40" cy="46" r="7" fill="#f0e05b"/>
                
                {/* Tronco geométrico */}
                <polygon points="36,50 44,50 42,85 38,85" fill="#f0e05b"/>
                
                {/* Base do tronco */}
                <polygon points="34,85 46,85 48,92 32,92" fill="#f0e05b" opacity="0.8"/>
              </svg>
            </motion.div>
          </motion.div>

          {/* Títulos - Voz Cidadã maior, Participa DF menor */}
          <div className="space-y-1">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-medium tracking-wide text-white"
            >
              Participa DF
            </motion.p>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: '#f0e05b', textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              Voz Cidadã
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 max-w-xs mx-auto leading-relaxed text-sm"
          >
            Sua opinião transforma o Distrito Federal.
          </motion.p>
        </div>
      )}
    </motion.header>
  );
}
