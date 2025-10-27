import React, { useMemo, useState } from "react";
import Create from "./components/Create";
import Update from "./components/Update"; // <- novo
import {
  getCategories,
  deleteCategory,
} from "../../../services/api/retornoApi/ApiCategory";
import { Alert } from "../../../components/functions/alert";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { RiStickyNoteAddFill } from "react-icons/ri";
import PageHeader from "../../pages/Login/PageHeader";

function Categories() {
  const { categories = [], error } = getCategories();

  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModalUpdate, setShowModalUpdate] = useState(false);
  const [category, setCategory] = useState(null);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // UI state — busca e filtro
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  if (error) return <div>Erro ao carregar categorias: {error.message}</div>;

  const openCreate = () => setShowModalCreate(true);
  const openUpdate = (c) => {
    setCategory(c);
    setShowModalUpdate(true);
  };
  const closeCreate = () => setShowModalCreate(false);
  const closeUpdate = () => setShowModalUpdate(false);

  const onDelete = async (c) => {
    if (!window.confirm(`Excluir a categoria "${c.name}"?`)) return;
    const { categories: ok, error: err } = await deleteCategory(c);
    if (ok) {
      setAlert({ type: "success", message: "Categoria deletada com sucesso!" });
      setTimeout(() => window.location.reload(), 800);
    } else if (err) {
      setAlert({
        type: "error",
        message:
          "Falha ao deletar. Categoria pode estar vinculada a transações.",
      });
      setTimeout(() => setAlert({ type: "", message: "" }), 12000);
    }
  };

  // listagem: ordena + filtra
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return [...categories]
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((c) =>
        statusFilter === "ALL" ? true : c.status === statusFilter
      )
      .filter((c) =>
        term ? c.name.toLowerCase().includes(term) || String(c.id).includes(term) : true
      );
  }, [categories, q, statusFilter]);

  const badgeClass = (s) =>
    s === "Ativo"
      ? "badge bg-success"
      : s === "Inativo"
      ? "badge bg-secondary"
      : "badge bg-muted";

  return (
    <div>
      {alert.message && <Alert type={alert.type} message={alert.message} />}

      <PageHeader
        pretitle="Cadastros"
        title="Categorias"
        secondary={{ label: "Atualizar", onClick: () => window.location.reload() }}
        primary={{ label: "Nova categoria", onClick: openCreate, icon: <RiStickyNoteAddFill /> }}
      />

      {/* Toolbar de busca/filtro */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-6">
              <label className="form-label">Buscar</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nome ou ID"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
            <div className="col-12 col-md-3 d-flex justify-content-md-end">
              <div className="text-muted small mt-3 mt-md-0">
                {filtered.length} {filtered.length === 1 ? "categoria" : "categorias"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="table-responsive">
          <table className="table card-table table-vcenter table-hover">
            <thead className="bg-body-tertiary">
              <tr>
                <th className="w-1">ID</th>
                <th>Nome</th>
                <th className="text-nowrap">Status</th>
                <th className="w-1 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td className="text-muted">{c.id}</td>
                  <td className="fw-medium">{c.name}</td>
                  <td>
                    <span className={badgeClass(c.status)}>{c.status}</span>
                  </td>
                  <td className="text-center">
                    <div className="btn-list d-inline-flex">
                      <button
                        type="button"
                        className="btn btn-icon btn-soft-secondary"
                        title="Editar"
                        onClick={() => openUpdate(c)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        type="button"
                        className="btn btn-icon btn-soft-danger"
                        title="Excluir"
                        onClick={() => onDelete(c)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-secondary py-4">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModalCreate && <Create closeModal={closeCreate} />}
      {showModalUpdate && <Update category={category} closeModal={closeUpdate} />}
    </div>
  );
}

export default Categories;
