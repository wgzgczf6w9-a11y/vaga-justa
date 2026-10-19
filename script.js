// ==========================================
// DADOS DE DEMONSTRAÇÃO (MOCK)
// ==========================================
const vagasDemonstracao = [
    {
        id: 1,
        cargo: "Analista de Suporte",
        empresa: "Tech Soluções",
        localizacao: "Salvador - BA",
        modalidade: "Presencial",
        contratacao: "Efetivo",
        requisitos: {
            formacao: "Tecnologia",
            experiencia: 1,
            habilidades: ["Atendimento", "Suporte", "Informática"],
            ingles: "Básico"
        }
    },
    {
        id: 2,
        cargo: "Assistente Administrativo",
        empresa: "Empresa Exemplo",
        localizacao: "Salvador - BA",
        modalidade: "Presencial",
        contratacao: "Efetivo",
        requisitos: {
            formacao: "Administração",
            experiencia: 0,
            habilidades: ["Excel", "Organização", "Atendimento"],
            ingles: "Nenhum"
        }
    },
    {
        id: 3,
        cargo: "Desenvolvedor Front-end",
        empresa: "Web Criativa",
        localizacao: "Salvador - BA",
        modalidade: "Remoto",
        contratacao: "CLT",
        requisitos: {
            formacao: "Tecnologia",
            experiencia: 2,
            habilidades: ["HTML", "CSS", "JavaScript"],
            ingles: "Intermediário"
        }
    },
    {
        id: 4,
        cargo: "Designer Gráfico",
        empresa: "Cria Design",
        localizacao: "Salvador - BA",
        modalidade: "Híbrido",
        contratacao: "PJ",
        requisitos: {
            formacao: "Design",
            experiencia: 1,
            habilidades: ["Photoshop", "Illustrator", "Criatividade"],
            ingles: "Básico"
        }
    },
    {
        id: 5,
        cargo: "Estagiário de RH",
        empresa: "People Gestão",
        localizacao: "Salvador - BA",
        modalidade: "Presencial",
        contratacao: "Estágio",
        requisitos: {
            formacao: "Recursos Humanos",
            experiencia: 0,
            habilidades: ["Comunicação", "Empatia", "Pacote Office"],
            ingles: "Nenhum"
        }
    },
    {
        id: 6,
        cargo: "Atendente de Suporte",
        empresa: "Conecta Serviços",
        localizacao: "Salvador - BA",
        modalidade: "Remoto",
        contratacao: "Efetivo",
        requisitos: {
            formacao: "Ensino Médio",
            experiencia: 1,
            habilidades: ["Atendimento", "Comunicação", "Informática"],
            ingles: "Básico"
        }
    }
];

// Datas fixas e cidades fictícias permitem demonstrar ordenação e filtros.
const datasPublicacao = ['2026-09-01', '2026-10-10', '2026-10-05', '2026-09-20', '2026-10-12', '2026-10-01'];
vagasDemonstracao.forEach((vaga, i) => { vaga.publicadaEm = datasPublicacao[i]; });
vagasDemonstracao[2].localizacao = 'Recife - PE';
vagasDemonstracao[3].localizacao = 'São Paulo - SP';
vagasDemonstracao[5].localizacao = 'Feira de Santana - BA';

// ==========================================
// ESTADO E ARMAZENAMENTO LOCAL
// Cada e-mail tem seu próprio perfil, favoritos e candidaturas.
// Não há autenticação: qualquer pessoa neste navegador pode abrir os perfis.
// ==========================================
const CHAVE_DADOS = 'vagaJusta_dados_v2';
const CHAVE_SESSAO = 'vagaJusta_sessao_v2';
const $ = id => document.getElementById(id);
let contas = [];
let contaAtual = null;
let historicoTelas = [];
let vagaAtualParaCompatibilidade = null;
let origemCompatibilidade = 'tela-vagas';
let candidaturaSelecionada = null;
let filtroVagas = 'Todas';
let filtroCandidaturas = 'Todas';
let preferencias = { altoContraste: false, textoMaior: false };
let armazenamentoBloqueado = false;

function avisar(mensagem) {
    const caixa = document.createElement('div');
    caixa.className = 'notificacao';
    const texto = document.createElement('p');
    texto.textContent = mensagem;
    const fechar = document.createElement('button');
    fechar.type = 'button';
    fechar.textContent = '×';
    fechar.setAttribute('aria-label', 'Fechar mensagem');
    fechar.onclick = () => caixa.remove();
    caixa.append(texto, fechar);
    $('area-notificacoes').replaceChildren(caixa);
    // Permanece visível até ser fechada ou substituída, sem prazo para leitura.
}

function ler(chave, padrao, validar = () => true) {
    try {
        const bruto = localStorage.getItem(chave);
        if (bruto === null) return padrao;
        const valor = JSON.parse(bruto);
        if (!validar(valor)) throw new Error('Formato inválido');
        return valor;
    } catch {
        armazenamentoBloqueado = true;
        avisar('Não foi possível ler os dados salvos. Nada será sobrescrito. Verifique as permissões do navegador ou use outro navegador para a apresentação.');
        return padrao;
    }
}

function gravar(chave, valor) {
    if (armazenamentoBloqueado) {
        avisar('Os dados não puderam ser salvos. O armazenamento está indisponível ou contém dados inválidos. Os dados anteriores foram preservados.');
        return false;
    }
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch {
        avisar('Não foi possível salvar. Verifique o espaço e as permissões do navegador. A alteração não foi confirmada.');
        return false;
    }
}

const camposPerfil = ['nome', 'email', 'telefone', 'localizacao', 'formacao', 'experiencia', 'habilidades', 'ingles'];
function perfilValido(p) {
    return p && typeof p === 'object' && ['nome', 'email', 'formacao', 'habilidades', 'ingles'].every(c => typeof p[c] === 'string') &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email) && Number.isFinite(p.experiencia) && p.experiencia >= 0 && p.experiencia <= 60;
}
function contaValida(c) {
    return c && perfilValido(c.perfil) && Array.isArray(c.favoritos) && c.favoritos.every(Number.isInteger) &&
        Array.isArray(c.candidaturas) && c.candidaturas.every(a => a && Number.isInteger(a.idVaga) && typeof a.data === 'string' && typeof a.status === 'string');
}
function salvarContas(novas) {
    if (!gravar(CHAVE_DADOS, novas)) return false;
    contas = novas;
    return true;
}
function atualizarConta(alteracao) {
    if (!contaAtual) return false;
    const nova = { ...contaAtual, ...alteracao };
    if (!salvarContas(contas.map(c => c.perfil.email === contaAtual.perfil.email ? nova : c))) return false;
    contaAtual = nova;
    return true;
}

// Migra o perfil antigo sem apagar as chaves legadas (backup).
// A versão anterior não guardava senha; somente os campos conhecidos são copiados.
function carregarDados() {
    contas = ler(CHAVE_DADOS, null, a => Array.isArray(a) && a.every(contaValida) && new Set(a.map(c => c.perfil.email)).size === a.length);
    if (contas === null) {
        contas = [];
        const antigo = ler('vagaJusta_usuario', null, perfilValido);
        if (antigo) {
            const perfil = Object.fromEntries(camposPerfil.map(c => [c, antigo[c] ?? '']));
            perfil.email = perfil.email.trim().toLowerCase();
            const favoritos = ler('vagaJusta_favoritos', [], a => Array.isArray(a) && a.every(Number.isInteger));
            const candidaturas = ler('vagaJusta_candidaturas', [], a => Array.isArray(a) && a.every(c => c && Number.isInteger(c.idVaga) && typeof c.data === 'string' && typeof c.status === 'string'));
            if (salvarContas([{ perfil, favoritos, candidaturas }])) avisar('Perfil da versão anterior recuperado. Entre com o e-mail cadastrado; esta versão demonstrativa não usa senha.');
        }
    }
    preferencias = ler('vagaJusta_preferencias_v2', {
        altoContraste: ler('vagaJusta_altoContraste', false, v => typeof v === 'boolean'),
        textoMaior: ler('vagaJusta_textoMaior', false, v => typeof v === 'boolean')
    }, p => p && typeof p.altoContraste === 'boolean' && typeof p.textoMaior === 'boolean');
    aplicarPreferencias();
    const sessao = ler(CHAVE_SESSAO, null, s => s === null || typeof s === 'string');
    contaAtual = contas.find(c => c.perfil.email === sessao) || null;
    mostrarTela(contaAtual ? 'tela-vagas' : 'tela-inicial');
}
window.addEventListener('DOMContentLoaded', carregarDados);

// ==========================================
// NAVEGAÇÃO — telas privadas exigem um perfil selecionado.
// ==========================================
function mostrarTela(idTela, registrar = true) {
    const publicas = ['tela-inicial', 'tela-login', 'tela-cadastro', 'tela-acessibilidade'];
    if (!contaAtual && !publicas.includes(idTela)) idTela = 'tela-login';
    const tela = $(idTela);
    if (!tela) return;
    document.querySelectorAll('.tela').forEach(t => t.classList.toggle('ativa', t === tela));
    if (registrar && historicoTelas.at(-1) !== idTela) historicoTelas.push(idTela);
    document.querySelectorAll('.nav-item').forEach(item => {
        const ativo = item.id === idTela.replace('tela-', 'nav-');
        item.classList.toggle('ativo', ativo);
        if (ativo) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
    });
    if (idTela === 'tela-vagas') buscarVagas();
    if (idTela === 'tela-perfil') preencherPerfil();
    if (idTela === 'tela-favoritos') renderizarFavoritos();
    if (idTela === 'tela-candidaturas') renderizarCandidaturas();
    document.title = `${tela.dataset.titulo} · Vaga Justa`;
    const titulo = tela.querySelector('h1, h2');
    if (titulo) { titulo.tabIndex = -1; titulo.focus({ preventScroll: true }); }
    window.scrollTo(0, 0);
}
function voltarPaginaAnterior() {
    historicoTelas.pop();
    mostrarTela(historicoTelas.at(-1) || (contaAtual ? 'tela-vagas' : 'tela-inicial'), false);
}
function voltarDaCompatibilidade() { mostrarTela(origemCompatibilidade); }
function recuperarSenha() { avisar('Não usamos senha. Cadastre um perfil e entre com o mesmo e-mail neste navegador. Não há recuperação por e-mail nem sincronização entre aparelhos.'); }
function fazerLoginGoogle() { avisar('Login com Google indisponível. Use um perfil demonstrativo cadastrado neste navegador.'); }
function iniciarSessao(conta) {
    if (!gravar(CHAVE_SESSAO, conta.perfil.email)) return false;
    contaAtual = conta;
    historicoTelas = [];
    filtroVagas = 'Todas'; filtroCandidaturas = 'Todas';
    $('input-busca').value = '';
    mostrarTela('tela-vagas');
    return true;
}
function fazerLogin(event) {
    event.preventDefault();
    if (!$('form-login').reportValidity()) return;
    const email = $('login-email').value.trim().toLowerCase();
    const conta = contas.find(c => c.perfil.email === email);
    if (!conta) { avisar('Nenhum perfil com este e-mail neste navegador. Confira o e-mail ou faça o cadastro.'); return; }
    if (iniciarSessao(conta)) { $('form-login').reset(); avisar('Perfil demonstrativo aberto.'); }
}
function obterPerfil(prefixo) {
    const perfil = {};
    camposPerfil.forEach(c => { perfil[c] = $(`${prefixo}-${c}`).value.trim(); });
    perfil.email = perfil.email.toLowerCase();
    perfil.experiencia = Number(perfil.experiencia);
    return perfil;
}
function validarFormulario(id) {
    const form = $(id);
    form.querySelectorAll('input').forEach(input => input.setCustomValidity(
        input.required && !input.value.trim() ? 'Preencha este campo.' : ''));
    return form.reportValidity();
}
// Limpa erros personalizados assim que o campo é corrigido.
document.addEventListener('input', event => { if (event.target.setCustomValidity) event.target.setCustomValidity(''); });
function criarConta(event) {
    event.preventDefault();
    if (!validarFormulario('form-cadastro')) return;
    const perfil = obterPerfil('cad');
    if (!perfilValido(perfil)) { avisar('Revise os dados do perfil.'); return; }
    if (contas.some(c => c.perfil.email === perfil.email)) { avisar('Este e-mail já possui um perfil neste navegador. Entre pela tela de login.'); return; }
    const conta = { perfil, favoritos: [], candidaturas: [] };
    if (!salvarContas([...contas, conta])) return;
    $('form-cadastro').reset();
    if (iniciarSessao(conta)) avisar('Perfil demonstrativo criado e salvo neste navegador.');
}
function sairConta() {
    // Sair limpa somente a sessão, nunca o cadastro e seus dados.
    try { localStorage.removeItem(CHAVE_SESSAO); }
    catch { avisar('Não foi possível encerrar a sessão salva. Verifique as permissões do navegador.'); return; }
    contaAtual = null;
    vagaAtualParaCompatibilidade = null;
    candidaturaSelecionada = null;
    historicoTelas = [];
    document.querySelectorAll('form').forEach(f => f.reset());
    limparCurriculo();
    mostrarTela('tela-login');
    avisar('Você saiu. Seu perfil, favoritos e candidaturas continuam salvos.');
}
function formatarTelefone(input) { input.value = input.value.replace(/[^\d+()\s-]/g, '').slice(0, 22); }

// ==========================================
// VAGAS, BUSCA E FAVORITOS
// Texto dinâmico sempre usa textContent, sem interpretar HTML do usuário.
// ==========================================
function normalizar(texto) { return String(texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' '); }
function elemento(tag, classe, texto) {
    const el = document.createElement(tag);
    el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
}
function botao(texto, classe, acao) {
    const el = elemento('button', classe, texto); el.type = 'button'; el.onclick = acao; return el;
}
function dataLegivel(data) { return /^\d{4}-\d{2}-\d{2}$/.test(data) ? data.split('-').reverse().join('/') : data; }
function cabecalhoVaga(vaga) {
    const div = elemento('div', '');
    div.append(elemento('h3', 'cargo', vaga.cargo), elemento('p', 'empresa', vaga.empresa), elemento('p', 'local', vaga.localizacao));
    return div;
}
function renderizarVagas(vagas, container = $('lista-vagas')) {
    container.replaceChildren();
    if (!vagas.length) { container.append(elemento('p', 'texto-central mt-20', 'Nenhuma vaga encontrada aqui.')); return; }
    vagas.forEach(vaga => {
        const favorito = contaAtual?.favoritos.includes(vaga.id);
        const card = elemento('article', 'card-vaga');
        const topo = elemento('div', 'card-cabecalho');
        const coracao = botao(favorito ? '♥' : '♡', `btn-favorito${favorito ? ' ativo' : ''}`, () => favoritarVaga(vaga.id));
        coracao.setAttribute('aria-label', `${favorito ? 'Remover dos' : 'Adicionar aos'} favoritos: ${vaga.cargo}`);
        coracao.setAttribute('aria-pressed', String(favorito));
        coracao.dataset.vagaFavorito = vaga.id;
        topo.append(cabecalhoVaga(vaga), coracao);
        const tags = elemento('div', 'tags');
        tags.append(elemento('span', 'tag', vaga.modalidade), elemento('span', 'tag verde', vaga.contratacao));
        card.append(topo, tags, elemento('p', 'local mb-10', `Publicação fictícia: ${dataLegivel(vaga.publicadaEm)}`), botao('Ver compatibilidade', 'btn-compatibilidade', () => abrirCompatibilidade(vaga.id)));
        container.append(card);
    });
}
function sincronizarChips(atributo, valor) {
    document.querySelectorAll(`[${atributo}]`).forEach(b => {
        const ativo = b.getAttribute(atributo) === valor;
        b.classList.toggle('ativo', ativo); b.setAttribute('aria-pressed', String(ativo));
    });
}
function buscarVagas() {
    const termo = normalizar($('input-busca').value);
    let vagas = vagasDemonstracao.filter(v => normalizar([v.cargo, v.empresa, v.localizacao, ...v.requisitos.habilidades].join(' ')).includes(termo));
    if (filtroVagas === 'Remoto') vagas = vagas.filter(v => v.modalidade === 'Remoto');
    if (filtroVagas === 'Salvador - BA') vagas = vagas.filter(v => v.localizacao === 'Salvador - BA');
    if (filtroVagas === 'Recentes') vagas.sort((a, b) => b.publicadaEm.localeCompare(a.publicadaEm));
    sincronizarChips('data-filtro-vaga', filtroVagas);
    renderizarVagas(vagas);
    $('resumo-vagas').textContent = `${vagas.length} vaga(s) fictícia(s)${filtroVagas === 'Recentes' ? ' · mais novas primeiro' : ''}`;
}
function filtrarVagas(filtro) { filtroVagas = filtro; buscarVagas(); }
function fecharTecladoAoPesquisar(event) { if (event.key === 'Enter') { event.preventDefault(); event.target.blur(); } }
function favoritarVaga(id) {
    if (!contaAtual) return;
    const favoritos = contaAtual.favoritos.includes(id) ? contaAtual.favoritos.filter(v => v !== id) : [...contaAtual.favoritos, id];
    if (!atualizarConta({ favoritos })) return;
    const naListaFavoritos = $('tela-favoritos').classList.contains('ativa');
    if (naListaFavoritos) renderizarFavoritos(); else buscarVagas();
    const tela = document.querySelector('.tela.ativa');
    (tela.querySelector(`[data-vaga-favorito="${id}"]`) || tela.querySelector('h2')).focus({ preventScroll: true });
    avisar(favoritos.includes(id) ? 'Vaga adicionada aos favoritos.' : 'Vaga removida dos favoritos.');
}
function renderizarFavoritos() { renderizarVagas(vagasDemonstracao.filter(v => contaAtual?.favoritos.includes(v.id)), $('lista-favoritos')); }

// ==========================================
// COMPATIBILIDADE — função pura: recebe dados e devolve resultado.
// Regras de equivalência explícitas, sem IA e sem comparação por trecho.
// ==========================================
const areasFormacao = {
    Tecnologia: ['tecnologia', 'informatica', 'tecnico em informatica', 'ciencia da computacao', 'sistemas de informacao', 'analise e desenvolvimento de sistemas', 'engenharia de software'],
    Administração: ['administracao', 'tecnico em administracao', 'bacharelado em administracao'],
    Design: ['design', 'design grafico', 'tecnico em design grafico'],
    'Recursos Humanos': ['recursos humanos', 'gestao de recursos humanos', 'tecnico em recursos humanos'],
    'Ensino Médio': ['ensino medio', 'ensino medio completo']
};
function calcularCompatibilidade(vaga, candidato) {
    const req = vaga.requisitos;
    const formacao = normalizar(candidato.formacao);
    const area = Object.keys(areasFormacao).find(a => areasFormacao[a].includes(formacao));
    const formacaoOK = req.formacao === 'Ensino Médio' ? Boolean(area) : area === req.formacao;
    const anos = Math.max(0, Number(candidato.experiencia) || 0);
    const habilidades = new Set(normalizar(candidato.habilidades).split(/[,;\n]/).map(h => h.trim()).filter(Boolean));
    const atendidas = req.habilidades.filter(h => habilidades.has(normalizar(h)));
    const faltantes = req.habilidades.filter(h => !habilidades.has(normalizar(h)));
    const niveis = ['nenhum', 'basico', 'intermediario', 'avancado'];
    const ingles = Math.max(0, niveis.indexOf(normalizar(candidato.ingles)));
    const exigido = Math.max(0, niveis.indexOf(normalizar(req.ingles)));
    const criterios = [
        { nome: 'Formação', maximo: 25, pontos: formacaoOK ? 25 : 0, atendido: formacaoOK, detalhe: `Área exigida: ${req.formacao}. Perfil: ${candidato.formacao || 'não informado'}.` },
        { nome: 'Experiência', maximo: 25, pontos: req.experiencia === 0 ? 25 : 25 * Math.min(anos / req.experiencia, 1), atendido: anos >= req.experiencia, detalhe: `Exigência: ${req.experiencia} ano(s). Perfil: ${anos} ano(s).` },
        { nome: 'Habilidades', maximo: 30, pontos: req.habilidades.length ? 30 * atendidas.length / req.habilidades.length : 30, atendido: faltantes.length === 0, detalhe: `Atendidas: ${atendidas.join(', ') || 'nenhuma'}. Faltantes: ${faltantes.join(', ') || 'nenhuma'}.` },
        { nome: 'Inglês', maximo: 20, pontos: exigido === 0 ? 20 : 20 * Math.min(ingles / exigido, 1), atendido: ingles >= exigido, detalhe: `Exigência: ${req.ingles}. Perfil: ${candidato.ingles || 'Nenhum'}.` }
    ];
    return { pontos: Math.round(criterios.reduce((total, c) => total + c.pontos, 0)), criterios, atendidas, faltantes };
}
function abrirCompatibilidade(id) {
    const vaga = vagasDemonstracao.find(v => v.id === id);
    if (!vaga || !contaAtual) return;
    const origem = document.querySelector('.tela.ativa').id;
    if (origem !== 'tela-compatibilidade') origemCompatibilidade = origem;
    vagaAtualParaCompatibilidade = vaga;
    $('detalhes-vaga-compatibilidade').replaceChildren(cabecalhoVaga(vaga));
    exibirCompatibilidade();
    mostrarTela('tela-compatibilidade');
}
function preencherLista(id, textos) { $(id).replaceChildren(...textos.map(t => elemento('li', '', t))); }
function exibirCompatibilidade() {
    const resultado = calcularCompatibilidade(vagaAtualParaCompatibilidade, contaAtual.perfil);
    $('valor-compatibilidade').textContent = `${resultado.pontos}%`;
    $('circle-porcentagem').setAttribute('stroke-dasharray', `${resultado.pontos}, 100`);
    $('circle-porcentagem').classList.toggle('vazio', resultado.pontos === 0);
    $('grafico-compatibilidade').setAttribute('aria-label', `Compatibilidade estimada: ${resultado.pontos}%`);
    $('faixa-compatibilidade').textContent = 'Comparação com os dados informados no perfil';
    const fortes = resultado.criterios.filter(c => c.atendido).map(c => `${c.nome}: critério atendido.`);
    if (resultado.atendidas.length && resultado.faltantes.length) fortes.push(`Habilidades reconhecidas: ${resultado.atendidas.join(', ')}.`);
    const melhorar = resultado.criterios.filter(c => !c.atendido).map(c => `${c.nome}: ${c.detalhe}`);
    if (!resultado.criterios[0].atendido) melhorar.push('Confira a grafia do curso nas sugestões do perfil. Cursos fora da lista precisam de revisão manual.');
    preencherLista('lista-pontos-fortes', fortes.length ? fortes : ['Nenhum critério atendido com os dados informados.']);
    preencherLista('lista-pontos-melhorar', melhorar.length ? melhorar : ['Todos os critérios desta regra foram atendidos. Isso não garante contratação.']);
    preencherLista('lista-criterios', resultado.criterios.map(c => `${c.nome}: ${c.pontos.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/${c.maximo} pontos · ${c.atendido ? 'Atendido' : c.pontos > 0 ? 'Parcial' : 'Não atendido'}. ${c.detalhe}`));
    const jaEnviou = contaAtual.candidaturas.some(c => c.idVaga === vagaAtualParaCompatibilidade.id);
    $('btn-candidatar').disabled = jaEnviou;
    $('btn-candidatar').textContent = jaEnviou ? 'Candidatura já registrada' : 'Simular candidatura';
}

// ==========================================
// CANDIDATURAS — registro local, sem envio a empresas.
// ==========================================
function candidatarSeAtual() {
    if (!contaAtual || !vagaAtualParaCompatibilidade) return;
    const idVaga = vagaAtualParaCompatibilidade.id;
    if (contaAtual.candidaturas.some(c => c.idVaga === idVaga)) { avisar('Você já registrou esta candidatura.'); return; }
    const candidatura = { idVaga, data: new Date().toLocaleDateString('pt-BR'), status: 'Em análise' };
    if (!atualizarConta({ candidaturas: [...contaAtual.candidaturas, candidatura] })) return;
    exibirCompatibilidade();
    avisar('Candidatura simulada e salva neste navegador. Nenhum dado foi enviado à empresa.');
}
function renderizarCandidaturas() {
    sincronizarChips('data-filtro-candidatura', filtroCandidaturas);
    const container = $('lista-candidaturas'); container.replaceChildren();
    const candidaturas = contaAtual.candidaturas.filter(c => filtroCandidaturas === 'Todas' || c.status === filtroCandidaturas);
    if (!candidaturas.length) container.append(elemento('p', 'texto-central mt-20', 'Nenhuma candidatura neste filtro.'));
    candidaturas.forEach(c => {
        const vaga = vagasDemonstracao.find(v => v.id === c.idVaga);
        if (!vaga) return;
        const card = elemento('article', 'card-vaga');
        card.append(cabecalhoVaga(vaga), elemento('p', 'local mt-10', `Registrada em ${dataLegivel(c.data)}`), elemento('p', 'status-candidatura', `${c.status} · simulação`), botao('Ver detalhes', 'btn-compatibilidade mt-10', () => verDetalhesCandidatura(c.idVaga)));
        container.append(card);
    });
}
function filtrarCandidaturas(status) { filtroCandidaturas = status; renderizarCandidaturas(); }
function verDetalhesCandidatura(id) {
    const c = contaAtual?.candidaturas.find(c => c.idVaga === id);
    const vaga = vagasDemonstracao.find(v => v.id === id);
    if (!c || !vaga) return;
    candidaturaSelecionada = id;
    $('info-detalhes-candidatura').replaceChildren(cabecalhoVaga(vaga), elemento('p', 'local mt-10', `Registrada em ${dataLegivel(c.data)} · ${c.status} (simulação)`));
    preencherLista('lista-etapas-processo', [
        `Registro local concluído em ${dataLegivel(c.data)}.`,
        c.status === 'Em análise' ? 'Análise do perfil: pendente na simulação.' : 'Análise: sem conclusão registrada.',
        c.status === 'Entrevista' ? 'Entrevista: status ilustrativo, sem data ou convite real.' : 'Entrevista: não agendada.',
        c.status === 'Finalizadas' ? 'Processo finalizado na simulação. Nenhum resultado de contratação informado.' : 'Conclusão: não registrada.'
    ]);
    mostrarTela('tela-detalhes-candidatura');
}
function abrirVagaDaCandidatura() { abrirCompatibilidade(candidaturaSelecionada); }

// ==========================================
// PERFIL, CURRÍCULO E ACESSIBILIDADE
// ==========================================
function preencherPerfil() {
    if (!contaAtual) return;
    const p = contaAtual.perfil;
    camposPerfil.forEach(c => { const el = $(`perfil-${c}-display`); if (el) el.textContent = c === 'experiencia' ? `${p[c]} ano(s)` : p[c] || 'Não informado'; });
    $('perfil-iniciais').textContent = p.nome.split(/\s+/).filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();
    $('perfil-resumo').textContent = `${contaAtual.favoritos.length} favorito(s) · ${contaAtual.candidaturas.length} candidatura(s)`;
}
function abrirEditarPerfil() {
    if (!contaAtual) return;
    camposPerfil.forEach(c => { $(`edit-${c}`).value = contaAtual.perfil[c] ?? ''; });
    mostrarTela('tela-editar-perfil');
}
function salvarPerfil(event) {
    event.preventDefault();
    if (!contaAtual || !validarFormulario('form-editar-perfil')) return;
    const perfil = obterPerfil('edit'); perfil.email = contaAtual.perfil.email;
    if (!perfilValido(perfil) || !atualizarConta({ perfil })) return;
    mostrarTela('tela-perfil'); avisar('Perfil salvo. As próximas comparações usarão estes dados.');
}
function selecionarCurriculo() {
    const arquivo = $('input-curriculo').files[0];
    if (!arquivo) return;
    if (!/\.pdf$/i.test(arquivo.name) || (arquivo.type && arquivo.type !== 'application/pdf') || arquivo.size > 5 * 1024 * 1024 || arquivo.size === 0) {
        limparCurriculo(); avisar('Selecione um PDF não vazio de até 5 MB.'); return;
    }
    $('nome-arquivo-curriculo').textContent = arquivo.name;
    $('tamanho-arquivo-curriculo').textContent = `${(arquivo.size / 1024).toFixed(1)} KB · seleção demonstrativa`;
    $('status-curriculo').hidden = false;
    avisar('PDF selecionado apenas para demonstração. Seu conteúdo não é lido nem usado no cálculo.');
}
function limparCurriculo() {
    $('input-curriculo').value = ''; $('status-curriculo').hidden = true;
    $('nome-arquivo-curriculo').textContent = ''; $('tamanho-arquivo-curriculo').textContent = '';
}
function definirPreferencia(nome, valor) {
    if (!Object.hasOwn(preferencias, nome)) return;
    const novas = { ...preferencias, [nome]: Boolean(valor) };
    if (gravar('vagaJusta_preferencias_v2', novas)) preferencias = novas;
    aplicarPreferencias();
}
function aplicarPreferencias() {
    document.documentElement.style.fontSize = preferencias.textoMaior ? '20px' : '16px';
    document.body.classList.toggle('alto-contraste', preferencias.altoContraste);
    document.body.classList.toggle('texto-maior', preferencias.textoMaior);
    document.querySelectorAll('[data-preferencia]').forEach(el => { el.checked = preferencias[el.dataset.preferencia]; });
    document.querySelectorAll('[data-estado-preferencia]').forEach(el => { el.textContent = preferencias[el.dataset.estadoPreferencia] ? 'Ligado' : 'Desligado'; });
    sincronizarChips('data-tamanho-texto', preferencias.textoMaior ? 'maior' : 'padrao');
}
