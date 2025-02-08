import { useState, useEffect } from 'react';

export const filterOpen = (categories, id) => {
    const [isFilterOpen, setDados] = useState({});

    useEffect(() => {
        // Se o id estiver vazio, inicialize os dados
        if (id === "") {
            const initialState = {};

            categories.forEach(category => {
                if (category.categoryId) {
                    // Define o estado inicial para cada categoria
                    initialState[category.categoryId] = { 
                        id: category.categoryId,
                        open: false // ou outro valor que você deseja inicializar
                    };
                }
            });

            // Atualiza o estado com o estado inicial
            setDados(initialState);
        }
    }, [categories, id]); // O efeito só será executado quando categories ou id mudarem

    // Função para alterar o estado de uma categoria específica
    const toggleCategoryState = (categoryId) => {
        setDados(prevData => ({
            ...prevData,
            [categoryId]: {
                ...prevData[categoryId],
                open: !prevData[categoryId]?.open,  // Alterna o estado 'open' da categoria
            }
        }));
    };

    return {
        isFilterOpen,
        toggleCategoryState,
    };
};
