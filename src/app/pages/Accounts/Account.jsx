import React, { useMemo, useState } from "react";
import Create from "./components/Create";
import Update from "./components/Update";
import { getAccounts, deleteAccount } from "../../../services/api/retornoApi/ApiAccount";
import { getCategories } from "../../../services/api/retornoApi/ApiCategory";
import { Alert } from "../../../components/functions/alert";
import { formatCurrency } from "../../../components/functions/mask";
import { RiStickyNoteAddFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import PageHeader from "../../pages/Login/PageHeader";

function Account() {
  // Data
  const { accounts = [], error } = getAccounts();
  const { categories = [] } = getCategories();

  // UI state
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [current, setCurrent] = useState(null);

  // Filtros
  const [q, setQ] = useState("");
  const [catFilter, setCatFilter] = useState("ALL");

  if (error) {
    return <div className="alert alert-danger m-3">Erro ao carregar contas: {error.message}</div>;
  }

  // Handlers básicos
  const openCreate = () => setShowModalCreate(true);
  const openUpdate = (acc) => {
    setCurrent(acc);
    setShowModalUpdate(true);
  };
  const closeCreate = () => setShowModalCreate(false);
  const closeUpdate = () => setShowModalUpdate(false);

  const onDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta conta?")) return;
    const { accounts: ok, error: err } = await deleteAccount(id);
    if (ok) {
      setAlert({ type: "success", message: "Conta deletada com sucesso!" });
      setTimeout(() => window.location.reload(), 600);
    } else if (err) {
      setAlert({ type: "error", message: "Falha ao deletar conta. Tente novamente." });
      setTimeout(() => setAlert({ type: "", message: "" }), 15000);
    }
  };

  // Helpers
  const categoryNameOf = (categoryId) =>
    categories.find((c) => c.id === categoryId)?.name || "—";

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return accounts
      .filter((a) => (catFilter === "ALL" ? true : a.categoryid === Number(catFilter)))
      .filter((a) =>
        term
          ? a.name.toLowerCase().includes(term) ||
            String(a.id).includes(term) ||
            categoryNameOf(a.categoryid).toLowerCase().includes(term)
          : true
      )
      .sort((a, b) => a.name.localeCompare(b.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts, q, catFilter, categories]);

  const total = useMemo(
    () => filtered.reduce((sum, a) => sum + (Number(a.value) || 0), 0),
    [filtered]
  );

  return (
    <div>
      {alert.message && <Alert type={alert.type} message={alert.message} />}

      <PageHeader
        pretitle="Cadastros"
        title="Contas"
        secondary={{ label: "Atualizar", onClick: () => window.location.reload() }}
        primary={{ label: "Nova conta", onClick: openCreate, icon: <RiStickyNoteAddFill /> }}
      />

      {/* Toolbar de filtro/busca */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label">Buscar</label>
              <input
                className="form-control"
                placeholder="Nome, ID ou Categoria"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Buscar contas por nome, ID ou categoria"
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                aria-label="Filtrar por categoria"
              >
                <option value="ALL">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end">
              <div className="text-muted small mt-3 mt-md-0">
                {filtered.length} {filtered.length === 1 ? "conta" : "contas"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela / lista */}
      <div className="card">
        {/* Para header “grudado”, você pode adicionar CSS:
            .table-responsive-sticky { max-height: 60vh; overflow: auto; }
            .table-sticky thead th { position: sticky; top: 0; z-index: 2; background: var(--tbl-bg, #fff); }
        */}
        <div className="table-responsive table-responsive-sticky">
          <table className="table card-table table-vcenter table-hover align-middle table-sticky">
            <thead className="bg-body-tertiary">
              <tr>
                <th className="w-1">ID</th>
                <th>Nome</th>
                <th className="text-end text-nowrap">Valor</th>
                <th className="text-nowrap">Categoria</th>
                <th className="w-1 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc) => (
                <tr key={acc.id}>
                  <td className="text-muted">{acc.id}</td>
                  <td className="fw-medium">{acc.name}</td>
                  <td className="text-end">{formatCurrency(acc.value)}</td>
                  <td>{categoryNameOf(acc.categoryid)}</td>
                  <td className="text-center">
                    <div className="btn-list d-inline-flex">
                      <button
                        type="button"
                        className="btn btn-icon btn-soft-secondary"
                        title="Editar"
                        aria-label={`Editar conta ${acc.name}`}
                        onClick={() => openUpdate(acc)}
                        data-bs-toggle="tooltip"
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-soft-danger"
                        title="Excluir"
                        aria-label={`Excluir conta ${acc.name}`}
                        onClick={() => onDelete(acc.id)}
                        data-bs-toggle="tooltip"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-5">
                    <div className="text-center text-secondary">
                      <div className="fs-1 mb-2">🧾</div>
                      <div className="mb-1">Nenhuma conta encontrada</div>
                      <div className="text-muted mb-3">Tente ajustar os filtros ou cadastre uma nova conta.</div>
                      <button className="btn btn-primary" onClick={openCreate}>
                        <RiStickyNoteAddFill className="me-1" />
                        Nova conta
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>

            {/* Rodapé totalizador (apenas quando houver items) */}
            {filtered.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={2} className="text-end fw-bold">
                    Total:
                  </td>
                  <td className="text-end fw-bold">{formatCurrency(total)}</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modais */}
      {showModalCreate && <Create closeModal={closeCreate} />}
      {showModalUpdate && <Update account={current} closeModal={closeUpdate} />}
    </div>
  );
}

export default Account;
