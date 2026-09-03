import http from "http";
import fs from "fs";
import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "stonecrazzy77",
    database: "AUF_prot"
});

db.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
        return;
    }

    console.log("MySQL conectado!");
});

const servidor = http.createServer((req, res) => {

    // ==========================================
    // INDEX
    // ==========================================

    if (req.method === "GET" && req.url === "/") {

        const arquivo =
            fs.readFileSync("./index.html");

        res.writeHead(200, {
            "Content-Type":
                "text/html; charset=utf-8"
        });

        res.end(arquivo);

        return;
    }


    // ==========================================
    // CSS
    // ==========================================

    if (req.method === "GET" && req.url === "/style.css") {

        const arquivo =
            fs.readFileSync("./style.css");

        res.writeHead(200, {
            "Content-Type": "text/css"
        });

        res.end(arquivo);

        return;
    }


    // ==========================================
    // JAVASCRIPT
    // ==========================================

    if (req.method === "GET" && req.url === "/script.js") {

        const arquivo =
            fs.readFileSync("./script.js");

        res.writeHead(200, {
            "Content-Type":
                "application/javascript"
        });

        res.end(arquivo);

        return;
    }


    // ==========================================
    // NPCs - BUSCAR
    // ==========================================

    if (
        req.method === "GET" &&
        req.url === "/api/npcs"
    ) {

        db.query(
            "SELECT * FROM npcs",
            (erro, resultados) => {

                if (erro) {

                    console.error(erro);

                    res.writeHead(500, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Erro ao buscar NPCs"
                    }));

                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "application/json"
                });

                res.end(
                    JSON.stringify(resultados)
                );
            }
        );

        return;
    }


    // ==========================================
    // NPCs - EXCLUIR
    // ==========================================

    if (
        req.method === "DELETE" &&
        req.url.startsWith("/api/npcs/")
    ) {

        const id =
            req.url.split("/")[3];

        db.query(
            "DELETE FROM npcs WHERE id = ?",
            [id],
            (erro, resultado) => {

                if (erro) {

                    console.error(erro);

                    res.writeHead(500, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Erro ao excluir NPC"
                    }));

                    return;
                }

                if (
                    resultado.affectedRows === 0
                ) {

                    res.writeHead(404, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "NPC não encontrado"
                    }));

                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    mensagem:
                        "NPC excluído com sucesso"
                }));
            }
        );

        return;
    }


    // ==========================================
    // NPCs - EDITAR
    // ==========================================

    if (
        req.method === "PUT" &&
        req.url.startsWith("/api/npcs/")
    ) {

        const id =
            req.url.split("/")[3];

        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {

                const dados =
                    JSON.parse(corpo);

                const sql = `
                    UPDATE npcs
                    SET nome = ?,
                        faccao = ?,
                        informacao = ?
                    WHERE id = ?
                `;

                db.query(
                    sql,
                    [
                        dados.nome,
                        dados.faccao,
                        dados.informacao,
                        id
                    ],
                    (erro, resultado) => {

                        if (erro) {

                            console.error(erro);

                            res.writeHead(500, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "Erro ao editar NPC"
                            }));

                            return;
                        }

                        if (
                            resultado.affectedRows === 0
                        ) {

                            res.writeHead(404, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "NPC não encontrado"
                            }));

                            return;
                        }

                        res.writeHead(200, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            mensagem:
                                "NPC editado com sucesso"
                        }));
                    }
                );

            } catch (erro) {

                console.error(erro);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Dados inválidos"
                }));
            }
        });

        return;
    }


    // ==========================================
    // NPCs - CRIAR
    // ==========================================

    if (
        req.method === "POST" &&
        req.url === "/api/npcs"
    ) {

        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {

                const dados =
                    JSON.parse(corpo);

                const sql = `
                    INSERT INTO npcs
                    (nome, faccao, informacao)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    sql,
                    [
                        dados.nome,
                        dados.faccao,
                        dados.informacao
                    ],
                    (erro, resultado) => {

                        if (erro) {

                            console.error(erro);

                            res.writeHead(500, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "Erro ao criar NPC"
                            }));

                            return;
                        }

                        res.writeHead(201, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            id:
                                resultado.insertId,
                            nome:
                                dados.nome,
                            faccao:
                                dados.faccao,
                            informacao:
                                dados.informacao
                        }));
                    }
                );

            } catch (erro) {

                console.error(erro);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Dados inválidos"
                }));
            }
        });

        return;
    }


    // ==========================================
    // ANOTAÇÕES - BUSCAR
    // ==========================================

    if (
        req.method === "GET" &&
        req.url === "/api/anotacoes"
    ) {

        db.query(
            `
            SELECT *
            FROM anotacoes
            ORDER BY atualizado_em DESC
            `,
            (erro, resultados) => {

                if (erro) {

                    console.error(
                        "Erro ao buscar anotações:",
                        erro
                    );

                    res.writeHead(500, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Erro ao buscar anotações"
                    }));

                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "application/json"
                });

                res.end(
                    JSON.stringify(resultados)
                );
            }
        );

        return;
    }


    // ==========================================
    // ANOTAÇÕES - CRIAR
    // ==========================================

    if (
        req.method === "POST" &&
        req.url === "/api/anotacoes"
    ) {

        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {

                const dados =
                    JSON.parse(corpo);

                if (
                    !dados.titulo ||
                    !dados.conteudo
                ) {

                    res.writeHead(400, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Título e conteúdo são obrigatórios"
                    }));

                    return;
                }

                const sql = `
                    INSERT INTO anotacoes
                    (titulo, conteudo)
                    VALUES (?, ?)
                `;

                db.query(
                    sql,
                    [
                        dados.titulo,
                        dados.conteudo
                    ],
                    (erro, resultado) => {

                        if (erro) {

                            console.error(
                                "Erro ao criar anotação:",
                                erro
                            );

                            res.writeHead(500, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "Erro ao criar anotação"
                            }));

                            return;
                        }

                        res.writeHead(201, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            id:
                                resultado.insertId,
                            titulo:
                                dados.titulo,
                            conteudo:
                                dados.conteudo
                        }));
                    }
                );

            } catch (erro) {

                console.error(erro);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "JSON inválido"
                }));
            }
        });

        return;
    }


    // ==========================================
    // ANOTAÇÕES - EDITAR
    // ==========================================

    if (
        req.method === "PUT" &&
        req.url.startsWith("/api/anotacoes/")
    ) {

        const id =
            req.url.split("/")[3];

        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {

                const dados =
                    JSON.parse(corpo);

                const sql = `
                    UPDATE anotacoes
                    SET titulo = ?,
                        conteudo = ?
                    WHERE id = ?
                `;

                db.query(
                    sql,
                    [
                        dados.titulo,
                        dados.conteudo,
                        id
                    ],
                    (erro, resultado) => {

                        if (erro) {

                            console.error(
                                "Erro ao editar anotação:",
                                erro
                            );

                            res.writeHead(500, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "Erro ao editar anotação"
                            }));

                            return;
                        }

                        if (
                            resultado.affectedRows === 0
                        ) {

                            res.writeHead(404, {
                                "Content-Type":
                                    "application/json"
                            });

                            res.end(JSON.stringify({
                                erro:
                                    "Anotação não encontrada"
                            }));

                            return;
                        }

                        res.writeHead(200, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            mensagem:
                                "Anotação editada com sucesso"
                        }));
                    }
                );

            } catch (erro) {

                console.error(erro);

                res.writeHead(400, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "JSON inválido"
                }));
            }
        });

        return;
    }


    // ==========================================
    // ANOTAÇÕES - EXCLUIR
    // ==========================================

    if (
        req.method === "DELETE" &&
        req.url.startsWith("/api/anotacoes/")
    ) {

        const id =
            req.url.split("/")[3];

        db.query(
            "DELETE FROM anotacoes WHERE id = ?",
            [id],
            (erro, resultado) => {

                if (erro) {

                    console.error(
                        "Erro ao excluir anotação:",
                        erro
                    );

                    res.writeHead(500, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Erro ao excluir anotação"
                    }));

                    return;
                }

                if (
                    resultado.affectedRows === 0
                ) {

                    res.writeHead(404, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        erro:
                            "Anotação não encontrada"
                    }));

                    return;
                }

                res.writeHead(200, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    mensagem:
                        "Anotação excluída com sucesso"
                }));
            }
        );

        return;
    }

    // ==========================================
// CRIATURAS - BUSCAR
// ==========================================

if (
    req.method === "GET" &&
    req.url === "/api/criaturas"
) {

    db.query(
        "SELECT * FROM criaturas",
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "Erro ao buscar criaturas:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao buscar criaturas"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json"
            });

            res.end(
                JSON.stringify(resultados)
            );
        }
    );

    return;
}


// ==========================================
// CRIATURAS - CRIAR
// ==========================================

if (
    req.method === "POST" &&
    req.url === "/api/criaturas"
) {

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const sql = `
                INSERT INTO criaturas
                (
                    nome,
                    elemento,
                    elemento_secundario,
                    vd,
                    vida,
                    defesa,
                    deslocamento
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    dados.nome,
                    dados.elemento,
                    dados.elemento_secundario,
                    dados.vd,
                    dados.vida,
                    dados.defesa,
                    dados.deslocamento
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao criar criatura:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao criar criatura"
                        }));

                        return;
                    }

                    res.writeHead(201, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        id:
                            resultado.insertId,
                        nome:
                            dados.nome,
                        elemento:
                            dados.elemento,
                        elemento_secundario:
                            dados.elemento_secundario,
                        vd:
                            dados.vd,
                        vida:
                            dados.vida,
                        defesa:
                            dados.defesa,
                        deslocamento:
                            dados.deslocamento
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos"
            }));
        }
    });

    return;
}


// ==========================================
// CRIATURAS - EDITAR
// ==========================================

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/criaturas/")
) {

    const id =
        req.url.split("/")[3];

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const sql = `
                UPDATE criaturas
                SET
                    nome = ?,
                    elemento = ?,
                    elemento_secundario = ?,
                    vd = ?,
                    vida = ?,
                    defesa = ?,
                    deslocamento = ?
                WHERE id = ?
            `;

            db.query(
                sql,
                [
                    dados.nome,
                    dados.elemento,
                    dados.elemento_secundario,
                    dados.vd,
                    dados.vida,
                    dados.defesa,
                    dados.deslocamento,
                    id
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao editar criatura:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao editar criatura"
                        }));

                        return;
                    }

                    if (
                        resultado.affectedRows === 0
                    ) {

                        res.writeHead(404, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Criatura não encontrada"
                        }));

                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        mensagem:
                            "Criatura editada com sucesso"
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos"
            }));
        }
    });

    return;
}


// ==========================================
// CRIATURAS - EXCLUIR
// ==========================================

if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/criaturas/")
) {

    const id =
        req.url.split("/")[3];

    db.query(
        "DELETE FROM criaturas WHERE id = ?",
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "Erro ao excluir criatura:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao excluir criatura"
                }));

                return;
            }

            if (
                resultado.affectedRows === 0
            ) {

                res.writeHead(404, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Criatura não encontrada"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Criatura excluída com sucesso"
            }));
        }
    );

    return;
}

// ==========================================
// ITENS - BUSCAR
// ==========================================

if (
    req.method === "GET" &&
    req.url === "/api/itens"
) {

    db.query(
        "SELECT * FROM itens",
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "Erro ao buscar itens:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao buscar itens"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json"
            });

            res.end(
                JSON.stringify(resultados)
            );
        }
    );

    return;
}


// ==========================================
// ITENS - CRIAR
// ==========================================

if (
    req.method === "POST" &&
    req.url === "/api/itens"
) {

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const sql = `
                INSERT INTO itens
                (
                    nome,
                    tipo,
                    categoria,
                    descricao,
                    efeito
                )
                VALUES (?, ?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    dados.nome,
                    dados.tipo,
                    dados.categoria,
                    dados.descricao,
                    dados.efeito
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao criar item:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao criar item"
                        }));

                        return;
                    }

                    res.writeHead(201, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        id:
                            resultado.insertId,

                        nome:
                            dados.nome,

                        tipo:
                            dados.tipo,

                        categoria:
                            dados.categoria,

                        descricao:
                            dados.descricao,

                        efeito:
                            dados.efeito
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos"
            }));
        }
    });

    return;
}


// ==========================================
// ITENS - EDITAR
// ==========================================

if (
    req.method === "PUT" &&
    req.url.startsWith("/api/itens/")
) {

    const id =
        req.url.split("/")[3];

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const sql = `
                UPDATE itens
                SET
                    nome = ?,
                    tipo = ?,
                    categoria = ?,
                    descricao = ?,
                    efeito = ?
                WHERE id = ?
            `;

            db.query(
                sql,
                [
                    dados.nome,
                    dados.tipo,
                    dados.categoria,
                    dados.descricao,
                    dados.efeito,
                    id
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao editar item:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao editar item"
                        }));

                        return;
                    }

                    if (
                        resultado.affectedRows === 0
                    ) {

                        res.writeHead(404, {
                            "Content-Type":
                                "application/json"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Item não encontrado"
                        }));

                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json"
                    });

                    res.end(JSON.stringify({
                        mensagem:
                            "Item editado com sucesso"
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos"
            }));
        }
    });

    return;
}


// ==========================================
// ITENS - EXCLUIR
// ==========================================

if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/itens/")
) {

    const id =
        req.url.split("/")[3];

    db.query(
        "DELETE FROM itens WHERE id = ?",
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "Erro ao excluir item:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao excluir item"
                }));

                return;
            }

            if (
                resultado.affectedRows === 0
            ) {

                res.writeHead(404, {
                    "Content-Type":
                        "application/json"
                });

                res.end(JSON.stringify({
                    erro:
                        "Item não encontrado"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Item excluído com sucesso"
            }));
        }
    );

    return;
}
// ===============================
// API - ORDEM DE TURNOS
// ===============================

// Listar ordem de turnos
if (req.method === "GET" && req.url === "/api/ordem-turnos") {
    db.query(
        "SELECT * FROM ordem_turnos ORDER BY teste DESC",
        (erro, resultados) => {
            if (erro) {
                res.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.end(JSON.stringify({
                    erro: "Erro ao buscar ordem de turnos."
                }));
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify(resultados));
        }
    );

    return;
}


// Adicionar participante
if (req.method === "POST" && req.url === "/api/ordem-turnos") {
    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {
        try {
            const dados = JSON.parse(corpo);

            const nome = dados.nome;
            const teste = Number(dados.teste);

            if (!nome || Number.isNaN(teste)) {
                res.writeHead(400, {
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.end(JSON.stringify({
                    erro: "Nome e teste são obrigatórios."
                }));
                return;
            }

            db.query(
                "INSERT INTO ordem_turnos (nome, teste) VALUES (?, ?)",
                [nome, teste],
                (erro, resultado) => {
                    if (erro) {
                        res.writeHead(500, {
                            "Content-Type": "application/json; charset=utf-8"
                        });
                        res.end(JSON.stringify({
                            erro: "Erro ao adicionar participante."
                        }));
                        return;
                    }

                    res.writeHead(201, {
                        "Content-Type": "application/json; charset=utf-8"
                    });
                    res.end(JSON.stringify({
                        id: resultado.insertId,
                        nome,
                        teste
                    }));
                }
            );

        } catch (erro) {
            res.writeHead(400, {
                "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify({
                erro: "Dados inválidos."
            }));
        }
    });

    return;
}


// Editar participante
if (req.method === "PUT" && req.url.startsWith("/api/ordem-turnos/")) {
    const id = req.url.split("/").pop();

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {
        try {
            const dados = JSON.parse(corpo);

            const nome = dados.nome;
            const teste = Number(dados.teste);

            if (!nome || Number.isNaN(teste)) {
                res.writeHead(400, {
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.end(JSON.stringify({
                    erro: "Nome e teste são obrigatórios."
                }));
                return;
            }

            db.query(
                "UPDATE ordem_turnos SET nome = ?, teste = ? WHERE id = ?",
                [nome, teste, id],
                erro => {
                    if (erro) {
                        res.writeHead(500, {
                            "Content-Type": "application/json; charset=utf-8"
                        });
                        res.end(JSON.stringify({
                            erro: "Erro ao editar participante."
                        }));
                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type": "application/json; charset=utf-8"
                    });
                    res.end(JSON.stringify({
                        mensagem: "Participante atualizado."
                    }));
                }
            );

        } catch (erro) {
            res.writeHead(400, {
                "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify({
                erro: "Dados inválidos."
            }));
        }
    });

    return;
}


// Excluir participante
if (req.method === "DELETE" && req.url.startsWith("/api/ordem-turnos/")) {
    const id = req.url.split("/").pop();

    db.query(
        "DELETE FROM ordem_turnos WHERE id = ?",
        [id],
        erro => {
            if (erro) {
                res.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.end(JSON.stringify({
                    erro: "Erro ao excluir participante."
                }));
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify({
                mensagem: "Participante excluído."
            }));
        }
    );

    return;
}



if (req.method === "DELETE" && req.url === "/api/ordem-turnos") {
    db.query(
        "DELETE FROM ordem_turnos",
        erro => {
            if (erro) {
                res.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8"
                });
                res.end(JSON.stringify({
                    erro: "Erro ao limpar ordem de turnos."
                }));
                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/json; charset=utf-8"
            });
            res.end(JSON.stringify({
                mensagem: "Ordem de turnos limpa."
            }));
        }
    );

    return;
}

// Servir wallpaper
if (req.method === "GET" && req.url === "/wallpaperauf.jpg") {
    fs.readFile("./wallpaperauf.jpg", (erro, arquivo) => {
        if (erro) {
            res.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            res.end("Wallpaper não encontrado.");
            return;
        }

        res.writeHead(200, {
            "Content-Type": "image/jpeg"
        });

        res.end(arquivo);
    });

    return;
}

// ===============================
// API - COMBATE DE CRIATURAS
// ===============================

// Listar criaturas em combate
if (
    req.method === "GET" &&
    req.url === "/api/combate-criaturas"
) {

    db.query(
        "SELECT * FROM combate_criaturas ORDER BY id ASC",
        (erro, resultados) => {

            if (erro) {

                console.error(
                    "Erro ao buscar criaturas em combate:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao buscar criaturas em combate."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(
                JSON.stringify(resultados)
            );
        }
    );

    return;
}


// Criar criatura em combate
if (
    req.method === "POST" &&
    req.url === "/api/combate-criaturas"
) {

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const criaturaId =
                Number(dados.criatura_id);

            const nome =
                String(
                    dados.nome || ""
                ).trim();

            const vidaMaxima =
                Number(dados.vida_maxima);

            if (
                Number.isNaN(criaturaId) ||
                !nome ||
                Number.isNaN(vidaMaxima)
            ) {

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "criatura_id, nome e vida_maxima são obrigatórios."
                }));

                return;
            }

            db.query(
                `
                INSERT INTO combate_criaturas
                (
                    criatura_id,
                    nome,
                    vida_atual,
                    vida_maxima
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    criaturaId,
                    nome,
                    vidaMaxima,
                    vidaMaxima
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao criar criatura em combate:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json; charset=utf-8"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao criar criatura em combate."
                        }));

                        return;
                    }

                    res.writeHead(201, {
                        "Content-Type":
                            "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        id:
                            resultado.insertId,

                        criatura_id:
                            criaturaId,

                        nome:
                            nome,

                        vida_atual:
                            vidaMaxima,

                        vida_maxima:
                            vidaMaxima
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos."
            }));
        }
    });

    return;
}


// Editar criatura em combate
if (
    req.method === "PUT" &&
    req.url.startsWith("/api/combate-criaturas/")
) {

    const id =
        req.url.split("/").pop();

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const vidaAtual =
                Number(dados.vida_atual);

            const nome =
                dados.nome !== undefined
                    ? String(dados.nome).trim()
                    : null;

            if (Number.isNaN(vidaAtual)) {

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "vida_atual inválida."
                }));

                return;
            }

            const sql =
                nome !== null
                    ? `
                        UPDATE combate_criaturas
                        SET nome = ?, vida_atual = ?
                        WHERE id = ?
                    `
                    : `
                        UPDATE combate_criaturas
                        SET vida_atual = ?
                        WHERE id = ?
                    `;

            const valores =
                nome !== null
                    ? [nome, vidaAtual, id]
                    : [vidaAtual, id];

            db.query(
                sql,
                valores,
                (erro, resultado) => {

                    if (erro) {

                        console.error(
                            "Erro ao atualizar criatura em combate:",
                            erro
                        );

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json; charset=utf-8"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao atualizar criatura em combate."
                        }));

                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        mensagem:
                            "Criatura em combate atualizada."
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos."
            }));
        }
    });

    return;
}


// Excluir criatura em combate
if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/combate-criaturas/")
) {

    const id =
        req.url.split("/").pop();

    db.query(
        "DELETE FROM combate_criaturas WHERE id = ?",
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(
                    "Erro ao excluir criatura em combate:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao excluir criatura em combate."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Criatura em combate excluída."
            }));
        }
    );

    return;
}


// Limpar criaturas em combate
if (
    req.method === "DELETE" &&
    req.url === "/api/combate-criaturas"
) {

    db.query(
        "DELETE FROM combate_criaturas",
        erro => {

            if (erro) {

                console.error(
                    "Erro ao limpar criaturas em combate:",
                    erro
                );

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao limpar criaturas em combate."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Criaturas em combate limpas."
            }));
        }
    );

    return;
}


// ===============================
// API - ORDEM DE TURNOS
// ===============================

// Listar ordem
if (
    req.method === "GET" &&
    req.url === "/api/ordem-turnos"
) {

    db.query(
        "SELECT * FROM ordem_turnos ORDER BY teste DESC",
        (erro, resultados) => {

            if (erro) {

                console.error(erro);

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao buscar ordem de turnos."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(
                JSON.stringify(resultados)
            );
        }
    );

    return;
}


// Adicionar participante ou criatura
if (
    req.method === "POST" &&
    req.url === "/api/ordem-turnos"
) {

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const nome =
                String(
                    dados.nome || ""
                ).trim();

            const teste =
                Number(dados.teste);

            const tipo =
                dados.tipo ||
                "participante";

            const combateCriaturaId =
                dados.combate_criatura_id
                    ? Number(
                        dados.combate_criatura_id
                    )
                    : null;

            if (
                !nome ||
                Number.isNaN(teste)
            ) {

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Nome e teste são obrigatórios."
                }));

                return;
            }

            db.query(
                `
                INSERT INTO ordem_turnos
                (
                    nome,
                    teste,
                    tipo,
                    combate_criatura_id
                )
                VALUES (?, ?, ?, ?)
                `,
                [
                    nome,
                    teste,
                    tipo,
                    combateCriaturaId
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(erro);

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json; charset=utf-8"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao adicionar à ordem de turnos."
                        }));

                        return;
                    }

                    res.writeHead(201, {
                        "Content-Type":
                            "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        id:
                            resultado.insertId,

                        nome:
                            nome,

                        teste:
                            teste,

                        tipo:
                            tipo,

                        combate_criatura_id:
                            combateCriaturaId
                    }));
                }
            );

        } catch (erro) {

            console.error(erro);

            res.writeHead(400, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos."
            }));
        }
    });

    return;
}


// Editar participante
if (
    req.method === "PUT" &&
    req.url.startsWith("/api/ordem-turnos/")
) {

    const id =
        req.url.split("/").pop();

    let corpo = "";

    req.on("data", parte => {
        corpo += parte;
    });

    req.on("end", () => {

        try {

            const dados =
                JSON.parse(corpo);

            const nome =
                String(
                    dados.nome || ""
                ).trim();

            const teste =
                Number(dados.teste);

            if (
                !nome ||
                Number.isNaN(teste)
            ) {

                res.writeHead(400, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Nome e teste são obrigatórios."
                }));

                return;
            }

            db.query(
                `
                UPDATE ordem_turnos
                SET nome = ?, teste = ?
                WHERE id = ?
                `,
                [
                    nome,
                    teste,
                    id
                ],
                (erro, resultado) => {

                    if (erro) {

                        console.error(erro);

                        res.writeHead(500, {
                            "Content-Type":
                                "application/json; charset=utf-8"
                        });

                        res.end(JSON.stringify({
                            erro:
                                "Erro ao editar participante."
                        }));

                        return;
                    }

                    res.writeHead(200, {
                        "Content-Type":
                            "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        mensagem:
                            "Participante atualizado."
                    }));
                }
            );

        } catch (erro) {

            res.writeHead(400, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                erro:
                    "Dados inválidos."
            }));
        }
    });

    return;
}


// Excluir participante
if (
    req.method === "DELETE" &&
    req.url.startsWith("/api/ordem-turnos/")
) {

    const id =
        req.url.split("/").pop();

    db.query(
        "DELETE FROM ordem_turnos WHERE id = ?",
        [id],
        (erro, resultado) => {

            if (erro) {

                console.error(erro);

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao excluir participante."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Participante excluído."
            }));
        }
    );

    return;
}


// Limpar ordem
if (
    req.method === "DELETE" &&
    req.url === "/api/ordem-turnos"
) {

    db.query(
        "DELETE FROM ordem_turnos",
        erro => {

            if (erro) {

                console.error(erro);

                res.writeHead(500, {
                    "Content-Type":
                        "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    erro:
                        "Erro ao limpar ordem de turnos."
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "application/json; charset=utf-8"
            });

            res.end(JSON.stringify({
                mensagem:
                    "Ordem de turnos limpa."
            }));
        }
    );

    return;
}

    res.writeHead(404, {
        "Content-Type":
            "text/plain; charset=utf-8"
    });

    res.end("Rota não encontrada.");
});


servidor.listen(3000, () => {

    console.log(
        "Servidor AUF rodando em http://localhost:3000"
    );

});