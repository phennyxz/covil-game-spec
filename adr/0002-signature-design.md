# ADR 0002 — Assinatura do inventário VLG

> **Histórico / parcialmente substituído pela [ADR 0012](0012-sdp-vlg-profile.md):** o VLG canônico utiliza o inventário e domínio de assinatura SDP (`SDP-INTEGRITY-v1\\n`), não o domínio `COVIL-VLG-INTEGRITY-v1\\n` descrito abaixo. As decisões sobre separação de confiança permanecem válidas. Não existe VLG publicado a migrar.


**Status:** Aprovado em 2026-11-18  
**Aplicação:** COVIL Game Specification 0.1 (contrato de segurança aprovado; implementação pendente)

## Decisão

Um pacote VLG possui `integrity.json` com caminhos normalizados, tamanhos em bytes e hashes SHA-256 de **todos** os arquivos distribuídos, incluindo `manifest.json`, exceto `integrity.json` e `signature.json`. O inventário deve ser completo e sem duplicatas: arquivos extras, ausentes ou divergentes invalidam o pacote.

O desenvolvedor assina o inventário com sua **chave privada Ed25519**. O `signature.json` contém algoritmo, identificador da chave e assinatura; a chave privada nunca é distribuída. O console verifica a assinatura com uma chave pública previamente confiável e, somente então, confere o inventário contra os arquivos do pacote.

### Bytes assinados

Para evitar dependência de canonicalização JSON, a assinatura será calculada sobre a concatenação dos bytes UTF-8 ASCII de domínio `COVIL-VLG-INTEGRITY-v1\n` com os **bytes exatos** do arquivo `integrity.json` distribuído. A ordem dos bytes, inclusive espaços e quebras de linha, é significativa. A verificação não reserializa JSON. O prefixo evita reutilização da assinatura em outros protocolos. Alterar o inventário invalida a assinatura.

`signature.json` não entra no inventário nem é assinado por si mesmo. Os campos `keyId` e `algorithm` do envelope devem ser validados e associados à chave confiável e ao algoritmo Ed25519, não aceitos como autoridade autodeclarada.

### Política de execução

- **Desenvolvimento/importação local:** VLG sem assinatura pode ser executado apenas quando o usuário habilitar explicitamente o modo de desenvolvedor, sob isolamento e restrições de segurança equivalentes aos de jogos assinados. A interface deve informar que a origem não foi autenticada.
- **Catálogo Jogai:** publicação exige assinatura Ed25519 válida, chave pública vinculada a uma identidade de desenvolvedor reconhecida pelo catálogo e verificação integral antes de disponibilizar o pacote.
- **Outros hosts:** podem definir políticas próprias de confiança, sem alterar o formato e sem declarar uma chave desconhecida como confiável automaticamente.
- Assinatura válida **não** comprova ausência de código malicioso; isolamento, permissões, controles de rede e limites de recursos continuam obrigatórios.

### Ordem de verificação

1. Validar limites e estrutura do ZIP, nomes, normalização e duplicatas sem executar conteúdo.
2. Ler `signature.json`, identificar uma chave pública confiável e verificar Ed25519 sobre o prefixo de domínio e os bytes exatos de `integrity.json`.
3. Validar estrutura e completude do inventário e calcular SHA-256 de cada arquivo listado, inclusive `manifest.json`.
4. Validar o manifesto, requisitos, política de confiança e permissões.
5. Somente após aprovação, autorizar a execução no contexto isolado.

A rejeição deve ser explícita para assinatura inválida, chave desconhecida, arquivo não listado, divergência de hash e requisitos incompatíveis.

## Questões de implementação ainda pendentes

Definir o esquema exato de `signature.json`, codificação da assinatura, formato de `keyId`, distribuição/revogação/rotação de chaves, prevenção de downgrade, limites de ZIP e testes interoperáveis com vetores criptográficos. Esses detalhes não anulam a decisão arquitetural aprovada.

## Consequências

A assinatura cobre indiretamente todos os arquivos e o manifesto; não há autorreferência de hash. Não é necessário JCS para verificar o inventário assinado. A versão 0.1 dos utilitários atualmente publicada **ainda não implementa** verificação Ed25519 nem a política de catálogo; nenhuma ferramenta deve alegar conformidade criptográfica até passar testes.
