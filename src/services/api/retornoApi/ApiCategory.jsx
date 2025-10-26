import { api } from "../api";
import { useState, useEffect } from "react";

const BaseUrl = "http://localhost:5034";


export async function createCategory(category) {
    try {
        const response = await api.post('CreateCategory', category.dataCreated);
        console.log("Categoria criada com sucesso", response.data);  // Ajustando a mensagem de log
        return { categories: response.data, error: null };  // Retorna a resposta da API ou erro
    } catch (error) {
        console.log("Erro ao criar a categoria", error);  // Mensagem de erro mais clara
        return { categories: null, error: error.response ? error.response.data : error.message };  // Retorna um erro mais detalhado
    }
}


export function getCategories() {
    const [categories, setCategories] = useState([]);
    const [errorCategories, setErrorCategories] = useState(null);

    useEffect(() => {
        api.get('/GetCategories')
            .then((response) => {
                console.log("Categorias encontradas:", response.data);
                setCategories(response.data);
            })
            .catch((errorCategories) => {
                console.log("Erro ao atualizar a categoria", errorCategories);
                setErrorCategories(errorCategories);  // Handle the error
            });
    }, []);

    return { categories, errorCategories };
}

export async function updateCategory(category) {
    try {
        const response = await api.put(`/UpdateCategory/${category.id}`, category);
        return { categories: response.data, error: null }; // Retorna os dados ou erro
    } catch (error) {
        console.log("Erro ao atualizar a categoria", error);
        return { categories: null, error: error.message }; // Retorna o erro
    }
}

export async function deleteCategory(category) {
    try {
        const response = await api.delete(`/DeleteCategory/${category.id}`);
        console.log("Categoria deletada com sucesso", response.data);
        return { categories: response.data, error: null }

    } catch (error) {
        console.log("Erro ao deletar a categoria", error);
        return { categories: null, error: error.message };
    }
}

export async function getCategoryById(id) {
    try {
        const response = await api.get(`/GetCategoryById/${id}`);
        return response.data

    } catch (error) {
        console.log("Erro ao encontrar a categoria", error);
        return error.message;
    }
}





