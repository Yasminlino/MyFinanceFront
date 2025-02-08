import React from "react";

export function Alert({ type, message }) {
    return (
        <div className={`alert alert-dismissible ${type === "success" ? "alert-success" : "alert-danger"}`}>           
            <strong>{type === "success" ? "Well done!" : "Oops!"}</strong> {message}.
        </div>
    );
}
