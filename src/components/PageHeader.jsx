import React from "react";

export default function PageHeader({
  pretitle,
  title,
  primary,
  secondary,
  right,
  className = "",
  children, // opcional: breadcrumbs/descrição
}) {
  return (
    <div className={`page-header ${className}`} style={{padding: '1rem'}}>
      <div className="row align-items-center">
        <div className="col">
          {pretitle && <div className="page-pretitle">{pretitle}</div>}
          {title && <h2 className="page-title m-0">{title}</h2>}
          {children}
        </div>

        <div className="col-auto ms-auto">
          <div className="btn-list">
            {secondary && (
              <span className="d-none d-sm-inline">
                <button
                  type="button"
                  className="btn"
                  onClick={secondary.onClick}
                  disabled={secondary.disabled}
                >
                  {secondary.icon && <span className="me-2">{secondary.icon}</span>}
                  {secondary.label}
                </button>
              </span>
            )}

            {primary && (
              <>
                {/* Desktop */}
                <button
                  type="button"
                  className="btn btn-primary d-none d-sm-inline-block"
                  data-bs-toggle={primary.modalTarget ? "modal" : undefined}
                  data-bs-target={primary.modalTarget}
                  onClick={primary.onClick}
                  disabled={primary.disabled}
                >
                  {primary.icon ? <span className="me-2">{primary.icon}</span> : <PlusIcon className="me-2" />}
                  {primary.label}
                </button>

                {/* Mobile (ícone) */}
                <button
                  type="button"
                  className="btn btn-primary d-sm-none btn-icon"
                  aria-label={primary.label}
                  onClick={primary.onClick}
                  disabled={primary.disabled}
                >
                  {primary.icon || <PlusIcon />}
                </button>
              </>
            )}

            {right}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`icon ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
