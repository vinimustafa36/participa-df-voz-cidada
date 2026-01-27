import { PenLine, Mic, ImageIcon, Search } from "lucide-react";
import { motion } from "framer-motion";
import ActionCard from "@/components/ui/ActionCard";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

type ManifestationType = "text" | "audio" | "media";

interface HomeScreenProps {
  onSelectType: (type: ManifestationType | "tracking") => void;
}

export default function HomeScreen({ onSelectType }: HomeScreenProps) {
  return (
    <div className="app-background geometric-pattern">
      <div className="main-container">
        <a href="#main-content" className="skip-link">
          Ir para o conteúdo principal
        </a>

        <Header />

        <main id="main-content" className="flex-1">
          <nav
            className="grid gap-4 md:grid-cols-3"
            aria-label="Opções de manifestação"
          >
            <ActionCard
              icon={PenLine}
              title="Escrever"
              description="Digite sua manifestação, sugestão ou reclamação"
              onClick={() => onSelectType("text")}
              delay={0.1}
            />
            <ActionCard
              icon={Mic}
              title="Gravar Áudio"
              description="Grave sua mensagem usando a voz"
              onClick={() => onSelectType("audio")}
              delay={0.2}
            />
            <ActionCard
              icon={ImageIcon}
              title="Enviar Mídia"
              description="Envie fotos ou vídeos como evidência"
              onClick={() => onSelectType("media")}
              delay={0.3}
            />
          </nav>

          {/* Tracking Option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => onSelectType("tracking")}
              className="w-full h-14 text-base border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 rounded-2xl"
            >
              <Search className="w-5 h-5 mr-3 text-primary" />
              <span className="text-foreground">Acompanhar Manifestação</span>
            </Button>
          </motion.div>

          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-14 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Ouvidoria Digital • Sempre à sua disposição
              </span>
            </div>
          </motion.footer>
        </main>
      </div>
    </div>
  );
}
