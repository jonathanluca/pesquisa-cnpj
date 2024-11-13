const express = require('express');
const path = require('path');
const axios = require('axios');

// Dados do Excel (substitua com seus dados reais)
const atividadesEnquadramento = [
    {
        descricao: "Manutenção e reparação de máquinas, aparelhos e materiais elétricos não especificados anteriormente",
        enquadramento: "Alvará Ambiental"
    },
    {
        descricao: "Instalação de máquinas e equipamentos industriais",
        enquadramento: "Alvará Ambiental"
    },
    {
        descricao: "Distribuição de água por caminhões",
        enquadramento: "Licença Ambiental"
    }
    // Adicione aqui todas as suas linhas do Excel
];

const app = express();

// Configurar middleware para arquivos estáticos
app.use(express.static('public'));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para consultar CNPJ
app.get('/api/cnpj/:cnpj', async (req, res) => {
    try {
        const { cnpj } = req.params;
        
        const response = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
        const data = response.data;
        
        // Formatar atividades secundárias e adicionar enquadramento
        const atividadesSecundarias = data.cnaes_secundarios.map(ativ => {
            const enquadramento = atividadesEnquadramento.find(
                ae => ae.descricao.toLowerCase() === ativ.descricao.toLowerCase()
            );
            
            return {
                code: ativ.codigo,
                text: ativ.descricao,
                enquadramento: enquadramento ? enquadramento.enquadramento : 'Não classificado'
            };
        });

        const result = {
            razao_social: data.razao_social,
            nome_fantasia: data.nome_fantasia,
            cnpj: data.cnpj,
            situacao: data.descricao_situacao_cadastral,
            atividade_principal: {
                code: data.cnae_fiscal,
                text: data.cnae_fiscal_descricao
            },
            atividades_secundarias: atividadesSecundarias
        };
        
        res.json(result);
    } catch (error) {
        console.error('Erro na consulta:', error.response?.data || error.message);
        res.status(500).json({ 
            error: 'Erro ao consultar CNPJ',
            details: error.response?.data || error.message 
        });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});