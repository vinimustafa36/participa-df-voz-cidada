import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Info, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ContactFormProps {
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
  email: string;
  onEmailChange: (value: string) => void;
  name: string;
  onNameChange: (value: string) => void;
}

export default function ContactForm({
  isAnonymous,
  onAnonymousChange,
  email,
  onEmailChange,
  name,
  onNameChange,
}: ContactFormProps) {
  const [emailTouched, setEmailTouched] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showEmailError = emailTouched && email && !isValidEmail(email);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Anonymous Toggle */}
      <label 
        htmlFor="anonymous-toggle"
        className="elegant-card p-4 flex items-start space-x-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
      >
        <Checkbox
          id="anonymous-toggle"
          checked={isAnonymous}
          onCheckedChange={(checked) => onAnonymousChange(checked === true)}
        />
        <div className="space-y-1">
          <span className="font-medium text-slate-800">
            Desejo permanecer anônimo(a)
          </span>
          <p className="text-sm text-slate-600">
            Sua identidade não será revelada no registro da manifestação.
          </p>
        </div>
      </label>

      {/* Contact Fields - Only show when not anonymous */}
      <AnimatePresence>
        {!isAnonymous && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Info Message */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-primary/20 shadow-sm">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">
                Seu e-mail será utilizado apenas para acompanhar esta manifestação. 
                Você receberá atualizações sobre o andamento.
              </p>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="contact-name" className="text-base font-medium flex items-center gap-2 text-slate-800">
                <User className="w-4 h-4 text-slate-500" />
                Nome (opcional)
              </Label>
              <Input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Como você gostaria de ser chamado(a)?"
                className="input-elegant"
                maxLength={100}
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-base font-medium flex items-center gap-2 text-slate-800">
                <Mail className="w-4 h-4 text-slate-500" />
                E-mail (opcional)
              </Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                placeholder="seu.email@exemplo.com"
                className={`input-elegant ${showEmailError ? 'border-red-500' : ''}`}
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? "email-error" : undefined}
              />
              {showEmailError && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  id="email-error"
                  className="text-sm text-red-600"
                >
                  Por favor, insira um e-mail válido.
                </motion.p>
              )}
              
              {email && isValidEmail(email) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-sm text-success"
                >
                  <Check className="w-4 h-4" />
                  Você receberá atualizações neste e-mail
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
