import { IUser } from './IUser';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  create(data: Omit<IUser, 'id'>): Promise<IUser>;
  update(id: number, data: Partial<Omit<IUser, 'id'>>): Promise<IUser | null>;
  delete(id: number): Promise<boolean>;
}
