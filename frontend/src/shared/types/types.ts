/**
 * интерфейс тела ошибки при любом запросе
 */
export interface IApiError {
	message: string;
	error: string;
	statusCode: number;
}
