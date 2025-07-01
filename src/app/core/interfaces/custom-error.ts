import { HttpErrorResponse } from "@angular/common/http";


export interface CustomErrorInterface{
	message: string,
	description?: string,
	shortCode?: string,
	type?: any,
	trace?: any
}
