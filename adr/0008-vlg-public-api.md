# ADR 0008 — API pública do VLG e inicialização

**Status:** Aprovado em 2026-11-19 (contrato de alto nível; SDK e transporte detalhado pendentes)

## Decisão

O VLG recebe um objeto de fachada `covil` em `async function init(covil)`, invocada pelo SDK do jogo **após** o host validar o manifesto e as capacidades obrigatórias, criar o iframe isolado e enviar `host.init`. A função de inicialização do jogo não substitui o handshake interno da ADR 0004. O SDK informa `game.ready` somente depois que `init(covil)` terminar com sucesso; `host.start` autoriza iniciar a simulação. Falha em `init` produz `game.error`; timeout/terminação permanecem sob autoridade do host.

Não haverá `covil.input()` nem `covil.output()` genéricos na API pública. Cada capacidade terá uma interface de domínio expressiva. O transporte entre jogo e host continua sendo um `MessageChannel` privado e validado, nunca acesso privilegiado direto ao ambiente do host.

## API comum

- `covil.has(capabilityId): boolean`: consulta **concessões atuais**, não apenas presença de hardware. Não solicita permissão.
- `covil.request(capabilityId): Promise<boolean>`: solicita ao host uma capacidade **declarada opcional** que admita concessão dinâmica; não autoriza capacidades ausentes do manifesto nem contorna política ou gesto do usuário. O host decide e pode negar. A concessão de capacidades obrigatórias é verificada **antes** de executar o VLG.
- O VLG pode receber notificações de alteração/revogação por mecanismo futuro do SDK; o host invalida imediatamente qualquer concessão revogada. A forma exata do evento ainda será padronizada.

## Interfaces específicas (superfície ilustrativa, ainda não SDK implementado)

| Capacidade | Fachada sugerida | Semântica |
|---|---|---|
| `input.buttons` | `covil.controls.on(action, callback)` | Ação lógica pressionada/solta, com remapeamento controlado pelo host |
| `output.haptics` | `covil.haptics.vibrate(durationMs)` | Pedido limitado e mediado de vibração |
| `output.audio` | `covil.audio.play(assetId)` | Reproduz recurso autorizado do jogo, sujeito a política de áudio |
| `storage.save` | `covil.storage.load(key)` / `save(key,value)` | Persistência isolada por VLG |
| `sensors.camera` | `covil.camera.capture()` | Captura mediada, após autorização |
| `input.motion` | `covil.motion.onChange(callback)` | Amostras autorizadas de movimento |
| `network.multiplayer` | `covil.network.send(data)` | Envio pelo transporte multiplayer autorizado |

Esses nomes são a **direção de desenho aprovada**; assinaturas completas, formatos, limites, erros, callbacks, ciclo de vida e compatibilidade entre versões exigem especificação por capacidade. A API não deve prometer funções em um host que não implementa a respectiva capacidade. `covil.has()` deve ser consultado antes do uso de recursos opcionais; qualquer chamada ainda pode falhar por revogação, limite ou mudança de ambiente.

## Exemplo

```js
async function init(covil) {
  covil.controls.on("accelerate", pressed => { moto.accelerating = pressed; });
  covil.controls.on("brake", pressed => { moto.braking = pressed; });

  if (covil.has("storage.save")) {
    const save = await covil.storage.load("player1");
    if (save) restore(save);
  }
  if (covil.has("output.haptics")) {
    // Exemplo de ação acionada pelo jogo, não efeito obrigatório de inicialização.
    await covil.haptics.vibrate(100);
  }
}
```

O código acima é **pseudocódigo de contrato**, não um exemplo executável sem o SDK e as funções do jogo. Para áudio, câmera, arquivos, pagamentos, identidade e rede, o host nunca entrega credenciais nem acesso indiscriminado a APIs nativas.

## Regras de segurança e interoperabilidade

1. O host valida manifesto e permissões obrigatórias antes de criar/executar código do jogo. `init` nunca é uma oportunidade de escapar dessa validação.
2. A fachada é código dentro do sandbox; operações privilegiadas são validadas e executadas pelo host. O objeto JS por si só **não é fronteira de segurança**.
3. O host valida mensagem, sessão, estado, capacidade concedida, parâmetros, tamanho, frequência e origem da solicitação. Revogação e `host.stop` cancelam operações pendentes quando possível.
4. `input.buttons` continua sendo entregue internamente por `host.input` (ADR 0005); `covil.controls.on` é apenas a abstração do SDK.
5. O SDK não requer framework, Jogai, Firebase, React ou hardware mínimo.
6. Uma implementação pode oferecer funcionalidades adicionais, mas não pode alterar silenciosamente a semântica de métodos padronizados.

## Fora do escopo desta ADR

SDK funcional, catálogo de erros, esquema wire para chamadas/respostas, eventos de revogação, API gráfica, quota de salvamento, transporte de mídia e modelos de concorrência. Os arquivos atuais em `examples/hello-vlg` ainda usam mensagens diretamente; a migração para o SDK será uma etapa de implementação separada.
