
import { api } from "../api";
import { useState, useEffect } from "react";

const BaseUrl = "http://localhost:5034/api";

export async function createTransaction(account) {
    const jsonAccount =
    {
        "name": account.name,
        "value": account.value,
        "date": account.date ?? account.month,
        "status": account.status ?? "Pendente",
        "idAccount": account.idAccount || 14
    }
    try {
        const response = await api.post('/CreateTransaction', jsonAccount);
        console.log("Categoria criada com sucesso", response.data);  // Ajustando a mensagem de log
        return { account: response.data, error: null };  // Retorna a resposta da API ou erro
    } catch (error) {
        console.log("Erro ao criar a categoria", error);  // Mensagem de erro mais clara
        return { account: null, error: error.response ? error.response.data : error.message };  // Retorna um erro mais detalhado
    }
}


export function getTransactionAccount() {
    const [Transaction, setTransaction] = useState([]);
    const [erroTransaction, setErrorTransaction] = useState(null);

    useEffect(() => {
        api.get('/GetTransaction')
            .then((response) => {
                console.log("Categoria atualizada com sucesso", response.data);
                setTransaction(response.data);
            })
            .catch((erroTransaction) => {
                console.log("Erro ao atualizar a categoria", erroTransaction);
                setErrorTransaction(erroTransaction);  // Handle the error
            });
    }, []);

    return { Transaction, erroTransaction };
}

export async function GetTransactionGroupingByDate(date) {

    try {
        const response = await api.get(`/GetTransactionGroupingByDate/${date}`);
        console.log("Conta atualizada com sucesso", response.data);
        return (response.data); // Retorna os dados ou erro
    } catch (error) {
        console.log("Erro ao atualizar a conta", error);
        return (error);
    }
}

export function getTransactionByDate(date) {
    const [transactions, setTransaction] = useState([]);
    const [erroTransaction, setErrorTransaction] = useState(null);

    useEffect(() => {
        api.get(`/GetTransactionByDate/${date}`)
            .then((response) => {
                console.log("Retorno GetTransactionByDate", response.data);
                setTransaction(response.data);
            })
            .catch((erroTransaction) => {
                console.log("Erro ao atualizar a categoria", erroTransaction);
                setErrorTransaction(erroTransaction);  // Handle the error
            });
    }, []);

    return { transactions, erroTransaction };
}

export async function updateTransaction(account) {
    const jsonAccount =
    {
        "id": account.id,
        "date": account.date,
        "name": account.name,
        "value": account.value,
        "idAccount": account.idAccount,
        "status": account.status
    }
    try {
        const response = await api.put('UpdateTransaction', jsonAccount);
        console.log("Conta atualizada com sucesso", response.data);
        return { account: response.data, error: null }; // Retorna os dados ou erro
    } catch (error) {
        console.log("Erro ao atualizar a conta", error);
        return { account: null, error: error.message }; // Retorna o erro
    }
}

export async function deleteTransaction(id) {
    try {
        const response = await api.delete(`/DeleteTransaction/${id}`);
        console.log("Update deletado com sucesso", response.data);
        return { accounts: response.data, error: null }

    } catch (error) {
        console.log("Erro ao deletar a categoria", error);
        return { accounts: null, error: error.message };
    }
}
