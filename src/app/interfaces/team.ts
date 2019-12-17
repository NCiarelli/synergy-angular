import { Employee } from './employee';

export interface Team {
  name: string;
  members: Employee[];
  teamType: string;
  id?: number;
  notes?: string;
}
