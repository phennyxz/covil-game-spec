# COVIL-DEV — Desenvolvimento, ferramentas e conformidade (0.1)

**Destinação:** caminho mínimo para criar um jogo web, empacotar e testar sem conhecer internamente o Jogai. **Estado:** builder, validador e testes experimentais disponíveis; assinatura, host seguro e portabilidade entre dois hosts pendentes.

## Regras para autores
1. Escreva HTML/JS/CSS que funcione no navegador. Separe lógica do jogo da integração com o host.
2. Declare `manifest.json`, ações lógicas e capacidades necessárias.
3. Use o SDK de referência ou alternativa compatível; não replique handshake com `postMessage` ad hoc.
4. Use `async init(covil)` e aguarde `host.start` para iniciar simulação.
5. Mantenha imports relativos válidos e assets no pacote. O builder injeta `covil-core.mjs` na raiz do VLG experimental.
6. Não inclua chaves privadas no VLG. Assinatura/publicação são passos separados ainda não implementados pelo builder.
7. Não anuncie conformidade plena sem testes de pacote, protocolo, host isolado e portabilidade.

## Exemplo de comandos executáveis (Node.js 20+)
```sh
node tools/covil-build.mjs examples/hello-vlg dist/hello-vlg.vlg
node tools/validate-vlg.mjs dist/hello-vlg.vlg
node --test tests/conformance/*.test.mjs
```
Esses comandos são instruções para execução local; a documentação não afirma que foram executados nesta consolidação. O builder gera **VLG não assinado para desenvolvimento**.

## Responsabilidades
- Jogo: mecânicas, desenho, assets, `init` e callbacks.
- SDK: fachada pública, mensagens e handshake.
- Host: isolamento, controles, concessões e lifecycle.
- Ferramentas: empacotar, inventariar e validar.
- Distribuidor: identidade, publicação, autorização assinada.

## Fontes
[Guia de responsabilidades](../../docs/12-responsibilities-and-developer-guide.md), [AGENTS](../../AGENTS.md), [exemplo](../../examples/hello-vlg/), [builder](../../tools/covil-build.mjs), [testes](../../tests/conformance/).
