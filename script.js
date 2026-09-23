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

// ==========================================
// VARIÁVEIS DE ESTADO
// ==========================================
let usuarioAtual = null;
let vagasFavoritas = [];
let minhasCandidaturas = [];
let vagaAtualParaCompatibilidade = null;
let historicoTelas = []; // Para o botão de voltar

// ==========================================
// INICIALIZAÇÃO
// ==========================================
window.onload = function() {
    carregarDadosLocalStorage();
    // Se o usuário já estiver "logado", vai direto para vagas
    if (usuarioAtual) {
        mostrarTela('tela-vagas');
    }
};

function carregarDadosLocalStorage() {
    const usuarioSalvo = localStorage.getItem('vagaJusta_usuario');
    const favoritosSalvos = localStorage.getItem('vagaJusta_favoritos');
    const candidaturasSalvas = localStorage.getItem('vagaJusta_candidaturas');
    
    // Acessibilidade
    const altoContraste = localStorage.getItem('vagaJusta_altoContraste');
    const textoMaior = localStorage.getItem('vagaJusta_textoMaior');

    if (usuarioSalvo) usuarioAtual = JSON.parse(usuarioSalvo);
    if (favoritosSalvos) vagasFavoritas = JSON.parse(favoritosSalvos);
    if (candidaturasSalvas) minhasCandidaturas = JSON.parse(candidaturasSalvas);

    if (altoContraste === 'true') {
        document.getElementById('toggle-contraste').checked = true;
        ativarContraste(true);
    }
    if (textoMaior === 'true') {
        aumentarTexto();
    }
}

// ==========================================
// NAVEGAÇÃO ENTRE TELAS
// ==========================================
// Mostra apenas a tela escolhida e esconde as outras
function mostrarTela(idTela) {
    // Esconde todas as telas
    const telas = document.querySelectorAll('.tela');
    telas.forEach(tela => {
        tela.classList.remove('ativa');
    });

    // Mostra a tela solicitada
    const telaAtiva = document.getElementById(idTela);
    if (telaAtiva) {
        telaAtiva.classList.add('ativa');
    }

    // Salva o histórico para o botão voltar (evitando duplicatas seguidas)
    if (historicoTelas.length === 0 || historicoTelas[historicoTelas.length - 1] !== idTela) {
        historicoTelas.push(idTela);
    }

    // Atualiza a barra de navegação inferior se necessário
    atualizarNavInferior(idTela);

    // Executa ações específicas dependendo da tela
    if (idTela === 'tela-vagas') {
        renderizarVagas(vagasDemonstracao);
    } else if (idTela === 'tela-perfil') {
        preencherPerfil();
    } else if (idTela === 'tela-favoritos') {
        renderizarFavoritos();
    } else if (idTela === 'tela-candidaturas') {
        renderizarCandidaturas();
    }
}

function voltarPaginaAnterior() {
    if (historicoTelas.length > 1) {
        historicoTelas.pop(); // Remove a atual
        const telaAnterior = historicoTelas[historicoTelas.length - 1];
        mostrarTela(telaAnterior);
    } else {
        mostrarTela('tela-inicial');
    }
}

function atualizarNavInferior(idTela) {
    const itens = document.querySelectorAll('.nav-item');
    itens.forEach(item => item.classList.remove('ativo'));

    if (idTela === 'tela-vagas') document.getElementById('nav-vagas-2').classList.add('ativo');
    if (idTela === 'tela-candidaturas') document.getElementById('nav-candidaturas').classList.add('ativo');
    if (idTela === 'tela-favoritos') document.getElementById('nav-favoritos').classList.add('ativo');
    if (idTela === 'tela-perfil') document.getElementById('nav-perfil').classList.add('ativo');
}

// ==========================================
// LOGIN E CADASTRO
// ==========================================
function alternarSenha(idInput) {
    const input = document.getElementById(idInput);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}

function fazerLogin(event) {
    event.preventDefault(); // Impede o envio real do form
    
    // Como é um protótipo, criamos um usuário falso se não existir
    if (!usuarioAtual) {
        usuarioAtual = {
            nome: "Usuário Teste",
            email: document.getElementById('login-email').value,
            telefone: "(71) 99999-9999",
            localizacao: "Salvador - BA",
            formacao: "Técnico em Informática",
            experiencia: 2,
            habilidades: "Atendimento, Informática, Excel",
            ingles: "Básico"
        };
        localStorage.setItem('vagaJusta_usuario', JSON.stringify(usuarioAtual));
    }
    mostrarTela('tela-vagas');
}

function fazerLoginGoogle() {
    alert("Opção demonstrativa do protótipo. Integraria com a conta do Google.");
    mostrarTela('tela-vagas');
}

function criarConta(event) {
    event.preventDefault();
    
    const senha = document.getElementById('cad-senha').value;
    const confirmarSenha = document.getElementById('cad-confirmar').value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    const novoUsuario = {
        nome: document.getElementById('cad-nome').value,
        email: document.getElementById('cad-email').value,
        telefone: document.getElementById('cad-telefone').value,
        localizacao: document.getElementById('cad-localizacao').value,
        formacao: document.getElementById('cad-formacao').value,
        experiencia: parseInt(document.getElementById('cad-experiencia').value),
        habilidades: document.getElementById('cad-habilidades').value,
        ingles: document.getElementById('cad-ingles').value
    };

    usuarioAtual = novoUsuario;
    localStorage.setItem('vagaJusta_usuario', JSON.stringify(usuarioAtual));
    
    alert("Conta criada com sucesso!");
    mostrarTela('tela-vagas');
}

function sairConta() {
    usuarioAtual = null;
    vagasFavoritas = [];
    minhasCandidaturas = [];
    localStorage.removeItem('vagaJusta_usuario');
    localStorage.removeItem('vagaJusta_favoritos');
    localStorage.removeItem('vagaJusta_candidaturas');
    mostrarTela('tela-login');
}

// ==========================================
// VAGAS E FILTROS
// ==========================================
function renderizarVagas(vagas) {
    const container = document.getElementById('lista-vagas');
    container.innerHTML = ''; // Limpa as vagas atuais

    if (vagas.length === 0) {
        container.innerHTML = '<p class="texto-central mt-20">Nenhuma vaga encontrada.</p>';
        return;
    }

    vagas.forEach(vaga => {
        const ehFavorita = vagasFavoritas.includes(vaga.id);
        const classeCoracao = ehFavorita ? 'btn-favorito ativo' : 'btn-favorito';
        const iconeCoracao = ehFavorita ? '♥' : '♡';

        const cardHTML = `
            <div class="card-vaga">
                <div class="card-cabecalho">
                    <div>
                        <h3 class="cargo">${vaga.cargo}</h3>
                        <p class="empresa">${vaga.empresa}</p>
                        <p class="local">${vaga.localizacao}</p>
                    </div>
                    <button class="${classeCoracao}" onclick="favoritarVaga(${vaga.id}, this)">${iconeCoracao}</button>
                </div>
                <div class="tags">
                    <span class="tag">${vaga.modalidade}</span>
                    <span class="tag verde">${vaga.contratacao}</span>
                </div>
                <button class="btn-compatibilidade" onclick="abrirCompatibilidade(${vaga.id})">Ver compatibilidade</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function buscarVagas() {
    const termoBusca = document.getElementById('input-busca').value.toLowerCase();
    
    const vagasFiltradas = vagasDemonstracao.filter(vaga => {
        return vaga.cargo.toLowerCase().includes(termoBusca) || 
               vaga.empresa.toLowerCase().includes(termoBusca) ||
               vaga.localizacao.toLowerCase().includes(termoBusca);
    });

    renderizarVagas(vagasFiltradas);
}

function filtrarVagas(filtro, btnClicado) {
    // Atualiza o visual dos botões
    const chips = document.querySelectorAll('#tela-vagas .chip');
    chips.forEach(chip => chip.classList.remove('ativo'));
    btnClicado.classList.add('ativo');

    // Filtra as vagas
    let vagasFiltradas = vagasDemonstracao;

    if (filtro === 'Remoto') {
        vagasFiltradas = vagasDemonstracao.filter(v => v.modalidade === 'Remoto');
    } else if (filtro === 'Salvador - BA') {
        vagasFiltradas = vagasDemonstracao.filter(v => v.localizacao.includes('Salvador'));
    }
    // "Recentes" apenas mantém a mesma ordem na demonstração, ou poderia embaralhar

    renderizarVagas(vagasFiltradas);
}

function favoritarVaga(idVaga, botao) {
    const index = vagasFavoritas.indexOf(idVaga);
    
    if (index > -1) {
        // Remover dos favoritos
        vagasFavoritas.splice(index, 1);
        botao.classList.remove('ativo');
        botao.innerHTML = '♡';
    } else {
        // Adicionar aos favoritos
        vagasFavoritas.push(idVaga);
        botao.classList.add('ativo');
        botao.innerHTML = '♥';
    }

    // Salvar no localStorage
    localStorage.setItem('vagaJusta_favoritos', JSON.stringify(vagasFavoritas));
    
    // Se estiver na tela de favoritos, re-renderizar
    if (document.getElementById('tela-favoritos').classList.contains('ativa')) {
        renderizarFavoritos();
    }
}

function renderizarFavoritos() {
    const container = document.getElementById('lista-favoritos');
    container.innerHTML = '';

    const vagasFiltradas = vagasDemonstracao.filter(vaga => vagasFavoritas.includes(vaga.id));

    if (vagasFiltradas.length === 0) {
        container.innerHTML = '<p class="texto-central mt-20">Você ainda não adicionou nenhuma vaga aos favoritos.</p>';
        return;
    }

    // Aproveita a mesma função de renderização
    vagasFiltradas.forEach(vaga => {
        const cardHTML = `
            <div class="card-vaga">
                <div class="card-cabecalho">
                    <div>
                        <h3 class="cargo">${vaga.cargo}</h3>
                        <p class="empresa">${vaga.empresa}</p>
                        <p class="local">${vaga.localizacao}</p>
                    </div>
                    <button class="btn-favorito ativo" onclick="favoritarVaga(${vaga.id}, this)">♥</button>
                </div>
                <div class="tags">
                    <span class="tag">${vaga.modalidade}</span>
                    <span class="tag verde">${vaga.contratacao}</span>
                </div>
                <button class="btn-compatibilidade" onclick="abrirCompatibilidade(${vaga.id})">Ver compatibilidade</button>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

// ==========================================
// COMPATIBILIDADE
// ==========================================
function abrirCompatibilidade(idVaga) {
    vagaAtualParaCompatibilidade = vagasDemonstracao.find(v => v.id === idVaga);
    if (!vagaAtualParaCompatibilidade) return;

    // Preenche cabeçalho
    const cabecalho = document.getElementById('detalhes-vaga-compatibilidade');
    cabecalho.innerHTML = `
        <h3 class="cargo">${vagaAtualParaCompatibilidade.cargo}</h3>
        <p class="empresa">${vagaAtualParaCompatibilidade.empresa}</p>
        <p class="local">${vagaAtualParaCompatibilidade.localizacao}</p>
    `;

    // Calcula compatibilidade baseada no usuário atual
    calcularCompatibilidade(vagaAtualParaCompatibilidade, usuarioAtual);

    mostrarTela('tela-compatibilidade');
}

// Calcula a compatibilidade entre candidato e vaga
function calcularCompatibilidade(vaga, candidato) {
    let pontos = 0;
    const req = vaga.requisitos;
    
    let pontosFortes = [];
    let pontosMelhorar = [];

    // Se não tiver candidato logado, cria um genérico para não quebrar
    const cand = candidato || { experiencia: 0, habilidades: "", formacao: "", ingles: "Nenhum" };

    // 1. Experiência (25 pts)
    if (cand.experiencia >= req.experiencia) {
        pontos += 25;
        pontosFortes.push("Experiência alinhada");
    } else {
        pontosMelhorar.push(`Exige ${req.experiencia} ano(s) de experiência`);
    }

    // 2. Formação (25 pts)
    // Uma lógica simples: se alguma palavra chave bater, consideramos compatível
    const formacaoCandidato = cand.formacao.toLowerCase();
    const formacaoReq = req.formacao.toLowerCase();
    
    if (formacaoCandidato.includes(formacaoReq) || formacaoReq.includes("qualquer") || formacaoCandidato !== "") {
        pontos += 25;
        pontosFortes.push("Formação compatível");
    } else {
        pontosMelhorar.push(`Desejável formação em ${req.formacao}`);
    }

    // 3. Habilidades (30 pts)
    let habilidadesBateram = 0;
    const habilidadesCand = cand.habilidades.toLowerCase();
    
    req.habilidades.forEach(hab => {
        if (habilidadesCand.includes(hab.toLowerCase())) {
            habilidadesBateram++;
        }
    });

    if (habilidadesBateram > 0) {
        let proporcao = habilidadesBateram / req.habilidades.length;
        pontos += Math.floor(30 * proporcao);
        if (proporcao >= 0.5) {
            pontosFortes.push("Habilidades técnicas aderentes");
        } else {
            pontosMelhorar.push("Aprimorar habilidades específicas");
        }
    } else {
        pontosMelhorar.push(`Requisito: ${req.habilidades.join(', ')}`);
    }

    // 4. Inglês (20 pts)
    const niveis = {"Nenhum": 0, "Básico": 1, "Intermediário": 2, "Avançado": 3};
    const nivelCand = niveis[cand.ingles] || 0;
    const nivelReq = niveis[req.ingles] || 0;

    if (nivelCand >= nivelReq) {
        pontos += 20;
        pontosFortes.push(`Inglês ${cand.ingles} adequado`);
    } else {
        pontosMelhorar.push(`Necessário inglês ${req.ingles}`);
    }

    // Atualiza UI
    if (pontos < 10) pontos = 10; // Mínimo pra não ficar 0 feio no gráfico
    if (pontos > 100) pontos = 100;

    document.getElementById('valor-compatibilidade').innerText = `${pontos}%`;
    document.getElementById('circle-porcentagem').setAttribute('stroke-dasharray', `${pontos}, 100`);

    // Atualiza listas
    const listaFortes = document.getElementById('lista-pontos-fortes');
    listaFortes.innerHTML = '';
    pontosFortes.forEach(p => listaFortes.innerHTML += `<li>${p}</li>`);

    const listaMelhorar = document.getElementById('lista-pontos-melhorar');
    listaMelhorar.innerHTML = '';
    pontosMelhorar.forEach(p => listaMelhorar.innerHTML += `<li>${p}</li>`);

    // Verifica se já se candidatou
    const btnCandidatar = document.getElementById('btn-candidatar');
    const jaCandidatou = minhasCandidaturas.find(c => c.idVaga === vaga.id);
    
    if (jaCandidatou) {
        btnCandidatar.innerText = "Candidatura já enviada";
        btnCandidatar.style.backgroundColor = "var(--texto-cinza)";
        btnCandidatar.disabled = true;
    } else {
        btnCandidatar.innerText = "Me candidatar";
        btnCandidatar.style.backgroundColor = "var(--verde-principal)";
        btnCandidatar.disabled = false;
    }
}

// ==========================================
// CANDIDATURAS
// ==========================================
function candidatarSeAtual() {
    if (!vagaAtualParaCompatibilidade || !usuarioAtual) return;

    const jaCandidatou = minhasCandidaturas.find(c => c.idVaga === vagaAtualParaCompatibilidade.id);
    if (jaCandidatou) {
        alert("Você já se candidatou a esta vaga!");
        return;
    }

    // Registra candidatura
    const novaCandidatura = {
        idVaga: vagaAtualParaCompatibilidade.id,
        cargo: vagaAtualParaCompatibilidade.cargo,
        empresa: vagaAtualParaCompatibilidade.empresa,
        localizacao: vagaAtualParaCompatibilidade.localizacao,
        data: new Date().toLocaleDateString('pt-BR'),
        status: "Em análise" // Status padrão
    };

    minhasCandidaturas.push(novaCandidatura);
    localStorage.setItem('vagaJusta_candidaturas', JSON.stringify(minhasCandidaturas));

    alert("Candidatura enviada com sucesso! Boa sorte!");
    
    // Atualiza botão na hora
    const btnCandidatar = document.getElementById('btn-candidatar');
    btnCandidatar.innerText = "Candidatura já enviada";
    btnCandidatar.style.backgroundColor = "var(--texto-cinza)";
    btnCandidatar.disabled = true;
}

function renderizarCandidaturas(filtroStatus = "Todas") {
    const container = document.getElementById('lista-candidaturas');
    container.innerHTML = '';

    let candidaturasExibir = minhasCandidaturas;

    if (filtroStatus !== "Todas") {
        candidaturasExibir = minhasCandidaturas.filter(c => c.status === filtroStatus);
    }

    if (candidaturasExibir.length === 0) {
        container.innerHTML = '<p class="texto-central mt-20">Você ainda não possui candidaturas aqui.</p>';
        return;
    }

    candidaturasExibir.forEach(cand => {
        let classeStatus = "status-candidatura";
        if (cand.status === "Entrevista") classeStatus += " status-entrevista";

        const cardHTML = `
            <div class="card-vaga" style="cursor: pointer;" onclick="verDetalhesCandidatura(${cand.idVaga})">
                <div class="card-cabecalho">
                    <div>
                        <h3 class="cargo">${cand.cargo}</h3>
                        <p class="empresa">${cand.empresa}</p>
                        <p class="local">${cand.localizacao}</p>
                        <p class="local mt-10">Enviado em ${cand.data}</p>
                    </div>
                    <div>
                        <span class="${classeStatus}">${cand.status}</span>
                        <span style="color: var(--texto-cinza); margin-left: 5px;">></span>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

function verDetalhesCandidatura(idVaga) {
    const candidatura = minhasCandidaturas.find(c => c.idVaga === idVaga);
    if (!candidatura) return;

    const info = document.getElementById('info-detalhes-candidatura');
    info.innerHTML = `
        <h3 class="cargo">${candidatura.cargo}</h3>
        <p class="empresa">${candidatura.empresa}</p>
        <p class="local">${candidatura.localizacao}</p>
        <p class="local mt-10">Enviado em ${candidatura.data}</p>
        <div class="mt-10">
            <span class="status-candidatura ${candidatura.status === 'Entrevista' ? 'status-entrevista' : ''}">${candidatura.status}</span>
        </div>
    `;

    const lista = document.getElementById('lista-etapas-processo');
    
    let etapasHTML = `
        <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: var(--verde-principal); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
            <div style="flex: 1;">
                <p style="font-weight: bold; font-size: 14px;">Candidatura enviada</p>
                <p style="font-size: 12px; color: var(--texto-cinza);">${candidatura.data}</p>
            </div>
        </li>
    `;
    
    const isEntrevistaOuFim = (candidatura.status === 'Entrevista' || candidatura.status === 'Finalizadas');
    
    etapasHTML += `
        <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: var(--verde-principal); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">✓</div>
            <div style="flex: 1;">
                <p style="font-weight: bold; font-size: 14px;">Análise do perfil</p>
            </div>
        </li>
    `;
    
    etapasHTML += `
        <li style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background-color: ${isEntrevistaOuFim ? 'var(--verde-principal)' : 'var(--borda)'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${isEntrevistaOuFim ? '✓' : ''}</div>
            <div style="flex: 1;">
                <p style="font-weight: ${isEntrevistaOuFim ? 'bold' : 'normal'}; font-size: 14px; color: ${isEntrevistaOuFim ? 'var(--texto-escuro)' : 'var(--texto-cinza)'};">Entrevista com RH</p>
            </div>
        </li>
    `;

    lista.innerHTML = etapasHTML;
    mostrarTela('tela-detalhes-candidatura');
}

function filtrarCandidaturas(status, btnClicado) {
    const chips = document.querySelectorAll('#tela-candidaturas .chip');
    chips.forEach(chip => chip.classList.remove('ativo'));
    btnClicado.classList.add('ativo');

    renderizarCandidaturas(status);
}

// ==========================================
// PERFIL
// ==========================================
function preencherPerfil() {
    if (!usuarioAtual) return;

    document.getElementById('perfil-nome-display').innerText = usuarioAtual.nome;
    document.getElementById('perfil-email-display').innerText = usuarioAtual.email;
    document.getElementById('perfil-telefone-display').innerText = usuarioAtual.telefone || "-";
    document.getElementById('perfil-localizacao-display').innerText = usuarioAtual.localizacao || "-";
    document.getElementById('perfil-formacao-display').innerText = usuarioAtual.formacao || "-";
    document.getElementById('perfil-experiencia-display').innerText = `${usuarioAtual.experiencia} anos` || "0 anos";
    document.getElementById('perfil-habilidades-display').innerText = usuarioAtual.habilidades || "-";
    document.getElementById('perfil-ingles-display').innerText = usuarioAtual.ingles || "-";
}

function abrirEditarPerfil() {
    if (!usuarioAtual) return;
    
    document.getElementById('edit-nome').value = usuarioAtual.nome;
    document.getElementById('edit-telefone').value = usuarioAtual.telefone || "";
    document.getElementById('edit-localizacao').value = usuarioAtual.localizacao || "";
    document.getElementById('edit-formacao').value = usuarioAtual.formacao || "";
    document.getElementById('edit-experiencia').value = usuarioAtual.experiencia || 0;
    document.getElementById('edit-habilidades').value = usuarioAtual.habilidades || "";
    document.getElementById('edit-ingles').value = usuarioAtual.ingles || "Nenhum";
    
    document.getElementById('msg-sucesso-perfil').style.display = 'none';
    mostrarTela('tela-editar-perfil');
}

function salvarPerfil(event) {
    event.preventDefault();
    if (!usuarioAtual) return;

    usuarioAtual.nome = document.getElementById('edit-nome').value;
    usuarioAtual.telefone = document.getElementById('edit-telefone').value;
    usuarioAtual.localizacao = document.getElementById('edit-localizacao').value;
    usuarioAtual.formacao = document.getElementById('edit-formacao').value;
    usuarioAtual.experiencia = parseInt(document.getElementById('edit-experiencia').value) || 0;
    usuarioAtual.habilidades = document.getElementById('edit-habilidades').value;
    usuarioAtual.ingles = document.getElementById('edit-ingles').value;

    localStorage.setItem('vagaJusta_usuario', JSON.stringify(usuarioAtual));
    
    const msg = document.getElementById('msg-sucesso-perfil');
    msg.style.display = 'block';
    
    setTimeout(() => {
        msg.style.display = 'none';
        mostrarTela('tela-perfil');
    }, 2000);
}

// ==========================================
// CURRÍCULO
// ==========================================
function selecionarCurriculo() {
    const input = document.getElementById('input-curriculo');
    const status = document.getElementById('status-curriculo');
    const nomeArquivo = document.getElementById('nome-arquivo-curriculo');
    
    if (input.files && input.files.length > 0) {
        nomeArquivo.innerText = input.files[0].name;
        status.style.display = 'block';
    } else {
        status.style.display = 'none';
    }
}

// ==========================================
// ACESSIBILIDADE
// ==========================================
function ativarContraste(ativo) {
    if (ativo) {
        document.body.classList.add('alto-contraste');
        localStorage.setItem('vagaJusta_altoContraste', 'true');
    } else {
        document.body.classList.remove('alto-contraste');
        localStorage.setItem('vagaJusta_altoContraste', 'false');
    }
}

let estadoTextoMaior = false;
function aumentarTexto() {
    estadoTextoMaior = !estadoTextoMaior;
    const btnTextMaior = document.getElementById('btn-texto-maior');

    if (estadoTextoMaior) {
        document.body.classList.add('texto-maior');
        localStorage.setItem('vagaJusta_textoMaior', 'true');
        if(btnTextMaior) btnTextMaior.classList.add('ativo');
    } else {
        document.body.classList.remove('texto-maior');
        localStorage.setItem('vagaJusta_textoMaior', 'false');
        if(btnTextMaior) btnTextMaior.classList.remove('ativo');
    }
}

function mostrarMsgDemonstrativa(checkbox) {
    if (checkbox.checked) {
        alert("Opção demonstrativa do protótipo acadêmico. A funcionalidade real exigiria integração com recursos do sistema operacional.");
        setTimeout(() => {
            checkbox.checked = false; // Desmarca após mostrar o alerta
        }, 500);
    }
}

function toggleContrasteConfig() {
    const checkbox = document.getElementById('toggle-contraste');
    if (checkbox) {
        checkbox.checked = !checkbox.checked;
        ativarContraste(checkbox.checked);
    }
}
