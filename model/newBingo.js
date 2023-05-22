const generateNumerosTablas = require("./numerosTablas");

generateNumerosTablas
function generateNewBingo(code){
    return {
        code: code,
        status:"Disponible",
        tablas: generateNumerosTablas(),
        numbersSelect:[]
    }
}
module.exports = generateNewBingo;