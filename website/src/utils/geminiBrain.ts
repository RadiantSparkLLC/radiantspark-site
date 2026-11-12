import {AI_EMPLOYEES} from '../data/aiEmployeesData';
export interface AiBrainResponse {employeeName:string;employeeRole:string;response:string;source:string}
export async function askAiBrain(_prompt:string,employeeId?:string):Promise<AiBrainResponse>{const e=AI_EMPLOYEES.find(e=>e.id===employeeId)||AI_EMPLOYEES[0];return {employeeName:e.name,employeeRole:e.role,response:'AI assistance is not connected. No action was taken. Use the contact option for help with your request.',source:'Connection unavailable'};}
