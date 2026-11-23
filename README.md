# Vaga Justa

Protótipo acadêmico de uma aplicação que compara o perfil de candidatos com seis vagas fictícias. O objetivo é demonstrar programação web e explicar uma estimativa de compatibilidade por regras, sem inteligência artificial.

## Como abrir

Não há instalação, compilação ou servidor obrigatório. Extraia o ZIP e abra `index.html` em um navegador com JavaScript habilitado. Para apresentar no celular e manter uma origem estável para os dados, prefira o endereço publicado no GitHub Pages.

O comportamento do localStorage ao abrir arquivos diretamente pode variar entre navegadores. Os dados do arquivo aberto no computador não são transferidos para o site. Use o mesmo navegador e endereço durante a apresentação. Não é necessário executar comandos, npm ou ferramentas no Mac.

## O papel de cada arquivo

- **index.html:** estrutura das telas, campos, textos, botões e rótulos de acessibilidade.
- **style.css:** aparência verde e branca, espaçamento, fontes, contraste e adaptação ao tamanho da tela.
- **script.js:** navegação, validação dos dados, busca, filtros, cálculo e armazenamento.
- **localStorage:** recurso do navegador usado para guardar pequenos dados em texto JSON. Não é um banco de dados remoto.

A função `mostrarTela` exibe uma seção HTML de cada vez, por meio da classe `ativa`. A aplicação não usa React, bibliotecas externas, backend ou APIs.

## Funcionalidades

- Cadastro de perfis locais com informações profissionais.
- Entrada por e-mail previamente cadastrado, sem senha.
- Seis vagas, empresas e datas inteiramente fictícias.
- Pesquisa por cargo, empresa, localização e habilidades, ignorando acentos e caixa.
- Filtro de trabalho remoto e de Salvador, combinado com a pesquisa.
- “Recentes” ordena as vagas da publicação fictícia mais nova para a mais antiga; não é uma janela de dias relativos à data atual.
- Favoritos e candidaturas separados por perfil.
- Compatibilidade detalhada e sugestões do que melhorar.
- Registro de candidatura demonstrativa com bloqueio de duplicatas.
- Painel de acompanhamento, histórico de etapas e resumo local baixável da candidatura.
- Simulação explícita de etapas do processo e solicitação de revisão para uma candidatura não selecionada.
- Perfil, edição, configurações, acessibilidade e seleção demonstrativa de PDF.
- Mensagens próprias do aplicativo, fechadas pelo botão ×.

## Entrada demonstrativa: não é autenticação

Não solicitamos nem armazenamos senhas. O e-mail serve apenas para selecionar um perfil cadastrado no mesmo navegador. Qualquer pessoa com acesso a esse navegador pode abrir o perfil conhecendo o e-mail. Não há verificação de identidade, envio de e-mail ou recuperação remota. Use nome, telefone e e-mail fictícios; por exemplo, `aluna@example.com`.

O botão Google apenas explica que a integração está indisponível. Sair encerra a sessão e mantém o cadastro, favoritos e candidaturas. Fechar e reabrir a página mantém a sessão até clicar em Sair.

O aplicativo não envia dados a empresas. Limpar os dados do navegador, mudar de navegador ou de endereço pode fazer os perfis deixarem de aparecer.

## Como funciona a compatibilidade

A função `calcularCompatibilidade(vaga, candidato)` recebe os requisitos e o perfil, calcula cada parcela e devolve o resultado. A função de exibição mostra esse resultado na tela.

| Critério | Pontuação | Regra |
| --- | --- | --- |
| Formação | 25 | Recebe 25 se a formação corresponder à área na lista explícita abaixo; caso contrário, 0. |
| Experiência | 25 | `25 × mínimo(anos informados / anos exigidos, 1)`. Se não exigir experiência, recebe 25. |
| Habilidades | 30 | `30 × quantidade de habilidades atendidas / quantidade exigida`. Cada habilidade pesa igualmente. |
| Inglês | 20 | Nenhum = 0, Básico = 1, Intermediário = 2, Avançado = 3. `20 × mínimo(nível informado / nível exigido, 1)`. Se não exigir inglês, recebe 20. |

A soma é arredondada para o inteiro mais próximo somente no final. A tela mostra as parcelas com até uma casa decimal; a soma das parcelas exibidas pode diferir ligeiramente do total por arredondamento. O resultado pode ser **0%** ou **100%**. Não há percentual mínimo artificial.

Um critério proporcional pode ser parcialmente atendido e ainda aparecer em “Para melhorar”. Requisitos inexistentes, como inglês “Nenhum”, recebem a pontuação integral desse critério. Isso mede adequação àquela vaga, e não qualificação geral.

### Exemplo para explicar na escola

A vaga Desenvolvedor Front-end pede Tecnologia, 2 anos de experiência, HTML, CSS, JavaScript e inglês intermediário.

- Técnico em Informática: 25 pontos de formação.
- 1 ano de experiência: 12,5 pontos.
- HTML e CSS: 20 pontos (duas das três habilidades).
- Inglês básico: 10 pontos (nível 1 de 2).
- Total: 67,5, arredondado para **68%**.

Não é uma previsão científica de contratação nem análise de recrutador. A experiência considera apenas os anos declarados, sem avaliar o tipo de trabalho anterior. O único idioma considerado nesta versão é o inglês.

### Equivalências de formação

A comparação ignora acentos, maiúsculas e espaços repetidos, mas exige o texto completo de uma destas opções:

| Área | Textos reconhecidos |
| --- | --- |
| Tecnologia | Tecnologia; Informática; Técnico em Informática; Ciência da Computação; Sistemas de Informação; Análise e Desenvolvimento de Sistemas; Engenharia de Software |
| Administração | Administração; Técnico em Administração; Bacharelado em Administração |
| Design | Design; Design Gráfico; Técnico em Design Gráfico |
| Recursos Humanos | Recursos Humanos; Gestão de Recursos Humanos; Técnico em Recursos Humanos |
| Ensino Médio | Ensino Médio; Ensino Médio completo |

Para vagas que pedem Ensino Médio, qualquer opção reconhecida nessa tabela atende ao requisito. As opções sem indicação de conclusão pressupõem formação concluída para a demonstração. Textos como “Ensino Médio incompleto”, “cursando Design” ou cursos fora da lista não pontuam. Essa simplificação é intencional e pode produzir falsos negativos; a aplicação informa que cursos desconhecidos precisam de revisão manual. Ela não interpreta livremente currículos.

As habilidades devem ser separadas por vírgula (também são aceitos ponto e vírgula e quebra de linha). “EXCEL” corresponde a “Excel”; “Excelente” e “Excel avançado” não correspondem a “Excel”. Não são inferidos sinônimos. Habilidades repetidas não ganham pontos adicionais.

## Candidaturas, revisão e currículo

A candidatura guarda a vaga, a data, a compatibilidade do momento do envio e o status. Ela começa em “Em análise”. Em **Análise de candidatura**, nos detalhes, o sistema aplica as mesmas regras de compatibilidade registradas no envio: 75% ou mais indica a próxima etapa, de 45% a 74% mantém a candidatura em análise, e abaixo de 45% registra “Não selecionada”. O resultado e a data ficam no histórico local.

Quando uma candidatura está como **Não selecionada**, aparece a opção **Contestar decisão**. Ela abre uma solicitação de revisão com texto de 20 a 500 caracteres e anexo opcional (PDF, JPG ou PNG até 5 MB). O arquivo não é enviado nem guardado: apenas seu nome é exibido no registro. A solicitação fica marcada como “Recebida para revisão (simulação)” e não altera automaticamente o resultado. O botão de baixar resumo cria um arquivo de texto local, também identificado como simulação.

O PDF é apenas selecionado para demonstração. Aceitamos arquivos não vazios com extensão/tipo PDF de até 5 MB. Não verificamos a estrutura interna, não lemos o conteúdo, não fazemos upload e não salvamos o arquivo no localStorage. A seleção desaparece ao sair ou recarregar. O cálculo usa os campos do perfil, nunca o PDF.

## Dados e versão anterior

As contas ficam em `vagaJusta_dados_v2`; a sessão em `vagaJusta_sessao_v2`; as preferências em `vagaJusta_preferencias_v2`. As preferências são comuns ao navegador. Os dados profissionais, favoritos e candidaturas são específicos de cada e-mail.

A primeira abertura tenta migrar as chaves antigas `vagaJusta_usuario`, `vagaJusta_favoritos` e `vagaJusta_candidaturas`. As chaves antigas são preservadas como backup. A migração exige dados válidos e não consegue recuperar o que o logout da versão antiga já apagou. Depois da migração, entre com o e-mail antigo.

JSON inválido ou formato incompatível gera uma mensagem e bloqueia novas gravações para não sobrescrever os dados anteriores. Falta de espaço ou de permissão de gravação também é informada, sem confirmar falsamente a alteração. Se isso ocorrer, preserve o navegador afetado e use outro perfil de navegador para demonstrar. Não limpe dados importantes sem antes obter uma cópia.

## Publicar pelo site do GitHub, sem Git local

1. Antes de substituir, abra o repositório no GitHub e use **Code → Download ZIP** para guardar a versão publicada como backup.
2. Extraia este ZIP final. Abra a pasta `vaga-justa`.
3. No repositório `wgzgczf6w9-a11y/vaga-justa`, confirme que está na branch `main` e na pasta que contém o `index.html` publicado.
4. Use **Add file → Upload files** e envie `index.html`, `style.css`, `script.js` e os documentos Markdown. Envie os arquivos, não o ZIP nem uma pasta adicional por cima da raiz.
5. Confira a lista de substituições antes de confirmar. Faça um commit pelo próprio site com uma descrição, por exemplo: “Finaliza protótipo acadêmico e corrige fluxos”.
6. Na configuração existente do Pages, confira a origem da publicação e acompanhe o deploy no GitHub. Não altere essa configuração se já estiver correta.
7. Quando terminar, abra o endereço publicado e recarregue. Teste cadastro, login, favorito e candidatura no celular.

Esse envio manual não depende de os históricos Git do computador e do GitHub serem iguais. Nenhum push ou publicação foi feito durante esta entrega. Não é necessário rodar testes ou comandos no Mac.

## Roteiro de apresentação (5 minutos)

1. Apresente o objetivo e esclareça que as vagas são fictícias.
2. Cadastre `aluna@example.com`: Técnico em Informática, 1 ano, HTML e CSS, inglês básico.
3. Busque “Desenvolvedor”. Abra a compatibilidade e explique os **68%** pelas quatro parcelas.
4. Simule uma candidatura e mostre que não é possível duplicá-la.
5. Favorite uma vaga e mostre as duas listas.
6. Edite o perfil para 2 anos, HTML, CSS, JavaScript e inglês intermediário. Abra a comparação novamente: **100%** pelas regras.
7. Ative texto maior e alto contraste. Depois retorne às preferências padrão.
8. Saia e entre com o mesmo e-mail para demonstrar a persistência.
9. Explique HTML = estrutura, CSS = aparência, JavaScript = comportamento, localStorage = persistência neste navegador.

## Melhorias futuras

Autenticação real com backend, sincronização, banco de dados, participação de empresas, modelagem mais completa da formação/experiência, testes com usuários e leitores de tela, além de interpretação de currículos com IA. Nenhuma chave de API deve ser colocada no frontend público.
