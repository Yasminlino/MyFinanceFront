import React, { useEffect, useState } from "react";
import { getAccountsGrouping } from "../../api/retornoApi/ApiAccount"

export function FormatedList(accounts) {
    if (accounts) {
        // Iterando sobre cada conta principal
        accounts.map(account => {
            // Verificando se existe o campo "accounts" dentro de cada conta
            if (account.accounts) {
                account.accounts = account.accounts.map(a => {
                    // Se monthlyUpdates não estiver vazio, substitua o item de 'a' por monthlyUpdates[0]
                    if (a.monthlyUpdates && a.monthlyUpdates.length !== 0) {
                        return a.monthlyUpdates[0]; // Substitui o item com o primeiro valor de monthlyUpdates
                    }
                    return a; // Caso contrário, retorna o próprio 'a' sem mudanças
                });
            }
            return account; // Retorna o account modificado
        });
    }
    return accounts; // Retorna a lista de contas com as modificações
}
