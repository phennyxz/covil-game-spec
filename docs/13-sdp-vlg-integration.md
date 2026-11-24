# Integração SDP ↔ VLG

**Decisão:** os dois padrões são contêineres ZIP. **SDP** é o formato aberto e genérico; **VLG** é sua especialização para jogos interoperáveis com COVIL. O VLG permanece neste repositório, enquanto o SDP mantém sua especificação independente em [SDP](https://github.com/phennyxz/SDP-Self-Declared-Digital-Package-Standard).

| Camada | Responsabilidade |
|---|---|
| SDP Core 0.1 | ZIP, `sdp.json`, inventário `integrity.json` SHA-256, `signature.json` Ed25519 opcional |
| VLG/COVIL | `manifest.json` do jogo, HTML de entrada, display, input, capacidades, `init(covil)`, ciclo de vida |
| CA/chaveiro | Exclusivamente identidade ↔ chave pública, validade e revogação; **não conhece nem homologa pacotes** |
| Host/Jogai | Verificação, confiança, permissões, sandbox, homologação e distribuição |

## Variante experimental SDP-backed VLG

```text
jogo.vlg (ZIP)
├── sdp.json            # declaração SDP: kind=game, creator, purpose, profiles
├── manifest.json       # contrato específico do jogo COVIL 0.1
├── integrity.json      # inventário SDP de todos os arquivos exceto integrity/signature
├── signature.json      # opcional: assinatura SDP Ed25519
├── covil-core.mjs      # SDK experimental
└── index.html / assets...
```

`sdp.json` declara o perfil `org.covil.runtime` v0.1. O `manifest.json` continua definindo `entry`, `display`, `input` e `capabilities`. O inventário SDP inclui **ambos** os manifestos. O perfil não duplica hashes ou assinatura.

## Compatibilidade e transição

**Histórico pré-SDP (sem lançamento):** o protótipo anterior usava: `manifest.json`, inventário `schemaVersion` e domínio de assinatura `COVIL-VLG-INTEGRITY-v1\n`. **Não é SDP**; não é um formato publicado que exija migração.

**VLG canônico 0.1 baseado em SDP:** inventário `sdpVersion`, domínio de assinatura `SDP-INTEGRITY-v1\n`. O builder e validador principais agora usam este contrato. Não há pacote VLG lançado que precise ser migrado; assinaturas históricas não podem ser reutilizadas. O envelope de autorização do distribuidor permanece **externo** ao ZIP assinado do desenvolvedor.

## Ferramentas canônicas (implementação experimental)

```bash
node tools/covil-build.mjs examples/hello-vlg dist/hello-vlg.vlg
node tools/validate-vlg.mjs dist/hello-vlg.vlg
node --test tests/conformance/sdp-vlg.test.mjs
```

As ferramentas canônicas reutilizam o SDK e os contratos de jogo do protótipo anterior, mas geram um ZIP com manifesto/inventário SDP. O validador experimental **não autentica assinaturas, não consulta CA e não substitui o verificador SDP Core independente**. Exige testes cruzados, fuzzing ZIP e conformidade de schemas antes de produção.

## Requisitos para concluir a migração

1. Vetores de interoperabilidade entre os dois repositórios e validação de assinatura Ed25519.
2. Schemas e regras de perfil VLG normativos, incluindo consistência entre `sdp.json` e `manifest.json`.
3. Testes adversariais e política de host isolado.
4. Versionamento público da variante VLG/SDP sem quebrar o VLG 0.1.
5. Adaptação do carregador Jogai/COVIL e testes reais de execução.
