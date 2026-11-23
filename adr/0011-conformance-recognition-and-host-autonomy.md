# ADR 0011 — Fronteiras da especificação, reconhecimento e autonomia do host

**Status:** decisão de consolidação aprovada em 2026-11-23; substitui a obrigatoriedade universal de envelope externo de distribuição estabelecida para o catálogo Jogai na ADR 0009. **Não revoga** o mecanismo de envelope como extensão opcional de plataforma. Implementação e testes de confiança permanecem pendentes.

## Decisão

1. O repositório **COVIL Game Specification** define contratos abertos, schemas, exemplos, vetores e ferramentas de conformidade de referência. Não é órgão obrigatório de homologação nem serviço central que precise receber todos os VLGs.
2. Ferramentas de build, verificação e suites de conformidade são recomendadas para interoperabilidade e reprodução de resultados, mas não são a única implementação válida. Conformidade é determinada pelos requisitos publicados e seus testes, não pelo fornecedor do validador.
3. A assinatura Ed25519 do desenvolvedor autentica o vínculo da chave privada ao **inventário exato**, que por SHA-256 identifica o conteúdo do pacote. A assinatura isolada não prova identidade civil, qualidade, legalidade, inocuidade, homologação ou permissão de distribuição.
4. O chaveiro/autoridade de reconhecimento permite pesquisar chaves oficiais e verificar declarações autenticadas sobre a chave, o vínculo de identidade e/ou a assinatura. O escopo e a validade da declaração devem ser explícitos. Reconhecer a assinatura **não** equivale a aprovar o jogo. Uma assinatura reconhecida ainda pode ter sido feita por chave comprometida; revogação e políticas de atualização são relevantes.
5. Cada host/plataforma decide independentemente **admissão, homologação, publicação, distribuição e execução**, sob suas políticas e legislação aplicável. Pode exigir atestados, revisão editorial, testes, envelopes próprios e cache de confiança, sem tornar tais mecanismos obrigatórios para todos os VLGs.
6. A ADR 0009 continua descrevendo um **modelo opcional de autorização externa assinada**, útil para catálogos que o adotem; não é uma segunda assinatura obrigatória do formato VLG nem prova de homologação.
7. Mesmo pacotes assinados/reconhecidos/homologados devem respeitar isolamento, integridade, limites e capacidades do host. O modo local não assinado continua explicitamente separado da política de distribuição.

## Metadados editoriais

O campo opcional `metadata` foi integrado ao schema experimental 0.1 e ao validador de referência. Ele pertence ao manifesto inventariado e, quando assinado, integra indiretamente a assinatura do desenvolvedor. São declarações atribuídas ao autor, não fatos certificados pela CA. O host define exigências de remessa, verificação editorial, classificações, tratamento de divergências materiais e medidas operacionais. O perfil de remessa obrigatória e taxonomias oficiais requerem decisão própria.

## Fluxo

```text
autor -> pacote + inventário -> assinatura de autoria
                                 |
                                 v
                    chaveiro / CA: reconhecimento
                                 |
                                 v
               host: validação + política + homologação
                                 |
                                 v
                   publicação / distribuição / execução
```

A CA não assina o pacote no lugar do autor e não emite autorização universal de distribuição. O host pode operar offline com material autenticado em cache conforme política de validade/revogação. A confiança nunca é estabelecida por um endereço ou chave autodeclarados no VLG.

## Consequências e compatibilidade

- **Mantidas:** ADR 0002, formato VLG, inventário completo, assinatura original, SEC e isolamento.
- **Alterada:** exigência da ADR 0009 de envelope obrigatório para catálogo Jogai passa a ser decisão de política da plataforma, não do padrão.
- **Não resolvidas:** formato normativo do atestado da CA, vinculação de identidade, revogação e validade offline, política de metadados de remessa, testes de interoperabilidade e homologação.
- A existência de `schemas/distribution.schema.json` representa **extensão experimental Jogai**, não schema universal do VLG.
