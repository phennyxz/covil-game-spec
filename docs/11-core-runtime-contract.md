# Núcleo mínimo de execução — contrato de implementação experimental 0.1

Este documento detalha o subconjunto já aprovado pelas ADRs 0003–0008. **Não aprova serviços sensíveis nem altera decisões arquiteturais.**

## Pré-execução

O host verifica integridade e política de assinatura, valida manifesto e compara `required` contra o conjunto de capacidades efetivamente concedidas. Desconhecida ou não concedida: bloquear antes de executar qualquer script VLG. `optional` não concedida: reportar como ausente. Concessões são por sessão; o jogo não escolhe a lista.

## Handshake

1. Host cria contexto isolado e `MessageChannel` privado; entrega uma porta à instância VLG.
2. Host envia `host.init` com `protocol: "0.1"`, `capabilities: string[]` concedidas, `viewport` e `actions`.
3. SDK do VLG invoca `async init(covil)` uma única vez.
4. Sucesso: `game.ready`; exceção: `game.error`.
5. Host envia `host.start` apenas após `game.ready`; eventos de `host.input` só produzem efeitos durante execução.
6. `host.pause` interrompe simulação; `host.resume` retoma; `host.stop` é definitivo. O host pode descartar o iframe sem aguardar confirmação.

Todos os envelopes incluem `covil`, `sessionId`, `id`, `type`, `payload`; `replyTo` é reservado para RPC. Validar origem/porta, sessão, direção, estado, tamanho e tipo antes de agir.

## API do SDK mínimo

- `covil.has(id)`: consulta a lista de concessões do `host.init`, sem efeitos colaterais.
- `covil.controls.on(action, callback)`: assina ação declarada pelo host; retorna função de cancelamento. Ações desconhecidas devem ser rejeitadas.
- `init(covil)` pode ser assíncrona; `game.ready` apenas após conclusão.
- `covil.request`, `storage`, `audio`, `camera`, `network` etc. **não são funcionais no núcleo mínimo**. Implementá-los requer contrato RPC, permissões e testes próprios.

## Segurança de referência

Um iframe sandbox com `allow-scripts` e **sem** `allow-same-origin` é apenas parte da barreira. O host deve também aplicar CSP restritiva, Permissions-Policy, controles de navegação e política efetiva de saída de rede. CORS não impede todo tráfego de saída. Não enviar credenciais ou objetos privilegiados. Não tratar `game.ready` como prova de confiança. O browser não garante limites rígidos de CPU/RAM.

## Pendências não bloqueantes do contrato conceitual, mas bloqueantes de produção

Limites exatos de mensagens e timeouts, protocolo de RPC, revogação, verificação Ed25519, chaves confiáveis, armazenamento offline de pacotes, testes adversariais de navegador, segundo host e compatibilidade de versões.
