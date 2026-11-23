# Plano de migração — covil-game-spec → VLG

**Estado:** reorganização documental em branch, sem renomeação administrativa do GitHub, sem migração de arquivos de código e sem mudança de wire format.

1. O nome do formato é **VLG — Virtual Light Game**; COVIL nomeia somente o padrão de interoperabilidade jogo-host.
2. A especificação VLG fica em `specs/vlg/`; a integração COVIL em `specs/covil/`. Documentos históricos permanecem acessíveis para preservar links e decisões.
3. `covil-core.mjs`, `host.*`, `game.*`, `covil:"0.1"` e `COVIL-VLG-INTEGRITY-v1\n` são **identificadores técnicos existentes**; não renomear sem protocolo/versão de migração e vetores de teste.
4. O campo `metadata` é opcional no schema experimental atual; não impor a pacotes legados. `reset` é proposta, não API disponível.
5. A CA certifica somente vínculo identidade↔chave; não assina, valida nem homologa pacotes. A ADR 0011 deve ser lida com esta delimitação, e documentos anteriores que atribuam reconhecimento de pacotes à CA são históricos.
6. A decisão de homologação/distribuição é exclusiva de cada portador/host. Envelopes de distribuição são extensões opcionais, não requisitos universais VLG.
7. Antes de renomear no GitHub, revisar CI, badges, links, IDs `$id` dos schemas, referências cruzadas, consumidores e redirects. A renomeação administrativa requer ação separada.
8. Após a migração, adicionar testes de paridade schema/validador, vetores de assinatura e prova de execução interoperável, sem alegar testes não executados.
