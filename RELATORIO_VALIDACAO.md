# Relatório de recuperação e validação — Vaga Justa

Data: 14/10/2026. Fonte principal: `Arquivo Comprimido.zip` enviado por Caio.

## Atualização de finalização — 23/11/2026

Foi criada uma continuação sobre a versão final recuperada, sem apagar as correções anteriores. A nova entrega acrescenta um painel com contagens de candidaturas, registro de compatibilidade no momento da inscrição, histórico local de mudanças de etapa, download de resumo em TXT e o fluxo de **solicitação de revisão** para candidaturas marcadas como “Não selecionada”.

A solicitação pede uma justificativa respeitosa de 20 a 500 caracteres e permite escolher um PDF, JPG ou PNG de até 5 MB. Por privacidade e por ser um protótipo sem servidor, nenhum arquivo ou texto é enviado a empresas; o aplicativo guarda somente o texto, a data, a situação demonstrativa e, se houver, o nome do arquivo no navegador. A mudança manual de status fica dentro de “Ferramentas de demonstração”, com aviso explícito de simulação.

Nesta atualização, a sintaxe de `script.js` foi novamente verificada no ambiente remoto e foram revisadas as referências novas de HTML/JavaScript. Uma tentativa de abrir o Chromium headless deste ambiente falhou porque o executável interno do navegador não está instalado; por isso, a interação visual específica das novas telas não foi declarada como testada em navegador nesta rodada. A validação visual anterior registrada abaixo continua referente à versão de outubro; antes de publicar, devem ser feitos os testes manuais novos indicados no final deste relatório.

## O que havia na edição parcial

O ZIP correto continha apenas os três arquivos principais. As datas internas eram: HTML em 14/10/2026, JavaScript em 23/09/2026 e CSS em 10/09/2026. Não havia histórico Git no ZIP; portanto, a atribuição da edição parcial ao Claude se baseia no contexto fornecido e na diferença de integração observada, não em comparação de commits.

O HTML já tinha 13 seções/telas, rótulos, botões semânticos, avisos demonstrativos, remoção das bolinhas do cadastro, iniciais no lugar de editar foto, quatro opções de navegação e uma área para notificações. Esses avanços foram aproveitados.

Porém, o JavaScript ainda tinha seis chamadas de alert, logout destrutivo, login fictício automático, correspondência incorreta de formação/habilidades e mínimo artificial de 10%. O CSS ainda restringia a altura com 100vh e overflow:hidden e ampliava fontes cumulativamente.

Havia incompatibilidades concretas: `nav-vagas-2` e `msg-sucesso-perfil` eram procurados no JavaScript, mas já não existiam no HTML. O HTML chamava funções ainda ausentes, como `definirPreferencia`, `recuperarSenha`, `voltarDaCompatibilidade`, `limparCurriculo` e `abrirVagaDaCandidatura`. Os filtros passaram a enviar somente um argumento, enquanto o script antigo ainda esperava receber um botão como segundo argumento.

O código remoto não foi usado para substituir nada. Não foi feita comparação com o estado atual do GitHub, pois o desencontro entre os três arquivos do ZIP já permitia identificar e corrigir o trabalho interrompido. Nenhum comando Git, push, commit remoto ou publicação foi realizado.

## Correções entregues

| Área | Resultado |
| --- | --- |
| Cadastro e entrada | Perfis por e-mail, sem senha; entrada somente em perfil existente; bloqueio de cadastro duplicado; campos limpos e validados. |
| Dados | Sessão separada das contas; logout preserva dados; migração do formato antigo; proteção contra JSON/formato inválido e aviso em falha de gravação. |
| Mensagens | Zero alert nativo; mensagens textuais próprias, anunciadas por região acessível e fechadas manualmente. |
| Compatibilidade | Regras explícitas, formação por equivalência exata, habilidades inteiras normalizadas, critérios proporcionais, 0–100% e detalhamento. |
| Busca e filtros | Pesquisa combinada com o filtro, acentuação normalizada, datas fictícias para ordenação e cidades distintas; estado preservado ao navegar. |
| Favoritos | Inclusão/remoção persistida por conta e botões com nome acessível/estado pressionado. |
| Candidaturas | Registro simulado, duplicatas bloqueadas, detalhes acessíveis e etapas sem conclusões inventadas. |
| Perfil | Edição persistente, iniciais, resumo, e-mail identificador somente leitura e conteúdo tratado como texto. |
| Currículo | Seleção de PDF até 5 MB, remoção e avisos explícitos de que não há análise, armazenamento nem envio. |
| Navegação | Menu corrigido; retorno da compatibilidade à origem; foco no título; telas de perfil exigem sessão. |
| Acessibilidade | Controles reais de contraste e texto sincronizados, foco visível, rótulos, botões e alvos de toque. |
| Mobile | Rolagem de página sem altura fixa que corte conteúdo, fontes dos campos de pelo menos 16 px, área segura inferior, layout adaptável e ampliação não cumulativa. |

Mantidos HTML, CSS, JavaScript puro e localStorage. Nenhuma biblioteca foi adicionada à aplicação. Ferramentas de teste foram usadas apenas no ambiente remoto e não integram o ZIP.

## Arquivos

Modificados: `index.html`, `style.css`, `script.js`.

Adicionados: `README.md` e este relatório. O README contém explicação didática, fórmula, tabela de equivalências, roteiro escolar, limitações e atualização manual pelo GitHub.

## O que foi efetivamente testado

Validação executada exclusivamente no ambiente isolado do Codex na nuvem. Nenhum processo foi executado no Mac do usuário.

- Sintaxe JavaScript aprovada pelo Node.
- Estrutura DOM: 13 telas, IDs únicos, referências de rótulos válidas e todas as funções chamadas pelo HTML definidas.
- Automação em Chromium headless: entrada inicial, proteção de telas, Google indisponível, ajuda de acesso e e-mail inexistente.
- Cadastro e persistência sem senha; cadastro duplicado sem sobrescrever conta.
- Busca por habilidade combinada com cidade; filtro Remoto; ordem de Recentes; filtros preservados ao trocar de tela.
- Favorito, retorno de Compatibilidade para Favoritos e persistência.
- Candidatura, bloqueio de duplicata, detalhes, retorno à origem e filtros de status.
- Edição de perfil, recarga com sessão e persistência da edição.
- Texto de teste parecido com HTML apresentado literalmente, sem execução de código injetado.
- Seleção e remoção de PDF e rejeição de arquivo com extensão/tipo incorreto.
- Texto maior e contraste sincronizados entre telas e preservados após recarga.
- Algoritmo: 0%, 100%, resultado parcial de 33%, “Excel” diferente de “Excelente”, acentos e maiúsculas.
- As 13 telas percorridas em larguras 320, 390, 768 e 1440 px, com texto maior e contraste: nenhuma produziu rolagem horizontal da página.
- Logout seguido de recarga sem sessão; segundo usuário sem dados do primeiro; reentrada com e-mail em caixa diferente recuperando favorito e candidatura.
- Migração de perfil, favorito e candidatura antigos, preservando as chaves legadas.
- JSON corrompido exibindo mensagem e permanecendo intacto.
- Falha de escrita simulada retornando erro, sem mensagem falsa de sucesso.
- Nenhum erro JavaScript de página ou diálogo nativo durante os fluxos automatizados.
- Revisão visual das capturas das telas em Chromium; corrigida a quebra de linha no indicador de 100%.

As capturas são material interno de verificação, não dados embarcados no aplicativo. O pacote final não contém contas nem dados dos testes.

## Limitações da validação e conferência final

Não foi possível iniciar WebKit: faltavam componentes de sistema no ambiente remoto. Não foram testados Safari/iPhone, Chrome/Android em aparelhos físicos, VoiceOver/TalkBack, teclado virtual ou oscilações reais de barras do navegador. Testar larguras em Chromium não equivale a testar esses dispositivos.

Antes da apresentação, confira no celular que será usado:

1. Abrir o site publicado e cadastrar um perfil fictício.
2. Rolar o cadastro até o fim com o teclado aberto e depois fechado.
3. Buscar, favoritar, comparar e registrar uma candidatura.
4. Editar o perfil e verificar a nova pontuação.
5. Ativar texto maior e contraste; conferir botões e menu inferior.
6. Sair e entrar novamente para conferir a persistência.
7. Em Detalhes da candidatura, abra **Ferramentas de demonstração**, marque “Não selecionada”, use **Contestar decisão**, escreva um motivo e confira se a solicitação fica registrada após sair e entrar novamente.
8. Baixe o resumo da candidatura e confirme que o arquivo diz “simulação” e não contém nenhum dado que não deveria aparecer.
7. Usar Tab/Enter no computador de apresentação, se ele fizer parte da demonstração; conferir a leitura por tecnologia assistiva se for necessária.

A revisão de estilo e os testes automatizados reduzem riscos, mas não substituem essa conferência no dispositivo final.

## O que continua demonstrativo

Identificação local por e-mail, vagas e empresas fictícias, candidaturas sem envio, status sem atualização externa, seleção de PDF sem leitura e compatibilidade heurística. Não há IA, autenticação segura, banco remoto, Google integrado ou envio de e-mails. Recursos futuros de acessibilidade estão sinalizados como em desenvolvimento, sem botões que finjam executá-los.

## Entrega e publicação

O ZIP final contém a pasta `vaga-justa`. Extraia e consulte o README. Para publicar, faça primeiro backup da versão do GitHub; depois substitua os três arquivos principais na raiz da pasta publicada, por upload manual no site do GitHub. Não envie o ZIP como se fosse o site. A publicação permanece sob autorização e controle do usuário.
