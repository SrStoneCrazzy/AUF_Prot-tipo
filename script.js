import * as THREE from "three";

function rolarD6() {
    return Math.floor(Math.random() * 6) + 1;
}

function rolarD4() {
    return Math.floor(Math.random() * 4) + 1;
}

function rolarDado(lados) {
    return Math.floor(Math.random() * lados) + 1;
}

function escolher(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
}

const tipos = {
    "Caça": [
        "Uma criatura está atacando pessoas da região.",
        "Uma criatura está impedindo o acesso a uma área importante.",
        "Precisam eliminar uma criatura específica para obter alguma parte dela.",
        "Uma ameaça está se aproximando da Aliança e precisa ser eliminada.",
        "Um grupo de criaturas tomou um local que precisa ser recuperado.",
        "Alguém quer vingança contra uma criatura que matou ou feriu alguém."
    ],
    "Coleta": [
        "Falta um recurso essencial na Aliança.",
        "Uma pessoa ou setor específico precisa daquele recurso.",
        "O recurso foi localizado em uma área perigosa.",
        "O estoque atual está acabando e precisam repor.",
        "Encontraram informações sobre um esconderijo com grandes quantidades do recurso.",
        "Um comerciante oferece uma recompensa pelo recurso."
    ],
    "Exploração": [
        "Foi encontrada uma área que ninguém da Aliança conhece.",
        "Uma rota nova pode facilitar o acesso a outra região.",
        "Alguém viu uma estrutura interessante na superfície.",
        "Uma expedição anterior encontrou algo, mas não conseguiu investigar.",
        "Há rumores sobre recursos em uma região desconhecida.",
        "Querem descobrir se determinada área ainda é habitável ou segura."
    ],
    "Resgate": [
        "Um membro da Aliança desapareceu.",
        "Uma expedição não retornou.",
        "Alguém ficou preso em uma região perigosa.",
        "Uma pessoa importante foi capturada.",
        "Um grupo pediu ajuda para recuperar alguém.",
        "Alguém está ferido e precisa ser trazido de volta."
    ],
    "Transporte": [
        "Um recurso precisa chegar a outra base.",
        "Uma pessoa precisa ser escoltada.",
        "Uma mensagem precisa ser entregue.",
        "Equipamentos precisam ser levados para uma expedição.",
        "Um objeto importante precisa ser recuperado e transportado.",
        "Uma carga precisa atravessar uma região perigosa."
    ],
    "Investigação": [
        "Alguém desapareceu sem deixar explicações.",
        "Uma expedição não retornou e ninguém sabe o motivo.",
        "Foram encontrados sinais estranhos em determinada região.",
        "Um local deixou de responder às comunicações.",
        "Alguém encontrou um objeto ou documento cuja origem é desconhecida.",
        "Surgiram rumores sobre alguma atividade incomum."
    ]
};

const consequencias = [
    [
        "Emboscada",
        "O grupo é surpreendido por inimigos que já estavam esperando ou que chegaram durante a missão."
    ],
    [
        "Outro grupo",
        "Os jogadores descobrem que outra facção ou grupo de sobreviventes também está interessado no mesmo objetivo."
    ],
    [
        "Recurso inesperado",
        "Além do objetivo original, os jogadores encontram algo muito mais valioso do que esperavam."
    ],
    [
        "Situação pior do que parecia",
        "O local ou objetivo apresenta um perigo muito maior do que as informações recebidas indicavam."
    ],
    [
        "Escolha difícil",
        "Os jogadores encontram uma segunda oportunidade ou problema que exige escolher entre dois objetivos. Não é possível resolver tudo."
    ],
    [
        "Informação importante",
        "Durante o trabalho, os jogadores encontram uma pista, documento, pessoa ou acontecimento que pode abrir uma nova possibilidade para a campanha."
    ]
];

let missaoAtual = null;
let historico = [];

function gerarMissao() {
    const tipoNum = rolarD6();
    const nomesTipos = Object.keys(tipos);
    const tipo = nomesTipos[tipoNum - 1];

    const motivoNum = rolarD6();
    const motivo = tipos[tipo][motivoNum - 1];

    const consequenciaNum = rolarD6();
    const consequencia = consequencias[consequenciaNum - 1];

    missaoAtual = {
        tipoNum,
        tipo,
        motivoNum,
        motivo,
        consequenciaNum,
        consequenciaNome: consequencia[0],
        consequenciaTexto: consequencia[1]
    };

    renderizarMissao();
}

function renderizarMissao() {
    if (!missaoAtual) return;

    document.getElementById("resultadoMissao").innerHTML = `
        <div class="result-block">
            <div class="result-label">TIPO DE TRABALHO</div>
            <div class="result-value">
                ${missaoAtual.tipo}
                <span class="dice">d6 = ${missaoAtual.tipoNum}</span>
            </div>
        </div>

        <div class="result-block">
            <div class="result-label">MOTIVO</div>
            <div class="result-value">
                ${missaoAtual.motivo}
                <span class="dice">d6 = ${missaoAtual.motivoNum}</span>
            </div>
        </div>

        <div class="result-block">
            <div class="result-label">CONSEQUÊNCIA</div>
            <div class="result-value">
                ${missaoAtual.consequenciaNome}
                <span class="dice">d6 = ${missaoAtual.consequenciaNum}</span>
                <div class="item-detail">
                    ${missaoAtual.consequenciaTexto}
                </div>
            </div>
        </div>
    `;
}

function textoMissao() {
    if (!missaoAtual) return "";

    return `GERADOR DE MISSÕES - AUF

TIPO: ${missaoAtual.tipo} (d6 = ${missaoAtual.tipoNum})

MOTIVO: ${missaoAtual.motivo} (d6 = ${missaoAtual.motivoNum})

CONSEQUÊNCIA: ${missaoAtual.consequenciaNome} (d6 = ${missaoAtual.consequenciaNum})
${missaoAtual.consequenciaTexto}`;
}

async function copiarMissao() {
    if (!missaoAtual) {
        alert("Gere uma missão primeiro.");
        return;
    }

    await navigator.clipboard.writeText(textoMissao());
    alert("Missão copiada.");
}

function salvarMissao() {
    if (!missaoAtual) {
        alert("Gere uma missão primeiro.");
        return;
    }

    historico.unshift({ ...missaoAtual });
    atualizarHistorico();
}

function atualizarHistorico() {
    const area = document.getElementById("historico");

    if (historico.length === 0) {
        area.innerHTML = `
            <div class="muted">
                Nenhuma missão salva.
            </div>
        `;
        return;
    }

    area.innerHTML = historico.map((m, i) => `
        <div class="history-item" onclick="carregarHistorico(${i})">
            <strong>${m.tipo}</strong>
            <small>${m.consequenciaNome}</small>
        </div>
    `).join("");
}

function carregarHistorico(i) {
    missaoAtual = historico[i];
    renderizarMissao();
}

function limparMissao() {
    missaoAtual = null;

    document.getElementById("resultadoMissao").innerHTML = `
        <div class="empty">
            [ AGUARDANDO ROLAGEM ]<br>
            Clique em "Gerar missão".
        </div>
    `;
}

const mercadorias = {
    "Comum": [
        { nome: "Filtros improvisados" },
        { nome: "Faca improvisada", detalhe: "1d3 de dano" },
        { nome: "Sucata de madeira" },
        { nome: "Bandagem simples", detalhe: "1d6 de cura" },
        { nome: "Bastão", detalhe: "1d6/1d8 de dano" },
        { nome: "Machete", detalhe: "1d6 de dano" }
    ],
    "Incomum": [
        { nome: "Bandagens", detalhe: "2d8+2 de cura" },
        { nome: "Balas curtas" },
        { nome: "Proteção leve" },
        { nome: "Comida enlatada" },
        { nome: "Água" },
        { nome: "Machado" }
    ],
    "Raro": [
        { nome: "Pistola" },
        { nome: "Balas médias" },
        { nome: "Filtro B" },
        {
            nome: "Armas brancas variadas de categoria",
            detalhe: "Armas brancas de alta categoria no livro"
        },
        { nome: "Sucatas eletrônicas" },
        {
            nome: "Componentes ritualísticos",
            ritualistico: true
        }
    ],
    "Militar": [
        { nome: "Armas de fogo de alta categoria" },
        { nome: "Cartuchos" },
        { nome: "Balas longas" },
        { nome: "Proteção pesada" },
        { nome: "Filtros militares" },
        { nome: "Ração militar" }
    ]
};

const categorias = [
    "Comum",
    "Incomum",
    "Raro",
    "Militar"
];

let estoqueAtual = [];

function gerarEstoque() {
    estoqueAtual = [];

    for (let i = 0; i < 8; i++) {
        const categoriaNum = rolarD4();
        const categoria = categorias[categoriaNum - 1];

        const itemNum = rolarD6();
        const item = mercadorias[categoria][itemNum - 1];

        let detalhe = item.detalhe || "";

        if (item.ritualistico) {
            const elementoNum = rolarD4();

            const elementos = [
                "Sangue",
                "Morte",
                "Conhecimento",
                "Energia"
            ];

            const elemento = elementos[elementoNum - 1];

            detalhe = `Elemento: ${elemento} (1d4 = ${elementoNum})`;
        }

        estoqueAtual.push({
            numero: i + 1,
            categoriaNum,
            categoria,
            itemNum,
            nome: item.nome,
            detalhe
        });
    }

    renderizarEstoque();
}

function renderizarEstoque() {
    if (estoqueAtual.length === 0) return;

    const resultado = document.getElementById("resultadoMercadorias");

    resultado.innerHTML = estoqueAtual.map(item => `
        <div class="result-block">
            <div class="stock-number">
                ESPAÇO ${String(item.numero).padStart(2, "0")}
            </div>

            <div class="category">
                ${item.categoria}
                <span class="dice">
                    1d4 = ${item.categoriaNum}
                </span>
            </div>

            <div class="item-name">
                ${item.nome}
                <span class="dice">
                    1d6 = ${item.itemNum}
                </span>
            </div>

            ${
                item.detalhe
                    ? `
                        <div class="item-detail">
                            ${item.detalhe}
                        </div>
                    `
                    : ""
            }
        </div>
    `).join("");
}

function textoEstoque() {
    if (estoqueAtual.length === 0) return "";

    let texto = "ESTOQUE DO VENDEDOR - AUF\n\n";

    estoqueAtual.forEach(item => {
        texto += `ESPAÇO ${String(item.numero).padStart(2, "0")}

Categoria:
${item.categoria}
(1d4 = ${item.categoriaNum})

Mercadoria:
${item.nome}
(1d6 = ${item.itemNum})`;

        if (item.detalhe) {
            texto += `\n${item.detalhe}`;
        }

        texto += "\n\n";
    });

    const objetos = document.getElementById("objetosParanormais").value;
    const vales = document.getElementById("valesFiltros").value;

    texto += `MERCADORIAS ESPECIAIS

Objetos Paranormais:
${objetos || "Definido pelo Mestre"}

Vales Filtros:
${vales || "Definido pelo Mestre"}`;

    return texto;
}

async function copiarEstoque() {
    if (estoqueAtual.length === 0) {
        alert("Gere o estoque primeiro.");
        return;
    }

    await navigator.clipboard.writeText(textoEstoque());
    alert("Estoque copiado.");
}

function limparEstoque() {
    estoqueAtual = [];

    document.getElementById("resultadoMercadorias").innerHTML = `
        <div class="empty">
            [ ESTOQUE VAZIO ]<br>
            Clique em "Gerar estoque".
        </div>
    `;
}

function mostrarAba(nome, botao) {
    document.querySelectorAll(".aba").forEach(aba => {
        aba.classList.remove("active");
    });

    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.remove("active");
    });

    const aba = document.getElementById(nome);

    if (!aba) {
        return;
    }

    aba.classList.add("active");

    if (botao) {
        botao.classList.add("active");
    }

    if (nome === "npcs") {
        carregarNPCs();
    }

    if (nome === "rolador") {
        setTimeout(() => {
            redimensionarRolador3D();
        }, 50);
    }
}

const formNpc = document.getElementById("form-npc");

if (formNpc) {
    formNpc.addEventListener("submit", async event => {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const faccao = document.getElementById("faccao").value;
        const informacao = document.getElementById("informacao").value;
        const idEditando = formNpc.dataset.editando;

        try {
            const url = idEditando
                ? `/api/npcs/${idEditando}`
                : "/api/npcs";

            const metodo = idEditando
                ? "PUT"
                : "POST";

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    faccao,
                    informacao
                })
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.erro || "Erro ao salvar NPC"
                );
            }

            formNpc.reset();
            delete formNpc.dataset.editando;

            formNpc.querySelector("button").textContent =
                "Adicionar NPC";

            await carregarNPCs();

            alert(
                idEditando
                    ? "NPC editado com sucesso!"
                    : `NPC "${nome}" adicionado com sucesso!`
            );

        } catch (erro) {
            console.error("Erro ao salvar NPC:", erro);
            alert("Não foi possível salvar o NPC.");
        }
    });
}

async function carregarNPCs(filtro = "") {
    const lista = document.getElementById("lista-npcs");

    if (!lista) return;

    try {
        const resposta = await fetch("/api/npcs");

        if (!resposta.ok) {
            throw new Error("Erro HTTP ao buscar NPCs.");
        }

        const npcs = await resposta.json();

        const termo = filtro.toLowerCase().trim();

        const npcsFiltrados = npcs.filter(npc =>
            (npc.nome || "").toLowerCase().includes(termo) ||
            (npc.faccao || "").toLowerCase().includes(termo)
        );

        if (npcsFiltrados.length === 0) {
            lista.innerHTML = `
                <div class="muted">
                    Nenhum NPC encontrado.
                </div>
            `;
            return;
        }

        lista.innerHTML = npcsFiltrados.map(npc => `
            <div class="npc-card">
                <div class="npc-info">
                    <h3>${npc.nome}</h3>
                    <strong>${npc.faccao || "Sem facção"}</strong>
                    <p>${npc.informacao || "Sem informações."}</p>
                </div>

                <div class="npc-actions">

                    <button onclick="editarNPC(${npc.id})">
                        Editar
                    </button>

                    <button onclick="excluirNPC(${npc.id})">
                        Excluir
                    </button>

                </div>
            </div>
        `).join("");

    } catch (erro) {
        console.error("Erro ao carregar NPCs:", erro);

        lista.innerHTML = `
            <div class="muted">
                Erro ao carregar NPCs.
            </div>
        `;
    }
}

async function excluirNPC(id) {
    const confirmar = confirm(
        "Deseja realmente excluir este NPC?"
    );

    if (!confirmar) return;

    try {
        const resposta = await fetch(
            `/api/npcs/${id}`,
            {
                method: "DELETE"
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                resultado.erro ||
                "Erro ao excluir NPC"
            );
        }

        await carregarNPCs();

    } catch (erro) {
        console.error(
            "Erro ao excluir NPC:",
            erro
        );

        alert(
            "Não foi possível excluir o NPC."
        );
    }
}

async function editarNPC(id) {
    try {
        const resposta =
            await fetch("/api/npcs");

        const npcs =
            await resposta.json();

        const npc =
            npcs.find(npc => npc.id === id);

        if (!npc) {
            alert("NPC não encontrado.");
            return;
        }

        document.getElementById("nome").value =
            npc.nome;

        document.getElementById("faccao").value =
            npc.faccao || "";

        document.getElementById("informacao").value =
            npc.informacao || "";

        document.getElementById(
            "form-npc"
        ).dataset.editando = id;

        document.getElementById(
            "form-npc"
        ).querySelector("button").textContent =
            "Salvar alterações";

    } catch (erro) {
        console.error(
            "Erro ao carregar NPC:",
            erro
        );

        alert(
            "Não foi possível carregar o NPC."
        );
    }
}

const pesquisaNPC =
    document.getElementById("pesquisa-npc");

if (pesquisaNPC) {
    pesquisaNPC.addEventListener(
        "input",
        () => {
            carregarNPCs(
                pesquisaNPC.value
            );
        }
    );
}

const dadosNPC = {
    nomes: {
        masculino: [
            "Alexei",
            "Alexander",
            "Andrei",
            "Anton",
            "Artem",
            "Boris",
            "Daniil",
            "Denis",
            "Dmitri",
            "Fyodor",
            "Igor",
            "Ilya",
            "Ivan",
            "Kirill",
            "Konstantin",
            "Leonid",
            "Lev",
            "Maksim",
            "Mikhail",
            "Nikita",
            "Nikolai",
            "Oleg",
            "Pavel",
            "Roman",
            "Ruslan",
            "Sergei",
            "Semyon",
            "Stanislav",
            "Stepan",
            "Timofey",
            "Vadim",
            "Valery",
            "Vasily",
            "Viktor",
            "Vladimir",
            "Yaroslav",
            "Yegor",
            "Yuri",
            "Arkady",
            "Grigori"
        ],

        feminino: [
            "Alina",
            "Alisa",
            "Anastasiya",
            "Anna",
            "Arina",
            "Darya",
            "Diana",
            "Ekaterina",
            "Elena",
            "Galina",
            "Irina",
            "Karina",
            "Katya",
            "Ksenia",
            "Larisa",
            "Lena",
            "Lidia",
            "Lyudmila",
            "Maria",
            "Margarita",
            "Marina",
            "Nadezhda",
            "Natalia",
            "Nina",
            "Olga",
            "Polina",
            "Sofia",
            "Svetlana",
            "Tamara",
            "Tatiana",
            "Valentina",
            "Vasilisa",
            "Vera",
            "Victoria",
            "Yana",
            "Yelena",
            "Yulia",
            "Zoya",
            "Kristina",
            "Varvara"
        ]
    },

    personalidades: [
        "reservado e observador",
        "extrovertido e falante",
        "desconfiado e paranoico",
        "calmo mesmo em situações perigosas",
        "impaciente e direto",
        "bem-humorado apesar da situação",
        "nervoso e inquieto",
        "educado, mas distante",
        "curioso e interessado em tudo",
        "cínico e difícil de impressionar",
        "otimista de maneira quase irritante",
        "pessimista e sempre esperando o pior",
        "teimoso e difícil de convencer",
        "prático e pouco sentimental",
        "gentil, mas extremamente cauteloso",
        "agressivo quando se sente ameaçado",
        "tímido e pouco acostumado a conversar",
        "carismático e persuasivo",
        "sarcástico e provocador",
        "disciplinado e metódico",
        "distraído e aparentemente desorganizado",
        "inteligente, mas pouco sociável",
        "paciente e bom ouvinte",
        "ambicioso e interessado em subir de posição",
        "leal até demais aos próprios aliados",
        "individualista e pouco confiável",
        "supersticioso e preocupado com sinais estranhos",
        "sereno, mas difícil de interpretar",
        "impulsivo e acostumado a agir primeiro",
        "sensível e facilmente afetado pelos acontecimentos",
        "orgulhoso e raramente admite estar errado",
        "calado, mas extremamente atento",
        "descontraído em situações inadequadas",
        "medroso, mas tenta esconder isso",
        "extremamente desconfiado de estranhos",
        "compassivo com pessoas vulneráveis",
        "obsessivo com organização",
        "fatalista e convencido de que tudo vai dar errado",
        "determinado e difícil de intimidar",
        "nostálgico e preso às lembranças do passado"
    ],

    comportamentos: [
        "fala baixo e evita chamar atenção",
        "faz perguntas demais",
        "observa as pessoas antes de responder",
        "tenta transformar qualquer conversa em negociação",
        "evita falar sobre o passado",
        "faz piadas em momentos inadequados",
        "fica constantemente olhando para as saídas",
        "mantém os braços cruzados durante toda a conversa",
        "não consegue ficar parado enquanto conversa",
        "fala olhando diretamente nos olhos",
        "costuma interromper os outros",
        "demora alguns segundos antes de responder",
        "mexe constantemente em algum objeto que carrega",
        "olha para o chão quando fala sobre assuntos pessoais",
        "tenta parecer mais confiante do que realmente é",
        "muda de assunto quando algo o deixa desconfortável",
        "memoriza o nome de quem acabou de conhecer",
        "fala sobre comida sempre que está nervoso",
        "mantém uma postura extremamente rígida",
        "ri quando está desconfortável",
        "fala de maneira extremamente objetiva",
        "costuma contar histórias exageradas",
        "observa as mãos das pessoas durante conversas",
        "evita ficar de costas para desconhecidos",
        "oferece ajuda mesmo quando ninguém pediu",
        "desconfia imediatamente de perguntas muito específicas",
        "faz comentários sobre o ambiente",
        "parece estar sempre com pressa",
        "fala muito quando percebe que encontrou alguém confiável",
        "fica em silêncio quando ouve falar da superfície",
        "fica mexendo nas próprias luvas",
        "confere os arredores antes de começar qualquer conversa",
        "tenta descobrir de onde a pessoa veio",
        "evita mencionar nomes de pessoas desaparecidas",
        "faz comentários secos sobre situações perigosas",
        "mantém uma das mãos próxima ao equipamento",
        "costuma olhar para o relógio",
        "fala de forma diferente dependendo da facção da pessoa",
        "faz perguntas sobre recursos antes de qualquer outra coisa",
        "fica visivelmente desconfortável quando alguém menciona o paranormal"
    ],

    aparencias: [
        "magro, com roupas remendadas e olheiras profundas",
        "alto e robusto, usando um casaco militar velho",
        "baixo, com cabelos curtos e mãos calejadas",
        "barba por fazer e rosto marcado pelo cansaço",
        "cabelos longos presos de maneira improvisada",
        "usa um sobretudo antigo cheio de remendos",
        "tem uma cicatriz atravessando uma das sobrancelhas",
        "usa óculos antigos com uma das lentes rachadas",
        "carrega uma mochila excessivamente grande",
        "tem os cabelos parcialmente grisalhos",
        "usa roupas de trabalhador adaptadas para o frio",
        "tem várias pequenas queimaduras nas mãos",
        "usa um cachecol velho mesmo dentro de locais fechados",
        "possui uma tatuagem parcialmente coberta por cicatrizes",
        "tem uma aparência surpreendentemente limpa",
        "usa luvas diferentes em cada mão",
        "tem uma jaqueta militar grande demais para o próprio corpo",
        "carrega ferramentas presas ao cinto",
        "tem o rosto constantemente coberto por poeira",
        "usa botas claramente maiores que o tamanho necessário",
        "possui uma cicatriz antiga no pescoço",
        "tem alguns dentes quebrados",
        "usa um boné antigo encontrado em algum prédio abandonado",
        "tem uma pequena marca de queimadura no rosto",
        "usa roupas cuidadosamente costuradas",
        "carrega uma máscara de proteção pendurada no pescoço",
        "tem uma postura cansada, mas movimentos rápidos",
        "usa um casaco feito de várias peças diferentes",
        "tem os olhos avermelhados pela falta de sono",
        "carrega um relógio que claramente não funciona",
        "possui marcas antigas de frio nas mãos",
        "usa uma mochila militar modificada",
        "tem o cabelo cortado de maneira irregular",
        "usa um casaco coberto por manchas de óleo",
        "tem uma cicatriz longa no antebraço",
        "carrega uma pequena bolsa de ferramentas",
        "usa roupas de diferentes uniformes costuradas juntas",
        "tem o rosto parcialmente coberto por uma máscara de pano",
        "possui várias pequenas cicatrizes nas mãos",
        "usa uma jaqueta pesada claramente muito antiga"
    ],

    detalhes: [
        "carrega uma fotografia antiga dentro da carteira",
        "guarda uma pequena coleção de peças metálicas",
        "não gosta de ficar perto de portas fechadas",
        "conhece um caminho alternativo pela região",
        "perdeu alguém importante durante uma expedição",
        "tem o hábito de contar os filtros antes de sair",
        "sempre pergunta se a pessoa veio da superfície",
        "guarda uma bala como lembrança de alguém",
        "sabe consertar pequenos aparelhos eletrônicos",
        "tem medo de ficar sozinho no escuro",
        "conhece alguém importante dentro da própria facção",
        "costuma trocar pequenos objetos por comida",
        "tem uma dívida com outro sobrevivente",
        "encontrou algo estranho durante uma patrulha",
        "guarda cartas que nunca conseguiu entregar",
        "aprendeu a sobreviver na superfície",
        "tem um mapa antigo que se recusa a mostrar",
        "procura alguém que desapareceu há meses",
        "mantém uma planta pequena escondida em algum lugar",
        "tem uma coleção de moedas antigas",
        "sabe uma história estranha sobre uma estação abandonada",
        "não sabe ler muito bem",
        "é excelente em reconhecer sons de máquinas",
        "conhece um comerciante que aparece ocasionalmente",
        "guarda comida escondida para emergências",
        "verifica duas vezes se uma porta está trancada",
        "possui um objeto que pertencia a alguém importante",
        "já encontrou um grupo de sobreviventes desconhecido",
        "sabe uma informação que provavelmente não deveria saber",
        "guarda uma chave sem saber exatamente o que ela abre",
        "conhece uma passagem esquecida entre duas regiões",
        "tem uma fotografia de uma estação antes da destruição",
        "mantém escondido um pequeno estoque de filtros",
        "já trabalhou para outra facção",
        "conhece alguém que desapareceu na superfície",
        "possui um rádio quebrado que se recusa a jogar fora",
        "tem uma história sobre uma criatura que ninguém acredita",
        "guarda um pedaço de metal como lembrança",
        "sabe preparar um tipo raro de comida com poucos recursos",
        "tem um pequeno caderno cheio de nomes"
    ],

    funcoes: [
        "comerciante",
        "soldado",
        "mecânico",
        "médico",
        "enfermeiro",
        "cozinheiro",
        "batedor",
        "vigia",
        "mensageiro",
        "carregador",
        "caçador",
        "catador de sucata",
        "técnico",
        "agricultor",
        "ferreiro",
        "guarda",
        "explorador",
        "trabalhador da manutenção",
        "responsável pelo estoque",
        "coletor de recursos",
        "operador de rádio",
        "contrabandista",
        "guia",
        "artesão",
        "responsável pela limpeza",
        "administrador",
        "motorista",
        "vigia de entrada",
        "batedor de túneis",
        "ajudante de oficina",
        "costureiro",
        "fabricante de filtros",
        "coletor de água",
        "responsável pela distribuição",
        "mensageiro entre estações",
        "responsável por animais",
        "vigia de depósitos",
        "especialista em sucata",
        "carregador de expedições",
        "trabalhador de estufas"
    ],

    habitos: [
        "conta os filtros antes de dormir",
        "guarda comida para depois mesmo quando não precisa",
        "bate três vezes em objetos antes de usá-los",
        "dorme com uma arma improvisada por perto",
        "coleciona pequenos objetos encontrados",
        "sempre oferece café ou chá",
        "nunca desperdiça água",
        "anota tudo em um pequeno caderno",
        "afina constantemente uma ferramenta que já está funcionando",
        "fala sozinho enquanto trabalha",
        "verifica o relógio mesmo sabendo que ele está parado",
        "organiza seus pertences por tamanho",
        "guarda qualquer pedaço de papel que encontra",
        "limpa as próprias botas constantemente",
        "evita sentar de costas para corredores",
        "sempre pergunta que horas são",
        "mantém uma lista de nomes escrita no braço",
        "assobia enquanto trabalha",
        "dorme pouco",
        "faz pequenos reparos mesmo quando ninguém pediu",
        "conta mentalmente enquanto caminha",
        "guarda objetos que outras pessoas considerariam lixo",
        "verifica portas e janelas várias vezes",
        "sempre carrega alguma coisa nas mãos",
        "organiza a comida por data",
        "não consegue dormir sem algum ruído de fundo",
        "costuma observar o teto enquanto pensa",
        "guarda pequenos pedaços de tecido",
        "faz anotações sobre os preços das mercadorias",
        "sempre verifica o próprio equipamento antes de sair",
        "evita usar o último item de qualquer recurso",
        "mantém as ferramentas perfeitamente alinhadas",
        "costuma limpar as mãos antes de comer",
        "guarda restos de comida para animais",
        "dorme usando o mesmo casaco",
        "faz perguntas sobre o estoque local",
        "sempre escolhe o mesmo lugar para sentar",
        "guarda objetos quebrados acreditando que ainda podem servir",
        "faz pequenas marcas nas paredes para se orientar",
        "nunca deixa uma refeição terminar sem guardar alguma sobra"
    ],

    motivacoes: [
        "quer encontrar um familiar desaparecido",
        "quer juntar recursos para deixar a estação",
        "quer descobrir o que aconteceu com sua antiga equipe",
        "quer conseguir uma posição melhor dentro da facção",
        "quer apenas sobreviver mais um dia",
        "quer encontrar um lugar seguro para morar",
        "quer pagar uma dívida",
        "quer proteger alguém próximo",
        "quer descobrir a verdade sobre um acontecimento estranho",
        "quer encontrar uma maneira de chegar à superfície",
        "quer reconstruir algo que perdeu",
        "quer juntar filtros suficientes para sua família",
        "quer provar seu valor para os outros",
        "quer abandonar a vida de sobrevivente",
        "quer encontrar uma pessoa que acredita estar viva",
        "quer descobrir novas rotas entre as estações",
        "quer acumular recursos para o inverno",
        "quer impedir que algo aconteça novamente",
        "quer ganhar dinheiro suficiente para comprar equipamento",
        "quer descobrir de onde vieram certos rumores",
        "quer encontrar um lugar onde possa viver em paz",
        "quer proteger sua estação de outra facção",
        "quer descobrir o destino de uma expedição perdida",
        "quer conseguir uma arma melhor",
        "quer reconstruir sua antiga oficina",
        "quer encontrar medicamentos para alguém próximo",
        "quer descobrir se uma antiga instalação ainda funciona",
        "quer juntar recursos para sua família",
        "quer recuperar um objeto perdido",
        "quer se tornar útil para a própria comunidade",
        "quer encontrar uma pessoa que lhe deve algo",
        "quer descobrir a origem de um estranho sinal de rádio",
        "quer fugir de alguém que está procurando por ele",
        "quer descobrir o que existe além das regiões conhecidas",
        "quer encontrar uma maneira de produzir mais filtros",
        "quer proteger uma criança da estação",
        "quer descobrir o que aconteceu antes da destruição",
        "quer encontrar um novo lugar para sua facção",
        "quer recuperar uma antiga rota comercial",
        "quer provar que uma história antiga é verdadeira"
    ],

    problemas: [
        "está devendo recursos a alguém",
        "perdeu recentemente uma pessoa próxima",
        "está escondendo um ferimento",
        "tem problemas para confiar em outras pessoas",
        "está sendo pressionado por alguém da própria facção",
        "perdeu algo importante recentemente",
        "está com poucos recursos",
        "tem medo de uma região específica",
        "sabe que alguém está procurando por ele",
        "está envolvido em uma pequena disputa",
        "tem uma dívida antiga",
        "está preocupado com alguém desaparecido",
        "não sabe se deve continuar na própria facção",
        "está escondendo uma informação",
        "foi acusado injustamente de alguma coisa",
        "está procurando trabalho",
        "está tentando proteger alguém sem que essa pessoa saiba",
        "tem medo de voltar para determinado lugar",
        "está sendo seguido por alguém",
        "não sabe em quem confiar",
        "está ficando sem filtros",
        "perdeu seu equipamento durante uma expedição",
        "tem um inimigo dentro da própria comunidade",
        "está sendo cobrado por uma dívida",
        "está escondendo que perdeu alguém durante uma missão",
        "não consegue mais acessar seu antigo local de trabalho",
        "está preocupado com rumores sobre uma criatura",
        "está sendo pressionado a aceitar um trabalho perigoso",
        "tem informações que podem colocar outras pessoas em perigo",
        "está tentando esconder que pretende abandonar a estação",
        "perdeu um documento importante",
        "tem problemas com outro membro da facção",
        "está sendo acusado de roubar recursos",
        "não sabe onde sua família está",
        "está tentando recuperar um objeto roubado",
        "tem medo de que alguém descubra seu passado",
        "está com uma lesão que dificulta seu trabalho",
        "não consegue encontrar peças para reparar seu equipamento",
        "está preso entre duas facções",
        "sabe que alguém está mentindo para ele"
    ]
};

function gerarNPCIA() {
    const resultado =
        document.getElementById("resultadoNPCIA");

    if (!resultado) return;

    const faccaoSelecionada =
        document.getElementById("npc-faccao").value;

    const generoSelecionado =
        document.getElementById("npc-genero").value;

    const sexualidadeSelecionada =
        document.getElementById("npc-sexualidade").value;

    const idadeSelecionada =
        document.getElementById("npc-idade").value;

    const personalidadeSelecionada =
        document.getElementById(
            "npc-personalidade"
        ).value.trim();

    const genero =
        generoSelecionado ||
        (
            Math.random() < 0.5
                ? "Masculino"
                : "Feminino"
        );

    const nome =
        escolher(
            genero === "Masculino"
                ? dadosNPC.nomes.masculino
                : dadosNPC.nomes.feminino
        );

    const faccao =
        faccaoSelecionada ||
        escolher([
            "Aliança",
            "Bastilha",
            "Filhos de Deus",
            "Matilha",
            "Independente"
        ]);

    const sexualidade =
        sexualidadeSelecionada ||
        escolher([
            "Heterossexual",
            "Homossexual",
            "Bissexual"
        ]);

    const idade =
        idadeSelecionada ||
        escolher([
            "18 a 25 anos",
            "26 a 35 anos",
            "36 a 50 anos",
            "51 a 65 anos",
            "66 anos ou mais"
        ]);

    const personalidade =
        personalidadeSelecionada ||
        escolher(dadosNPC.personalidades);

    const aparencia =
        escolher(dadosNPC.aparencias);

    const comportamento =
        escolher(dadosNPC.comportamentos);

    const detalhe =
        escolher(dadosNPC.detalhes);

    const funcao =
        escolher(dadosNPC.funcoes);

    const habito =
        escolher(dadosNPC.habitos);

    const motivacao =
        escolher(dadosNPC.motivacoes);

    const problema =
        escolher(dadosNPC.problemas);

    resultado.innerHTML = `
        <div class="result-block">
            <div class="result-label">NOME</div>
            <div class="result-value">${nome}</div>
        </div>

        <div class="result-block">
            <div class="result-label">IDADE</div>
            <div class="result-value">${idade}</div>
        </div>

        <div class="result-block">
            <div class="result-label">FACÇÃO</div>
            <div class="result-value">${faccao}</div>
        </div>

        <div class="result-block">
            <div class="result-label">GÊNERO</div>
            <div class="result-value">${genero}</div>
        </div>

        <div class="result-block">
            <div class="result-label">SEXUALIDADE</div>
            <div class="result-value">${sexualidade}</div>
        </div>

        <div class="result-block">
            <div class="result-label">FUNÇÃO</div>
            <div class="result-value">${funcao}</div>
        </div>

        <div class="result-block">
            <div class="result-label">PERSONALIDADE</div>
            <div class="result-value">${personalidade}</div>
        </div>

        <div class="result-block">
            <div class="result-label">APARÊNCIA</div>
            <div class="result-value">${aparencia}</div>
        </div>

        <div class="result-block">
            <div class="result-label">COMPORTAMENTO</div>
            <div class="result-value">${comportamento}</div>
        </div>

        <div class="result-block">
            <div class="result-label">HÁBITO</div>
            <div class="result-value">${habito}</div>
        </div>

        <div class="result-block">
            <div class="result-label">MOTIVAÇÃO</div>
            <div class="result-value">${motivacao}</div>
        </div>

        <div class="result-block">
            <div class="result-label">PROBLEMA</div>
            <div class="result-value">${problema}</div>
        </div>

        <div class="result-block">
            <div class="result-label">DETALHE</div>
            <div class="result-value">${detalhe}</div>
        </div>
    `;
}

let dadoSelecionado = 20;

let cenaDados = null;
let cameraDados = null;
let renderizadorDados = null;
let grupoDados = null;

let dadosVisuais = [];

let rolagemEmAndamento = false;
let inicioRolagem = 0;
let duracaoRolagem = 1200;

function criarMaterialDado() {
    return new THREE.MeshStandardMaterial({
        color: 0xff1493,
        roughness: 0.32,
        metalness: 0.4
    });
}
function criarGeometriaDado(lados) {

    switch (lados) {

        case 4:
            return new THREE.TetrahedronGeometry(
                1.35,
                0
            );

        case 6:
            return new THREE.BoxGeometry(
                1.9,
                1.9,
                1.9
            );

        case 8:
            return new THREE.OctahedronGeometry(
                1.4,
                0
            );

        case 10:
            return new THREE.BoxGeometry(
                1.9,
                1.9,
                1.9
            );

        case 12:
            return new THREE.DodecahedronGeometry(
                1.35,
                0
            );

        case 20:
            return new THREE.IcosahedronGeometry(
                1.4,
                0
            );


        default:
            return new THREE.BoxGeometry(
                1.9,
                1.9,
                1.9
            );
    }
}

function criarTextoDado(texto, tamanho = 1.5) {
    const canvas =
        document.createElement("canvas");

    canvas.width = 512;
    canvas.height = 512;

    const contexto =
        canvas.getContext("2d");

    contexto.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    contexto.fillStyle =
        "rgba(0, 0, 0, 0.85)";

    contexto.beginPath();

    contexto.arc(
        256,
        256,
        180,
        0,
        Math.PI * 2
    );

    contexto.fill();

    contexto.fillStyle =
        "#ffffff";

    contexto.font =
        "bold 190px Arial";

    contexto.textAlign =
        "center";

    contexto.textBaseline =
        "middle";

    contexto.fillText(
        texto,
        256,
        256
    );

    const textura =
        new THREE.CanvasTexture(
            canvas
        );

    textura.needsUpdate = true;

    const material =
        new THREE.SpriteMaterial({
            map: textura,
            transparent: true
        });

    const sprite =
        new THREE.Sprite(material);

    sprite.scale.set(
        tamanho,
        tamanho,
        tamanho
    );

    return sprite;
}

function criarModeloDado(lados) {
    const grupo =
        new THREE.Group();

    const geometria =
        criarGeometriaDado(lados);

    const material =
        criarMaterialDado();

    const dado =
        new THREE.Mesh(
            geometria,
            material
        );

    dado.castShadow = true;
    dado.receiveShadow = true;

    grupo.add(dado);

    const numero =
        criarTextoDado(
            lados === 100
                ? "00"
                : "?"
        );

    numero.position.set(
        0,
        0,
        1.45
    );

    grupo.add(numero);

    grupo.userData.numero =
        numero;

    grupo.userData.valor =
        null;

    grupo.userData.lados =
        lados;

    return grupo;
}

function atualizarNumeroDado(
    grupo,
    valor
) {
    if (!grupo) return;

    if (!grupo.userData.numero) {
        return;
    }

    const novoNumero =
        criarTextoDado(
            String(valor)
        );

    novoNumero.position.copy(
        grupo.userData.numero.position
    );

    grupo.remove(
        grupo.userData.numero
    );

    grupo.userData.numero.material.dispose();

    grupo.userData.numero =
        novoNumero;

    grupo.add(novoNumero);

    grupo.userData.valor =
        valor;
}

function limparGrupoDados() {
    if (!grupoDados) {
        return;
    }

    while (
        grupoDados.children.length > 0
    ) {
        const objeto =
            grupoDados.children[0];

        objeto.traverse(parte => {

            if (parte.geometry) {
                parte.geometry.dispose();
            }

            if (parte.material) {

                if (parte.material.map) {
                    parte.material.map.dispose();
                }

                parte.material.dispose();
            }

        });

        grupoDados.remove(objeto);
    }

    dadosVisuais = [];
}

function criarDadoVisual(lados) {
    limparGrupoDados();

    const dado =
        criarModeloDado(lados);

    grupoDados.add(dado);

    dadosVisuais = [dado];

    return dado;
}

function criarD100Visual() {
    limparGrupoDados();

    const centena =
        criarModeloDado(10);

    const unidade =
        criarModeloDado(10);

    centena.position.x = -1.05;
    unidade.position.x = 1.05;

    grupoDados.add(centena);
    grupoDados.add(unidade);

    dadosVisuais = [
        centena,
        unidade
    ];

    return {
        centena,
        unidade
    };
}

function iniciarRolador3D() {
    const container =
        document.getElementById(
            "dice-stage"
        );

    if (!container) {
        return;
    }

    if (
        renderizadorDados
    ) {
        return;
    }

    cenaDados =
        new THREE.Scene();

    cameraDados =
        new THREE.PerspectiveCamera(
            45,
            1,
            0.1,
            100
        );

    cameraDados.position.set(
        0,
        1.5,
        6
    );

    cameraDados.lookAt(
        0,
        0,
        0
    );

    renderizadorDados =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

    renderizadorDados.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );

    renderizadorDados.setClearColor(
        0x000000,
        0
    );

    container.innerHTML = "";

    container.appendChild(
        renderizadorDados.domElement
    );

    const luzAmbiente =
        new THREE.HemisphereLight(
            0xffffff,
            0x17101f,
            2.5
        );

    cenaDados.add(
        luzAmbiente
    );

    const luzPrincipal =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );

    luzPrincipal.position.set(
        4,
        6,
        5
    );

    cenaDados.add(
        luzPrincipal
    );

    const luzFrontal =
        new THREE.PointLight(
            0xffffff,
            2,
            15
        );

    luzFrontal.position.set(
        -3,
        2,
        4
    );

    cenaDados.add(
        luzFrontal
    );

    grupoDados =
        new THREE.Group();

    cenaDados.add(
        grupoDados
    );

    selecionarDadoVisual(
        dadoSelecionado
    );

    redimensionarRolador3D();

    window.addEventListener(
        "resize",
        redimensionarRolador3D
    );

    animarRolador3D();
}

function selecionarDadoVisual(lados) {

    if (!grupoDados) {
        return;
    }

    if (lados === 100) {

        criarD100Visual();

    } else {

        criarDadoVisual(lados);

    }
}

function selecionarDado(lados) {
    dadoSelecionado =
        lados;

    const indicador =
        document.getElementById(
            "dado-selecionado"
        );

    if (indicador) {
        indicador.textContent =
            `d${lados}`;
    }

    document
        .querySelectorAll(
            ".dice-selector button"
        )
        .forEach(botao => {

            botao.classList.remove(
                "selected"
            );

            if (
                botao.textContent
                    .trim()
                    .toLowerCase()
                    === `d${lados}`
            ) {
                botao.classList.add(
                    "selected"
                );
            }

        });

    selecionarDadoVisual(
        lados
    );
}

function iniciarAnimacaoDados() {
    if (
        dadosVisuais.length === 0
    ) {
        return;
    }

    rolagemEmAndamento =
        true;

    inicioRolagem =
        performance.now();

    dadosVisuais.forEach(
        dado => {

            dado.rotation.x =
                Math.random() *
                Math.PI * 2;

            dado.rotation.y =
                Math.random() *
                Math.PI * 2;

            dado.rotation.z =
                Math.random() *
                Math.PI * 2;

        }
    );
}

function animarRolador3D(
    tempo = 0
) {
    requestAnimationFrame(
        animarRolador3D
    );

    if (
        rolagemEmAndamento &&
        dadosVisuais.length > 0
    ) {
        const decorrido =
            tempo -
            inicioRolagem;

        const progresso =
            Math.min(
                decorrido /
                duracaoRolagem,
                1
            );

        const velocidade =
            0.32 *
            (1 - progresso);

        dadosVisuais.forEach(
            dado => {

                dado.rotation.x +=
                    velocidade;

                dado.rotation.y +=
                    velocidade * 1.35;

                dado.rotation.z +=
                    velocidade * 0.75;

            }
        );

        if (
            progresso >= 1
        ) {
            rolagemEmAndamento =
                false;
        }
    }

    if (
        renderizadorDados &&
        cenaDados &&
        cameraDados
    ) {
        renderizadorDados.render(
            cenaDados,
            cameraDados
        );
    }
}

function redimensionarRolador3D() {
    const container =
        document.getElementById(
            "dice-stage"
        );

    if (
        !container ||
        !renderizadorDados ||
        !cameraDados
    ) {
        return;
    }

    const largura =
        container.clientWidth;

    const altura =
        container.clientHeight;

    if (
        largura <= 0 ||
        altura <= 0
    ) {
        return;
    }

    cameraDados.aspect =
        largura / altura;

    cameraDados.updateProjectionMatrix();

    renderizadorDados.setSize(
        largura,
        altura,
        false
    );
}

function rolarD100() {
    const dezenas =
        Math.floor(
            Math.random() * 10
        );

    const unidades =
        Math.floor(
            Math.random() * 10
        );

    if (
        dezenas === 0 &&
        unidades === 0
    ) {
        return {
            dezenas: 0,
            unidades: 0,
            total: 100
        };
    }

    return {
        dezenas,
        unidades,
        total:
            dezenas * 10 +
            unidades
    };
}

function rolarDados() {
    const quantidadeInput =
        document.getElementById(
            "quantidade-dados"
        );

    const modificadorInput =
        document.getElementById(
            "modificador-dados"
        );

    const resultado =
        document.getElementById(
            "resultadoRolagem"
        );

    if (
        !quantidadeInput ||
        !modificadorInput ||
        !resultado
    ) {
        return;
    }

    let quantidade =
        parseInt(
            quantidadeInput.value
        );

    let modificador =
        parseInt(
            modificadorInput.value
        );

    if (
        isNaN(quantidade)
    ) {
        quantidade = 1;
    }

    if (
        isNaN(modificador)
    ) {
        modificador = 0;
    }

    quantidade =
        Math.max(
            1,
            Math.min(
                100,
                quantidade
            )
        );

    resultado.innerHTML = `
        <div class="empty">
            [ ROLANDO... ]
        </div>
    `;

    iniciarAnimacaoDados();

    if (
        dadoSelecionado === 100
    ) {
        rolarD100Resultado(
            quantidade,
            modificador,
            resultado
        );

        return;
    }

    const resultados = [];

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {
        resultados.push(
            rolarDado(
                dadoSelecionado
            )
        );
    }

    const soma =
        resultados.reduce(
            (total, valor) =>
                total + valor,
            0
        );

    const total =
        soma + modificador;

    setTimeout(() => {

        if (
            quantidade === 1 &&
            dadosVisuais[0]
        ) {
            atualizarNumeroDado(
                dadosVisuais[0],
                resultados[0]
            );
        }

        resultado.innerHTML = `
            <div class="result-block">

                <div class="result-label">
                    ROLAGEM
                </div>

                <div class="result-value">
                    ${quantidade}d${dadoSelecionado}
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    RESULTADOS
                </div>

                <div class="result-value">
                    ${resultados.join(" + ")}
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    MODIFICADOR
                </div>

                <div class="result-value">
                    ${modificador >= 0 ? "+" : ""}${modificador}
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    TOTAL
                </div>

                <div class="result-value">
                    ${total}
                </div>

            </div>
        `;

    }, duracaoRolagem);
}

function rolarD100Resultado(
    quantidade,
    modificador,
    resultado
) {
    const resultados = [];

    for (
        let i = 0;
        i < quantidade;
        i++
    ) {
        resultados.push(
            rolarD100()
        );
    }

    const soma =
        resultados.reduce(
            (total, valor) =>
                total + valor.total,
            0
        );

    const total =
        soma + modificador;

    setTimeout(() => {

        if (
            quantidade === 1 &&
            dadosVisuais.length === 2
        ) {
            atualizarNumeroDado(
                dadosVisuais[0],
                resultados[0].dezenas
            );

            atualizarNumeroDado(
                dadosVisuais[1],
                resultados[0].unidades
            );
        }

        const resultadosTexto =
            resultados
                .map(
                    resultado =>
                        resultado.total
                )
                .join(" + ");

        resultado.innerHTML = `
            <div class="result-block">

                <div class="result-label">
                    ROLAGEM
                </div>

                <div class="result-value">
                    ${quantidade}d100
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    RESULTADOS
                </div>

                <div class="result-value">
                    ${resultadosTexto}
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    MODIFICADOR
                </div>

                <div class="result-value">
                    ${modificador >= 0 ? "+" : ""}${modificador}
                </div>

            </div>

            <div class="result-block">

                <div class="result-label">
                    TOTAL
                </div>

                <div class="result-value">
                    ${total}
                </div>

            </div>
        `;

    }, duracaoRolagem);
}

function limparRolagem() {
    const resultado =
        document.getElementById(
            "resultadoRolagem"
        );

    if (resultado) {
        resultado.innerHTML = `
            <div class="empty">
                [ AGUARDANDO ROLAGEM ]
                <br>
                Escolha um dado e role.
            </div>
        `;
    }

    rolagemEmAndamento =
        false;

    if (
        dadoSelecionado === 100
    ) {
        criarD100Visual();
    } else {
        criarDadoVisual(
            dadoSelecionado
        );
    }
}

window.rolarDados =
    rolarDados;

window.selecionarDado =
    selecionarDado;

window.limparRolagem =
    limparRolagem;

window.gerarMissao =
    gerarMissao;

window.copiarMissao =
    copiarMissao;

window.salvarMissao =
    salvarMissao;

window.limparMissao =
    limparMissao;

window.carregarHistorico =
    carregarHistorico;

window.gerarEstoque =
    gerarEstoque;

window.copiarEstoque =
    copiarEstoque;

window.limparEstoque =
    limparEstoque;

window.mostrarAba =
    mostrarAba;

window.editarNPC =
    editarNPC;

window.excluirNPC =
    excluirNPC;

window.carregarNPCs =
    carregarNPCs;

window.gerarNPCIA =
    gerarNPCIA;

window.addEventListener(
    "DOMContentLoaded",
    () => {
        iniciarRolador3D();
        carregarNPCs();
    }
);

// ======================================================
// ANOTAÇÕES DO MESTRE
// ======================================================

let anotacaoEditando = null;
let anotacoesCache = [];


// ======================================================
// CARREGAR ANOTAÇÕES
// ======================================================

async function carregarAnotacoes() {

    const lista =
        document.getElementById("lista-anotacoes");

    if (!lista) {
        return;
    }

    try {

        const resposta =
            await fetch("/api/anotacoes");

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar anotações"
            );
        }

        const anotacoes =
            await resposta.json();

        anotacoesCache = anotacoes;

        renderizarAnotacoes(anotacoes);

    } catch (erro) {

        console.error(
            "Erro ao carregar anotações:",
            erro
        );

        lista.innerHTML = `
            <div class="muted">
                Erro ao carregar anotações.
            </div>
        `;
    }
}


// ======================================================
// RENDERIZAR ANOTAÇÕES
// ======================================================

function renderizarAnotacoes(anotacoes) {

    const lista =
        document.getElementById("lista-anotacoes");

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (anotacoes.length === 0) {

        lista.innerHTML = `
            <div class="muted">
                Nenhuma anotação salva.
            </div>
        `;

        return;
    }

    anotacoes.forEach(anotacao => {

        const item =
            document.createElement("div");

        item.className =
            "anotacao-item";


        const titulo =
            document.createElement("div");

        titulo.className =
            "anotacao-titulo";

        titulo.textContent =
            anotacao.titulo;


        const conteudo =
            document.createElement("div");

        conteudo.className =
            "anotacao-conteudo";

        conteudo.textContent =
            anotacao.conteudo;


        const acoes =
            document.createElement("div");

        acoes.className =
            "anotacao-acoes";


        const botaoEditar =
            document.createElement("button");

        botaoEditar.textContent =
            "Editar";

        botaoEditar.addEventListener(
            "click",
            () => {
                editarAnotacao(anotacao.id);
            }
        );


        const botaoExcluir =
            document.createElement("button");

        botaoExcluir.textContent =
            "Excluir";

        botaoExcluir.addEventListener(
            "click",
            () => {
                excluirAnotacao(anotacao.id);
            }
        );


        acoes.appendChild(
            botaoEditar
        );

        acoes.appendChild(
            botaoExcluir
        );


        item.appendChild(
            titulo
        );

        item.appendChild(
            conteudo
        );

        item.appendChild(
            acoes
        );


        lista.appendChild(
            item
        );
    });
}


// ======================================================
// SALVAR / EDITAR ANOTAÇÃO
// ======================================================

async function salvarAnotacao(evento) {

    evento.preventDefault();


    const campoTitulo =
        document.getElementById(
            "titulo-anotacao"
        );

    const campoConteudo =
        document.getElementById(
            "conteudo-anotacao"
        );


    if (!campoTitulo || !campoConteudo) {
        return;
    }


    const titulo =
        campoTitulo.value.trim();

    const conteudo =
        campoConteudo.value.trim();


    if (!titulo || !conteudo) {

        alert(
            "Preencha o título e o conteúdo."
        );

        return;
    }


    try {

        const editando =
            anotacaoEditando !== null;


        const url =
            editando
                ? `/api/anotacoes/${anotacaoEditando}`
                : "/api/anotacoes";


        const metodo =
            editando
                ? "PUT"
                : "POST";


        const resposta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        titulo: titulo,
                        conteudo: conteudo
                    })
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.json()
                    .catch(() => null);

            throw new Error(
                erro?.erro ||
                "Erro ao salvar anotação"
            );
        }


        campoTitulo.value = "";
        campoConteudo.value = "";

        anotacaoEditando = null;


        atualizarEstadoFormulario();


        await carregarAnotacoes();


    } catch (erro) {

        console.error(
            "Erro ao salvar anotação:",
            erro
        );

        alert(
            "Não foi possível salvar a anotação."
        );
    }
}


// ======================================================
// EDITAR ANOTAÇÃO
// ======================================================

function editarAnotacao(id) {

    const anotacao =
        anotacoesCache.find(
            item => Number(item.id) === Number(id)
        );


    if (!anotacao) {
        return;
    }


    const campoTitulo =
        document.getElementById(
            "titulo-anotacao"
        );

    const campoConteudo =
        document.getElementById(
            "conteudo-anotacao"
        );


    if (!campoTitulo || !campoConteudo) {
        return;
    }


    campoTitulo.value =
        anotacao.titulo;

    campoConteudo.value =
        anotacao.conteudo;


    anotacaoEditando =
        Number(anotacao.id);


    atualizarEstadoFormulario();


    campoTitulo.focus();
}


// ======================================================
// EXCLUIR ANOTAÇÃO
// ======================================================

async function excluirAnotacao(id) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta anotação?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `/api/anotacoes/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.json()
                    .catch(() => null);

            throw new Error(
                erro?.erro ||
                "Erro ao excluir anotação"
            );
        }


        if (
            anotacaoEditando !== null &&
            Number(anotacaoEditando) === Number(id)
        ) {

            cancelarEdicao();
        }


        await carregarAnotacoes();


    } catch (erro) {

        console.error(
            "Erro ao excluir anotação:",
            erro
        );

        alert(
            "Não foi possível excluir a anotação."
        );
    }
}


// ======================================================
// CANCELAR EDIÇÃO
// ======================================================

function cancelarEdicao() {

    const formulario =
        document.getElementById(
            "form-anotacao"
        );

    if (formulario) {
        formulario.reset();
    }


    anotacaoEditando = null;

    atualizarEstadoFormulario();
}


// ======================================================
// ATUALIZAR BOTÃO DO FORMULÁRIO
// ======================================================

function atualizarEstadoFormulario() {

    const botao =
        document.querySelector(
            "#form-anotacao button[type='submit']"
        );


    if (!botao) {
        return;
    }


    if (anotacaoEditando !== null) {

        botao.textContent =
            "Salvar alterações";


        let botaoCancelar =
            document.getElementById(
                "cancelar-edicao-anotacao"
            );


        if (!botaoCancelar) {

            botaoCancelar =
                document.createElement(
                    "button"
                );

            botaoCancelar.type =
                "button";

            botaoCancelar.id =
                "cancelar-edicao-anotacao";

            botaoCancelar.textContent =
                "Cancelar edição";


            botaoCancelar.addEventListener(
                "click",
                cancelarEdicao
            );


            botao.parentElement.appendChild(
                botaoCancelar
            );
        }


    } else {

        botao.textContent =
            "Salvar anotação";


        const botaoCancelar =
            document.getElementById(
                "cancelar-edicao-anotacao"
            );


        if (botaoCancelar) {

            botaoCancelar.remove();
        }
    }
}


// ======================================================
// PESQUISA DE ANOTAÇÕES
// ======================================================

function pesquisarAnotacoes() {

    const campo =
        document.getElementById(
            "pesquisa-anotacao"
        );


    if (!campo) {
        return;
    }


    const pesquisa =
        campo.value
            .trim()
            .toLowerCase();


    if (!pesquisa) {

        renderizarAnotacoes(
            anotacoesCache
        );

        return;
    }


    const resultados =
        anotacoesCache.filter(
            anotacao => {

                const titulo =
                    String(
                        anotacao.titulo || ""
                    ).toLowerCase();


                const conteudo =
                    String(
                        anotacao.conteudo || ""
                    ).toLowerCase();


                return (
                    titulo.includes(pesquisa) ||
                    conteudo.includes(pesquisa)
                );
            }
        );


    renderizarAnotacoes(
        resultados
    );
}


// ======================================================
// INICIALIZAÇÃO DAS ANOTAÇÕES
// ======================================================

function inicializarAnotacoes() {

    const formulario =
        document.getElementById(
            "form-anotacao"
        );


    if (formulario) {

        formulario.addEventListener(
            "submit",
            salvarAnotacao
        );
    }


    const pesquisa =
        document.getElementById(
            "pesquisa-anotacao"
        );


    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            pesquisarAnotacoes
        );
    }


    carregarAnotacoes();
}


// ======================================================
// INICIAR
// ======================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarAnotacoes
    );

} else {

    inicializarAnotacoes();
}

// ======================================================
// CRIATURAS
// ======================================================

let criaturaEditando = null;

let criaturasCache = [];


// ======================================================
// CARREGAR CRIATURAS
// ======================================================

async function carregarCriaturas() {

    const lista =
        document.getElementById(
            "lista-criaturas"
        );

    if (!lista) {
        return;
    }

    try {

        const resposta =
            await fetch(
                "/api/criaturas"
            );

        if (!resposta.ok) {
            throw new Error(
                "Erro ao buscar criaturas"
            );
        }

        const criaturas =
            await resposta.json();

        criaturasCache =
            criaturas;

        renderizarCriaturas(
            criaturas
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar criaturas:",
            erro
        );

        lista.innerHTML = `
            <div class="muted">
                Erro ao carregar criaturas.
            </div>
        `;
    }
}


// ======================================================
// RENDERIZAR CRIATURAS
// ======================================================

function renderizarCriaturas(
    criaturas
) {

    const lista =
        document.getElementById(
            "lista-criaturas"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = "";


    if (criaturas.length === 0) {

        lista.innerHTML = `
            <div class="muted">
                Nenhuma criatura cadastrada.
            </div>
        `;

        return;
    }


    criaturas.forEach(criatura => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "criatura-item";


        // ------------------------------------------
        // CABEÇALHO
        // ------------------------------------------

        const cabecalho =
            document.createElement(
                "div"
            );

        cabecalho.className =
            "criatura-cabecalho";


        const nome =
            document.createElement(
                "div"
            );

        nome.className =
            "criatura-nome";

        nome.textContent =
            criatura.nome;


        const vd =
            document.createElement(
                "div"
            );

        vd.className =
            "criatura-vd";

        vd.textContent =
            `VD ${criatura.vd}`;


        cabecalho.appendChild(
            nome
        );

        cabecalho.appendChild(
            vd
        );


        // ------------------------------------------
        // ELEMENTOS
        // ------------------------------------------

        const elementos =
            document.createElement(
                "div"
            );

        elementos.className =
            "criatura-elementos";


        const elemento =
            document.createElement(
                "span"
            );

        elemento.className =
            "criatura-elemento";

        elemento.textContent =
            criatura.elemento;


        elementos.appendChild(
            elemento
        );


        if (
            criatura.elemento_secundario
        ) {

            const secundario =
                document.createElement(
                    "span"
                );

            secundario.className =
                "criatura-elemento secundario";

            secundario.textContent =
                criatura.elemento_secundario;


            elementos.appendChild(
                secundario
            );
        }


        // ------------------------------------------
        // STATUS
        // ------------------------------------------

        const status =
            document.createElement(
                "div"
            );

        status.className =
            "criatura-status";


        function criarStatus(
            label,
            valor
        ) {

            const box =
                document.createElement(
                    "div"
                );

            box.className =
                "criatura-status-box";


            const nomeStatus =
                document.createElement(
                    "span"
                );

            nomeStatus.className =
                "criatura-status-label";

            nomeStatus.textContent =
                label;


            const valorStatus =
                document.createElement(
                    "span"
                );

            valorStatus.className =
                "criatura-status-valor";

            valorStatus.textContent =
                valor;


            box.appendChild(
                nomeStatus
            );

            box.appendChild(
                valorStatus
            );


            return box;
        }


        status.appendChild(
            criarStatus(
                "Vida",
                criatura.vida
            )
        );

        status.appendChild(
            criarStatus(
                "Defesa",
                criatura.defesa
            )
        );

        status.appendChild(
            criarStatus(
                "Deslocamento",
                criatura.deslocamento
            )
        );


        // ------------------------------------------
        // AÇÕES
        // ------------------------------------------

        const acoes =
            document.createElement(
                "div"
            );

        acoes.className =
            "criatura-acoes";


        const botaoEditar =
            document.createElement(
                "button"
            );

        botaoEditar.textContent =
            "Editar";

        botaoEditar.addEventListener(
            "click",
            () => {

                editarCriatura(
                    criatura.id
                );

            }
        );


        const botaoExcluir =
            document.createElement(
                "button"
            );

        botaoExcluir.textContent =
            "Excluir";

        botaoExcluir.addEventListener(
            "click",
            () => {

                excluirCriatura(
                    criatura.id
                );

            }
        );


        acoes.appendChild(
            botaoEditar
        );

        acoes.appendChild(
            botaoExcluir
        );


        // ------------------------------------------
        // MONTAR CARTÃO
        // ------------------------------------------

        item.appendChild(
            cabecalho
        );

        item.appendChild(
            elementos
        );

        item.appendChild(
            status
        );

        item.appendChild(
            acoes
        );


        lista.appendChild(
            item
        );
    });
}


// ======================================================
// SALVAR / EDITAR CRIATURA
// ======================================================

async function salvarCriatura(
    evento
) {

    evento.preventDefault();


    const nome =
        document.getElementById(
            "nome-criatura"
        ).value.trim();


    const elemento =
        document.getElementById(
            "elemento-criatura"
        ).value.trim();


    const elementoSecundario =
        document.getElementById(
            "elemento-secundario-criatura"
        ).value.trim();


    const vd =
        document.getElementById(
            "vd-criatura"
        ).value;


    const vida =
        document.getElementById(
            "vida-criatura"
        ).value;


    const defesa =
        document.getElementById(
            "defesa-criatura"
        ).value;


    const deslocamento =
        document.getElementById(
            "deslocamento-criatura"
        ).value.trim();


    if (
        !nome ||
        !elemento ||
        !vd ||
        !vida ||
        !defesa ||
        !deslocamento
    ) {

        alert(
            "Preencha todos os campos obrigatórios."
        );

        return;
    }


    const editando =
        criaturaEditando !== null;


    const url =
        editando
            ? `/api/criaturas/${criaturaEditando}`
            : "/api/criaturas";


    const metodo =
        editando
            ? "PUT"
            : "POST";


    try {

        const resposta =
            await fetch(
                url,
                {
                    method: metodo,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        nome:
                            nome,

                        elemento:
                            elemento,

                        elemento_secundario:
                            elementoSecundario,

                        vd:
                            Number(vd),

                        vida:
                            Number(vida),

                        defesa:
                            Number(defesa),

                        deslocamento:
                            deslocamento
                    })
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.json()
                    .catch(
                        () => null
                    );

            throw new Error(
                erro?.erro ||
                "Erro ao salvar criatura"
            );
        }


        limparFormularioCriatura();

        await carregarCriaturas();


    } catch (erro) {

        console.error(
            "Erro ao salvar criatura:",
            erro
        );

        alert(
            "Não foi possível salvar a criatura."
        );
    }
}


// ======================================================
// EDITAR CRIATURA
// ======================================================

function editarCriatura(
    id
) {

    const criatura =
        criaturasCache.find(
            item =>
                Number(item.id) ===
                Number(id)
        );


    if (!criatura) {
        return;
    }


    document.getElementById(
        "nome-criatura"
    ).value =
        criatura.nome;


    document.getElementById(
        "elemento-criatura"
    ).value =
        criatura.elemento;


    document.getElementById(
        "elemento-secundario-criatura"
    ).value =
        criatura.elemento_secundario || "";


    document.getElementById(
        "vd-criatura"
    ).value =
        criatura.vd;


    document.getElementById(
        "vida-criatura"
    ).value =
        criatura.vida;


    document.getElementById(
        "defesa-criatura"
    ).value =
        criatura.defesa;


    document.getElementById(
        "deslocamento-criatura"
    ).value =
        criatura.deslocamento;


    criaturaEditando =
        Number(criatura.id);


    const formulario =
        document.getElementById(
            "form-criatura"
        );


    if (formulario) {

        formulario.classList.add(
            "editando"
        );
    }


    const botao =
        formulario?.querySelector(
            "button[type='submit']"
        );


    if (botao) {

        botao.textContent =
            "Salvar alterações";
    }


    document.getElementById(
        "nome-criatura"
    ).focus();
}


// ======================================================
// LIMPAR FORMULÁRIO
// ======================================================

function limparFormularioCriatura() {

    const formulario =
        document.getElementById(
            "form-criatura"
        );


    if (formulario) {

        formulario.reset();

        formulario.classList.remove(
            "editando"
        );
    }


    criaturaEditando =
        null;


    const botao =
        formulario?.querySelector(
            "button[type='submit']"
        );


    if (botao) {

        botao.textContent =
            "Salvar criatura";
    }
}


// ======================================================
// EXCLUIR CRIATURA
// ======================================================

async function excluirCriatura(
    id
) {

    const confirmar =
        confirm(
            "Deseja realmente excluir esta criatura?"
        );


    if (!confirmar) {
        return;
    }


    try {

        const resposta =
            await fetch(
                `/api/criaturas/${id}`,
                {
                    method:
                        "DELETE"
                }
            );


        if (!resposta.ok) {

            const erro =
                await resposta.json()
                    .catch(
                        () => null
                    );

            throw new Error(
                erro?.erro ||
                "Erro ao excluir criatura"
            );
        }


        if (
            criaturaEditando !== null &&
            Number(criaturaEditando) ===
                Number(id)
        ) {

            limparFormularioCriatura();
        }


        await carregarCriaturas();


    } catch (erro) {

        console.error(
            "Erro ao excluir criatura:",
            erro
        );

        alert(
            "Não foi possível excluir a criatura."
        );
    }
}


// ======================================================
// PESQUISAR CRIATURAS
// ======================================================

function pesquisarCriaturas() {

    const campo =
        document.getElementById(
            "pesquisa-criatura"
        );


    if (!campo) {
        return;
    }


    const pesquisa =
        campo.value
            .trim()
            .toLowerCase();


    if (!pesquisa) {

        renderizarCriaturas(
            criaturasCache
        );

        return;
    }


    const resultados =
        criaturasCache.filter(
            criatura => {

                const nome =
                    String(
                        criatura.nome || ""
                    ).toLowerCase();


                const elemento =
                    String(
                        criatura.elemento || ""
                    ).toLowerCase();


                const secundario =
                    String(
                        criatura.elemento_secundario || ""
                    ).toLowerCase();


                return (
                    nome.includes(pesquisa) ||
                    elemento.includes(pesquisa) ||
                    secundario.includes(pesquisa)
                );
            }
        );


    renderizarCriaturas(
        resultados
    );
}


// ======================================================
// INICIALIZAR CRIATURAS
// ======================================================

function inicializarCriaturas() {

    const formulario =
        document.getElementById(
            "form-criatura"
        );


    if (formulario) {

        formulario.addEventListener(
            "submit",
            salvarCriatura
        );
    }


    const pesquisa =
        document.getElementById(
            "pesquisa-criatura"
        );


    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            pesquisarCriaturas
        );
    }


    carregarCriaturas();
}


// ======================================================
// INICIAR
// ======================================================

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializarCriaturas
    );

} else {

    inicializarCriaturas();
}