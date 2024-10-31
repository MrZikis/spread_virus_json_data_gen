const fs = require('fs');
const iconv = require('iconv-lite');
const Papa = require('papaparse');

// Funkce pro načtení CSV souboru a převod na JSON
function convertCSVToJSON(csvFile) {
    // Čtení CSV souboru bez specifikace kódování
    const csvDataBuffer = fs.readFileSync(csvFile);

    // Překódování z windows-1250 na utf8
    const csvData = iconv.decode(csvDataBuffer, 'windows-1250');

    // Parsování CSV
    Papa.parse(csvData, {
        header: true, // Zpracovává hlavičku
        complete: function(results) {
            const jsonData = {}; // Inicializace objektu pro JSON

            // Pro každý řádek CSV vytvoříme položku v JSON
            results.data.forEach(row => {
                jsonData[row['kod-NUTS4-okresu']] = {
                    name: row['nazev-okresu'],
                    population: +(row['pocet-obyvatel']),
                    infected: 0 // Statická hodnota
                };
            });

            // Výstup JSON jako string
            const jsonString = JSON.stringify(jsonData, null, 2);
            console.log(jsonString); // Můžete to změnit na export do souboru

            // Uložení JSON do souboru (volitelné)
            downloadJSON(jsonString, 'data_okresy.json');
        },
        error: function(error) {
            console.error('Chyba při načítání CSV souboru:', error);
        }
    });
}

// Funkce pro stažení JSON jako soubor
function downloadJSON(jsonString, filename) {
    fs.writeFileSync(filename, jsonString, 'utf8');
}

// Příklad volání funkce - změňte 'path/to/your/file.csv' na cestu k vašemu CSV souboru
convertCSVToJSON('./CiselnikOkresu.csv');