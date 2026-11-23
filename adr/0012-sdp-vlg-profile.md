# ADR 0012 — VLG é uma especialização do SDP

**Status:** proposta experimental implementada aditivamente, 2026-11-23.

**Decisão:** SDP e VLG permanecem padrões de pacote ZIP separados por escopo. SDP define o núcleo genérico de autodeclaração e integridade. VLG usa esse núcleo e acrescenta as exigências de interoperabilidade COVIL. O repositório `covil-game-spec` mantém VLG; SDP não depende de COVIL.

**Compatibilidade:** VLG legado 0.1 continua suportado e não é reinterpretado como SDP. A nova variante tem `sdp.json`, inventário SDP e perfil `org.covil.runtime`; assinatura antiga não é reaproveitada.

**Confiança:** CA/chaveiro só informa vínculo identidade↔chave, validade e revogação; o portador decide verificação, admissão, execução e distribuição. Nenhum hash ou assinatura atesta veracidade ou segurança.

Ver [integração SDP–VLG](../docs/13-sdp-vlg-integration.md).
