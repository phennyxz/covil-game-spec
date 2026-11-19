# ADR 0005 — Entrada e controles abstratos

**Status:** Aprovado em 2026-11-19  
**Escopo:** COVIL 0.1, entrada de gameplay para `emulator`, `mobile` e `adaptive`

## Decisão

**O VLG declara ações lógicas; o COVIL host gerencia dispositivos físicos e virtuais, mapeamento e entrega de eventos.** O jogo não depende de um teclado, controle, layout visual ou plataforma específica. A entrada de gameplay é mediada pelo host e entregue via `host.input` no canal privado definido na ADR 0004. A fronteira de isolamento permanece sob responsabilidade do host (ADR 0003).

## Contrato mínimo

- `manifest.input.actions` é uma lista de nomes de ações aceitas pelo jogo (por exemplo `up`, `down`, `left`, `right`, `jump`, `accelerate`, `pause`). Nomes devem ser únicos, não vazios e tratados como identificadores, não como comandos executáveis.
- `host.init.payload.actions` informa as ações negociadas/ativas. O host não deve enviar ações não declaradas ou não negociadas.
- `host.input.payload` mínimo: `{ "action": "jump", "pressed": true }`; `pressed: false` significa liberação. O evento descreve **estado lógico**, não keycodes, coordenadas ou detalhes do dispositivo.
- O host decide quais teclas, botões virtuais, controles físicos e mecanismos acessíveis acionam cada ação. Remapeamento pelo usuário não exige alteração do VLG.
- Ações simultâneas são permitidas. Múltiplos dispositivos podem contribuir para a mesma ação: o host deve consolidar o estado lógico, evitando liberar uma ação enquanto outro dispositivo ainda a mantém pressionada.
- O console é dono do foco, da interface privilegiada e dos controles de sistema. Ações de gameplay não podem ser usadas para obter capacidades, navegar o host ou simular comandos privilegiados.
- Ao pausar, perder foco ou encerrar, o host deixa de entregar entrada de gameplay e limpa os estados pressionados para impedir teclas/botões presos. O jogo deve interromper a simulação quando pausado, conforme ADR 0004.
- O modo de exibição não determina o dispositivo de entrada. `emulator`, `mobile` e `adaptive` compartilham o mesmo contrato.

## Exemplo

```json
{
  "input": {
    "actions": ["left", "right", "accelerate", "brake", "pause"]
  }
}
```

Um botão virtual, tecla ou gatilho pode ser mapeado para `accelerate`, gerando:

```json
{"covil":"0.1","sessionId":"opaque-random-session","id":"input-42","type":"host.input","payload":{"action":"accelerate","pressed":true}}
```

O host valida estado, esquema, ação permitida, tamanho e sessão. O jogo recebe apenas o estado lógico. O host pode implementar entrada por toque diretamente no jogo **somente** se houver um contrato específico e seguro para isso; o núcleo abstrato não autoriza acesso ao DOM do console.

## Não decidido nesta ADR

Eventos analógicos (eixos, gatilhos graduais), gestos, coordenadas de toque, múltiplos jogadores, ordenação e timestamps de eventos, repetição, acessibilidade avançada, política de mapeamento padrão, APIs de remapeamento e vibração/haptics requerem especificações adicionais. A ausência dessas extensões não impede jogos básicos com ações digitais.

## Consequências

O mesmo pacote VLG pode executar em diferentes hosts sem alterar sua lógica de entrada. O COVIL mantém autoridade sobre dispositivos e foco. A ADR define o contrato; não certifica a implementação nem dispensa testes de entrada adversarial.
