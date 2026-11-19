# Auditoria e consolidação — COVIL 0.1

**Data:** 2026-11-19. **Status:** revisão estática do repositório, não auditoria de segurança certificada. Não houve execução de testes nesta revisão: o checkout via rede do ambiente de execução não estava disponível.

## Ordem de autoridade

1. ADRs aprovadas para decisões arquiteturais (0001–0008).
2. Documentos de contrato em `docs/` e catálogo em `schemas/capabilities.registry.json`.
3. Schemas, tipos e testes para o subconjunto efetivamente implementado.
4. Exemplos e ferramentas experimentais não ampliam os direitos do VLG.

Contradições devem ser corrigidas no documento derivado, sem reescrever o histórico da ADR. Alterações de decisão exigem nova ADR.

## Achados

| ID | Gravidade | Achado | Encaminhamento |
|---|---|---|---|
| A01 | Alta | Fundação menciona JCS, embora ADR 0002 tenha fixado assinatura dos bytes exatos de `integrity.json` | Corrigir fundação e documentos derivados |
| A02 | Alta | `hello-vlg` usa mensagens diretas, não `init(covil)` da ADR 0008 | Criar SDK mínimo e migrar exemplo, preservando o protocolo |
| A03 | Alta | Não há host isolado de referência com testes adversariais; validador não verifica assinatura | Não declarar segurança/conformidade; implementar antes de aceitar pacotes de terceiros |
| A04 | Média | ADR 0006 e docs derivados ainda descrevem o formato legado de capacidades como atual | Registrar nota de implementação posterior e corrigir documentos derivados |
| A05 | Média | `sensors.motion` aparece em exemplo da ADR 0006, mas catálogo usa `input.motion` | Corrigir com nota de errata, sem redefinir catálogo |
| A06 | Média | Protocolo de RPC, erros, revogação, limites e timeouts ainda não está definido | Especificar núcleo mínimo antes de serviços privilegiados |
| A07 | Média | Validação de manifesto duplicada entre JSON Schema e validador manual, com risco de divergência | Testes de paridade e fonte normativa |
| A08 | Média | Leitor ZIP artesanal: revisão insuficiente para arquivos hostis; faltam testes amplos de ZIP adversarial | Substituir ou endurecer antes de produção |
| A09 | Média | API `covil.request()` ainda não tem mensagem de concessão dinâmica | Não anunciar como funcional até definir RPC e política de consentimento |
| A10 | Baixa | Alguns documentos ainda dizem que o registro de capacidades está pendente | Atualizar referências |

## Contratos consolidados

- **Pacote e assinatura:** docs/02, ADR 0002; assinatura Ed25519 sobre prefixo ASCII e bytes exatos do inventário, ainda não implementada.
- **Manifesto:** docs/03, JSON Schema e ADR 0007; listas `required` e `optional`.
- **Compatibilidade:** ADR 0006; o host rejeita requisito obrigatório não concedido **antes de executar código VLG**.
- **Isolamento:** ADR 0003 e docs/06; sandbox iframe opaco + CSP/Permissions-Policy + canal privado. Nenhuma fachada JS é barreira de segurança.
- **Protocolo:** ADR 0004 e docs/04; host é dono do ciclo de vida.
- **Entrada:** ADR 0005; ações lógicas, sem dependência de dispositivo.
- **API pública:** ADR 0008 e docs/09; `init(covil)`, `has`, `request` e interfaces específicas, sem `input/output` genéricos.
- **Catálogo:** docs/08 e schema estruturado; identificadores não são garantias de hardware ou desempenho.

## Escopo fechado do primeiro núcleo

Um host de laboratório deve validar pacote e manifesto, comparar capacidades requeridas contra concessões, estabelecer iframe isolado e canal, enviar `host.init`, receber `game.ready`, enviar `host.start`, controlar ações digitais, pausar/retomar/encerrar e invalidar mensagens após encerramento. O SDK mínimo só precisa suportar `init(covil)`, `has`, `controls.on` e ciclo de vida. Outros métodos ficam reservados, não simulados.

## Critérios de saída

- [ ] Suite de pacote e manifesto executada sem falhas
- [ ] Testes de incompatibilidade obrigatória e degradação opcional
- [ ] SDK e host comunicam-se por MessageChannel
- [ ] `hello-vlg` usa `init(covil)`
- [ ] Pausa, foco, encerramento e sessão inválida testados
- [ ] Sandbox, CSP e restrições de rede verificados em navegador real
- [ ] Mesmo pacote executado em dois hosts independentes
- [ ] Assinatura Ed25519 e confiança implementadas antes de catálogo público

**Conclusão:** a arquitetura está suficientemente definida para construir um núcleo de laboratório, **não** para declarar a especificação 0.1 segura ou certificada.
