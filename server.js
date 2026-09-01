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

    if (req.method === "GET" && req.url === "/") {
        const arquivo = fs.readFileSync("./index.html");

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(arquivo);
        return;
    }

    if (req.method === "GET" && req.url === "/style.css") {
        const arquivo = fs.readFileSync("./style.css");

        res.writeHead(200, {
            "Content-Type": "text/css"
        });

        res.end(arquivo);
        return;
    }

    if (req.method === "GET" && req.url === "/script.js") {
        const arquivo = fs.readFileSync("./script.js");

        res.writeHead(200, {
            "Content-Type": "application/javascript"
        });

        res.end(arquivo);
        return;
    }

    if (req.method === "GET" && req.url === "/api/npcs") {
        db.query("SELECT * FROM npcs", (erro, resultados) => {

            if (erro) {
                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    erro: "Erro ao buscar NPCs"
                }));

                return;
            }

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(resultados));
        });

        return;
    }

    if (req.method === "DELETE" && req.url.startsWith("/api/npcs/")) {

        const id = req.url.split("/")[3];

        db.query(
            "DELETE FROM npcs WHERE id = ?",
            [id],
            (erro, resultado) => {

                if (erro) {
                    console.error(erro);

                    res.writeHead(500, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        erro: "Erro ao excluir NPC"
                    }));

                    return;
                }

                if (resultado.affectedRows === 0) {
                    res.writeHead(404, {
                        "Content-Type": "application/json"
                    });

                    res.end(JSON.stringify({
                        erro: "NPC não encontrado"
                    }));

                    return;
                }

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    mensagem: "NPC excluído com sucesso"
                }));
            }
        );

        return;
    }

    if (req.method === "PUT" && req.url.startsWith("/api/npcs/")) {

        const id = req.url.split("/")[3];
        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {
                const dados = JSON.parse(corpo);

                const sql = `
                    UPDATE npcs
                    SET nome = ?, faccao = ?, informacao = ?
                    WHERE id = ?
                `;

                db.query(
                    sql,
                    [dados.nome, dados.faccao, dados.informacao, id],
                    (erro, resultado) => {

                        if (erro) {
                            console.error(erro);

                            res.writeHead(500, {
                                "Content-Type": "application/json"
                            });

                            res.end(JSON.stringify({
                                erro: "Erro ao editar NPC"
                            }));

                            return;
                        }

                        if (resultado.affectedRows === 0) {
                            res.writeHead(404, {
                                "Content-Type": "application/json"
                            });

                            res.end(JSON.stringify({
                                erro: "NPC não encontrado"
                            }));

                            return;
                        }

                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });

                        res.end(JSON.stringify({
                            mensagem: "NPC editado com sucesso"
                        }));
                    }
                );

            } catch (erro) {
                console.error(erro);

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    erro: "Dados inválidos"
                }));
            }
        });

        return;
    }

    if (req.method === "POST" && req.url === "/api/npcs") {

        let corpo = "";

        req.on("data", parte => {
            corpo += parte;
        });

        req.on("end", () => {

            try {
                const dados = JSON.parse(corpo);

                const sql = `
                    INSERT INTO npcs (nome, faccao, informacao)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    sql,
                    [dados.nome, dados.faccao, dados.informacao],
                    (erro, resultado) => {

                        if (erro) {
                            console.error(erro);

                            res.writeHead(500, {
                                "Content-Type": "application/json"
                            });

                            res.end(JSON.stringify({
                                erro: "Erro ao criar NPC"
                            }));

                            return;
                        }

                        res.writeHead(201, {
                            "Content-Type": "application/json"
                        });

                        res.end(JSON.stringify({
                            id: resultado.insertId,
                            nome: dados.nome,
                            faccao: dados.faccao,
                            informacao: dados.informacao
                        }));
                    }
                );

            } catch (erro) {
                console.error(erro);

                res.writeHead(400, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    erro: "Dados inválidos"
                }));
            }
        });

        return;
    }

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Rota não encontrada.");
});

servidor.listen(3000, () => {
    console.log("Servidor AUF rodando em http://localhost:3000");
});