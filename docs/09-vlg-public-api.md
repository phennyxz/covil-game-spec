# API pública do VLG — contrato de alto nível (0.1 experimental)

**Decisão:** [ADR 0008](../adr/0008-vlg-public-api.md). **Estado:** desenho aprovado; SDK não implementado.

## Entrada e ciclo de vida

O desenvolvedor implementa `async function init(covil)`. O SDK recebe `host.init` no canal isolado e chama `init` apenas após a verificação prévia das capacidades obrigatórias pelo host. Quando a função termina com sucesso, o SDK envia `game.ready`; o jogo só executa simulação após `host.start`. O host pode pausar, revogar permissões e encerrar unilateralmente a sessão.

## Métodos comuns

```ts
interface Covil {
  has(capabilityId: string): boolean;
  request(capabilityId: string): Promise<boolean>;
  controls: { on(action: string, listener: (pressed: boolean) => void): () => void };
  haptics?: { vibrate(durationMs: number): Promise<void> };
  storage?: { load(key: string): Promise<unknown>; save(key: string, value: unknown): Promise<void> };
  audio?: { play(assetId: string): Promise<void> };
  camera?: { capture(): Promise<unknown> };
  motion?: { onChange(listener: (sample: unknown) => void): () => void };
  network?: { send(data: unknown): Promise<void> };
}
```

Esta interface ilustra os nomes e o formato de uso; os tipos, limites e operações por capacidade ainda serão refinados. Métodos opcionais podem não existir se a capacidade não for implementada. Mesmo com `has() === true`, chamadas podem falhar por revogação ou restrições operacionais. `request()` só pode tentar ativar capacidades opcionais declaradas no manifesto e permitidas pelo host.

## Exemplo de uso

```js
async function init(covil) {
  covil.controls.on("left", pressed => { state.left = pressed; });
  covil.controls.on("right", pressed => { state.right = pressed; });

  if (covil.has("storage.save")) {
    const saved = await covil.storage.load("slot1");
    if (saved) state.restore(saved);
  }
  if (covil.has("output.haptics")) {
    await covil.haptics.vibrate(50);
  }
}
```

O exemplo é ilustrativo e depende de um objeto `state` definido pelo jogo. O SDK não expõe tokens, cookies, DOM do host, rede irrestrita ou APIs privilegiadas ao iframe. A implementação do host valida todas as solicitações recebidas pelo `MessageChannel`.

## Relação com o manifesto

```json
{
  "capabilities": {
    "required": ["input.buttons", "output.graphics"],
    "optional": ["storage.save", "output.haptics"]
  }
}
```

Os identificadores seguem o [registro de capacidades](08-capability-registry.md). O host bloqueia o lançamento se faltar uma capacidade obrigatória. Capacidade opcional não concedida deve ser tratada pelo jogo sem falha fatal.

## Próximas definições

Esquemas de mensagens de chamada/resposta, erros, limites, eventos de revogação, quotas e testes de integração do SDK/host. O protótipo `hello-vlg` ainda utiliza o protocolo diretamente.
