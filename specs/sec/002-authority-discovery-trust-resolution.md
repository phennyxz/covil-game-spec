# COVIL-SEC-002 — Descoberta de autoridades e resolução de confiança

**Estado:** proposta normativa; schema, implementação e testes pendentes.  
**Escopo:** credenciais e chaves de desenvolvedores e distribuidores; não altera o payload VLG.

## Princípio de segurança
Uma credencial pode indicar **quem a emitiu** (`issuer`), **qual autoridade atesta o vínculo** (`authorityId`) e **onde buscar a credencial ou a chave pública** (`locator`). Nenhum desses campos estabelece confiança por si só. O host MUST verificar uma cadeia criptográfica e de autorização até uma **âncora de confiança previamente configurada**, sob política local. O host MUST NOT aceitar como raiz uma chave apenas porque o VLG ou envelope a indicou.

A autenticação da assinatura prova posse da chave privada correspondente; a certificação da chave pública prova apenas as declarações explicitamente atestadas pela autoridade. Não presumir identidade civil, ausência de malware, qualidade ou autorização de distribuição sem credenciais e políticas próprias.

## Fronteiras
- A assinatura do desenvolvedor permanece em `signature.json` e protege os bytes exatos de `integrity.json` segundo ADR 0002. Seus identificadores/localizadores devem ser definidos por extensão versionada compatível com o formato existente.
- A assinatura do distribuidor permanece no envelope **externo** da ADR 0009; o VLG original não é modificado nem reassinado para cada destino.
- O registro de chaves é serviço independente e federável. O host pode confiar no COVIL Trust Registry, em outras autoridades, ou em chaves explicitamente fixadas.
- Localizadores são dicas de descoberta, não URLs a serem seguidas cegamente; referências e credenciais relevantes MUST ser autenticadas por assinatura ou cadeia já confiável.
- Identidades de host/grupo e cifragem não são obrigatórias no VLG. Autorização de catálogo/canal pode ser aplicada pelo distribuidor; controles de host não impedem cópia ou execução por hosts modificados.

## Resolução
1. Validar ZIP, inventário e hashes antes de qualquer execução; seguir SEC-001.
2. Identificar assinatura, `keyId`, `issuer`, `authorityId` e referências de credenciais conforme versões de schema suportadas.
3. Resolver primeiro cache local confiável; opcionalmente consultar localizadores autorizados sob política de rede estrita.
4. Verificar cadeia, assinaturas, usos de chave (`developer-signing` / `distribution-signing` / `authority-signing`), escopo, validade, versão de política e revogação.
5. Verificar assinatura do desenvolvedor; quando exigida, verificar também autorização externa assinada do distribuidor e seu vínculo ao hash exato do VLG.
6. Somente então considerar admissão pelo host, mantendo sandbox e permissões de CAP/RUN.

Falha de consulta não equivale a aprovação. Offline: somente credenciais e dados de revogação previamente autenticados, dentro de prazo e política; revogação não é instantânea em hosts offline. Proteger contra rollback de estado confiável, substituição de chave, ciclos de delegação, confusão de papéis e replay.

## Segurança dos localizadores
MUST limitar protocolos e destinos, tamanho, tempo, profundidade de cadeia e redirecionamentos; rejeitar IPs privados, loopback, link-local, metadados de nuvem e destinos proibidos (SSRF); não encaminhar credenciais do host; não executar conteúdo recebido. Consultas de identidade não podem ser iniciadas pelo jogo dentro do sandbox privilegiado. Cache autenticado e privacidade de telemetria são requisitos de projeto.

## Exemplo ilustrativo, NÃO schema aprovado
```json
{
  "developer": {
    "keyId": "dev:studio-123:key-01",
    "issuer": "dev:studio-123",
    "authorityId": "authority:covil-registry",
    "locator": "https://registry.example.invalid/v1/keys/dev-123/key-01"
  },
  "distribution": {
    "keyId": "dist:jogai:key-02",
    "issuer": "dist:jogai",
    "authorityId": "authority:covil-registry",
    "locator": "https://registry.example.invalid/v1/keys/jogai/key-02"
  }
}
```

Os localizadores reais e seus locais nos envelopes exigem schemas versionados, autenticação de campos e vetores de teste. Não confundir `issuer` com `authorityId`: o emissor da autorização pode ser o distribuidor, cuja chave é certificada por outra autoridade.

## Testes de conformidade futuros
Raiz indicada pelo atacante; troca de locator; chave de uso incorreto; autoridade desconhecida/revogada; certificado expirado; cadeia cíclica; cache offline expirado; rollback; resposta SSRF/redirecionamento; assinatura válida com pacote alterado; credencial válida mas autorização de distribuição ausente.

Referências: ADR 0002, ADR 0009, SEC-001 e [Fundação do Trust Registry](../tec/001-trust-registry-foundation.md).
