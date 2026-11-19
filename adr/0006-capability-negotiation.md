# ADR 0006 — Descoberta, negociação e concessão de capacidades

**Status:** Aprovado em 2026-11-19 (arquitetura; formato de manifesto e mensagens ainda experimental)

## Decisão

O VLG declara capacidades **obrigatórias** e **opcionais**, e pode consultar as categorias/capacidades que o COVIL oferece. O **COVIL host** verifica suporte real do dispositivo/navegador, sua própria implementação, políticas de segurança e autorizações do usuário antes de conceder qualquer capacidade. Disponibilidade **não** implica concessão. Um VLG não pode habilitar uma capacidade por conta própria.

### Estados distintos

- **requested:** declarado ou solicitado pelo VLG.
- **supported:** a combinação host + plataforma implementa o recurso.
- **permitted:** a política do host e, quando aplicável, o usuário autorizaram o uso.
- **granted:** a capacidade está ativa para a sessão, com limites e escopo determinados pelo host.

Consultas podem devolver informações de suporte e de concessão, sem expor dados pessoais ou detalhes sensíveis desnecessários. O host pode atualizar/revogar concessões ao longo da sessão.

### Compatibilidade

1. O host analisa as capacidades obrigatórias **antes de executar código do VLG**, com base no manifesto validado e no contexto de permissões.
2. Se uma capacidade obrigatória não puder ser concedida, **não inicia** o jogo; informa incompatibilidade ou permissão ausente de forma compreensível.
3. Se uma capacidade opcional não puder ser concedida, o jogo pode iniciar sem ela; o host informa sua ausência.
4. Se a capacidade exigir consentimento, o host controla a solicitação e nunca considera mera existência da API como autorização. Recusa equivale a indisponibilidade para aquela sessão.
5. Durante a execução, o VLG pode consultar o estado atualizado das capacidades. A revogação deve ser sinalizada, e o jogo deve degradar funcionalidades opcionais ou ser pausado/encerrado de modo controlado se perder uma capacidade obrigatória.
6. A consulta não concede permissões e não pode invocar APIs privilegiadas diretamente.

### Categorias de catálogo (extensíveis)

- **input:** touch/multitouch, pointer/mouse, keyboard, gamepad, movimento.
- **output:** áudio, vibração/haptics, tela cheia, orientação.
- **sensors:** microfone, câmera, geolocalização, sensores ambientais.
- **storage-network:** dados persistentes isolados, importação de arquivos, rede autorizada.
- **platform:** identidade mínima, placares, conquistas, notificações, pagamentos e compartilhamento.

Categorias servem à descoberta; **autorizações são por capacidade específica e escopo**, não uma liberação irrestrita da categoria inteira. Um host pode anunciar recurso não suportado como `supported: false`; não deve afirmar que suporta algo que não consegue mediar com segurança.

### Segurança

O isolamento definido na ADR 0003 permanece obrigatório. O COVIL é responsável por aplicar permissões; mensagens são validadas pelo protocolo da ADR 0004. Recursos sensíveis (câmera, microfone, rede, arquivos, localização, identidade, pagamentos) exigem mediação ou delegação tecnicamente segura. Se a PWA não conseguir garantir o isolamento exigido para uma capacidade, deve marcá-la como **não suportada**. Nenhuma assinatura de pacote concede automaticamente capacidades.

### Exemplos conceituais (não são o schema 0.1 atual)

```json
{
  "required": ["input.touch"],
  "optional": ["output.haptics", "sensors.motion"]
}
```

Um jogo com `input.touch` obrigatório não inicia num host sem touch efetivamente disponível e concedido. Um jogo que declare `output.haptics` opcional continua funcionando sem vibração.

### Pendências de interoperabilidade

Definir nomes canônicos, versão e namespace das capacidades, sintaxe definitiva no `manifest.json`, mensagens de consulta/resultado/alteração, política de prompts, estados de autorização, quotas, escopos e teste de conformidade. O schema e o validador 0.1 existentes ainda implementam o subconjunto legado `storage/network`; **não aceitar o exemplo acima como manifesto válido sem migração explícita**. Nenhum suporte a hardware está certificado por esta ADR.
