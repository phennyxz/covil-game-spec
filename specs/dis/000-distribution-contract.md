# COVIL-DIS — Publicação e distribuição (0.1)

**Destinação:** autorizar publicação de um pacote já assinado sem alterar o VLG original. **Estado:** arquitetura aprovada na ADR 0009; schemas de envelopes propostos na ADR 0010; código de assinatura pendente.

## Regras
1. Desenvolvedor assina inventário do VLG. Distribuidor valida pacote e identidade, decide publicação e assina **envelope externo**.
2. Envelope vincula autorização ao SHA-256 dos **bytes exatos do VLG**; não substitui nem remove assinatura do desenvolvedor.
3. Autorização de publicação e homologação técnica são declarações distintas. Nenhuma significa segurança absoluta.
4. Política de catálogo/canal é suficiente para MVP. Hosts individuais, grupos e conteúdo cifrado são opcionais/futuros; restrição por host não impede execução em host modificado.
5. Um host verifica assinatura do distribuidor, cadeia de confiança, prazo, escopo, hash do VLG e política local antes da execução.
6. Registro de chaves e autoridade são serviços **independentes e federáveis**, não dependências obrigatórias do formato.

## Exemplo de release
```text
release/
  game.vlg
  distribution.json
  distribution.sig
```
O `distribution.json` pode incluir `issuer`, `issuerKeyId`, `packageSha256`, `scope.catalog`, `scope.channel` e `authorization`, segundo versão aprovada do schema. Não inserir os dois arquivos de distribuição dentro do ZIP.

## Fontes
[ADR 0009](../../adr/0009-distribution-trust-chain.md), [ADR 0010 proposta](../../adr/0010-signature-envelope-schemas.md), [schema experimental](../../schemas/distribution.schema.json), [DIS-001](001-destination-and-authority-policy.md).
