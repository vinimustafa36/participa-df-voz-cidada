import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileCheck,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getManifestationByProtocol, type ManifestationWithStatus } from "@/lib/manifestation";

interface TrackingScreenProps {
  onBack: () => void;
}

interface TimelineStatus {
  id: string;
  label: string;
  description: string;
  date: string | null;
  status: 'completed' | 'current' | 'pending';
  icon: typeof CheckCircle2;
}

function getTimelineStatuses(manifestation: ManifestationWithStatus): TimelineStatus[] {
  const statusOrder = ['recebida', 'em_analise', 'encaminhada', 'finalizada'];
  const currentIndex = statusOrder.indexOf(manifestation.status);

  return [
    {
      id: 'recebida',
      label: 'Recebida',
      description: 'Sua manifestação foi registrada com sucesso no sistema.',
      date: manifestation.createdAt,
      status: currentIndex >= 0 ? 'completed' : 'pending',
      icon: FileCheck,
    },
    {
      id: 'em_analise',
      label: 'Em Análise',
      description: 'Nossa equipe está analisando sua manifestação com atenção.',
      date: currentIndex >= 1 ? manifestation.statusUpdatedAt : null,
      status: currentIndex > 1 ? 'completed' : currentIndex === 1 ? 'current' : 'pending',
      icon: Clock,
    },
    {
      id: 'encaminhada',
      label: 'Encaminhada',
      description: 'Sua manifestação foi encaminhada ao órgão responsável.',
      date: currentIndex >= 2 ? manifestation.statusUpdatedAt : null,
      status: currentIndex > 2 ? 'completed' : currentIndex === 2 ? 'current' : 'pending',
      icon: Send,
    },
    {
      id: 'finalizada',
      label: 'Finalizada',
      description: 'Sua manifestação foi concluída e respondida.',
      date: currentIndex >= 3 ? manifestation.statusUpdatedAt : null,
      status: currentIndex === 3 ? 'completed' : 'pending',
      icon: CheckCircle2,
    },
  ];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    text: 'Manifestação Escrita',
    audio: 'Manifestação em Áudio',
    media: 'Manifestação com Mídia',
  };
  return labels[type] || 'Manifestação';
}

export default function TrackingScreen({ onBack }: TrackingScreenProps) {
  const [protocol, setProtocol] = useState("");
  const [manifestation, setManifestation] = useState<ManifestationWithStatus | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!protocol.trim()) {
      setError("Por favor, insira o número do protocolo.");
      return;
    }

    const result = getManifestationByProtocol(protocol.trim());
    setManifestation(result);
    setSearched(true);
    setError("");

    if (!result) {
      setError("Manifestação não encontrada. Verifique o número do protocolo.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const timelineStatuses = manifestation ? getTimelineStatuses(manifestation) : [];

  return (
    <div className="app-background geometric-pattern">
      <div className="main-container">
        <Header showBackButton onBack={onBack} title="Acompanhar Manifestação" />

        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="info-card">
              <div className="info-card-icon" aria-hidden="true">
                <Search className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground mb-1">
                  Consulte o andamento da sua manifestação
                </h2>
                <p className="text-sm text-muted-foreground">
                  Digite o número do protocolo que você recebeu ao registrar sua manifestação.
                </p>
              </div>
            </div>

            {/* Search Form */}
            <div className="elegant-card space-y-4">
              <div className="space-y-2">
                <Label htmlFor="protocol-input" className="text-base font-medium">
                  Número do Protocolo
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="protocol-input"
                    type="text"
                    value={protocol}
                    onChange={(e) => {
                      setProtocol(e.target.value.toUpperCase());
                      if (error) setError("");
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Ex: PDF20250120-123456"
                    className="input-elegant flex-1 font-mono text-base"
                    aria-describedby={error ? "search-error" : undefined}
                  />
                  <Button 
                    onClick={handleSearch} 
                    size="lg"
                    className="px-6"
                    aria-label="Buscar manifestação"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Buscar
                  </Button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  id="search-error"
                  className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}
            </div>

            {/* Results */}
            {searched && manifestation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="space-y-6"
              >
                {/* Manifestation Info */}
                <div className="elegant-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      Detalhes da Manifestação
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      manifestation.status === 'finalizada' 
                        ? 'bg-success/10 text-success' 
                        : manifestation.status === 'encaminhada'
                        ? 'bg-info/10 text-info'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {timelineStatuses.find(s => s.id === manifestation.status)?.label}
                    </span>
                  </div>
                  
                  <div className="grid gap-3 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Protocolo</span>
                      <span className="font-mono font-medium text-foreground">
                        {manifestation.protocol}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Tipo</span>
                      <span className="font-medium text-foreground">
                        {getTypeLabel(manifestation.type)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground">Data de Abertura</span>
                      <span className="font-medium text-foreground">
                        {formatDate(manifestation.createdAt)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Identificação</span>
                      <span className="font-medium text-foreground">
                        {manifestation.isAnonymous ? 'Anônimo(a)' : 'Identificado(a)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="elegant-card">
                  <h3 className="font-semibold text-foreground mb-6">
                    Linha do Tempo
                  </h3>
                  
                  <div className="timeline">
                    {timelineStatuses.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="timeline-item"
                      >
                        <div 
                          className={`timeline-icon ${item.status}`}
                          aria-hidden="true"
                        >
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="timeline-content">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-semibold ${
                              item.status === 'pending' 
                                ? 'text-muted-foreground' 
                                : 'text-foreground'
                            }`}>
                              {item.label}
                            </h4>
                            {item.date && (
                              <span className="text-xs text-muted-foreground">
                                {formatDate(item.date)}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${
                            item.status === 'pending' 
                              ? 'text-muted-foreground/60' 
                              : 'text-muted-foreground'
                          }`}>
                            {item.description}
                          </p>
                          {item.status === 'current' && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-primary font-medium">
                              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                              Status atual
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Next Steps */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 bg-secondary rounded-2xl"
                >
                  <p className="text-sm text-muted-foreground text-center">
                    Sua manifestação está sendo tratada com atenção pela equipe responsável.
                    <br />
                    O prazo de resposta é de até <strong>20 dias úteis</strong>.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Empty State */}
            {!searched && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Consulte sua manifestação
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Insira o número do protocolo para verificar o andamento da sua manifestação.
                </p>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
