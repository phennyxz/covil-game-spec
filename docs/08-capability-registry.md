# COVIL 0.1 — Registro de capacidades

**Status:** catálogo de identificadores aprovado para a especificação experimental 0.1; contratos de mensagens específicos ainda pendentes.  
**Fonte estruturada:** [capabilities.registry.json](../schemas/capabilities.registry.json).

## Regras

1. Um identificador representa uma **função observável do host**, não um dispositivo físico nem uma garantia de desempenho.
2. A presença neste catálogo **não** significa que todo host implemente ou conceda a capacidade.
3. O host verifica a lista `required` antes de iniciar o jogo. Capacidade desconhecida, não implementada ou não concedida bloqueia a inicialização se obrigatória; se opcional, não bloqueia.
4. O host medeia acesso, autorização, escopo e revogação. Nenhum identificador autoriza acesso direto a APIs privilegiadas.
5. As categorias `input`, `output`, `sensors`, `storage`, `network` e `platform` agrupam funções; não são permissões em bloco.
6. `core` indica função fundamental esperada de um host COVIL 0.1; `extension` indica suporte facultativo. O host pode satisfazer `input.buttons` com controles virtuais, teclado ou gamepad.
7. Nenhum identificador implica FPS, CPU, GPU, RAM, largura de banda, resolução mínima ou latência garantida.
8. Uma capacidade que dependa de permissão ou mediação segura deve ser anunciada como indisponível se o host não puder fornecê-la com segurança.
9. Novos identificadores requerem definição e versionamento; identificadores existentes não devem mudar de significado silenciosamente.

## Identificadores oficiais

| Identificador | Nível | Significado |
|---|---|---|
| `input.buttons` | core | Host delivers named digital action press/release events via host.input; physical buttons are not required. |
| `input.touch` | extension | Host can supply touch contacts/gestures to game through an explicitly negotiated interface; not equivalent to input.buttons. |
| `input.pointer` | extension | Host can supply pointer position and button events in game-local coordinates. |
| `input.keyboard` | extension | Host can supply keyboard events or key-level information; not required for input.buttons. |
| `input.gamepad` | extension | Host can expose gamepad-specific buttons or axes; a gamepad is not necessary for input.buttons. |
| `input.motion` | extension | Host can deliver motion/orientation sensor samples after platform and permission checks. |
| `output.graphics` | core | Host provides an isolated drawable viewport and reports its dimensions; does not guarantee WebGL, FPS or a particular resolution. |
| `output.audio` | extension | Host permits audible playback under user gesture, mute and volume policy; not a microphone capability. |
| `output.haptics` | extension | Host can perform bounded vibration/haptic requests; no guarantee of waveform precision. |
| `output.fullscreen` | extension | Host can request an expanded/fullscreen presentation when supported and permitted; game cannot control host chrome directly. |
| `output.orientation` | extension | Host can attempt requested display orientation when supported; not guaranteed to lock orientation. |
| `sensors.camera` | extension | Host can mediate camera data after explicit user permission; never implies direct iframe camera access. |
| `sensors.microphone` | extension | Host can mediate microphone data after explicit user permission; never implies direct iframe microphone access. |
| `sensors.location` | extension | Host can mediate location information with explicit permission and scope. |
| `storage.save` | extension | Host can persist and retrieve per-game isolated save data; no access to another game's saves or host storage. |
| `storage.file-import` | extension | Host can mediate user-selected file import; no arbitrary filesystem access. |
| `network.multiplayer` | extension | Host can provide an approved multiplayer transport/service; does not imply unrestricted fetch/WebSocket access. |
| `platform.identity` | extension | Host can expose a scoped pseudonymous player identity; never raw host tokens or credentials. |
| `platform.achievements` | extension | Host can record/retrieve achievements within its own service contract. |
| `platform.leaderboard` | extension | Host can submit/read scores within its own service contract. |
| `platform.notifications` | extension | Host can mediate notifications subject to platform/user permission. |
| `platform.payments` | extension | Host may offer a controlled purchase flow; game never receives payment credentials. |
| `platform.share` | extension | Host may invoke a user-approved share flow; not automatic publishing. |

## Observações de interoperabilidade

- `input.buttons` entrega **ações lógicas** definidas em `manifest.input.actions`; não garante botões físicos. `input.touch`, `input.pointer`, `input.keyboard` e `input.gamepad` são interfaces mais específicas, não pré-requisitos para ações digitais.
- `output.graphics` fornece área de desenho isolada e dimensões; não promete WebGL/WebGPU.
- `storage.save` fornece persistência isolada por jogo; quotas e API exata serão especificadas.
- `network.multiplayer` não equivale a acesso irrestrito à internet. O host deverá definir transporte, destinos autorizados e limites.
- `sensors.camera` e `sensors.microphone` exigem permissão e mediação apropriada; um iframe com origem opaca não deve receber acesso direto privilegiado.
- `platform.payments` e `platform.identity` nunca expõem credenciais ou tokens do host ao VLG.
- A declaração do manifesto não substitui o handshake e a negociação de concessões descritos nas ADRs 0004, 0006 e 0007.

## Fora do escopo atual

A semântica fina de gestos, eixos analógicos, formatos de mídia, APIs de armazenamento, eventos de revogação, quotas e mensagens de consulta/concessão será especificada por contratos posteriores. Este registro **não** certifica implementação de nenhuma dessas APIs em Jogai/COVIL.
