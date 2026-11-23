# COVIL-TEC — Fundamentos, escopo e governança (0.1)

**Estado:** consolidação editorial dos contratos experimentais; não cria novo protocolo.

## Destinação
TEC define vocabulário, fronteiras, versionamento, compatibilidade e processo de evolução. Não é um motor, loja, SDK, PKI nem especificação de hardware mínimo.

## Regras
1. O jogo continua sendo HTML/CSS/JavaScript executável localmente no navegador. O VLG adiciona metadados, integridade e portabilidade; não deve exigir framework, Firebase, Jogai ou motor específico.
2. `COVIL` = ambiente/contratos; `VLG` = pacote; `host` = executor; `distributor` = publicador; `SDK` = fachada opcionalmente substituível por implementação conforme.
3. `schemaVersion`, versão do protocolo, versão do jogo e versão da implementação do host são distintas. A versão 0.1 é experimental.
4. O núcleo obrigatório deve permanecer pequeno. Extensões são opcionais e negociadas, sem garantia de hardware, CPU, RAM ou FPS.
5. Uma regra normativa nova precisa de identificação, status, testes planejados e ADR quando altera decisão aprovada. MUST/SHOULD/MAY descrevem requisitos do contrato-alvo; não são prova de implementação.
6. Separar sempre: **aprovado em ADR**, **proposto**, **implementado**, **testado** e **apto à produção**.
7. Um mesmo VLG deve poder executar em dois hosts independentes, sem modificações específicas por host; esta é a prova de valor do projeto.

## Exemplo
```text
game/ (HTML + JS + assets) -> covil-build -> game.vlg
game.vlg -> validador -> host A (Jogai) / host B (independente)
```
O jogo não conhece o código interno do Jogai.

## Fontes existentes
[Fundação](../../docs/00-foundation.md), [arquitetura](../../docs/01-architecture.md), [versões](../../docs/07-versioning.md), [ADR 0001](../../adr/0001-project-boundaries.md). A proposta de registro federado está em [Trust Registry](001-trust-registry-foundation.md), **não** é requisito do núcleo.
