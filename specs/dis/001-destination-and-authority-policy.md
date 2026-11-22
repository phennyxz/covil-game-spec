# COVIL-DIS-001 — Destinos e autoridades de distribuição

**Estado:** proposta de política, sem schema ou implementação aprovados.

O VLG assinado pelo desenvolvedor é **independente do destino**. Distribuidores autorizam o pacote original por envelope externo vinculado ao SHA-256 dos bytes exatos (ADR 0009). A identidade do distribuidor e a autoridade que atesta sua chave podem ser resolvidas segundo SEC-002.

## Destino
- `public`: pacote elegível para distribuição pública sob política de cada host.
- `restricted`: canais, catálogos, hosts ou grupos designados; a restrição é **aplicada por hosts cooperativos**, não é proteção contra cópia ou host modificado.
- `private`: distribuição controlada; cifragem de conteúdo seria extensão futura separada, **não parte do MVP** e não impede extração do JavaScript após execução no navegador.

Para o MVP, preferir autorização de **catálogo/canal** (ex.: produção, homologação) sem registro obrigatório de hosts individuais ou grupos. A política de destinatários deve ser opcional e versionada. O host verifica assinatura, escopo e política local; uma indicação de destino não concede confiança à chave emissora.

## Autoridade de distribuição
O envelope pode referenciar `issuer`, `issuerKeyId`, `authorityId` e `locator`, mediante schema futuro autenticado. Autoridade certifica vínculo/uso da chave; distribuidor decide autorização comercial; homologação técnica é declaração separada. Nenhuma delas prova segurança absoluta.

Não incorporar localizadores ou autorizações de distribuição ao ZIP VLG original sem nova decisão de formato. Referências: ADR 0009, SEC-002 e fundação do Trust Registry.
