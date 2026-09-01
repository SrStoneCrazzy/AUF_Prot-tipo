import mysql from "mysql2/promise";

const conexao = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "stonecrazzy77",
    database: "AUF_prot"
});

console.log("MySQL conectado!");

export default conexao;