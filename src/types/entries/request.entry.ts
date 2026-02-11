export type RequestStatus = "pending" | "approved" | "rejected";
export type RequestType = "new_item" | "restock" | "pricing_update" | "partnership";

export interface Request {
    id: string;
    supplierId: string;
    supplierName: string;
    requestType: RequestType;
    status: RequestStatus;
    requestedBy: string;
    date: string;
    notes?: string;
}
