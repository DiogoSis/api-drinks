import { prisma } from '../../infra/lib/prisma';
import { IDrink, DrinksRepository } from "../drinks-repository";

export class PrismaDrinksRepository implements DrinksRepository {

  async findAll(): Promise<IDrink[]> {
    const drinks = await prisma.drink.findMany({
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
    const drink = await prisma.drink.findUnique({
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
