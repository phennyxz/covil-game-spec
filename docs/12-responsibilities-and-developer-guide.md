# Responsabilidades e fronteiras — guia para desenvolvedores e implementadores

**Status:** orientação arquitetural para COVIL 0.1 experimental. Este guia reúne decisões das ADRs 0002–0009; não substitui os contratos e não declara funcionalidades pendentes como implementadas.

> **Regra de ouro:** o jogo implementa a lógica; o SDK implementa a interface COVIL; o host controla dispositivos, execução e recursos; o distribuidor verifica e autoriza a publicação.

## Matriz de responsabilidades

| Tarefa | Responsável | Não cabe a |
| --- | --- | --- |
| Mecânica, simulação, desenho, assets e estado do jogo | Desenvolvedor do jogo | Host |
| Implementar `async init(covil)` e registrar ações abstratas | Desenvolvedor do jogo | Host |
| Expor `covil.controls.on`, `covil.has` e traduzir protocolo para API | SDK COVIL compatível | Jogo |
| Bootstrap `host.init` → `game.ready`, mensagens e sessão | SDK + host, cada lado do canal | Código de jogo ad hoc |
| Mapear teclado, touch, gamepad e botões físicos para ações | Host | Jogo e SDK embarcado |
| Determinar concessões, validar `required` e impedir início incompatível | Host | Jogo |
| Criar iframe/processo isolado, CSP, política de rede e permissões | Host | SDK |
| Enviar `host.start/pause/resume/stop`, gerir foco e estado | Host | Jogo |
| Reagir a `start/pause/resume/stop`, iniciar/parar timers | Jogo, via callbacks do SDK | Host não altera lógica interna |
| Validar manifesto, montar inventário SHA-256 e ZIP | Ferramentas de build COVIL compatíveis | Cada jogo manualmente |
| Assinar inventário original com chave privada do autor | Desenvolvedor ou serviço sob seu controle | Host |
| Conferir autoria, integridade e política de publicação | Servidor distribuidor | Jogo |
| Emitir autorização assinada em envelope externo ao VLG | Distribuidor | Jogo e SDK |
| Verificar cadeia de confiança, integridade e política local antes de executar | Host | Jogo |
| Emitir relatório de homologação técnica com evidências | Processo de homologação do distribuidor | Assinatura simples |

O **SDK oficial é uma implementação de referência, não um monopólio**: SDKs alternativos são permitidos se seguirem integralmente a API e o protocolo, com testes de conformidade. O jogo não deve criar seu próprio canal de controle incompatível e chamá-lo de COVIL.

## Contrato do desenvolvedor de jogos

1. Escrever HTML/CSS/JS/assets e `manifest.json` válidos. Declarar capacidades obrigatórias e opcionais e ações lógicas (`left`, `right`, `start` etc.).
2. Implementar `async init(covil)`, registrar `covil.controls.on(action, callback)` e callbacks de ciclo de vida quando aplicáveis.
3. **Não** ler `keydown`/gamepad/touch como mecanismo obrigatório de controles COVIL. O host mapeia dispositivos para ações. Jogos podem oferecer recursos locais adicionais apenas se a política/capacidade permitir e sem comprometer a portabilidade.
4. **Não** emitir `game.ready` diretamente via `window.parent.postMessage(..., "*")`, não inventar `window.covil.ready()`, nem implementar um `sdk.js` substituto que ignore `MessageChannel`, `sessionId` ou `host.init`.
5. **Não** iniciar simulação, timers ou operações privilegiadas antes de `host.start`. `init` prepara o jogo; `host.start` autoriza executar. Pausa deve suspender simulação; `stop` encerra a sessão.
6. Não presumir acesso a cookies, armazenamento, rede, identidade ou APIs do host. Usar capacidades concedidas e tratar ausência/revogação.
7. Não confundir pacote íntegro com pacote confiável: assinatura e homologação seguem políticas de distribuição.

## Contrato do SDK

- Entregar a API pública acordada, esconder os detalhes do envelope e usar a porta privada de sessão criada pelo host.
- Esperar `host.init` antes de chamar `init(covil)`; enviar `game.ready` **somente** após sucesso; comunicar falhas por `game.error`.
- Entregar ações lógicas e eventos de ciclo de vida; não substituir o host no mapeamento de hardware, permissões, sandbox ou verificação criptográfica.
- Validar mensagens recebidas conforme contrato e não expor autoridade do host ao jogo.
- A implementação atual `sdk/covil-core.mjs` é **experimental**: não oferece `covil.request` nem serviços privilegiados completos.

## Contrato do host

- Verificar pacote, confiança e capacidades obrigatórias **antes de executar qualquer script do VLG**.
- Criar isolamento, `MessageChannel` por sessão, e controlar handshake e transições de estado.
- Converter entradas físicas em `host.input` de ações declaradas; limpar estado de botões ao pausar, perder foco ou encerrar.
- Aplicar permissões, CSP, isolamento de origem, rede e limites; o SDK não é fronteira de segurança.
- A referência Web/PWA ainda **não possui host isolado completo**. `host/capability-preflight.mjs` é apenas uma função de pré-verificação.

## Contrato do distribuidor

- Validar assinatura Ed25519 do desenvolvedor e integridade do VLG original; registrar identidade e chave pública.
- Aplicar política de publicação e, quando exigida, homologação técnica com evidências.
- Assinar envelope **externo** ao ZIP original; não substituir assinatura do desenvolvedor.
- Proteger chave privada de distribuição; publicar metadados autenticados de confiança, validade e revogação.
- A ADR 0009 aprova a arquitetura; assinaturas e envelopes ainda **não estão implementados**.

## Exemplo de integração (pseudocódigo)

```js
// Código do jogo: sem leitura de teclado nem postMessage manual.
async function init(covil) {
  covil.controls.on("left", pressed => { if (pressed) turnLeft(); });
  covil.controls.on("right", pressed => { if (pressed) turnRight(); });
  covil.lifecycle.on("start", startSimulation);
  covil.lifecycle.on("pause", pauseSimulation);
  covil.lifecycle.on("resume", resumeSimulation);
  covil.lifecycle.on("stop", stopSimulation);
}
```

O exemplo omite o bootstrap de propósito: ele pertence à integração do **SDK oficial**. Para bootstrap funcional, consultar [hello-vlg](../examples/hello-vlg/) e [SDK experimental](../sdk/covil-core.mjs). O manifesto e as funções auxiliares devem ser fornecidos pelo jogo.

## Checklist de revisão para IA, agentes e colaboradores

Antes de gerar um jogo ou alterar o runtime:

- [ ] Li este guia, [API pública](09-vlg-public-api.md), [contrato mínimo](11-core-runtime-contract.md) e [manifesto](03-manifest.md).
- [ ] Não inventei IDs de capacidades, mensagens, métodos ou campos de manifesto.
- [ ] O jogo usa ações lógicas, não teclas físicas obrigatórias.
- [ ] O jogo não implementa um SDK ou bootstrap de protocolo próprio.
- [ ] `init` aguarda o host; `game.ready` é responsabilidade do SDK.
- [ ] Simulação começa apenas após `host.start` e respeita pause/resume/stop.
- [ ] Build produz inventário completo e ZIP aceito pelo validador.
- [ ] Assinatura do desenvolvedor e autorização do distribuidor são distintas.
- [ ] Não declarei compatibilidade, homologação ou segurança sem executar testes correspondentes.

## Fontes de autoridade

- [ADR 0002](../adr/0002-signature-design.md): inventário e assinatura do desenvolvedor.
- [ADR 0003](../adr/0003-vlg-execution-isolation.md): isolamento pelo host.
- [ADR 0004](../adr/0004-runtime-lifecycle-protocol.md): ciclo de vida e protocolo.
- [ADR 0005](../adr/0005-input-controls.md): controles e dispositivos.
- [ADRs 0006–0007](../adr/0006-capability-negotiation.md): negociação de capacidades.
- [ADR 0008](../adr/0008-vlg-public-api.md): API do jogo.
- [ADR 0009](../adr/0009-distribution-trust-chain.md): autorização e homologação.
