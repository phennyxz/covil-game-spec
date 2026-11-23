# COVIL-DIS — Publicação e distribuição (0.1)

**Destinação:** definir fronteiras de distribuição sem tornar homologação ou autorização de catálogo serviços centrais obrigatórios. **Estado:** ADR 0011 atualiza a política da ADR 0009; o envelope externo permanece extensão opcional, não implementada.

## Regras

1. O desenvolvedor assina seu inventário; a CA/chaveiro reconhece vínculos de chave/assinatura segundo declarações autenticadas, sem aprovar conteúdo.
2. O host/plataforma decide sua própria homologação, admissão, publicação, distribuição e execução.
3. Uma plataforma **pode** emitir autorização assinada em envelope externo, vinculada ao SHA-256 dos bytes exatos do VLG, conforme ADR 0009. Isso não é obrigatório ao formato.
4. O envelope não substitui nem altera a assinatura original do desenvolvedor; homologação, quando houver, deve ter significado e evidências próprios.
5. O host aplica suas próprias políticas de confiança, escopo, cache/revogação, integridade, isolamento e capacidades. Nenhuma assinatura autoriza contornar sandbox.
6. `schemas/distribution.schema.json` é um **exemplo experimental específico do Jogai**, não uma exigência universal para hosts.

## Exemplo opcional

```text
release/
  game.vlg
  distribution.json
  distribution.sig
```

Um host pode distribuir `game.vlg` sem esse envelope se sua política permitir; a ausência do envelope não torna o formato VLG inválido.

## Fontes

[ADR 0011](../../adr/0011-conformance-recognition-and-host-autonomy.md), [ADR 0009](../../adr/0009-distribution-trust-chain.md), [ADR 0010 proposta](../../adr/0010-signature-envelope-schemas.md), [DIS-001](001-destination-and-authority-policy.md).
