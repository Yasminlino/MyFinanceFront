
import { api } from "../api";
import { useState, useEffect } from "react";
import { createTransaction } from "./ApiTransaction";

const BaseUrl = "http://localhost:5034/api";

export async function createAccount(account) {
    if (account.parcela) {
        for (let i; i <= account.parcela; i++) {
            // const fazervalidaçãomonth
            const jsonTransaction = {
                name: account.name,
                value: account.value,
                date: account.date ?? account.month,
                status: account.status ?? "Pendente",
                idAccount: account.id
            }
            createTransaction();
        }
    }

    const jsonAccount =
    {
        "name": account.dataCreated.name,
        "value": account.dataCreated.value,
        "categoryid": account.dataCreated.categoryid,
        "installments": 0
    }
    try {
        const response = await api.post('/CreateAccount', jsonAccount);
        console.log("Categoria criada com sucesso", response.data);
        return { account: response.data, error: null };  // Retorna a resposta da API ou erro
    } catch (error) {
        console.log("Erro ao criar a categoria", error);  // Mensagem de erro mais clara
        return { account: null, error: error.response ? error.response.data : error.message };  // Retorna um erro mais detalhado
    }

}

const apiBaseUrl = 'http://localhost:5034/api/Accounts';

// Hook customizado para buscar contas
// Função getAccounts

export function getAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        api.get("/GetAccounts", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                console.log("Conta retornada com sucesso", response.data);
                setAccounts(response.data);
            })
            .catch((errorCategories) => {
                console.log("Erro ao atualizar a categoria", errorCategories);
                setError(errorCategories);  // Tratar erro
            });
    }, []);

    return { accounts, error };
}



export function getAccountsGrouping() {
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/GetAccounts')
            .then((response) => {
                console.log("Categoria atualizada com sucesso", response.data);
                setAccounts(response.data);
            })
            .catch((error) => {
                console.log("Erro ao atualizar a categoria", error);
                setError(error);  // Handle the error
            });
    }, []);

    return { accounts, error };
}

export async function updateAccount(account) {
    const jsonAccount =
    {
        "id": account.id,
        "name": account.name,
        "value": account.value,
        "categoryid": account.categoryid
    }
    try {
        const response = await api.put('UpdateAccount', jsonAccount);
        console.log("Conta atualizada com sucesso", response.data);
        return { account: response.data, error: null }; // Retorna os dados ou erro
    } catch (error) {
        console.log("Erro ao atualizar a conta", error);
        return { account: null, error: error.message }; // Retorna o erro
    }
}

export async function deleteAccount(id) {
    try {
        const response = await api.delete(`/DeleteAccount/${id}`);
        console.log("Categoria deletada com sucesso", response.data);
        return { accounts: response.data, error: null }

    } catch (error) {
        console.log("Erro ao deletar a categoria", error);
        return { accounts: null, error: error.message };
    }
}

export async function getAccountsbyCategory() {

}
