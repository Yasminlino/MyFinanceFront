import React from "react";

export function formatDate(dataValue) {
    let date = dataValue.split("-" && "T")[0];
    date = date.split("-");
    date = date[0] + "-" + date[1] + "-" + date[2];
    return date
}

export function formatedNewDate(date) {
    const ano = date.getFullYear();  
    const mes = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0  
    const dia = String(date.getDate()).padStart(2, '0');  
    
    return `${ano}-${mes}-${dia}`;  
}

export function formatDateMonth(date)
{
    return date + "-01";
}

export function formatCurrency(numberValue) {
    let value = "";
    let inteiros = "";
    let centavos = "";
    if (numberValue) {
        if (!numberValue.toString().includes(",")) {
            numberValue = numberValue.toString().replace(/(\d+)(\d{2})$/, "$1,$2");
        }

        value = numberValue.replace(/[^0-9,\.]/g, "");
        if (value.length > 3) {
            const split = value.split(",");
            inteiros = split[0];

            const n = split[1].length;
            if (n > 2) {
                inteiros += split[1][0]
                split[1] = split[1][1] + split[1][2]
                value = split[0] + "," + split[1];
            }
            inteiros = inteiros.toString().replaceAll(".", "")
            inteiros = parseInt(inteiros).toString();
            centavos = split[1];
        } else {
            inteiros = "0";
            centavos = "0" + value;

        }
        if (inteiros.length > 3) {
            let reversedValue = inteiros.split('').reverse().join('');
            let formattedReversedValue = reversedValue.replace(/(\d{3})(?=\d)/g, '$1.');
            inteiros = formattedReversedValue.split('').reverse().join('');
        }
        return `R$ ${inteiros},${centavos}`;
    }
}

export function removeFormatCurrency(value) {
    let valueFormated = value.toString().replace(".", "").replace(",", "");
    valueFormated = valueFormated.replace(/[^0-9,\.]/g, "");
    return valueFormated;
}

