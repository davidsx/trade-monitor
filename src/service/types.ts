export interface IService {
    get<TRes>(url: string): Promise<TRes>;
}