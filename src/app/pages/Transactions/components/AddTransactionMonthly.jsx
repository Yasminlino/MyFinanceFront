import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "../../../../components/functions/alert";
import { getAccounts } from "../../../../services/api/retornoApi/ApiAccount";
import { createTransaction } from "../../../../services/api/retornoApi/ApiTransaction";
import { getTransactionByDate } from "../../../../services/api/retornoApi/ApiTransaction";
import { formatCurrency, removeFormatCurrency, formatDate } from "../../../../components/functions/mask";
import { VscChromeClose } from "react-icons/vsc";

function AddTransactionMonthly({ date, closeModal }) {
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const { accounts = [] } = getAccounts();
  const { transactions = [] } = getTransactionByDate(date);

  // Conjunto de contas que já possuem transação no mês → checkbox desabilitado
  const disabledIds = useMemo(() => {
    const s = new Set();
    transactions.forEach(t => s.add(t.idAccount));
    return s;
  }, [transactions]);

  // Apenas as contas que podem ser marcadas (“selecionáveis”)
  const selectableAccounts = useMemo(
    () => accounts.filter(a => !disabledIds.has(a.id)),
    [accounts, disabledIds]
  );

  const allSelected = useMemo(
    () => selectableAccounts.length > 0 && selectableAccounts.every(a => selectedIds.has(a.id)),
    [selectableAccounts, selectedIds]
  );

  const selectedCount = selectedIds.size;

  const showError = (msg) => {
    setAlert({ type: "error", message: msg });
    setTimeout(() => setAlert({ type: "", message: "" }), 6000);
  };

  const showSuccess = (msg) => {
    setAlert({ type: "success", message: msg });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

  const toggleOne = (accountId) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds(prev => {
      // se já está tudo selecionado, desmarca todos; caso contrário, marca todos os habilitados
      if (allSelected) return new Set();
      return new Set(selectableAccounts.map(a => a.id));
    });
  };

  const handleClose = () => closeModal();

  const handleSave = async () => {
    if (selectedIds.size === 0) {
      showError("Por favor, selecione ao menos uma conta!");
      return;
    }

    setSaving(true);
    const payloads = accounts
      .filter(acc => selectedIds.has(acc.id))
      .map(acc => ({
        date: formatDate(date),
        name: acc.name,
        idAccount: acc.id,
        value: removeFormatCurrency(acc.value),
        status: "PENDENTE",
      }));

    let successCount = 0;
    let errorCount = 0;

    // executa uma por uma para manter comportamento e mensagens previsíveis
    for (const p of payloads) {
      try {
        const { account: created } = await createTransaction(p);
        if (created) successCount++;
        else errorCount++;
      } catch {
        errorCount++;
      }
    }

    setSaving(false);

    if (successCount > 0) {
      showSuccess(`${successCount} ${successCount === 1 ? "conta adicionada" : "contas adicionadas"} com sucesso.`);
      closeModal(); // fecha como você já fazia
    }
    if (errorCount > 0) {
      showError("Houve erros ao processar algumas contas.");
    }
  };

  return (
    <>
    <div className="modal-backdrop show my-backdrop"></div>
    <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
      {alert.message && <Alert type={alert.type} message={alert.message} />}
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            {/* Se estiver em Bootstrap 5, pode trocar para btn-close */}
            <h4 className="modal-title m-0">Contas cadastradas</h4>
            <button type="button" className="btn btn-close" aria-label="Close" onClick={handleClose}>
            </button>
          </div>

          <div className="modal-body">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="form-check">
                <input
                  id="check-all"
                  className="form-check-input"
                  type="checkbox"
                  onChange={toggleAll}
                  checked={allSelected && selectableAccounts.length > 0}
                  disabled={selectableAccounts.length === 0}
                />
                <label className="form-check-label" htmlFor="check-all">
                  Selecionar todos ({selectableAccounts.length})
                </label>
              </div>
              <small className="text-muted">
                Selecionados: <strong>{selectedCount}</strong>
              </small>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr className="info colorwhite">
                    <th style={{ width: 48 }}></th>
                    <th>Nome</th>
                    <th className="text-nowrap">Valor</th>
                    {/* <th className="text-nowrap">Status no mês</th> */}
                  </tr>
                </thead>
                <tbody>
                  {accounts && accounts.length > 0 ? (
                    accounts.map((acc) => {
                      const disabled = disabledIds.has(acc.id);
                      const checked = selectedIds.has(acc.id);
                      return (
                        <tr key={acc.id} className={disabled ? "text-muted" : ""}>
                          <td>
                            <input
                              type="checkbox"
                              className="form-check-input"
                              disabled={disabled}
                              checked={checked}
                              onChange={() => toggleOne(acc.id)}
                              aria-label={`Selecionar conta ${acc.name}`}
                            />
                          </td>
                          <td>{acc.name}</td>
                          <td>{formatCurrency(acc.value)}</td>
                          {/* <td>
                            {disabled ? (
                              <span className="badge bg-secondary">
                                já adicionada neste mês
                              </span>
                            ) : (
                              <span className="badge bg-primary-lt">disponível</span>
                            )}
                          </td> */}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        Nenhuma conta encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={saving}>
              Fechar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving || selectedIds.size === 0}>
              {saving ? "Adicionando..." : "ADICIONAR ITENS"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default AddTransactionMonthly;
