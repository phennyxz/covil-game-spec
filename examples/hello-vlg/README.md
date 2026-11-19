# Hello VLG

Jogo mínimo independente de framework, usando o SDK experimental `sdk/covil-core.mjs` copiado para `covil-core.mjs` dentro do pacote. O manifesto exige `input.buttons` e `output.graphics`.

`game.js` implementa `async init(covil)` e assina ações com `covil.controls.on`. O SDK implementa `game.ready` e o ciclo de vida sobre o `MessageChannel`. O host deve validar capacidades obrigatórias **antes** de executar o código.

Gerar pacote: `node tools/build-example.mjs`. Validar: `node tools/validate-vlg.mjs dist/hello-vlg.vlg`.

**Segurança:** este exemplo e o SDK não constituem um host seguro; não execute VLGs de terceiros em uma página privilegiada. RPC, permissões dinâmicas, assinatura Ed25519 e isolamento de produção continuam pendentes.
