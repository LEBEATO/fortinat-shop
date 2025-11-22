
import { User, Transaction } from '../types';

const USERS_KEY = 'fn_users_db';

// Helper to get DB
const getDb = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

// Helper to save DB
const saveDb = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const MockPrisma = {
  user: {
    create: async (email: string, name: string, password?: string) => {
      const users = getDb();
      if (users.find(u => u.email === email)) {
        throw new Error("Usuário já existe.");
      }
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        password: password || '123456', // Demo logic
        balance: 10000, // Regra: Recebe 10.000 V-Bucks ao cadastrar
        inventory: [],
        history: []
      };
      users.push(newUser);
      saveDb(users);
      return newUser;
    },

    findUnique: async (email: string) => {
      const users = getDb();
      return users.find(u => u.email === email) || null;
    },

    findMany: async () => {
      return getDb().map(u => ({
        ...u,
        password: undefined
      }));
    },

    update: async (id: string, data: Partial<User>) => {
      const users = getDb();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error("User not found");
      
      users[index] = { ...users[index], ...data };
      saveDb(users);
      return users[index];
    }
  },

  transactions: {
    buy: async (userId: string, cosmetic: { id: string, price: number, name: string, image: string, bundleIds?: string[] }) => {
      const users = getDb();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error("User not found");

      const user = users[userIndex];

      if (user.inventory.includes(cosmetic.id)) {
        throw new Error("Você já possui este item.");
      }

      if (user.balance < cosmetic.price) {
        throw new Error("Saldo insuficiente.");
      }

      // Regra: Ao comprar bundle, adiciona todos os itens do bundle
      const itemsToAdd = [cosmetic.id, ...(cosmetic.bundleIds || [])];
      
      // Filtra apenas o que o usuário ainda não tem (para não duplicar IDs no inventário)
      const newItems = itemsToAdd.filter(id => !user.inventory.includes(id));

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        cosmeticId: cosmetic.id,
        cosmeticName: cosmetic.name,
        cosmeticImage: cosmetic.image,
        amount: -cosmetic.price,
        type: 'PURCHASE',
        date: new Date().toISOString(),
        relatedItems: newItems // Salva exatamente quais IDs foram concedidos nesta compra
      };

      user.balance -= cosmetic.price;
      user.inventory.push(...newItems);
      user.history.push(newTransaction);

      users[userIndex] = user;
      saveDb(users);
      return user;
    },

    refund: async (userId: string, cosmeticId: string) => {
      const users = getDb();
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) throw new Error("User not found");

      const user = users[userIndex];

      if (!user.inventory.includes(cosmeticId)) {
        throw new Error("Você não possui este item para devolver.");
      }

      // Busca a transação original.
      // Precisamos varrer de trás para frente (reverse) para pegar a compra mais recente.
      // A lógica foi aprimorada para encontrar a transação mesmo se o item for parte de um pacote (relatedItems)
      const originalTx = [...user.history].reverse().find(h => 
        h.type === 'PURCHASE' && (
          h.cosmeticId === cosmeticId || 
          (h.relatedItems && h.relatedItems.includes(cosmeticId))
        )
      );
      
      if (!originalTx) {
         // Se não achou, pode ser um dado antigo. Tenta remover apenas o item do inventário sem reembolso se for muito crítico, 
         // mas para segurança financeira do app, lançamos erro.
         // Contudo, se for um erro de "relatedItems" undefined em dados legados, tentamos uma busca mais permissiva apenas pelo cosmeticId principal.
         throw new Error("Erro: Não foi possível localizar o recibo de compra original deste item.");
      }

      const refundAmount = Math.abs(originalTx.amount);
      
      // Se a compra foi um pacote, removemos TODOS os itens que foram adicionados naquela transação
      const itemsToRemove = originalTx.relatedItems && originalTx.relatedItems.length > 0 
                            ? originalTx.relatedItems 
                            : [cosmeticId];

      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        cosmeticId: cosmeticId,
        cosmeticName: originalTx.cosmeticName, // Mantém o nome do item/pacote comprado originalmente
        cosmeticImage: originalTx.cosmeticImage,
        amount: refundAmount,
        type: 'REFUND',
        date: new Date().toISOString(),
        relatedItems: itemsToRemove
      };

      user.balance += refundAmount;
      // Remove do inventário todos os itens associados àquela compra
      user.inventory = user.inventory.filter(id => !itemsToRemove.includes(id));
      user.history.push(newTransaction);

      users[userIndex] = user;
      saveDb(users);
      return user;
    }
  }
};
