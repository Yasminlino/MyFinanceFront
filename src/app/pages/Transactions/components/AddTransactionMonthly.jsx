import React, { useEffect, useState } from "react";
import { createAccount } from "../../../../services/api/retornoApi/ApiAccount";
import { getCategories } from "../../../../services/api/retornoApi/ApiCategory"
import { Alert } from "../../../../components/functions/alert";
import { formatCurrency } from "../../../../components/functions/mask";
import { removeFormatCurrency } from "../../../../components/functions/mask"
import { getAccounts } from "../../../../services/api/retornoApi/ApiAccount";
import { createTransaction } from "../../../../services/api/retornoApi/ApiTransaction";
import { getTransactionByDate } from "../../../../services/api/retornoApi/ApiTransaction";
import { formatDate } from "../../../../components/functions/mask";

function AddTransactionMonthly({ date, closeModal }) {

    const [dataCreated, setDataCreated] = useState({ name: "", value: "", categoryid: "" });
    const [alert, setAlert] = useState({ type: "", message: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const { accounts, errorac } = getAccounts();
    const [accountsChecked, setAccountsChecked] = useState([]);
    const { transactions, erroMonthly } = getTransactionByDate(date);

    useEffect(() => {
        transactions.map(transaction => {
            const element = document.getElementById(`check-box${transaction.idAccount}`)
            if (element)
                element.setAttribute('disabled', true);
        })
    });

    const handleChange = (event, account) => {
        const json = {
            date: formatDate(date),
            name: account.name,
            idAccount: account.id,
            value: account.value,
            status: "PENDENTE",
            checked: event.target.checked
        }
        const existingAccountIndex = accountsChecked.findIndex(c => c.idAccount === account.id);

        if (existingAccountIndex >= 0) {
            setAccountsChecked(prevState => {
                const updatedAccounts = [...prevState];
                updatedAccounts[existingAccountIndex] = json;
                return updatedAccounts;
            });
        } else {
            // Se o item não existir, adicione-o ao array
            setAccountsChecked(prevState => [...prevState, json]);
        }
    };

    const handleClose = () => {
        closeModal();
    };
    const handleSave = async () => {
        // Inicializa uma variável para armazenar os resultados
        let successCount = 0;
        let errorCount = 0;

        // Verifica se pelo menos uma conta foi selecionada
        if (accountsChecked.length === 0) {
            setError("Por favor, selecione ao menos uma conta!");
            return;
        }

        // Itera sobre as contas selecionadas e processa cada uma
        for (const account of accountsChecked) {
            // Filtra as transações relacionadas à conta
            const transaction = transactions.filter(a => a.idAccount);

            // Verifica se a conta está marcada e se há transações
            if (account.checked && transaction.length >= 0) {
                account.value = removeFormatCurrency(account.value);
                account.date = formatDate(date);

                // Chama a função para criar a transação e aguarda a resposta
                const { account: updatedAccount, error } = await createTransaction(account);

                // Se a transação foi bem-sucedida, incrementa o contador de sucesso
                if (updatedAccount) {
                    successCount++;
                } else {
                    errorCount++;
                }
            }
        }

        // Se todas as contas foram processadas corretamente, mostra o sucesso
        if (successCount > 0) {
            setSuccess(true);
            closeModal();
            console.log(`${successCount} contas adicionadas com sucesso`);
        }

        // Se houver algum erro, mostra uma mensagem de erro
        if (errorCount > 0) {
            setError("Houve erros ao processar algumas contas.");
        }
    };


    return (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            {alert.message && <Alert type={alert.type} message={alert.message} />}
            <div className="modal-dialog" role="document">

                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleClose}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4>Add Account Monthly</h4>
                    </div>
                    <div className="modal-body">
                        <table className="table table-hover">
                            <thead>
                                <tr className="info colorwhite">
                                    <th>
                                        Name
                                    </th>
                                    <th>
                                        Value
                                    </th>
                                    <th>

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts && accounts.map((acc, index) => (
                                    <tr key={index}>
                                        <th>
                                            {acc.name}
                                        </th>
                                        <th>
                                            {formatCurrency(acc.value)}
                                        </th>
                                        <th>
                                            <input type="checkbox" id={`check-box${acc.id}`} onChange={(event) => handleChange(event, acc)} />
                                        </th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">Conta atualizada com sucesso!</div>}
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>ADICIONAR ITENS</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTransactionMonthly;
