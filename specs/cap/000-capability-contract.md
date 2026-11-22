# COVIL-CAP — Capacidades e concessões (0.1)

**Destinação:** funções disponibilizadas pelo host, não características de hardware. **Estado:** identificadores e listas no manifesto implementados; negociação e enforcement completos pendentes.

## Regras
1. Manifesto declara `capabilities.required` e `capabilities.optional` como listas disjuntas de IDs.
2. Host compara `required` com capacidades efetivamente **concedidas** antes de executar qualquer script. Ausência de requerida bloqueia; ausência de opcional permite degradação.
3. O registro de IDs é canônico em `schemas/capabilities.registry.json`. Um ID conhecido não significa suporte, concessão ou autorização irrestrita.
4. `input.buttons` e `output.graphics` são funções centrais; `input.buttons` pode ser fornecida por touch, teclado, controle virtual ou gamepad.
5. A concessão é por sessão, sujeita a escopo e revogação. O jogo não concede permissões a si próprio.
6. Acesso sensível deve passar pelo host, nunca por APIs privilegiadas diretas presumidas. Não impor requisitos mínimos de CPU/GPU/RAM.

## Exemplo
```json
"capabilities": {
  "required": ["input.buttons", "output.graphics"],
  "optional": ["storage.save", "output.haptics"]
}
```
Se `storage.save` não estiver disponível, o jogo ainda inicia. Se `output.graphics` não estiver concedida, o host rejeita a execução.

## Fontes
[Registro](../../docs/08-capability-registry.md), [IDs](../../schemas/capabilities.registry.json), [ADRs 0006](../../adr/0006-capability-negotiation.md) e [0007](../../adr/0007-capability-contract.md), [preflight](../../host/capability-preflight.mjs).
