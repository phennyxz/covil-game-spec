# COVIL Game Specification — oito setores

**Versão:** 0.1 experimental. **Status:** organização documental; não representa certificação, implementação completa ou aprovação de propostas. O COVIL permite criar jogos HTML/JS/CSS comuns, empacotá-los como VLG e executá-los em hosts compatíveis, sem exigir Jogai, engine ou serviço central.

## Escolha seu setor

| Setor | Destinação | Entrada |
|---|---|---|
| **TEC** — Técnica | Escopo, terminologia, versões, governança e compatibilidade | [TEC](tec/000-scope-and-governance.md) |
| **SEC** — Segurança | Integridade, assinaturas, confiança, isolamento, OFPI e autoridades | [SEC](sec/000-security-model.md) |
| **APP** — Aplicação | API usada pelo jogo, init, eventos e lifecycle | [APP](app/000-game-api.md) |
| **PAC** — Pacote | ZIP VLG, manifesto, inventário e caminhos | [PAC](pac/000-vlg-package.md) |
| **CAP** — Capacidades | IDs, required/optional, concessões e revogação | [CAP](cap/000-capability-contract.md) |
| **RUN** — Execução | Host, sandbox, MessageChannel, estados e controles | [RUN](run/000-host-runtime.md) |
| **DIS** — Distribuição | Publicação, autorização, canais e envelope externo | [DIS](dis/000-distribution-contract.md) |
| **DEV** — Desenvolvedor | Fluxo de build, SDK, exemplos e testes | [DEV](dev/000-developer-workflow.md) |

**[Revisão transversal e pendências de consolidação — 2026-11-23](REVIEW-2026-11-23.md)** — matriz de conformidade, ambiguidades, decisões a formalizar e critérios de saída.

**[Mapa de migração e fontes existentes](MIGRATION.md)** — onde encontrar ADRs, schemas, código e o status real de cada contrato.

## Como usar
- **Autor de jogo:** comece por DEV → PAC → APP → CAP. Seu jogo deve funcionar localmente como Web comum; o SDK cuida da integração COVIL.
- **Implementador de host:** comece por RUN → SEC → CAP → PAC → APP.
- **Distribuidor:** comece por DIS → SEC → PAC.
- **Mantenedor do padrão:** comece por TEC → MIGRATION → ADRs.

## Extensões e propostas
- [SEC-001 — Integridade estrita e quarentena OFPI](sec/001-strict-package-integrity-ofpi.md).
- [SEC-002 — Localizadores de autoridades e resolução de confiança](sec/002-authority-discovery-trust-resolution.md).
- [TEC — Fundação do COVIL Trust Registry](tec/001-trust-registry-foundation.md).
- [DIS-001 — Destinos e autoridades de distribuição](dis/001-destination-and-authority-policy.md).

## Governança
1. Cada setor tem responsabilidade exclusiva; SEC é transversal. PAC descreve bytes; SEC decide aceitação; RUN executa; CAP concede recursos; DIS publica; APP expõe API; DEV orienta ferramentas; TEC coordena versões.
2. Identificadores normativos seguem `COVIL-<SETOR>-NNN` quando houver regra formalizada. Documento `000` é um guia de entrada e **não** cria requisitos novos.
3. MUST/SHOULD/MAY expressam requisitos alvo; sempre marcar proposta, aprovado, implementado e testado separadamente.
4. ADRs aprovadas e schemas atuais não são alterados implicitamente por esta reorganização.
5. NET (multiplayer) é candidato futuro, não um nono setor atual.
6. Não introduzir DRM, federação obrigatória, autoridade central ou mínimos de hardware no núcleo.

**Critério de sucesso:** o mesmo VLG funciona em dois hosts independentes sem modificação do jogo. Atualmente isso **não foi demonstrado**.
