# ADR 0010 — Esquemas de assinatura VLG e autorização de distribuição

**Status:** Proposto para revisão, 2026-11-21  
**Relacionamento:** detalha formatos pendentes das ADRs 0002 e 0009, sem alterar a arquitetura aprovada.

## Objetivo

Definir envelopes interoperáveis mínimos para assinatura Ed25519 do desenvolvedor e autorização Ed25519 do distribuidor. A proposta preserva o ZIP VLG original, os bytes exatos assinados e a separação entre autoria, decisão administrativa, autorização de distribuição e homologação técnica.

Esta ADR é proposta; enquanto não aceita, implementações devem tratar os schemas como não normativos.

## `signature.json`

Exatamente quatro propriedades, sem propriedades adicionais. O `signature.json` é UTF-8 sem BOM, compacto (sem espaços fora das strings) e usa a ordem de membros mostrada abaixo. Parsers rejeitam chaves JSON duplicadas e qualquer representação diferente dessa forma compacta; os valores aqui são ASCII.

```json
{
  "schemaVersion": "0.1",
  "algorithm": "Ed25519",
  "keyId": "ed25519-sha256:<64 lowercase hex characters>",
  "signature": "<86 base64url characters, no padding>"
}
```

- `signature` decodifica para exatamente 64 bytes.
- `keyId` é `ed25519-sha256:` seguido de SHA-256 hexadecimal minúsculo dos 32 bytes da chave pública Ed25519 bruta.
- A chave pública deve estar ativa em um registro de confiança e vinculada a um UID de desenvolvedor reconhecido; `keyId` autodeclarado não estabelece confiança.
- A assinatura Ed25519 cobre `UTF8("COVIL-VLG-INTEGRITY-v1\n") || exactBytes(integrity.json)`.
- `signature.json` não entra no inventário. `integrity.json` deve listar todos os demais arquivos, inclusive `manifest.json`, e validar seus tamanhos/hashes.
- JSON inválido, versão/algoritmo inesperados, codificação não canônica, assinatura inválida, chave desconhecida/revogada ou divergência de inventário falham fechados.

## Registro de chaves de desenvolvedor

Um registro contém `keyId`, UID do desenvolvedor, chave pública Ed25519 bruta em base64url sem padding, status `active`/`revoked`, timestamp de criação e campos opcionais de revogação/motivo. A chave privada permanece com o titular. Não se aceita que o cliente escolha UID ou estado.

Ativação exige autenticação Firebase de conta com papel developer e prova de posse Ed25519 de desafio de uso único, validade máxima de cinco minutos. A mensagem proposta é `UTF8("COVIL-VLG-KEY-PROOF-v1\n" || uid || "\n" || keyId || "\n" || nonce)`; desafio consumido não pode ser reutilizado. Um UID pode manter várias chaves ativas para rotação. Chave revogada nunca volta a ativa; rotação cadastra uma chave nova e depois revoga a antiga. Listagens nunca retornam desafio ou prova.

## `distribution.json` e `distribution.sig`

`distribution.json` é envelope externo ao `.vlg`, com exatamente:

```json
{
  "schemaVersion": "0.1",
  "issuer": "jogai",
  "issuerKeyId": "ed25519-sha256:<64 lowercase hex characters>",
  "releaseId": "<UUID v4 lowercase>",
  "issuedAt": "<RFC 3339 UTC timestamp>",
  "expiresAt": "<RFC 3339 UTC timestamp>",
  "packageSha256": "<64 lowercase hex characters>",
  "integritySha256": "<64 lowercase hex characters>",
  "developerKeyId": "ed25519-sha256:<64 lowercase hex characters>",
  "gameId": "<manifest id>",
  "gameVersion": "<manifest version>",
  "scope": { "catalog": "jogai", "channel": "public" },
  "authorization": "publish",
  "homologation": null
}
```

`scope` e homologação serão evoluídos por versões de schema; campos não descritos são rejeitados. Quando presente, `homologation` identifica separadamente resultado, política/testes, versão do verificador, instante e hash imutável do relatório. Sua ausência não afirma que o pacote passou homologação.

`distribution.sig` contém somente a assinatura Ed25519 em base64url sem padding (86 caracteres), decodificando para 64 bytes. Ela autentica `UTF8("COVIL-DISTRIBUTION-v1\n") || exactBytes(distribution.json)`. O arquivo e a codificação UTF-8 do envelope devem ser preservados sem reserialização. A chave do distribuidor pertence a uma raiz previamente confiável e fica protegida por KMS/HSM ou mecanismo equivalente; nunca é armazenada no pacote, código cliente ou sistema de upload.

`packageSha256` cobre os bytes exatos do arquivo VLG. `integritySha256` cobre os bytes exatos de `integrity.json`. O console verifica assinatura do distribuidor, prazo, escopo, hash do pacote e assinatura/inventário do desenvolvedor antes de executar isoladamente. A distribuição só é autorizada após decisão administrativa auditada para o mesmo UID, versão e hash. O envelope não altera nem substitui a assinatura de desenvolvedor.

## Aprovação administrativa

A aprovação é um evento de governança server-side vinculado ao hash imutável; não é em si uma assinatura e não torna o artefato público. Depois da aprovação, o serviço de publicação pode emitir o envelope com a chave do distribuidor. Decisão, assinatura de release e eventual homologação são registros distintos. Um administrador pode aprovar submissão própria apenas se a política permitir, registrando `selfApproved`/ator.

## Rejeição e perguntas pendentes

Esta proposta precisa de vetores interoperáveis de assinatura válida/inválida, testes de codificação JSON estrita, política para duplicatas/chaves comprometidas e definição da raiz de confiança do console. Confirmar se UUID v4 é suficiente como `releaseId`, a semântica de timestamps/clock skew, a política de expiração/revogação offline e se o registro usa apenas UID Firebase ou identidade federada. A aprovação desta ADR não implica a operação de KMS, bucket, IAM ou distribuição de produção.
