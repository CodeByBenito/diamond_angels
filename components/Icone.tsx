import type { IconeId } from "@/lib/conteudo";

type Id = IconeId | "pin" | "relogio" | "calendario" | "whatsapp" | "seta" | "fechar" | "instagram";

/* Traços finos e dourados, no mesmo desenho do logo. */
const CAMINHOS: Record<Id, React.ReactNode> = {
  coroa: <><path d="M4 17h16l1-10-5 4-4-6-4 6-5-4z" /><path d="M5 20h14" /></>,
  diamante: <><path d="M6 4h12l3 5-9 11L3 9z" /><path d="M3 9h18M9 4l3 16 3-16" /></>,
  megafone: <><path d="M4 10v4h3l8 5V5L7 10z" /><path d="M18.5 9a4 4 0 0 1 0 6" /></>,
  conexao: <><circle cx="8" cy="9" r="3" /><circle cx="16" cy="9" r="3" /><path d="M3 20c.6-3 2.6-5 5-5s4.4 2 5 5M11 20c.6-3 2.6-5 5-5s4.4 2 5 5" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  relogio: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  calendario: <><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /></>,
  seta: <path d="M5 12h14M13 6l6 6-6 6" />,
  fechar: <path d="M6 6l12 12M18 6L6 18" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></>,
  whatsapp: <><path d="M4 20l1.2-4.1A8 8 0 1 1 8.3 19z" /><path d="M9 9.2c.2 2.6 2.9 5.3 5.6 5.6l1.1-1.3-1.8-1-1 .8c-.9-.4-1.8-1.3-2.2-2.2l.8-1-1-1.8z" /></>,
};

export default function Icone({ id, className }: { id: Id; className?: string }) {
  return (
    <svg className={`icone${className ? ` ${className}` : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {CAMINHOS[id]}
    </svg>
  );
}
