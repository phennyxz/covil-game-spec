# ADR 0003 — Isolamento de execução VLG no COVIL

**Status:** Aprovado em 2026-11-18  
**Escopo:** COVIL Web/PWA, incluindo modos `emulator`, `mobile` e `adaptive`

## Decisão

**O COVIL (console/host) é o responsável pelo isolamento.** Todo código de um VLG é considerado potencialmente hostil, independentemente da validade da assinatura, identidade do desenvolvedor ou origem do pacote. O jogo não deve precisar implementar sua própria segurança para proteger o console.

Para a implementação Web/PWA de referência, adotar **iframe com atributo `sandbox`, origem opaca/isolada, políticas restritivas e canal privado `MessageChannel`**. O jogo não recebe acesso direto a DOM, cookies, credenciais, armazenamento, objetos ou APIs privilegiadas do console.

O modo de apresentação (`emulator`, `mobile`, `adaptive`) não altera a fronteira de segurança. O mesmo runtime isolado suporta HTML/CSS/JS, Canvas e WebGL. Workers/OffscreenCanvas podem ser usados **dentro do ambiente isolado** como otimização, mas não substituem a fronteira de segurança. Hosts nativos futuros podem usar isolamento por processo, mantendo as mesmas propriedades verificáveis e o protocolo COVIL.

## Requisitos para o host

1. **Validar antes de executar:** ZIP, caminhos, tamanhos, inventário SHA-256, manifesto e política de assinatura (ADR 0002).
2. **Separar origens:** conteúdo do VLG não compartilha a origem privilegiada do host. Preferir uma origem dedicada a jogos, com política que impeça acesso cruzado a dados entre jogos. Não combinar permissões de sandbox que anulem a separação.
3. **Sandbox mínimo:** permitir scripts quando necessário, mas negar por padrão navegação de topo, pop-ups, downloads, formulários, modais, permissões sensíveis e acesso à origem do host. Qualquer exceção precisa de justificativa e teste.
4. **Restringir recursos:** aplicar CSP, Permissions-Policy e controles de navegação/rede no contexto do jogo, inclusive para recursos secundários. Atributos de iframe isoladamente não garantem controle de tráfego de rede.
5. **Canal privado:** estabelecer `MessageChannel` por sessão; autenticar a origem/fonte durante bootstrap conforme o modelo de origem opaca; validar `sessionId`, esquema, estado, limites de tamanho e capacidades para **cada** mensagem. Nenhuma solicitação arbitrária do jogo pode invocar funções internas do console.
6. **Privilégio mínimo:** capacidades negadas por padrão. Serviços do console são expostos por uma API mediada e estritamente autorizada; não compartilhar tokens ou objetos privilegiados.
7. **Ciclo de vida:** host pode pausar, suspender, remover o iframe e invalidar canais/sessões; ignorar mensagens tardias após encerramento. Um VLG não pode manter acesso privilegiado após o fim da sessão.
8. **Recursos e falhas:** limitar mensagens, armazenamento, downloads, tamanho do pacote e solicitações; aplicar watchdogs e políticas de interrupção. Não prometer limites rígidos de CPU/memória que um navegador Web não consegue impor.
9. **Verificação adversarial:** testar VLGs que tentem ler dados do host, falsificar mensagens, usar capacidades não concedidas, navegar o topo, abrir pop-ups, registrar persistência e continuar operando após encerramento.

## Implementação Web de referência (ilustrativa)

```html
<iframe
  sandbox="allow-scripts"
  referrerpolicy="no-referrer"
  allow="camera 'none'; microphone 'none'; geolocation 'none'"
  src="https://games.example.net/session/opaque-id/">
</iframe>
```

O trecho **não** é uma implementação segura completa. A origem dedicada, CSP/Permissions-Policy servidas no contexto correto, políticas de rede, isolamento de armazenamento, bootstrap seguro, entrega dos arquivos e revogação de sessões devem ser implementados e testados em conjunto. Não confiar em `event.origin` como identificador único quando a origem é opaca (`null`); validar `event.source`, a transferência única do canal e um segredo de sessão não exposto a terceiros.

## Consequências

O COVIL Web utiliza uma única arquitetura para jogos emulador, mobile e adaptive. Assinatura identifica o responsável pelos bytes; isolamento protege o host contra o comportamento desses bytes. A especificação exige **propriedades e testes**, não que todos os futuros hosts usem obrigatoriamente iframe.

## Limitações e pendências

Browsers podem compartilhar processos e recursos; iframe não oferece contenção absoluta de CPU/memória nem proteção contra falhas do navegador. A política de carregamento offline, URLs por jogo, network allowlist, CSP detalhada, protocolo de bootstrap, quotas e testes adversariais precisam de especificações e implementação antes de declarar conformidade de segurança. A implementação atual do repositório **não** é um host seguro.
