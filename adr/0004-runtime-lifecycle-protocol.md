# ADR 0004 — Protocolo mínimo e ciclo de vida do VLG

**Status:** Aprovado em 2026-11-18  
**Escopo:** protocolo COVIL 0.1, núcleo de execução, sem serviços opcionais

## Contexto

O COVIL deve executar jogos VLG potencialmente hostis (ADR 0003), independentemente de apresentação `emulator`, `mobile` ou `adaptive`. O jogo não controla permissões, a sessão, a interface privilegiada nem o encerramento de seu próprio isolamento. Precisamos de um contrato pequeno e implementável antes de incluir serviços avançados.

## Decisão

**O host é a autoridade sobre sessão, estado, permissões, viewport e entrega de entrada.** O jogo é responsável por sua lógica e renderização no contexto isolado. A comunicação de referência Web/PWA usa um `MessageChannel` privado, estabelecido pelo host após a criação do iframe isolado, conforme ADR 0003.

### Envelope experimental 0.1

```json
{"covil":"0.1","sessionId":"opaque-random-session","id":"message-1","type":"host.init","payload":{"protocol":"0.1","capabilities":[]}}
```

Campos obrigatórios: `covil`, `sessionId`, `id`, `type`, `payload`. `replyTo` é opcional e só serve à correlação; **não** concede autoridade. Validar tipo, esquema, tamanho, estado da sessão e capacidades em cada mensagem. IDs de sessão são imprevisíveis e exclusivos por execução. Mensagens fora de estado, de sessões anteriores ou desconhecidas não executam operações privilegiadas.

### Fluxo mínimo

1. **CREATED:** host valida o pacote, prepara origem/isolamento, cria iframe e canal privado.
2. **INITIALIZING:** host entrega o canal por bootstrap controlado e envia `host.init` com versão, capacidades concedidas, viewport e ações de entrada. O VLG responde `game.ready` ou `game.error`.
3. **READY:** o host decide quando enviar `host.start`; não iniciar a simulação antes disso.
4. **RUNNING:** o host entrega `host.input` e `host.display`; pode enviar `host.pause`.
5. **PAUSED:** jogo interrompe simulação e entrada de gameplay até `host.resume`; renderização de pausa é permitida. O host pode alterar viewport ou encerrar a qualquer momento.
6. **STOPPING:** host envia `host.stop` como solicitação cooperativa; jogo pode responder `game.stopped`.
7. **TERMINATED:** host invalida sessão/canal, remove iframe e descarta mensagens tardias. **`game.stopped` não é necessário para o host concluir o encerramento.**

`game.error` informa falha, mas não obriga o host a continuar executando. Falha de inicialização, timeout, mensagem inválida recorrente ou violação de política podem levar a `TERMINATED`. O host nunca depende de uma resposta do VLG para revogar permissões ou encerrar a sessão.

### Mensagens do núcleo

| Direção | Tipo | Significado |
|---|---|---|
| host → game | `host.init` | Configuração inicial e capacidades concedidas |
| game → host | `game.ready` | Jogo inicializado |
| host → game | `host.start` | Autoriza iniciar a simulação |
| host → game | `host.pause` | Suspende simulação |
| host → game | `host.resume` | Retoma simulação |
| host → game | `host.stop` | Solicita limpeza cooperativa |
| game → host | `game.stopped` | Confirma limpeza, quando possível |
| game → host | `game.error` | Informa erro |
| host → game | `host.display` | Informa viewport/orientação/densidade |
| host → game | `host.input` | Entrega ação abstrata pressionada/liberada |

### Apresentação e entrada

`host.init` inclui `viewport: {width, height, dpr, orientation}` e `actions: string[]`. `host.display` atualiza as dimensões lógicas e orientação. `host.input` transporta ações abstratas e seu estado `pressed`, sem depender do teclado físico. O modo de apresentação **não** modifica o protocolo ou a fronteira de isolamento. Toque, teclado, gamepad e controles virtuais podem coexistir, sujeitos às permissões do host.

### Segurança e extensibilidade

- O VLG **não** pode emitir mensagens `host.*` com efeito no console; direção e estado são validados.
- Capacidades e serviços opcionais são negados por padrão e exigem contrato próprio, autorização explícita e validação de cada chamada.
- O canal privado é meio de transporte, não substituto de isolamento, CSP ou política de rede.
- O host controla foco, encerramento, sessão e permissões; o jogo não pode elevar privilégios por mensagens ou manifesto.
- Implementações devem testar reordenação, duplicação, mensagens tardias, payloads malformados, floods, falta de `game.ready` e recusa de `game.stopped`.

## Não decidido nesta ADR

Os valores numéricos de timeouts, limites de tamanho/frequência, códigos de erro, negociação de versões, confirmação de pausa, semântica de gestos, áudio, salvamento, identidade, placares e rede serão definidos em decisões e testes subsequentes. Não presumir conformidade apenas pela existência dos tipos TypeScript.

## Consequências

Um único núcleo de protocolo atende jogos simples e complexos e permite que o Jogai seja o primeiro host sem tornar-se dependência da especificação COVIL. A especificação é independente de framework. A implementação real do host e a suíte adversarial ainda precisam ser construídas.
