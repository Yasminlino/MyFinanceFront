
const BaseUrl = "http://localhost:5034/api/categories";

export async function getCategorias() {
    try {
        const response = await fetch(BaseUrl);
        
        if (!response.ok) {
            throw new Error("Erro na resposta da API");
        }
        
        const data = await response.json(); // Supondo que a resposta seja JSON
        return { data, erro: "" }; // Retorna os dados ou uma string de erro vazia
    } catch (error) {
        console.log("Erro na API", error);
        return { data: "", erro: error.message }; // Retorna o erro como mensagem
    }
}