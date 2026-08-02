import Dexie, { Table } from 'dexie';

export type TransactionType = 'expense' | 'income' | 'debt';
export type DebtType = 'owed_by_me' | 'owed_to_me';

export interface Transaction {
  id?: number;
  amount: number;
  type: TransactionType;
  categoryId: string; // references pre-configured categories
  date: string; // ISO string
  note?: string;
  debtType?: DebtType;
  isDebtRepayment?: boolean;
  relatedDebtId?: number; // if this is a repayment of a debt
  createdAt: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameFr: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export class AppDB extends Dexie {
  transactions!: Table<Transaction, number>;
  categories!: Table<Category, string>;

  constructor() {
    super('ExpenseTrackerDB');
    this.version(1).stores({
      transactions: '++id, amount, type, categoryId, date, debtType, relatedDebtId, createdAt',
      categories: 'id, type'
    });
  }
}

export const db = new AppDB();

// Seed initial categories if empty
export async function seedCategories() {
  const count = await db.categories.count();
  if (count > 0) return;

  const initialCategories: Category[] = [
    // Expenses
    { id: 'exp_groceries', nameAr: 'مواد غذائية', nameFr: 'Épicerie', type: 'expense', icon: 'ShoppingCart', color: '#f59e0b' },
    { id: 'exp_smoking', nameAr: 'تدخين', nameFr: 'Tabac', type: 'expense', icon: 'Cigarette', color: '#ef4444' },
    { id: 'exp_transport', nameAr: 'نقل / بنزين', nameFr: 'Transport / Essence', type: 'expense', icon: 'Car', color: '#3b82f6' },
    { id: 'exp_subs', nameAr: 'اشتراكات', nameFr: 'Abonnements', type: 'expense', icon: 'Wifi', color: '#8b5cf6' },
    { id: 'exp_alimony', nameAr: 'نفقة', nameFr: 'Pension alimentaire', type: 'expense', icon: 'Heart', color: '#ec4899' },
    { id: 'exp_housing', nameAr: 'أقساط السكن', nameFr: 'Logement (AADL)', type: 'expense', icon: 'Home', color: '#10b981' },
    { id: 'exp_emergencies', nameAr: 'طوارئ', nameFr: 'Urgences', type: 'expense', icon: 'AlertTriangle', color: '#f97316' },
    { id: 'exp_other', nameAr: 'أخرى', nameFr: 'Autre', type: 'expense', icon: 'HelpCircle', color: '#6b7280' },
    
    // Income
    { id: 'inc_salary', nameAr: 'الراتب الشهري', nameFr: 'Salaire', type: 'income', icon: 'Wallet', color: '#10b981' },
    { id: 'inc_bonus', nameAr: 'منحة دورية', nameFr: 'Prime périodique', type: 'income', icon: 'Gift', color: '#3b82f6' },
    { id: 'inc_other', nameAr: 'مصدر آخر', nameFr: 'Autre source', type: 'income', icon: 'Briefcase', color: '#8b5cf6' },

    // Debts
    { id: 'debt_owed_by_me', nameAr: 'ديون عليّ', nameFr: 'Dettes à payer', type: 'debt', icon: 'ArrowDownRight', color: '#ef4444' },
    { id: 'debt_owed_to_me', nameAr: 'ديون لي', nameFr: 'Dettes à recevoir', type: 'debt', icon: 'ArrowUpRight', color: '#10b981' },
  ];

  await db.categories.bulkAdd(initialCategories);
}

db.on('populate', seedCategories);
