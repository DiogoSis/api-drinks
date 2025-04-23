import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../interfaces/user/IUserRepository';
import { IUser } from '../../interfaces/user/IUser';

export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { email }
    });
    
    if (!user) {
      return null;
    }
    
    return this.mapUserToDTO(user);
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: id }
    });
    
    if (!user) {
      return null;
    }
    
    return this.mapUserToDTO(user);
  }

  async create(data: Omit<IUser, 'id'>): Promise<IUser> {
    const user = await this.prisma.usuario.create({
      data: {
        nome: data.name,
        email: data.email,
        senha: data.password,
        role: data.role
      }
    });
    
    return this.mapUserToDTO(user);
  }

  async update(id: number, data: Partial<Omit<IUser, 'id'>>): Promise<IUser | null> {
    const user = await this.prisma.usuario.findUnique({
      where: { usuario_id: id }
    });
    
    if (!user) {
      return null;
    }
    
    const updatedUser = await this.prisma.usuario.update({
      where: { usuario_id: id },
      data: {
        nome: data.name,
        email: data.email,
        senha: data.password,
        role: data.role
      }
    });
    
    return this.mapUserToDTO(updatedUser);
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.usuario.delete({
        where: { usuario_id: id }
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      return false;
    }
  }

  private mapUserToDTO(user: any): IUser {
    return {
      id: user.usuario_id,
      name: user.nome,
      email: user.email,
      password: user.senha,
      role: user.role
    };
  }
}
