# COVIL-APP — API de jogo (0.1)

**Destinação:** contrato visto pelo autor do jogo, sem expor transporte interno. **Estado:** `init`, `has`, controles e lifecycle em SDK experimental; APIs privilegiadas pendentes.

## Regras
1. O desenvolvedor cria jogo web comum, assets e manifesto. O SDK/adapter COVIL cuida do handshake; jogo não deve emitir `game.ready` diretamente.
2. `async init(covil)` prepara recursos e listeners; o SDK a chama após `host.init`. A simulação só começa após `host.start`.
3. Usar ações lógicas declaradas no manifesto (`left`, `right`, etc.) com `covil.controls.on`, sem depender de códigos de teclado ou gamepad.
4. Respeitar `start`, `pause`, `resume`, `stop`. Pausa interrompe a simulação; stop libera recursos.
5. `covil.has(id)` consulta concessões atuais; `covil.request(id)` e fachadas privilegiadas são propostas e **não funcionam no SDK 0.1**.
6. O jogo não acessa tokens, DOM do host, permissões ou credenciais do distribuidor.

## Exemplo — trecho da lógica de jogo
```js
async function init(covil) {
  covil.controls.on("left", pressed => { if (pressed) move(-1); });
  covil.controls.on("right", pressed => { if (pressed) move(1); });
  covil.lifecycle.on("start", startLoop);
  covil.lifecycle.on("pause", stopLoop);
  covil.lifecycle.on("resume", startLoop);
  covil.lifecycle.on("stop", dispose);
}
```
`move`, `startLoop`, `stopLoop` e `dispose` são funções do jogo; exemplo de API, não arquivo executável isolado. Para bootstrap executável veja `examples/hello-vlg/game.js`.

## Fontes
[API pública](../../docs/09-vlg-public-api.md), [guia do desenvolvedor](../../docs/12-responsibilities-and-developer-guide.md), [ADR 0008](../../adr/0008-vlg-public-api.md), [SDK](../../sdk/covil-core.mjs).
