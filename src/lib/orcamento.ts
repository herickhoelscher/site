import type { Content } from '@/content'

/**
 * Link do botão "pedir orçamento".
 *
 * Com o número de WhatsApp preenchido em `contato.whatsapp` (só dígitos, com
 * DDI e DDD, ex.: 5545999999999), abre a conversa já com a mensagem escrita.
 * Enquanto o número estiver vazio, cai no e-mail com o mesmo texto, para o
 * botão nunca ficar quebrado.
 */
export function linkOrcamento(t: Content, servico?: string) {
  const texto = servico ? `${t.orcamento.mensagem} (${servico})` : t.orcamento.mensagem
  const numero = t.contato.whatsapp.replace(/\D/g, '')
  if (numero) return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
  return `mailto:${t.contato.emailAddr}?subject=${encodeURIComponent(t.orcamento.assunto)}&body=${encodeURIComponent(texto)}`
}

export const temWhatsapp = (t: Content) => t.contato.whatsapp.replace(/\D/g, '').length > 0
