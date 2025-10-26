import React, { useEffect, useMemo, useState } from "react";
import "./styles/transaction.css"
// import { getAccountsGrouping } from "../../api/retornoApi/ApiAccount";
import {
  formatCurrency,
  formatDate,
  formatDateMonth,
  removeFormatCurrency,
} from "../../routes/functions/mask";
import { Alert } from "../functions/alert";
import AddTransactionMonthly from "../Modals/Transaction/AddTransactionMonthly";
import {
  updateTransaction,
  deleteTransaction,
  GetTransactionGroupingByDate,
} from "../../api/retornoApi/ApiTransaction";

import { VscSaveAll } from "react-icons/vsc";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import CreateTransaction from "../Modals/Transaction/Create";
import { FaEdit } from "react-icons/fa";
import { FiCalendar, FiLock, FiUnlock, FiChevronDown } from "react-icons/fi";
import { Tooltip, Collapse } from "bootstrap"; // já vem com bootstrap bundle

export default function Transaction() {
  // ---- Constantes de UI / Dados
  const STATUS = ["", "PENDENTE", "PAGO NO PRAZO", "AGUARDANDO", "PAGO ATRASADO"];
  const FIELD_IDS = ["name", "value", "month", "status"];

  // 👉 mês atual em YYYY-MM (ex.: 2025-09)
  const defaultMonth = `${new Date().getFullYear()}-${String(
    new Date().getMonth() + 1
  ).padStart(2, "0")}`;

  // ---- Estados
  const [transactions, setTransactions] = useState([]);
  const [transactionMonthly, setTransactionMonthly] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // bloqueio por status (qualquer status diferente de PENDENTE = bloqueado)
  const lockedById = useMemo(() => {
    const map = new Map();
    transactionMonthly.forEach((t) => {
      map.set(t.id, t.statusSalvo !== "PENDENTE" && !t.desbloqueiaCampos);
    });
    return map;
  }, [transactionMonthly]);

  // ...existing code...
  useEffect(() => {
    // tooltips
    const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tips = [...triggers].map((el) => new Tooltip(el));

    // collapse (garante que, em SPA, os targets sejam inicializados)
    const collapseBtns = document.querySelectorAll('[data-bs-toggle="collapse"]');
    const collapseInstances = [];
    collapseBtns.forEach((btn) => {
      const selector = btn.getAttribute('data-bs-target') || btn.getAttribute('href');
      const target = selector && document.querySelector(selector);
      if (target) {
        // não fazer toggle automático, só garantir a instância
        collapseInstances.push(new Collapse(target, { toggle: false }));
      }
    });

    return () => {
      tips.forEach((t) => t.dispose());
      collapseInstances.forEach((c) => c.dispose && c.dispose());
    };
  }, []);

  // ---- Efeitos
  useEffect(() => {
    const initialData = transactions.flatMap((category) =>
      category.accounts.flatMap((account) =>
        account.transactions.map((transaction) => ({
          id: transaction.id,
          name: transaction.name,
          value: transaction.value,
          month: transaction.date,
          categoryId: category.categoryId,
          idAccount: account.id,
          status: transaction.status,
          statusSalvo: transaction.status,
          categoryName: category.categoryName,
          desbloqueiaCampos: false,
        }))
      )
    );
    setTransactionMonthly(initialData);
  }, [transactions]);

  const handleDateChange = async (event) => {
    const newDate = formatDateMonth(event.target.value);
    const data = await GetTransactionGroupingByDate(newDate);
    setTransactions(data || []);
  };

  // 👉 carrega automaticamente o mês atual na primeira montagem
  useEffect(() => {
    handleDateChange({ target: { value: defaultMonth } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Helpers
  const openWithValidation = (setter) => {
    const v = document.getElementById("dateFilter")?.value;
    if (!v) {
      setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    } else {
      setter(true);
    }
  };

  const handleToolbar = (action) => {
    if (action === "add") return openWithValidation(setShowModalAdd);
    if (action === "create") return openWithValidation(setShowModalCreate);
    if (action === "refresh") {
      const value = document.getElementById("dateFilter")?.value;
      if (!value) {
        setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
        setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      } else {
        handleDateChange({ target: { value } });
      }
    }
  };

  const sumByCategory = (categoryId) => {
    let sum = 0;
    transactionMonthly.forEach((item) => {
      if (item.categoryId === categoryId) {
        const v = item.value ? removeFormatCurrency(item.value) : 0;
        sum += parseInt(v, 10);
      }
    });
    return formatCurrency(sum);
  };

  const handleChange = (campo, id) => (event) => {
    const { value } = event.target;
    setTransactionMonthly((prev) =>
      prev.map((item) => {
        if (item.id === id || item.idAccount === id) {
          const valueCampo = campo === "value" ? formatCurrency(value) : value;
          return { ...item, [campo]: valueCampo };
        }
        return item;
      })
    );
  };

  const handleSave = async (id) => {
    const data = transactionMonthly.find((d) => d.id === id);
    let isValid = true;

    FIELD_IDS.forEach((index) => {
      if (!data[index]) isValid = false;
    });

    if (!isValid) {
      setAlert({ type: "error", message: "Preencha os campos obrigatórios" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
      return;
    }

    const payload = { ...data, value: removeFormatCurrency(data.value) };
    const { account: dados, error } = await updateTransaction(payload);

    if (!error && dados) {
      setTransactionMonthly((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
              ...t,
              status: dados.status,
              statusSalvo: dados.status,
              desbloqueiaCampos: dados.status === "PENDENTE" ? t.desbloqueiaCampos : false,
            }
            : t
        )
      );
      setAlert({ type: "success", message: "Transação atualizada com sucesso!" });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    } else if (error) {
      console.log("Erro ao atualizar a conta", error);
      setAlert({ type: "error", message: "Erro ao atualizar. Tente novamente." });
      setTimeout(() => setAlert({ type: "", message: "" }), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      const { accounts: ok, error } = await deleteTransaction(id);
      if (ok) {
        const dateInputValue = document.getElementById("dateFilter")?.value;
        handleDateChange({ target: { value: dateInputValue || defaultMonth } });
        setAlert({ type: "success", message: "Transação deletada com sucesso!" });
        setTimeout(() => setAlert({ type: "", message: "" }), 8000);
      } else if (error) {
        setAlert({ type: "error", message: "Falha ao deletar. Tente novamente." });
        setTimeout(() => setAlert({ type: "", message: "" }), 8000);
      }
    }
  };

  const unlock = (id) => {
    setTransactionMonthly((prev) =>
      prev.map((t) => (t.id === id ? { ...t, desbloqueiaCampos: true } : t))
    );
  };

  // ---- UI helpers (Bootstrap/Tabler)
  const renderStatus = (s) => {
    const map = {
      "": "badge bg-secondary",
      PENDENTE: "badge bg-warning text-dark",
      "PAGO NO PRAZO": "badge bg-success",
      AGUARDANDO: "badge bg-primary",
      "PAGO ATRASADO": "badge bg-danger",
    };
    return <span className={map[s] || "badge bg-secondary"}>{s || "—"}</span>;
  };

  return (
    <div className="page-body">
      {alert.message && <Alert type={alert.type} message={alert.message} />}

      {/* ======= HEADER ======= */}
      <div className="">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            {/* Esquerda menor */}
            <div className="col-12 col-lg-4">
              <div className="page-pretitle">Financeiro</div>
              <h2 className="page-title">Transações</h2>
            </div>

            {/* Direita maior */}
            <div className="col-12 col-lg-8 d-print-none">
              <div className="d-flex justify-content-end gap-2 flex-wrap">
                {/* input mês continua sempre visível */}
                <div className="input-icon">
                  <input
                    className="form-control"
                    type="month"
                    id="dateFilter"
                    defaultValue={defaultMonth}
                    onChange={handleDateChange}
                    aria-label="Filtrar por mês"
                  />
                </div>

                {/* botão toggle para mostrar/ocultar ações */}
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#toolbarCollapse"
                  aria-expanded="false"
                  aria-controls="toolbarCollapse"
                  title="Mostrar/ocultar ações"
                >
                  Ações
                </button>

                {/* ações colapsáveis */}
                <div className="collapse" id="toolbarCollapse">
                  <div className="btn-list">
                    <button className="btn btn-primary gap-2 btn-lg-icon" onClick={() => handleToolbar("add")}>
                      <MdFormatListBulletedAdd /> Adicionar em lote
                    </button>
                    <button className="btn btn-primary gap-2 btn-lg-icon" onClick={() => handleToolbar("create")}>
                      <RiStickyNoteAddFill /> Nova transação
                    </button>
                    <button className="btn btn-outline-secondary gap-2 btn-lg-icon" onClick={() => handleToolbar("refresh")}>
                      <GrUpdate /> Atualizar
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ======= CONTEÚDO ======= */}
      <div className="container-xl mt-3">
        {/* Empty state geral */}
        {(!transactions || transactions.length === 0) && (
          <div className="card">
            <div className="card-body text-center text-secondary py-5">
              <div className="mb-3 fs-1">🧾</div>
              <h3 className="mb-1">Nenhuma transação encontrada</h3>
              <p className="text-muted">
                Comece adicionando sua primeira transação para este mês.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleToolbar("create")}
              >
                <RiStickyNoteAddFill className="me-1" />
                Adicionar transação
              </button>
            </div>
          </div>
        )}
        {/* Categorias */}
        {transactions?.map((category) => {
          const collapseId = `cat-${category.categoryId}`;
          const rows = transactionMonthly.filter(
            (c) => c.categoryId === category.categoryId
          );

          return (
            <div className="card card-stacked mb-3" key={category.categoryId}>
              <div className="card-header justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <button
                    className="btn btn-icon btn-outline-secondary btn-sm"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${collapseId}`}
                    aria-expanded="false"
                    aria-controls={collapseId}
                    title="Mostrar/ocultar"
                  >
                    <FiChevronDown />
                  </button>
                  <h3 className="card-title m-0">
                    {String(category.categoryName || "").toUpperCase()}
                  </h3>
                </div>

                <div className="card-actions text-end">
                  <div className="text-muted small">Total da categoria</div>
                  <div className="fw-bold fs-5">
                    {sumByCategory(category.categoryId)}
                  </div>
                </div>
              </div>

              {/* CONTEÚDO COLAPSÁVEL */}
              <div className="collapse show" id={collapseId}>
                {/* Tabela (desktop) */}
                <div className="table-responsive d-none d-lg-block">
                  <table className="table card-table table-vcenter">
                    <thead className="bg-body-tertiary sticky-top">
                      <tr>
                        <th>Conta</th>
                        <th className="text-nowrap">Valor</th>
                        <th className="text-nowrap">Vencimento</th>
                        <th className="text-nowrap">Status</th>
                        <th className="w-1 text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.length > 0 ? (
                        rows.map((account) => {
                          const readOnly = lockedById.get(account.id);
                          return (
                            <tr key={account.id} id={account.id}>
                              <td className="text-uppercase fw-medium">
                                {String(account.name || "").toUpperCase()}
                              </td>

                              <td style={{ maxWidth: 220 }}>
                                <div className="input-group input-group-sm">
                                  <span className="input-group-text">R$</span>
                                  <input
                                    id={`value${account.id}`}
                                    onChange={handleChange("value", account.id)}
                                    className="form-control"
                                    type="text"
                                    value={formatCurrency(account.value)}
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                    aria-label={`Valor da conta ${account.name}`}
                                  />
                                </div>
                              </td>

                              <td style={{ maxWidth: 220 }}>
                                <input
                                  id={`month${account.id}`}
                                  onChange={handleChange("month", account.id)}
                                  value={formatDate(account.month)}
                                  className="form-control form-control-sm"
                                  type="date"
                                  readOnly={readOnly}
                                  disabled={readOnly}
                                  aria-label={`Vencimento da conta ${account.name}`}
                                />
                              </td>

                              <td style={{ minWidth: 220 }}>
                                {readOnly ? (
                                  <div className="d-flex align-items-center gap-2">
                                    <span className="badge bg-success-subtle text-success-emphasis">
                                      <FiLock className="me-1" /> {account.status}
                                    </span>
                                    <button
                                      className="btn btn-icon btn-soft-muted ms-1"
                                      onClick={() => unlock(account.id)}
                                      title="Desbloquear para edição"
                                      data-bs-toggle="tooltip"
                                    >
                                      <FiUnlock />
                                    </button>
                                  </div>
                                ) : (
                                  <select
                                    id={`status${account.id}`}
                                    onChange={handleChange("status", account.id)}
                                    value={account.status}
                                    className="form-select form-select-sm"
                                    aria-label={`Status da conta ${account.name}`}
                                  >
                                    {STATUS.map((s, i) => (
                                      <option key={i} value={s}>
                                        {s}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>

                              <td className="text-center">
                                <div className="btn-list d-inline-flex">
                                  <button
                                    id={`btnSave${account.id}`}
                                    onClick={() => handleSave(account.id)}
                                    className="btn btn-icon btn-soft-success"
                                    title="Salvar"
                                    aria-label="Salvar"
                                    data-bs-toggle="tooltip"
                                    disabled={readOnly}
                                  >
                                    <VscSaveAll />
                                  </button>

                                  <button
                                    id={`btnDelete${account.id}`}
                                    onClick={() => handleDelete(account.id)}
                                    className="btn btn-icon btn-soft-danger"
                                    title="Excluir"
                                    aria-label="Excluir"
                                    data-bs-toggle="tooltip"
                                  >
                                    <MdDelete />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-secondary py-4">
                            Nenhuma conta registrada neste mês
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Cards (mobile) */}
                <div className="d-lg-none p-3">
                  {rows.length > 0 ? (
                    rows.map((account) => {
                      const readOnly = lockedById.get(account.id);
                      return (
                        <div
                          key={account.id}
                          className={`border rounded-3 p-3 mb-3 ${readOnly ? "bg-body-tertiary" : ""
                            }`}
                        >
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h4 className="h6 m-0 text-uppercase">
                              {String(account.name || "").toUpperCase()}
                            </h4>
                            <div className="d-flex align-items-center gap-2">
                              {readOnly ? (
                                <span className="badge bg-success-subtle text-success-emphasis">
                                  <FiLock className="me-1" />
                                  {account.status}
                                </span>
                              ) : (
                                renderStatus(account.status)
                              )}
                              <button
                                className="btn btn-link p-0 text-muted"
                                onClick={() => unlock(account.id)}
                                title="Desbloquear"
                              >
                                <FiUnlock />
                              </button>
                            </div>
                          </div>

                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label mb-1 small">Valor</label>
                              <div className="input-group input-group-sm">
                                <span className="input-group-text">R$</span>
                                <input
                                  type="text"
                                  value={formatCurrency(account.value)}
                                  onChange={handleChange("value", account.id)}
                                  disabled={readOnly}
                                  className="form-control"
                                />
                              </div>
                            </div>
                            <div className="col-6">
                              <label className="form-label mb-1 small">Vencimento</label>
                              <input
                                type="date"
                                value={formatDate(account.month)}
                                onChange={handleChange("month", account.id)}
                                disabled={readOnly}
                                className="form-control form-control-sm"
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label mb-1 small">Status</label>
                              {readOnly ? (
                                <div className="d-flex align-items-center gap-2">
                                  {renderStatus(account.status)}
                                  <button
                                    className="btn btn-link p-0 text-muted"
                                    onClick={() => unlock(account.id)}
                                    title="Desbloquear"
                                  >
                                    <FiUnlock />
                                  </button>
                                </div>
                              ) : (
                                <select
                                  value={account.status}
                                  onChange={handleChange("status", account.id)}
                                  className="form-select form-select-sm"
                                >
                                  {STATUS.map((s, i) => (
                                    <option key={i} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>
                            <div className="col-12 d-flex justify-content-end gap-2">
                              <button
                                onClick={() => handleSave(account.id)}
                                className="btn btn-icon btn-soft-success btn-xs"
                                disabled={readOnly}
                                title="Salvar"
                                data-bs-toggle="tooltip"
                              >
                                <VscSaveAll />
                              </button>
                              <button
                                onClick={() => handleDelete(account.id)}
                                className="btn btn-icon btn-soft-danger btn-xs"
                                title="Excluir"
                                data-bs-toggle="tooltip"
                              >
                                <MdDelete />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-secondary py-3">
                      Nenhuma conta registrada neste mês
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <div className="text-muted small">
                    {rows.length} {rows.length === 1 ? "item" : "itens"}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="text-muted">Total</span>
                    <span className="badge bg-primary-lt fs-5">
                      {sumByCategory(category.categoryId)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {showModalAdd && (
          <AddTransactionMonthly
            date={formatDateMonth(document.getElementById("dateFilter").value)}
            closeModal={() => setShowModalAdd(false)}
          />
        )}

        {showModalCreate && (
          <CreateTransaction closeModal={() => setShowModalCreate(false)} />
        )}
      </div>
    </div>
  );
}
