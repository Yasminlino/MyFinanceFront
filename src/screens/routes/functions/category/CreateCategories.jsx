// import api from "../../../../api/apiCategory";
// import { useState, useEffect } from "react";

// export function createCategories(category) {
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [response, setResponse] = useState(null); 

//     useEffect(() => {
//         api.post(category)
//             .then((response) => {
//                 console.log("Categoria atualizada com sucesso", response.data);
//                 setCategories(response.data);
//             })
//             .catch((error) => {
//                 console.log("Erro ao atualizar a categoria", error);
//                 setError(error);  // Handle the error
//             });
//     }, []);

//     return { categories, error };
// }
