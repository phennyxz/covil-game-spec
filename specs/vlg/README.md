# VLG — Virtual Light Game: padrão de artefato

## Escopo normativo

VLG é um contêiner ZIP de jogo Web. Especifica caminhos relativos seguros, `manifest.json`, `integrity.json`, entrada HTML, declarações técnicas/editoriais e assinatura de autoria quando presente. Um arquivo VLG **não depende de COVIL**.

### Conformidade estrutural

O verificador confere formato, limites, nomes e duplicatas, requisitos do manifesto, inventário completo, tamanhos e SHA-256. Os arquivos internos podem estar em quaisquer subdiretórios seguros; o inventário mapeia caminhos e hashes, não resolve imports JS.

A conformidade estrutural não depende da identidade do signatário. Uma assinatura válida criptograficamente tampouco implica identidade reconhecida, veracidade, homologação, legalidade ou segurança.

### Assinatura

A assinatura Ed25519 do desenvolvedor vincula sua chave privada aos bytes exatos de `integrity.json` precedidos pelo domínio `COVIL-VLG-INTEGRITY-v1\n` **no perfil histórico 0.1**. O inventário vincula os arquivos listados. A identidade e o estado da chave podem ser verificados separadamente por quem portar o pacote; o padrão não impõe uma CA central.

### Declarações editoriais

O bloco opcional `metadata` contém título, descrição, idiomas, gêneros, tags, classificação etária declarada e indicadores de conteúdo. São **afirmações do autor**; o host deve avaliá-las segundo sua política. `null` em indicadores significa desconhecido/não declarado, não ausência comprovada.

### Política do portador

O portador decide verificar a assinatura, consultar a CA/chaveiro, examinar a veracidade das declarações, admitir, homologar, executar e distribuir. Recomenda-se **fortemente** rejeitar pacotes com divergências materiais, não executar arquivos com falha estrutural/de integridade, e aplicar isolamento, quarentena, auditoria e medidas proporcionais a reincidência comprovada, com processo de contestação adequado. OFPI é orientação de tratamento de discrepâncias, não certificação central do formato.

## Documentos existentes

- [Pacote](../../docs/02-vlg-package.md)
- [Manifesto](../../docs/03-manifest.md)
- [Editorial](../pac/001-editorial-metadata.md)
- [Assinatura](../../adr/0002-signature-design.md)
- [Schema](../../schemas/manifest.schema.json)
- [Validador experimental](../../tools/validate-vlg.mjs)

## Interoperabilidade opcional

Para executar um jogo com API de host COVIL, consultar [padrão COVIL](../covil/README.md). O formato VLG não requer `init(covil)` para todo jogo Web.
