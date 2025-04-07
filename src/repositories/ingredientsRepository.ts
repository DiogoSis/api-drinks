import { PrismaClient } from "@prisma/client";
import { IIngrediente, IIngredienteRepository } from "../interfaces/ingredients";

let prismaClient: PrismaClient | undefined = undefined;

export class IngredientRepository implements IIngredienteRepository {
  
  private prisma : PrismaClient;
  
  constructor() {
    if(!prismaClient) {
      prismaClient = new PrismaClient();
    }
    this.prisma = prismaClient;
  }

  async findAll(): Promise<IIngrediente> {

  }

  async findById(id: number): Promise<IIngrediente | null> {
    
  }
}