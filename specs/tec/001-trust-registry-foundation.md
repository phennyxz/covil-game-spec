# COVIL Trust Registry — fundação e contrato inicial

**Estado:** proposta arquitetural (não existe API de produção nem autoridade raiz operacional nesta especificação).  
**Natureza:** serviço independente do formato VLG, opcional para hosts federados.

## Missão e separação
O **COVIL Game Spec** define formatos e verificações; o **COVIL Trust Registry** publica identidades, chaves públicas, credenciais e revogações; o **Jogai** é um host/distribuidor que poderá confiar nele. Não exigir que todos os hosts consultem uma API central. Não converter registro em DRM, verificador de inocuidade ou autoridade civil por presunção.

## Entidades e responsabilidades
- `identity`: identificador estável, tipo (`developer`, `distributor`, `authority`), estado e nível explícito de verificação; identidade pseudônima é válida, sem alegação automática de pessoa/empresa verificada.
- `key`: `keyId`, algoritmo (Ed25519 para assinaturas previstas), chave **pública**, titular, usos permitidos, criação, expiração, revogação e histórico de rotação; múltiplas chaves por identidade.
- `credential`: declaração assinada por autoridade vinculando identidade, chave, papéis, escopo, período e emissor; referência verificável ao material assinado.
- `revocation`: evento autenticado, motivo codificado, alcance (chave, identidade, credencial ou autorização), instante efetivo e sequência monotônica.
- `trust-anchor`: chave ou autoridade explicitamente configurada pelo host; nunca estabelecida por autoafirmação do pacote.

## Fluxos
1. **Cadastro:** registrar identidade e chave pública; comprovar posse da privada por desafio de assinatura com nonce único, expiração curta, contexto e prevenção de replay.
2. **Certificação:** operador/política aprova o vínculo e a função; autoridade assina credencial com domínio criptográfico exclusivo e formato de bytes determinístico. Registrar auditoria.
3. **Publicação:** endpoints somente leitura entregam credenciais, chaves, metadados assinados e revogações.
4. **Rotação/revogação:** novas chaves são certificadas; comprometimento é revogado e divulgado com atualização autenticada e proteção contra rollback.
5. **Consumo:** host resolve e verifica localmente segundo SEC-002; operação offline pode usar cache válido.

A API **não recebe nem armazena chaves privadas de desenvolvedores**. Chaves privadas da autoridade/distribuidor devem ficar em KMS/HSM ou proteção equivalente com acesso segregado, logs e backup/recuperação planejados.

## Superfície HTTP conceitual (não contrato final)
```http
GET /v1/identities/{identityId}
GET /v1/keys/{identityId}/{keyId}
GET /v1/credentials/{credentialId}
GET /v1/revocations
POST /v1/registrations
POST /v1/key-challenges
POST /v1/key-challenges/{challengeId}/verify
```
Leituras públicas devem ter autenticação de dados via assinaturas; TLS sozinho não substitui verificação local. Escritas exigem autenticação, autorização, controle de taxa, auditoria e proteção contra abuso. Evitar expor dados pessoais além do necessário. Não definir endpoint de assinatura arbitrária para usuários.

## Criptografia e interoperabilidade
- Assinaturas Ed25519 com **separação de domínio** distinta de assinatura de inventário e envelope de distribuição.
- Definir antes de codificar: bytes assinados (JSON canônico padronizado ou bytes exatos com regras de serialização), codificação, IDs, validade, usos, cadeia e regras de delegação.
- Distribuir âncoras de confiança por configuração explícita/atualização autenticada, nunca pelo VLG.
- Revogações com sequência, validade e proteção contra rollback; definir limite máximo de cache, comportamento fail-closed e contingência de indisponibilidade.
- Não exigir X.509 para MVP; interoperabilidade futura pode ser estudada sem bloquear o registro inicial.

## MVP sugerido
Cadastro de identidade pseudônima; prova de posse de chave Ed25519; registro de chave pública e seus usos; credencial assinada por autoridade; consulta pública; revogação autenticada; validador offline com vetores positivos/negativos. Somente depois: delegações complexas, níveis de verificação civil/empresarial, múltiplas autoridades, política de transparência, painéis administrativos e serviços adicionais.

## Ameaças e decisões pendentes
Roubo de chave raiz, emissão indevida, registro de identidade enganosa, takeover de conta, comprometimento de autoridade, disponibilidade da API, privacidade, replay e rollback. Definir modelo de governança da autoridade, recuperação de raiz, emissão, política de nomes, identidade do host, esquema versionado, endpoints de transparência e SLA de revogação. A existência do registro não substitui isolamento de execução nem análise de pacotes.

Referências: [SEC-002](../sec/002-authority-discovery-trust-resolution.md), ADR 0002, ADR 0009.
