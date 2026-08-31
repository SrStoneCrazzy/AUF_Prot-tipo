// ============================================================
// ATÉ O ÚLTIMO FILTRO
// GERADOR DE MISSÕES E MERCADORIAS
// ============================================================


// ============================================================
// FUNÇÕES DE DADOS
// ============================================================

function rolarD6() {

    return Math.floor(
        Math.random() * 6
    ) + 1;

}


function rolarD4() {

    return Math.floor(
        Math.random() * 4
    ) + 1;

}


// ============================================================
// GERADOR DE MISSÕES
// ============================================================

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


// ============================================================
// GERAR MISSÃO
// ============================================================

function gerarMissao() {

    const tipoNum = rolarD6();


    const nomesTipos =
        Object.keys(tipos);


    const tipo =
        nomesTipos[tipoNum - 1];


    const motivoNum =
        rolarD6();


    const motivo =
        tipos[tipo][motivoNum - 1];


    const consequenciaNum =
        rolarD6();


    const consequencia =
        consequencias[
            consequenciaNum - 1
        ];


    missaoAtual = {

        tipoNum,

        tipo,

        motivoNum,

        motivo,

        consequenciaNum,

        consequenciaNome:
            consequencia[0],

        consequenciaTexto:
            consequencia[1]

    };


    renderizarMissao();

}


function renderizarMissao() {

    if (!missaoAtual) return;


    document.getElementById(
        "resultadoMissao"
    ).innerHTML = `

        <div class="result-block">

            <div class="result-label">
                TIPO DE TRABALHO
            </div>

            <div class="result-value">

                ${missaoAtual.tipo}

                <span class="dice">
                    d6 = ${missaoAtual.tipoNum}
                </span>

            </div>

        </div>


        <div class="result-block">

            <div class="result-label">
                MOTIVO
            </div>

            <div class="result-value">

                ${missaoAtual.motivo}

                <span class="dice">
                    d6 = ${missaoAtual.motivoNum}
                </span>

            </div>

        </div>


        <div class="result-block">

            <div class="result-label">
                CONSEQUÊNCIA
            </div>

            <div class="result-value">

                ${missaoAtual.consequenciaNome}

                <span class="dice">
                    d6 = ${missaoAtual.consequenciaNum}
                </span>

                <div class="item-detail">

                    ${missaoAtual.consequenciaTexto}

                </div>

            </div>

        </div>

    `;

}


function textoMissao() {

    if (!missaoAtual)
        return "";


    return `GERADOR DE MISSÕES - AUF

TIPO: ${missaoAtual.tipo} (d6 = ${missaoAtual.tipoNum})

MOTIVO: ${missaoAtual.motivo} (d6 = ${missaoAtual.motivoNum})

CONSEQUÊNCIA: ${missaoAtual.consequenciaNome} (d6 = ${missaoAtual.consequenciaNum})
${missaoAtual.consequenciaTexto}`;

}


async function copiarMissao() {

    if (!missaoAtual) {

        alert(
            "Gere uma missão primeiro."
        );

        return;

    }


    await navigator.clipboard.writeText(
        textoMissao()
    );


    alert(
        "Missão copiada."
    );

}


function salvarMissao() {

    if (!missaoAtual) {

        alert(
            "Gere uma missão primeiro."
        );

        return;

    }


    historico.unshift({
        ...missaoAtual
    });


    atualizarHistorico();

}


function atualizarHistorico() {

    const area =
        document.getElementById(
            "historico"
        );


    if (historico.length === 0) {

        area.innerHTML = `

            <div class="muted">
                Nenhuma missão salva.
            </div>

        `;

        return;

    }


    area.innerHTML =
        historico.map(
            (m, i) => `

                <div
                    class="history-item"
                    onclick="carregarHistorico(${i})">

                    <strong>
                        ${m.tipo}
                    </strong>

                    <small>
                        ${m.consequenciaNome}
                    </small>

                </div>

            `
        ).join("");

}


function carregarHistorico(i) {

    missaoAtual =
        historico[i];


    renderizarMissao();

}


function limparMissao() {

    missaoAtual = null;


    document.getElementById(
        "resultadoMissao"
    ).innerHTML = `

        <div class="empty">

            [ AGUARDANDO ROLAGEM ]<br>

            Clique em "Gerar missão".

        </div>

    `;

}


// ============================================================
// GERADOR DE MERCADORIAS
// ============================================================

const mercadorias = {


    "Comum": [

        {
            nome:
                "Filtros improvisados"
        },


        {
            nome:
                "Faca improvisada",

            detalhe:
                "1d3 de dano"
        },


        {
            nome:
                "Sucata de madeira"
        },


        {
            nome:
                "Bandagem simples",

            detalhe:
                "1d6 de cura"
        },


        {
            nome:
                "Bastão",

            detalhe:
                "1d6/1d8 de dano"
        },


        {
            nome:
                "Machete",

            detalhe:
                "1d6 de dano"
        }

    ],


    "Incomum": [

        {
            nome:
                "Bandagens",

            detalhe:
                "2d8+2 de cura"
        },


        {
            nome:
                "Balas curtas"
        },


        {
            nome:
                "Proteção leve"
        },


        {
            nome:
                "Comida enlatada"
        },


        {
            nome:
                "Água"
        },


        {
            nome:
                "Machado"
        }

    ],


    "Raro": [

        {
            nome:
                "Pistola"
        },


        {
            nome:
                "Balas médias"
        },


        {
            nome:
                "Filtro B"
        },


        {
            nome:
                "Armas brancas variadas de categoria",

            detalhe:
                "Armas brancas de alta categoria no livro"
        },


        {
            nome:
                "Sucatas eletrônicas"
        },


        {
            nome:
                "Componentes ritualísticos",

            ritualistico:
                true
        }

    ],


    "Militar": [

        {
            nome:
                "Armas de fogo de alta categoria"
        },


        {
            nome:
                "Cartuchos"
        },


        {
            nome:
                "Balas longas"
        },


        {
            nome:
                "Proteção pesada"
        },


        {
            nome:
                "Filtros militares"
        },


        {
            nome:
                "Ração militar"
        }

    ]

};


const categorias = [

    "Comum",

    "Incomum",

    "Raro",

    "Militar"

];


let estoqueAtual = [];


// ============================================================
// GERAR ESTOQUE
// ============================================================

function gerarEstoque() {

    estoqueAtual = [];


    /*
        8d4

        Cada d4 determina a categoria
        de um dos 8 espaços do estoque.

        1 = Comum
        2 = Incomum
        3 = Raro
        4 = Militar
    */


    for (
        let i = 0;
        i < 8;
        i++
    ) {


        const categoriaNum =
            rolarD4();


        const categoria =
            categorias[
                categoriaNum - 1
            ];


        /*
            1d6

            Determina qual item
            daquela categoria aparece.
        */


        const itemNum =
            rolarD6();


        const item =
            mercadorias[
                categoria
            ][
                itemNum - 1
            ];


        let detalhe =
            item.detalhe || "";


        /*
            COMPONENTES RITUALÍSTICOS

            1 = Sangue
            2 = Morte
            3 = Conhecimento
            4 = Energia
        */


        if (item.ritualistico) {

            const elementoNum =
                rolarD4();


            const elementos = [

                "Sangue",

                "Morte",

                "Conhecimento",

                "Energia"

            ];


            const elemento =
                elementos[
                    elementoNum - 1
                ];


            detalhe =
                `Elemento: ${elemento} (1d4 = ${elementoNum})`;

        }


        estoqueAtual.push({

            numero:
                i + 1,

            categoriaNum,

            categoria,

            itemNum,

            nome:
                item.nome,

            detalhe

        });

    }


    renderizarEstoque();

}


// ============================================================
// MOSTRAR ESTOQUE
// ============================================================

function renderizarEstoque() {

    if (
        estoqueAtual.length === 0
    )
        return;


    const resultado =
        document.getElementById(
            "resultadoMercadorias"
        );


    resultado.innerHTML =
        estoqueAtual.map(
            item => `

                <div class="result-block">

                    <div class="stock-number">

                        ESPAÇO
                        ${String(
                            item.numero
                        ).padStart(2, "0")}

                    </div>


                    <div class="category">

                        ${item.categoria}

                        <span class="dice">

                            1d4 =
                            ${item.categoriaNum}

                        </span>

                    </div>


                    <div class="item-name">

                        ${item.nome}

                        <span class="dice">

                            1d6 =
                            ${item.itemNum}

                        </span>

                    </div>


                    ${
                        item.detalhe
                        ?
                        `
                            <div class="item-detail">

                                ${item.detalhe}

                            </div>
                        `
                        :
                        ""
                    }

                </div>

            `
        ).join("");

}


// ============================================================
// COPIAR ESTOQUE
// ============================================================

function textoEstoque() {

    if (
        estoqueAtual.length === 0
    )
        return "";


    let texto =
        "ESTOQUE DO VENDEDOR - AUF\n\n";


    estoqueAtual.forEach(
        item => {

            texto +=
`ESPAÇO ${String(
    item.numero
).padStart(2, "0")}

Categoria:
${item.categoria}
(1d4 = ${item.categoriaNum})

Mercadoria:
${item.nome}
(1d6 = ${item.itemNum})`;


            if (item.detalhe) {

                texto +=
                    `\n${item.detalhe}`;

            }


            texto +=
                "\n\n";

        }
    );


    const objetos =
        document.getElementById(
            "objetosParanormais"
        ).value;


    const vales =
        document.getElementById(
            "valesFiltros"
        ).value;


    texto +=
`MERCADORIAS ESPECIAIS

Objetos Paranormais:
${objetos || "Definido pelo Mestre"}

Vales Filtros:
${vales || "Definido pelo Mestre"}`;


    return texto;

}


async function copiarEstoque() {

    if (
        estoqueAtual.length === 0
    ) {

        alert(
            "Gere o estoque primeiro."
        );

        return;

    }


    await navigator.clipboard.writeText(
        textoEstoque()
    );


    alert(
        "Estoque copiado."
    );

}


function limparEstoque() {

    estoqueAtual = [];


    document.getElementById(
        "resultadoMercadorias"
    ).innerHTML = `

        <div class="empty">

            [ ESTOQUE VAZIO ]<br>

            Clique em "Gerar estoque".

        </div>

    `;

}


// ============================================================
// ABAS
// ============================================================

function mostrarAba(
    nome,
    botao
) {


    document
        .querySelectorAll(".aba")
        .forEach(
            aba => {

                aba.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(".tab")
        .forEach(
            tab => {

                tab.classList.remove(
                    "active"
                );

            }
        );


    document
        .getElementById(nome)
        .classList.add(
            "active"
        );


    botao.classList.add(
        "active"
    );

}