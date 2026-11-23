# COVIL-RUN — Host e execução (0.1)

**Destinação:** obrigações do executor de VLG e protocolo de sessão. **Estado:** protocolo e SDK experimental; host seguro completo e segundo host inexistentes.

## Regras
1. Validar pacote, política de confiança e capacidades requeridas **antes de executar** qualquer código VLG.
2. Em Web/PWA, criar iframe com origem opaca isolada, `sandbox` restrito, CSP, Permissions-Policy e política efetiva de rede; `postMessage` isoladamente não é sandbox.
3. Usar `MessageChannel` privado e `sessionId` imprevisível por execução. Validar envelope (`covil`, `sessionId`, `id`, `type`, `payload`), direção, estado, tamanho e origem/porta.
4. Sequência: `host.init` → `game.ready` → `host.start`; depois `host.pause/resume/display/input`; `host.stop` termina. Host pode encerrar iframe sem cooperação do jogo.
5. Host converte dispositivos físicos em ações lógicas; jogo não controla console, permissões nem ciclo de vida.
6. O host não deve compartilhar tokens, cookies, objetos internos ou acesso direto a serviços sensíveis. Navegador não fornece limite rígido de CPU/RAM.

## Exemplo de mensagem
```json
{"covil":"0.1","sessionId":"opaque-random-session-id-at-least-16-chars","id":"message-1","type":"host.init","payload":{"protocol":"0.1","capabilities":["input.buttons","output.graphics"],"actions":["left","right"]}}
```
O exemplo é ilustrativo: a sessão deve ser imprevisível, e o payload real pode incluir viewport e outros dados previstos no protocolo. O SDK experimental exige `protocol`, `capabilities` e `actions`.

## Fontes
[Protocolo](../../docs/04-runtime-protocol.md), [núcleo](../../docs/11-core-runtime-contract.md), [display/entrada](../../docs/05-display-input.md), [ADR 0003](../../adr/0003-vlg-execution-isolation.md), [ADR 0004](../../adr/0004-runtime-lifecycle-protocol.md), [ADR 0005](../../adr/0005-input-controls.md).
