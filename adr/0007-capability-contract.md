# ADR 0007 — Contrato declarativo de capacidades

**Status:** Aprovado em 2026-11-19  
**Escopo:** contrato funcional do manifesto VLG, sem requisitos mínimos de CPU, GPU ou RAM

## Decisão

Adotar `manifest.capabilities` com duas listas: `required` (obrigatórias) e `optional` (opcionais). Cada elemento é um identificador de capacidade padronizado, com namespace, por exemplo `input.buttons`, `output.graphics`, `storage.save`. Não introduzir requisitos mínimos de hardware no MVP. A compatibilidade é funcional: suporte efetivo e permissão de uso, não uma classificação de desempenho.

```json
{
  "capabilities": {
    "required": [
      "input.buttons",
      "output.graphics",
      "storage.save"
    ],
    "optional": [
      "input.gamepad",
      "input.motion",
      "output.audio",
      "output.haptics",
      "network.multiplayer"
    ]
  }
}
```

### Semântica

1. O COVIL verifica **antes de iniciar** se cada capacidade obrigatória pode ser concedida. Se alguma faltar, não inicia o VLG e informa os requisitos ausentes.
2. Capacidade opcional indisponível não bloqueia a inicialização; o host comunica o resultado.
3. Identificador desconhecido obrigatório bloqueia a inicialização; identificador desconhecido opcional é tratado como indisponível.
4. Disponibilidade e autorização são conceitos distintos. O host não concede câmera, microfone, rede ou qualquer outro recurso sensível só porque a API existe.
5. O VLG pode consultar a situação das capacidades durante a sessão; o host é autoridade sobre concessão, escopo e revogação (ADR 0006).
6. Declaração de capacidade não concede acesso direto a APIs privilegiadas. O isolamento e a mediação do host continuam obrigatórios (ADR 0003).
7. Os identificadores devem ser únicos em cada lista e não podem aparecer simultaneamente em `required` e `optional`. Um identificador não reconhecido não se transforma em permissão genérica.
8. O formato de lista é extensível; os nomes de exemplo ilustram o contrato, mas a semântica exata de cada capacidade e seu catálogo versionado precisam ser especificados antes de certificar interoperabilidade.

### Limite da decisão

A ADR **não** define hardware mínimo, pontuação de desempenho, FPS garantido ou quantidade de memória. Não confundir incompatibilidade funcional com desempenho insuficiente. Também não define as mensagens e APIs de cada recurso; elas serão contratos próprios.

### Migração do protótipo

O manifesto e o validador experimentais 0.1 existentes usam `capabilities: {storage, network}`. O novo formato aprovado **substitui** essa representação, mas schema, validador, exemplos e testes devem ser migrados em conjunto, sem afirmar suporte até essa integração estar concluída. Pacotes existentes precisarão ser atualizados ou tratados por uma política explícita de compatibilidade. Não interpretar automaticamente o formato antigo como concessão de novas capacidades.

## Registro publicado

O catálogo de identificadores da especificação experimental 0.1 está em [docs/08-capability-registry.md](../docs/08-capability-registry.md), com representação estruturada em [schemas/capabilities.registry.json](../schemas/capabilities.registry.json). A migração do manifesto, schema, validador e exemplos para `required`/`optional` foi realizada após a aprovação desta ADR; os contratos de execução por capacidade continuam pendentes.
