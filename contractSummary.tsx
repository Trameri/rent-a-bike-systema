import React from "react";
import { Contract } from "./contracts";

export function ContractSummary({ contract }: { contract: Contract }) {
    return (
        <div>
            <h3>Riepilogo Contratto</h3>
            <ul>
                {contract.bikes.map(bike => (
                    <li key={bike.id}>Bici: {bike.id} (Barcode: {bike.barcode})</li>
                ))}
            </ul>
            <p>Prezzo attuale: €{contract.price}</p>
            <p>Tariffa: {contract.tariffType === "hourly" ? "Oraria" : "Giornaliera"}</p>
            <p>Pagato: {contract.paid ? "Sì" : "No"}</p>
        </div>
    );
}
