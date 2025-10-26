import React, { useEffect, useState } from "react";
import { getAccountsGrouping } from "../../api/retornoApi/ApiAccount";
import { getCategories } from "../../api/retornoApi/ApiCategory";
import { VscSaveAll } from "react-icons/vsc";
import {formatCurrency} from "../functions/mask"

export default function HistoryMonthlyUpdate() {

    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    const status = ['', 'PENDENTE', 'PAGO NO PRAZO', 'AGUARDANDO', 'PAGO ATRASADO'];
    const titles = ['ACCOUNT', 'VALUE', 'STATUS', 'DUEDATE', '']
    const [years, setYears] = useState([]);
    const { categories, erroCategories } = getCategories();
    const { accounts, erroAccounts } = getAccountsGrouping();


    useEffect(() => {
        const year = new Date().getFullYear() + 10;
        const newYears = [];
        for (let y = 2000; y < year; y++) {
            newYears.push(y);
        }
        setYears(newYears);

    })

    // handleChange(()=> {
        
    // })

    // handleSave(()=> {

    // })


    return (
        <div>
            <div class="form-group lista-grupo" style={{
                height: '120px', paddingBottom: '20px'
            }}>
                <h2>Monthly Update</h2>
                <div className="col-lg-3">
                    <label>Month</label>
                    <select className="form-control" name="" id="">
                        <option value=""> ----selecione---- </option>

                        {months && months.map((month) => (
                            <option value={month}>{month}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-3">
                    <label>Ano</label>
                    <select className="form-control" name="" id="">
                        <option value="">----selecione----</option>
                        {years && years.map((year) => (
                            <option value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className="col-lg-3">
                    <label>Status</label>
                    <select className="form-control" name="" id="">
                        <option value="">----selecione----</option>

                        {status && status.map((month) => (
                            <option value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="col-lg-3">
                    <label>Account</label>
                    <select className="form-control" name="" id="">
                        <option value="">----selecione----</option>

                        {status && status.map((month) => (
                            <option value={month}>{month}</option>
                        ))}
                    </select>
                </div>
                <div className="col-lg-3">
                    <label className="control-label">Category</label>
                    <select className="form-control" name="" id="">
                        <option value="">----selecione----</option>

                        {status && status.map((month) => (
                            <option value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <table className="table table-striped table-hover">

                    {categories && categories.map((category, index) => (
                        <React.Fragment key={index}>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                                <tr className="info">
                                    <th className="" colSpan={titles.length}>{category.name}</th>
                                </tr>

                                <tr>
                                    {titles && titles.map((title, index) => (
                                        <th key={index}>{title}</th>
                                    ))}
                                </tr>

                            </thead>
                            <tbody>
                                {accounts && accounts.map((account, accountIndex) => (
                                    <tr class="active"> 
                                        <td>{account.name}</td>
                                        <td>{formatCurrency(account.value)}</td>
                                        <td>
                                            <select className="form-control" id="select" name="">
                                                {status && status.map((month) => (
                                                    <option value={month}>{month}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <input className="form-control" type="date" />
                                        </td>
                                        <td>
                                        <button className="form-control"><VscSaveAll /></button>
                                        </td>

                                    </tr>
                                ))}
                                <tr>
                                    <th>TOTAL</th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </tbody>
                        </React.Fragment>
                    ))}
                </table>
            </div>
            <div>
                <caption>Resumo mensal</caption>
                <label htmlFor="">Ativo</label>
                <input type="text" value="1500" disabled />
                <label htmlFor="">Passivo</label>
                <input type="text" value="1000" disabled />
                <label htmlFor="">Restante</label>
                <input type="text" value="500" disabled />
            </div>
        </div>
    )

}