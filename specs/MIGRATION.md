# Consolidação por setor — mapa de fontes e transição

**Política:** `specs/` é a **porta de entrada por assunto**. Documentos `docs/`, schemas, SDK e ADRs são preservados; não há alteração de contrato, API ou estrutura VLG por simples reorganização. Até migração normativa formal, em caso de divergência prevalecem ADRs aprovadas e schemas implementados em seus respectivos escopos. Propostas não sobrepõem contratos aprovados.

| Setor | Documento de entrada | Fontes existentes | Estado |
|---|---|---|---|
| TEC | [TEC](tec/000-scope-and-governance.md) | docs/00, docs/01, docs/07, ADR 0001 | Princípios aprovados, versão 0.1 experimental |
| SEC | [SEC](sec/000-security-model.md) | docs/06, ADR 0002, ADR 0003, ADR 0009 | Segurança alvo; SEC-001/002 propostos |
| APP | [APP](app/000-game-api.md) | docs/09, ADR 0008, sdk/ | SDK parcial |
| PAC | [PAC](pac/000-vlg-package.md) | docs/02, docs/03, schemas/manifest.schema.json, ADR 0002 | ZIP e inventário no protótipo |
| CAP | [CAP](cap/000-capability-contract.md) | docs/08, ADR 0006/0007, schemas/capabilities.registry.json | IDs e manifesto; grants pendentes |
| RUN | [RUN](run/000-host-runtime.md) | docs/04, docs/05, docs/11, ADR 0003/0004/0005 | SDK parcial; host seguro pendente |
| DIS | [DIS](dis/000-distribution-contract.md) | ADR 0009, ADR 0010 proposta, schemas/distribution.schema.json | Envelope não implementado |
| DEV | [DEV](dev/000-developer-workflow.md) | docs/10, docs/12, AGENTS, tools/, examples/, tests/ | Ferramentas experimentais |

## Hierarquia de leitura
1. `README.md` → `specs/README.md` → setor desejado.
2. Documento setorial 000: **para que serve, regras, exemplo, fontes**.
3. Fonte detalhada em `docs/`, ADR aprovada, schema e testes.
4. Propostas setoriais numeradas e ADRs propostas ficam marcadas como pendentes até aprovação e implementação.

## Pendências concretas
- Validar e assinar Ed25519 e envelopes; definir schema versionado de credenciais/localizadores sem quebrar ADR 0010.
- Implementar host de navegador com isolamento e testes adversariais.
- Executar o **mesmo** VLG em dois hosts independentes.
- Testar SEC-001 (tipo/magic exigem mudança versionada de inventário).
- Implementar Trust Registry somente se houver demanda real; não é pré-requisito de build local.
- Não alegar testes executados ou homologação com base nesta reorganização.

## Regra anti-expansão
Qualquer nova obrigação deve demonstrar qual falha concreta resolve, por que ferramentas existentes não bastam, impacto sobre autor de jogo e teste que comprova seu valor. Não bloquear o MVP por funcionalidades de federação, DRM ou certificação avançada.
