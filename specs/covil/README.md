# COVIL — padrão de interoperabilidade jogo ↔ host

**Escopo:** contrato de execução e conexão entre jogos e hosts COVIL compatíveis, independentemente do formato de distribuição do jogo. COVIL **não** é um requisito de conformidade estrutural VLG.

## API pública de referência

```js
async function init(covil) {
  covil.controls.on("left", pressed => { /* ação lógica */ });
  covil.lifecycle.on("start", () => { /* iniciar simulação */ });
  covil.lifecycle.on("pause", () => { /* pausar simulação */ });
  covil.lifecycle.on("resume", () => { /* retomar simulação */ });
  covil.lifecycle.on("reset", () => { /* restaurar partida */ });
  covil.lifecycle.on("stop", () => { /* liberar recursos */ });
}
```

`init(covil)` é chamado pelo SDK após `host.init` e antes de `game.ready`. A simulação começa somente após `host.start`. `reset` é **proposta de extensão**: restaura estado da partida sem destruir a sessão, recriar o canal ou chamar `init` novamente; o host conserva a autoridade sobre execução/pausa. **Não implementado nem incluído no protocolo 0.1 vigente.**

`covil.has(id)` consulta capacidades concedidas. `covil.controls.on(action, callback)` recebe ações lógicas independentes do dispositivo físico. `covil.lifecycle.on(event, callback)` registra eventos do host. `covil.request` e fachadas privilegiadas ainda não estão implementadas.

## Responsabilidades

O jogo controla sua lógica; o SDK traduz mensagens em API pública; o host valida capacidades, controla `start/pause/resume/stop`, mapeia dispositivos, isola código não confiável e impõe permissões. O transporte Web de referência usa `MessageChannel` privado com sessão imprevisível; não substitui sandbox, CSP ou controles de rede.

## Fontes e conformidade

- [API pública](../../docs/09-vlg-public-api.md)
- [Protocolo](../../docs/04-runtime-protocol.md)
- [Núcleo experimental](../../docs/11-core-runtime-contract.md)
- [SDK de referência](../../sdk/covil-core.mjs)
- [ADR lifecycle vigente](../../adr/0004-runtime-lifecycle-protocol.md)
- [Setores APP, CAP e RUN](../README.md)

**Estado:** o SDK é parcial; `reset`, RPC de serviços, host de navegador seguro e testes de dois hosts independentes permanecem pendentes. Uma implementação pode ser COVIL compatível sem distribuir VLG; o carregador e sua política são escolhas do host.
