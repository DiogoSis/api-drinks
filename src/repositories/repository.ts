import {
  PrismaClient,
  drink,
  receitadrink,
  ingrediente,
  unidademedida,
} from "@prisma/client";
import { IDrink, IDrinkRepository } from "../interfaces/drink";

type ReceitaWithRelations = receitadrink & {
  ingrediente: ingrediente & {
    unidademedida: unidademedida;
  };
};

type DrinkWithRelations = drink & {
  receitadrink: ReceitaWithRelations[];
};

let prismaClient: PrismaClient | undefined = undefined;

export class DrinkRepository implements IDrinkRepository {
  private prisma: PrismaClient;

  constructor() {
    if (!prismaClient) {
      prismaClient = new PrismaClient();
    }
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<IDrink[]> {
    const drinks = await this.prisma.drink.findMany({
      orderBy: {
        drink_id: "asc",
      },
      include: {
        receitadrink: {
          include: {
            ingrediente: {
              include: {
                unidademedida: true,
              },
            },
          },
        },
      },
    });

    return drinks.map((drink) => ({
      id: drink.drink_id,
      nome: drink.nome,
      descricao: drink.descricao || undefined,
      categoria: drink.categoria || undefined,
      preparation: drink.preparation || undefined,
      photoUrl: drink.photo_url || undefined,
      ingredientes: drink.receitadrink.map((receita) => ({
        nome: receita.ingrediente.nome,
        quantidade: Number(receita.quantidade_necessaria),
        unidadeMedida: receita.ingrediente.unidademedida.abreviacao,
      })),
    }));
  }

  async findById(id: number): Promise<IDrink | null> {
    const drink = await this.prisma.drink.findUnique({
      where: { drink_id: id },
      include: {
        receitadrink: {
          include: {
            ingrediente: {
              include: {
                unidademedida: true,
              },
            },
          },
        },
      },
    });

    if (!drink) return null;

    return {
      id: drink.drink_id,
      nome: drink.nome,
      descricao: drink.descricao || undefined,
      categoria: drink.categoria || undefined,
      preparation: drink.preparation || undefined,
      photoUrl: drink.photo_url || undefined,
      ingredientes: drink.receitadrink.map((receita) => ({
        nome: receita.ingrediente.nome,
        quantidade: Number(receita.quantidade_necessaria),
        unidadeMedida: receita.ingrediente.unidademedida.abreviacao,
      })),
    };
  }
}
