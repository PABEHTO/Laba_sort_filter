let correspond = {
    "Название": "structure",
    "Тип": "category",
    "Страна": "country",
    "Город": "city",
    "Год": ["yearFrom", "yearTo"],
    "Высота": ["heightFrom", "heightTo"]
};

let dataFilter = (dataForm) => {
    let dictFilter = {};
    
    for (let j = 0; j < dataForm.elements.length; j++) {
        let item = dataForm.elements[j];
        let valInput = item.value;

        // если поле типа text, приводим его значение к нижнему регистру
        if (item.type == "text") {
            valInput = valInput.toLowerCase();
        } 
        // числовые поля
        else if (item.type == "number") {
            if (valInput === "") {
                if (item.id.includes("From")) {
                    valInput = -Infinity; // если поле From пустое, то -inf
                } else if (item.id.includes("To")) {
                    valInput = Infinity; // если поле To пустое, то +inf
                }
            } else {
                valInput = Number(valInput); // в число
            }
        }

        //  очередной элемент ассоциативного массива
        if (item.id) { // есть ли у элемента id
            dictFilter[item.id] = valInput;
        }
    }       
    return dictFilter;
};

let filterTable = (data, idTable, dataForm) => {

    let datafilter = dataFilter(dataForm);
    
    let tableFilter = data.filter(item => {
        let result = true;
        
        for (let key in item) {
            let val = item[key];
            
            // текстовые поля
            if (typeof val == 'string') {
                val = item[key].toLowerCase();
                result &&= val.indexOf(datafilter[correspond[key]]) !== -1;
            }
            // числовые поля
            else if (typeof val == 'number') {
                let range = correspond[key]; // массив id полей From и To
                let from = datafilter[range[0]]; // ниж гр
                let to = datafilter[range[1]]; // верх гр
                result &&= val >= from && val <= to;
            }
        }
        return result;
    });     

    clearTable(idTable);
    createTable(tableFilter, idTable);  
};

let clearFilter = (idTable, data, dataForm) => {
    dataForm.reset();
    clearTable(idTable);
    createTable(data, idTable);
};