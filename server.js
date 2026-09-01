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
    // ROTA NÃO ENCONTRADA
    // ==========================================

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