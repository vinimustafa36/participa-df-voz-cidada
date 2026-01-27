import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, Home, Mail, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

interface SuccessScreenProps {
  protocolNumber: string;
  userEmail?: string;
  onGoHome: () => void;
}

export default function SuccessScreen({
  protocolNumber,
  userEmail,
  onGoHome,
}: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);

  const copyProtocol = async () => {
    try {
      await navigator.clipboard.writeText(protocolNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = protocolNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-background geometric-pattern">
      <div className="main-container">
        <Header />

        <main className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="success-container w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="success-icon"
            >
              <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Manifestação Enviada!
              </h1>
              <p className="text-white/90 text-lg mb-2">
                Recebemos sua manifestação. Ela é importante para melhorar os serviços públicos do Distrito Federal.
              </p>
              <p className="text-sm text-white/80">
                Agradecemos por participar da construção de um DF melhor.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="protocol-box"
            >
              <p className="text-sm text-slate-600 mb-2">
                Número do Protocolo
              </p>
              <p className="protocol-number text-primary" aria-label={`Protocolo ${protocolNumber}`}>
                {protocolNumber}
              </p>
              <Button
                variant="outline"
                onClick={copyProtocol}
                className="mt-4 transition-all duration-200"
                aria-label={copied ? "Protocolo copiado" : "Copiar protocolo"}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-success" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Protocolo
                  </>
                )}
              </Button>
            </motion.div>

            {/* Email Confirmation */}
            {userEmail && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-3 p-4 bg-success/10 rounded-xl border border-success/20 mt-4"
              >
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">
                    Confirmação enviada
                  </p>
                  <p className="text-xs text-slate-600">
                    Enviamos um e-mail para <strong className="text-slate-700">{userEmail}</strong> com os detalhes da sua manifestação.
                  </p>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 elegant-card text-left"
            >
              <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-primary" />
                O que acontece agora?
              </h2>
              <ul className="text-sm text-slate-600 space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    1
                  </span>
                  <span>Sua manifestação será analisada com atenção pela equipe competente.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    2
                  </span>
                  <span>Você pode acompanhar o andamento pelo número do protocolo a qualquer momento.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    3
                  </span>
                  <span>O prazo de resposta é de até <strong className="text-slate-700">20 dias úteis</strong>.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8"
            >
              <Button 
                onClick={onGoHome} 
                size="lg" 
                className="w-full text-lg h-14 transition-all duration-300 hover:shadow-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
