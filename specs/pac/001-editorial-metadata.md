# PAC — Metadados editoriais do VLG (proposta)

**Destinação:** declarar informações de identificação, descoberta, classificação e conteúdo do jogo remetido a hosts COVIL. **Estado:** proposta documental; ainda não altera o schema `manifest.schema.json` 0.1, o builder nem o validador.

## Princípios

1. Os metadados editoriais pertencem ao **`manifest.json`**, junto das declarações técnicas. Não se cria um novo arquivo obrigatório para catálogo ou classificação.
2. O manifesto integra o `integrity.json`; a assinatura de autoria cobre o inventário conforme ADR 0002. Logo, modificar metadados após a assinatura invalida a integridade autenticada.
3. Informações editoriais são **declarações atribuíveis ao remetente**, não evidência automática de veracidade. A autoridade COVIL deve confrontar declarações materiais com evidências técnicas, operacionais e de conformidade antes de reconhecer uma versão para produção.
4. A política OFPI alcança divergências materiais de conteúdo e classificação, além de falhas técnicas. O procedimento deve distinguir falha objetivamente comprovada, suspeita que requer análise e diferença editorial não material. Não presumir fraude por erro subjetivo de categorização.
5. Assinatura de autoria, vínculo da chave com a identidade e **aprovação da versão pela autoridade** são atos distintos. Um pacote apenas assinado não é automaticamente homologado.
6. A aprovação deve vincular-se à versão exata verificada e à política aplicada. Mudanças no pacote exigem nova verificação; evidências posteriores podem justificar suspensão ou revogação.
7. O fluxo local de desenvolvimento pode omitir campos editoriais de remessa e assinatura. O perfil de **remessa oficial** exigirá os campos definidos pela futura revisão versionada do schema e a assinatura válida.
8. Metadados de classificação e conformidade não substituem análise humana, políticas do host ou obrigações legais. O host continua obrigado a isolar a execução, mesmo de VLG reconhecido.

## Grupos de campos propostos

| Grupo | Campos candidatos | Finalidade |
| --- | --- | --- |
| Identificação editorial | `title`, `description`, `languages` | Exibição e compreensão pelo destinatário |
| Descoberta | `genres`, `tags` | Catálogo, busca e organização |
| Classificação | `ageRating.system`, `ageRating.value`, `ageRating.status` | Declarar sistema, faixa e origem da classificação |
| Conteúdo e interações | `content.violence`, `content.userInteraction`, `content.advertising`, `content.inAppPurchases` | Análise de riscos, políticas do host e proteção de usuários |

**Observações:** os nomes, enums, obrigatoriedade, internacionalização, semântica de `false` versus `unknown`, critérios de classificação e versionamento ainda precisam ser definidos. Um valor `self_declared` significa apenas declaração do remetente; não equivale a classificação oficial. Os campos de conteúdo não são uma lista exaustiva de obrigações legais.

## Exemplo conceitual de seção do manifesto

```json
{
  "metadata": {
    "title": "Corrida Infinita",
    "description": "Corrida procedural em perspectiva isométrica.",
    "genres": ["runner", "arcade"],
    "tags": ["procedural", "isometric"],
    "languages": ["pt-BR"],
    "ageRating": {
      "system": "CLASSIND",
      "value": "L",
      "status": "self_declared"
    },
    "content": {
      "violence": false,
      "userInteraction": false,
      "advertising": false,
      "inAppPurchases": false
    }
  }
}
```

**Exemplo não normativo:** não representa classificação efetivamente concedida e não deve ser interpretado como manifesto 0.1 validável. O manifesto completo conserva os campos técnicos atuais, como `entry`, `runtime`, `input` e `capabilities`.

## Recebimento, OFPI e homologação

- **Recebimento:** verificar estrutura, inventário, assinatura e identidade da chave antes de considerar o pacote para produção.
- **Análise:** comparar metadados materiais com comportamento, recursos, conteúdo e critérios de conformidade aplicáveis. Divergência material bloqueia homologação enquanto não resolvida, com isolamento e registro de evidências segundo SEC.
- **Reconhecimento:** a autoridade registra aprovação da versão exata sob uma política identificável. Não confundir assinatura de autoria com atestado de aprovação.
- **Pós-publicação:** novas evidências podem provocar reanálise, suspensão e comunicação aos hosts; a implementação de distribuição de estados de confiança é tratada em SEC/DIS.

## Integração setorial

- **PAC:** forma e semântica das declarações editoriais no manifesto.
- **SEC:** OFPI, autenticidade, evidências, quarentena e revogação.
- **DIS:** critérios de submissão, homologação e publicação.
- **DEV:** coleta assistida dos metadados no processo de remessa, sem exigir burocracia no ciclo local.
- **RUN:** aplicação das políticas de execução e isolamento.

## Próxima etapa normativa

Antes de incorporar ao schema, definir taxonomias, campos exigidos por perfil, validação de conteúdo, internacionalização, política de classificação etária e testes de conformidade. Fazer a alteração por revisão versionada do contrato, preservando a compatibilidade declarada da versão 0.1.
