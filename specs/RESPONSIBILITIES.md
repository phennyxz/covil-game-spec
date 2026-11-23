# Responsabilidades — VLG, COVIL, CA e portador

| Parte | Responsabilidade | Não afirma |
| --- | --- | --- |
| VLG | Estrutura do pacote, manifesto, integridade, assinaturas e conformidade técnica | Veracidade, identidade civil, homologação ou segurança |
| COVIL | Interfaces, capacidades, controles, ciclo de vida e contrato de host | Formato de distribuição obrigatório ou aprovação de pacotes |
| Autor | Declara características e assina inventário específico com sua chave | Homologação automática |
| CA/chaveiro | Mantém e atesta vínculo entre identidade cadastrada e chave pública, seus usos, validade e revogação | Identidade, estrutura, hash, qualidade ou aprovação de pacote |
| Portador/host | Confere estrutura, hashes, assinatura, reconhecimento da chave, declarações e sua própria política | Que a CA já verificou o jogo |
| Distribuidor | Decide publicação e distribuição segundo política própria | Autorização universal para todos os hosts |

Uma assinatura válida prova o uso da chave privada correspondente para os bytes assinados; não identifica a pessoa sem vínculo externo. O chaveiro não deve manter índices ou afirmações sobre pacotes como parte de seu contrato básico.

A verificação de integridade é objetiva; avaliação de declarações e medidas por divergência cabem ao portador. Recomenda-se rejeição de inconsistências materiais e medidas de quarentena/bloqueio proporcionais, auditáveis e sujeitas a revisão. Ferramentas de referência e testes de conformidade são úteis, mas implementações independentes podem cumprir o padrão.
