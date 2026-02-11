export const queryBuilder = (params: Record<string, any>): string => {
    const query = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, String(value));
        }
    });

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "";
};
