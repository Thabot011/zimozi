export default interface getAllProducts extends getAllFilter {
    category?: category;
    priceFrom?: number;
    priceTo?: number;
}
export enum category {
    food,
    drink,
    clothes
}

export interface getAllFilter {
    pageSize?: number;
    pageNumber?: number;
    firstDocumentId?: string;
    lastDocumentId?: string;
}