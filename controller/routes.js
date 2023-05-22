const express = require("express");
const { default: ShortUniqueId } = require("short-unique-id");
const generateNewBingo = require("../model/newBingo");
const ConnectDb = require("../model/connectDb");
const router = express.Router();
const { Server } = require("socket.io");

const io = new Server(3001, {
    cors:{
        origin: "*"
    }
});

router
    .post("/newBingo", (req, res) => {
        //Crear nuevo bingo
        const db = new ConnectDb();
        db.connect();
        const uid = new ShortUniqueId({ length: 10 });
        let newUid = uid();
        const newBingo = generateNewBingo(newUid);
        db.insertOne("sesiones", newBingo);
        return res.send(newBingo);
    })
    .get("/tabla/:code", (req, res) => {
        //Obtener tabla de bingo
        const db = new ConnectDb();
        db.connect();
        const code = req.params.code;
        db.findOne("sesiones", { code: code}).then((result) => {
            if(result == null){
                return res.send({
                    numerosTabla: []
                });
            }
            let tabla = {};
            let disponible = true;
            let contador = 0;
            while(disponible){
                if(result.tablas[contador].isAvailable){
                    tabla = result.tablas[contador];
                    disponible = false;
                    result.tablas[contador].isAvailable = false;
                    break;
                }
                contador++;
            }
            db.updateOne("sesiones", { code: code }, { $set: { tablas: result.tablas } });
            return res.send(tabla);
        })
    })
    .post("/bingo/:code", (req, res) => {
        //Seleccionar un nuevo número
        const db = new ConnectDb();
        db.connect();
        const code = req.params.code;
        let number = req.body.number;
        db.findOne("sesiones", { code: code}).then((result) => {
            let numbers = result.numbersSelect;
            numbers.push(number);
            db.updateOne("sesiones", { code: code }, { $set: { numbersSelect: numbers } });
            switch (true) {
                case number <= 15:
                    number = "B" + number;
                    break;
                case number <= 30:
                    number = "I" + number;
                    break;
                case number <= 45:
                    number = "N" + number;
                    break;
                case number <= 60:
                    number = "G" + number;
                    break;
                default:
                    number = "O" + number;
                    break;
            }
            io.emit(code, number);
            return res.send(numbers);
        })
    })

module.exports = router;