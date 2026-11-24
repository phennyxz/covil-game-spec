# ADR 0012 — VLG é uma especialização do SDP

**Status:** aprovada como arquitetura canônica; ferramentas experimentais, 2026-11-23.

**Decisão:** SDP e VLG permanecem padrões de pacote ZIP separados por escopo. SDP define o núcleo genérico de autodeclaração e integridade. VLG usa esse núcleo e acrescenta as exigências de interoperabilidade COVIL. O repositório `covil-game-spec` mantém VLG; SDP não depende de COVIL.

**Compatibilidade:** Não há VLG publicado a migrar. O protótipo anterior fica apenas como ferramenta de regressão histórica; o VLG canônico tem `sdp.json`, inventário SDP e perfil `org.covil.runtime`; qualquer assinatura do protótipo anterior não seria reaproveitada.

**Confiança:** CA/chaveiro só informa vínculo identidade↔chave, validade e revogação; o portador decide verificação, admissão, execução e distribuição. Nenhum hash ou assinatura atesta veracidade ou segurança.

Ver [integração SDP–VLG](../docs/13-sdp-vlg-integration.md).
