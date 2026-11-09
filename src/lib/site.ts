/**
 * Configuração partilhada do site.
 *
 * PENDENTE (cronograma, "Pontos a confirmar" 4 e 7): destino real dos botões
 * "Fale connosco" / "Contratar Agora" e ligações das redes sociais.
 */
export const site = {
  name: "Umoja Net",
  /** Para onde levam "Contratar Agora" e os botões de preço. */
  hireHref: "#contacto",
  /** Destino do botão "Fale connosco" (formulário, WhatsApp ou telefone). */
  contactHref: "#contacto",
  copyright: "© 2025 Vertical Telecom | Todos os direitos reservados",
} as const;

export const navLinks = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/planos", label: "Planos" },
  { href: "/#rede", label: "Nossa rede" },
] as const;

export const socialLinks = [
  { href: "#", label: "Facebook", icon: "facebook" },
  { href: "#", label: "Instagram", icon: "instagram" },
  { href: "#", label: "LinkedIn", icon: "linkedin" },
  { href: "#", label: "YouTube", icon: "youtube" },
  { href: "#", label: "WhatsApp", icon: "whatsapp" },
] as const;
