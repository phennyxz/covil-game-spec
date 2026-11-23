# COVIL-PAC — Pacote VLG (0.1)

**Destinação:** formato físico e metadados do jogo, independente de onde será publicado. **Estado:** formato 0.1 experimental, com builder e validador parciais.

## Regras
1. `.vlg` é ZIP. `manifest.json` e `integrity.json` são obrigatórios na raiz; `signature.json` é reservado e obrigatório quando a política de distribuição exigir assinatura.
2. `manifest.entry` aponta para HTML local, em caminho relativo seguro. JS/CSS/assets podem ficar em quaisquer subdiretórios. O host preserva caminhos e imports relativos.
3. `integrity.json` lista **todos** os arquivos regulares exceto ele próprio e `signature.json`; cada registro contém `path`, tamanho exato dos bytes descomprimidos e SHA-256 desses bytes. Arquivo extra ou ausente é inválido.
4. Caminhos normalizados, sem traversal, symlink, entradas duplicadas ou ZIP criptografado. Impor limites de arquivo/entrada/descompressão.
5. `signature.json` segue o contrato Ed25519 da ADR 0002. O schema de assinatura 0.1 detalhado na ADR 0010 ainda está **proposto**.
6. Distribuição e certificação não alteram o ZIP original: envelopes externos pertencem a DIS; SEC determina rejeição, confiança e quarentena.
7. O inventário 0.1 **não** contém tipo autenticado nem magic number. Esses controles dependem de migração versionada futura; SEC-001 documenta o objetivo, não a funcionalidade atual.

## Exemplo de árvore
```text
jogo.vlg
  manifest.json
  integrity.json
  signature.json             # quando assinado
  web/index.html
  web/game.js
  assets/sprite.png
```
`web/index.html` é válido como `manifest.entry`; `integrity.json` lista `manifest.json`, `web/index.html`, `web/game.js` e `assets/sprite.png`.

## Exemplo de manifesto 0.1
```json
{
  "schemaVersion":"0.1",
  "id":"org.example.runner",
  "name":"Runner",
  "version":"1.0.0",
  "entry":"web/index.html",
  "runtime":"web",
  "display":{"mode":"adaptive","orientation":"landscape","aspectRatio":"16:9"},
  "input":{"actions":["left","right","pause"]},
  "capabilities":{"required":["input.buttons","output.graphics"],"optional":[]}
}
```
Exemplo de formato, não pacote pronto: o inventário real exige hashes e tamanhos efetivos.

## Fontes
[Formato](../../docs/02-vlg-package.md), [manifesto](../../docs/03-manifest.md), [schema](../../schemas/manifest.schema.json), [ADR 0002](../../adr/0002-signature-design.md), [ADR 0010 proposta](../../adr/0010-signature-envelope-schemas.md).
