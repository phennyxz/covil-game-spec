# ADR 0009 — Dupla assinatura, autorização de distribuição e homologação

**Status:** Aprovado em 2026-11-19 (arquitetura; formatos, infraestrutura e testes pendentes)  
**Relacionamento:** complementa a [ADR 0002](0002-signature-design.md), sem substituir a assinatura do desenvolvedor.

## Contexto e decisão

O desenvolvedor assina o inventário do VLG com sua chave privada Ed25519 conforme ADR 0002. Um servidor de publicação recebe o pacote, verifica a identidade do publicador, a assinatura do desenvolvedor e a integridade do conteúdo. Após aplicar suas políticas, um **distribuidor** pode emitir uma **segunda assinatura**, que autoriza a distribuição daquele conteúdo exato para os consoles que confiam nesse distribuidor.

A assinatura do desenvolvedor representa **autoria criptográfica associada a uma identidade cadastrada**; a assinatura do distribuidor representa **autorização de distribuição sob uma política específica**. Uma eventual **homologação técnica** é uma declaração separada, verificável e explicitamente vinculada a evidências de testes. Nenhuma assinatura significa que o software é inofensivo.

A cadeia é: desenvolvedor → validação do servidor → autorização assinada pelo distribuidor → verificação local do console → execução isolada.

## Preservação da assinatura original

A assinatura do desenvolvedor **não é removida nem substituída**. O distribuidor deve manter o `integrity.json` original e o `signature.json` do desenvolvedor. Não pode alterar arquivos do VLG e reutilizar a assinatura anterior. Uma alteração de payload requer novo inventário e nova assinatura do desenvolvedor.

Para evitar a contradição com a completude do inventário da ADR 0002, a autorização do distribuidor é um **envelope externo** ao arquivo `.vlg` original, associado a seus bytes e metadados. Não inserir `distribution.json` ou `distribution.sig` na raiz do ZIP existente sem uma ADR específica que altere o formato.

## Envelope de distribuição (modelo conceitual)

```text
release/
  game.vlg                 # ZIP original, não modificado
  distribution.json        # declaração de autorização, fora do ZIP
  distribution.sig         # assinatura do distribuidor, fora do ZIP
```

Campos conceituais de `distribution.json`:

- `schemaVersion`, `issuer`, `issuerKeyId`, `releaseId`, `issuedAt`, `expiresAt`;
- `packageSha256`: SHA-256 dos **bytes exatos do arquivo VLG** distribuído;
- `integritySha256`: SHA-256 dos bytes exatos de `integrity.json`;
- `developerKeyId`: referência à chave de desenvolvedor validada;
- `gameId`, `gameVersion` e escopo de distribuição (catálogo, canal, público-alvo ou dispositivos);
- `authorization`: decisão explícita de publicação;
- `homologation`: quando houver, resultado, política de testes, versão do verificador, data e referência imutável ao relatório de evidências.

**Não é ainda um schema normativo.** Os formatos exatos, semântica de campos e serialização serão definidos antes da implementação. A assinatura do distribuidor deve usar Ed25519, separação de domínio própria (distinta da ADR 0002) e **bytes exatos** do envelope; o console não deve aceitar um documento cujo conteúdo foi alterado. Evitar ambiguidades de canonicalização. `distribution.sig` não é autoassinado.

## Distinção obrigatória: autorização × homologação

1. **Autorização de distribuição:** a distribuidora decidiu publicar determinado pacote sob uma política, independentemente de existir homologação técnica.
2. **Homologação técnica:** afirma somente que um conjunto identificado de testes foi executado, em um ambiente e versão determinados, com um resultado documentado. Não implica ausência de vulnerabilidades.
3. Um distribuidor pode exigir homologação como pré-requisito de autorização; essa exigência é **política do distribuidor**, não regra universal do formato VLG.
4. A interface do console não deve chamar uma autorização simples de “jogo seguro” ou “certificado” quando não houver evidências adequadas.

## Verificação no servidor e no console

**Servidor:**

1. Recebe pacote e identifica o desenvolvedor autenticado.
2. Valida limites ZIP, caminhos, inventário e hashes, sem executar código do VLG.
3. Verifica Ed25519 do desenvolvedor e vínculo da chave pública à identidade reconhecida, incluindo estado de revogação.
4. Aplica análises e políticas de publicação; registra resultados e versões das ferramentas.
5. Emite declaração de autorização e, se aplicável, declaração de homologação distinta.
6. Assina o envelope de distribuição com chave de distribuidor protegida por KMS/HSM ou mecanismo equivalente com controle de acesso, trilha de auditoria e segregação de funções.
7. Publica VLG original, envelope, assinatura e metadados de confiança/revogação.

**Console:**

1. Obtém VLG original e envelope externo, por canal local ou remoto.
2. Confere chave pública confiável do distribuidor, validade, escopo, assinatura do envelope e políticas locais.
3. Confere `packageSha256` contra os bytes exatos recebidos e valida novamente a estrutura, inventário, hashes e manifesto VLG.
4. Verifica a assinatura original do desenvolvedor quando exigido pela política do host; a verificação no servidor não elimina a possibilidade nem a utilidade da verificação local.
5. Aplica requisitos, permissões e isolamento COVIL antes de executar.

O console não deve considerar a assinatura do distribuidor uma autorização para contornar sandbox, CSP, limites ou permissões. Um envelope assinado por chave desconhecida, revogada ou fora de escopo não é confiável por padrão.

## Federação e independência

O formato VLG continua aberto. Jogai pode operar seu próprio registro de desenvolvedores e autoridade de distribuição; outros catálogos, fabricantes e comunidades podem manter suas próprias autoridades. Cada host escolhe suas raízes de confiança, sem dependência obrigatória de consulta online ao Jogai. A cadeia de confiança pode ser verificada offline com chaves públicas previamente confiáveis e metadados de política ainda válidos.

A política de **catálogo Jogai** passa a exigir, além da assinatura reconhecida do desenvolvedor prevista na ADR 0002, a autorização de distribuição assinada pela autoridade do catálogo. Hosts independentes podem estabelecer regras próprias. O modo de desenvolvedor explícito e isolado permanece possível nos termos da ADR 0002.

## Ciclo de vida das chaves e revogação

- Chaves privadas dos desenvolvedores permanecem com seus titulares; o registro central armazena chaves **públicas**, identidade, `keyId`, histórico, escopo e estados.
- A chave privada do distribuidor não fica no servidor de upload nem no repositório de código. A assinatura é uma operação auditada e autorizada.
- Prever rotação, comprometimento, revogação, expiração e múltiplas chaves por desenvolvedor/distribuidor.
- Consoles offline podem aceitar aprovações previamente confiáveis até o prazo e a política de atualização/revogação permitirem; **revogação no servidor não é instantânea em dispositivos offline**.
- Uma lista de confiança ou revogação deve ser autenticada, ter controle contra rollback e validade delimitada. A raiz de confiança não pode ser substituída por um manifesto fornecido pelo próprio VLG.
- Distinguir revogação da chave, da identidade, da autorização de uma versão e da homologação de um relatório.

## Ameaças e limitações

A dupla assinatura não impede publicações maliciosas por contas comprometidas, chaves roubadas, análises incompletas ou erros de implementação. Evitar ataques de substituição (assinatura válida aplicada a outro pacote), replay de versões antigas, downgrade, publicação fora de escopo e troca de identidade. Não expor tokens, dados pessoais nem segredos do host ao VLG.

## Implementação e testes pendentes

Definir schemas, codificação de assinaturas, prefixo de domínio, vínculo de identidades, chave raiz do distribuidor, política de cache/revogação offline, algoritmo de verificação em host, provas de homologação e testes de vetores positivos/negativos. O validador CLI e o SDK existentes **não implementam** assinaturas Ed25519, envelopes de distribuição ou homologação. Não declarar certificação nem cadeia de confiança operacional até testes independentes.
