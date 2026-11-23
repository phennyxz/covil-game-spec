# VLG — Virtual Light Game

**Especificação aberta e experimental 0.1 para pacotes de jogos Web portáteis.**

VLG descreve **o artefato**: estrutura ZIP, manifesto, declarações editoriais e técnicas, inventário SHA-256 e assinatura criptográfica de autoria. Não exige COVIL, Jogai, Firebase, CA específica, loja, framework ou engine.

**COVIL é um padrão independente de interoperabilidade**: descreve como um jogo conversa com um host compatível por interfaces de inicialização, controles, capacidades e ciclo de vida. Um pacote VLG pode declarar integração COVIL; uma implementação COVIL pode carregar jogos por outros meios.

## Comece aqui

- [Padrão VLG](specs/vlg/README.md) — pacote, validação, assinatura e declarações.
- [Interoperabilidade COVIL](specs/covil/README.md) — `init(covil)`, eventos, controles, host e isolamento.
- [Fronteiras de responsabilidade](specs/RESPONSIBILITIES.md) — desenvolvedor, CA, portador e plataforma.
- [Migração e compatibilidade](specs/MIGRATION-VLG.md) — nomes históricos e identificadores preservados.
- [Setores históricos e decisões](specs/README.md) — navegação legada, ADRs e documentação detalhada.
- [Ferramentas e testes](AGENTS.md) — implementação de referência, não serviço obrigatório de certificação.

## Estado real

O builder e validador existentes geram/verificam um **subconjunto experimental não assinado**. O SDK COVIL implementa inicialização, `has`, controles e parte do ciclo de vida. Assinatura Ed25519, reconhecimento de chave, `reset`, host isolado endurecido, homologação e portabilidade entre hosts **não estão comprovados por este repositório**. Não confundir arquitetura aprovada com funcionalidade implementada.

A validade **estrutural** de um VLG significa conformidade com formato, campos, caminhos, inventário e hashes; não significa assinatura reconhecida, veracidade editorial, segurança, homologação ou autorização de distribuição.

A CA/chaveiro reconhece **identidades e suas chaves**, não pacotes. O portador decide verificar assinaturas, consultar a CA, conferir declarações e aplicar sua política de aceitação, quarentena, homologação e distribuição.

**Nome proposto do repositório GitHub:** `phennyxz/VLG`. Este checkout ainda pode estar sob `phennyxz/covil-game-spec` até renomeação administrativa. Não alterar identificadores de protocolo nem prefixos de assinatura por substituição textual.
