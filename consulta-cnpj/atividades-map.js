const XLSX = require('xlsx');
const path = require('path');

function carregarAtividades() {
    try {
        const excelPath = path.join(__dirname, '..', 'data', 'enquadramento.xlsx');
        const workbook = XLSX.readFile(excelPath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Converte para array usando os nomes corretos das colunas
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Criar um mapa usando a descrição da atividade como chave
        const atividadesMap = new Map();
        data.forEach(row => {
            if (row['Descrição da Atividade']) {
                atividadesMap.set(
                    row['Descrição da Atividade'].trim(), 
                    row['Enquadramento da atividade']
                );
            }
        });

        console.log('Atividades carregadas:', atividadesMap.size);
        return atividadesMap;
    } catch (error) {
        console.error('Erro ao carregar atividades:', error);
        return new Map();
    }
}

module.exports = { carregarAtividades };