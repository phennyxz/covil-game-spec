# COVIL-SEC — Segurança e confiança (0.1)

**Destinação:** requisitos transversais de integridade, autenticação, isolamento, confiança e resposta a incidentes. **Estado:** regras documentadas, implementação de assinatura e host seguro pendentes.

## Regras
1. Tratar qualquer VLG recebido como não confiável. Validar ZIP, manifesto, inventário, hashes e limites antes de executar.
2. Qualquer divergência de inventário é rejeição **OFPI** conforme [SEC-001](001-strict-package-integrity-ofpi.md), com bloqueio e quarentena apropriada ao ambiente.
3. SHA-256 confirma integridade contra o inventário, mas não autentica sua origem. Ed25519 autentica assinatura; reconhecimento de chave/assinatura e decisão de admissão do host são verificações separadas.
4. A assinatura do desenvolvedor cobre prefixo de domínio e bytes exatos de `integrity.json` (ADR 0002). Envelope do distribuidor, **quando adotado pelo host**, é externo e vinculado aos bytes exatos do VLG (ADRs 0009 e 0011).
5. `issuer`, `authorityId` e `locator` servem à descoberta de credenciais, não criam confiança. O host escolhe âncoras confiáveis e valida cadeia/escopo/revogação segundo [SEC-002](002-authority-discovery-trust-resolution.md).
6. Mesmo um VLG assinado e autorizado continua sendo código não confiável: sandbox, CSP, política de rede e capacidades são obrigatórios.
7. Reconhecimento de chave/assinatura não equivale a identidade civil verificada, homologação técnica ou garantia de software seguro. Homologação e distribuição são decisões do host (ADR 0011).

## Exemplo de falhas distintas
```text
HASH_MISMATCH       -> pacote inválido, OFPI, quarentena
UNKNOWN_KEY         -> integridade pode estar correta; confiança recusada
INVALID_SIGNATURE   -> assinatura inválida; execução bloqueada
MISSING_CAPABILITY  -> pacote pode ser confiável, mas host incompatível
```
Não fundir erros de confiança com erros de integridade.

## Fontes
[Segurança original](../../docs/06-security.md), [ADR 0002](../../adr/0002-signature-design.md), [ADR 0003](../../adr/0003-vlg-execution-isolation.md), [ADR 0009](../../adr/0009-distribution-trust-chain.md).
