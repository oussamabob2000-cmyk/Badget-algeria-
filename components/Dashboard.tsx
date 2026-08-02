'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db, Transaction, Category } from '@/lib/db';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingDown, TrendingUp, Landmark } from 'lucide-react';
import * as Icons from 'lucide-react';
import { format } from 'date-fns';

export function Dashboard() {
  const { t, lang } = useI18n();
  const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

  const transactions = useLiveQuery(() => db.transactions.reverse().sortBy('date'));
  const categories = useLiveQuery(() => db.categories.toArray());

  const getCategory = (id: string) => categories?.find(c => c.id === id);

  const getIcon = (iconName?: string) => {
    if (!iconName) return <Icons.Circle className="w-4 h-4" />;
    const Icon = (Icons as any)[iconName] || Icons.Circle;
    return <Icon className="w-4 h-4" />;
  };

  // Calculate stats
  let totalBalance = 0;
  let monthlyExpenses = 0;
  let monthlyIncome = 0;

  transactions?.forEach(tx => {
    const isCurrentMonth = tx.date.startsWith(currentMonth);
    
    if (tx.type === 'income') {
      totalBalance += tx.amount;
      if (isCurrentMonth) monthlyIncome += tx.amount;
    } else if (tx.type === 'expense') {
      totalBalance -= tx.amount;
      if (isCurrentMonth) monthlyExpenses += tx.amount;
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Balance */}
        <Card className="bg-gradient-to-br from-sky-500 to-emerald-500 border-none text-white shadow-lg shadow-sky-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90 flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              {t.totalBalance}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold truncate">
              {totalBalance.toLocaleString()} <span className="text-xl opacity-80 font-normal">DZD</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Income */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              {t.monthlyIncome}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">
              +{monthlyIncome.toLocaleString()} <span className="text-base text-slate-500 font-normal">DZD</span>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Expenses */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              {t.monthlyExpenses}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              -{monthlyExpenses.toLocaleString()} <span className="text-base text-slate-500 font-normal">DZD</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">{t.recentTransactions}</h3>
        {transactions?.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-xl border border-slate-800 border-dashed text-slate-500">
            {t.noTransactions}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
            {transactions?.slice(0, 10).map((tx, i) => {
              const cat = getCategory(tx.categoryId);
              return (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${i !== 0 ? 'border-t border-slate-800/50' : ''} hover:bg-slate-800/50 transition-colors`}>
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center bg-opacity-20"
                      style={{ backgroundColor: `${cat?.color}20`, color: cat?.color }}
                    >
                      {getIcon(cat?.icon)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">
                        {cat ? (lang === 'ar' ? cat.nameAr : cat.nameFr) : '...'}
                      </div>
                      <div className="text-xs text-slate-500 flex gap-2">
                        <span>{tx.date}</span>
                        {tx.note && <span className="truncate max-w-[100px] md:max-w-xs block opacity-75">{tx.note}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'expense' ? 'text-red-400' : tx.type === 'income' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tx.type === 'expense' ? '-' : tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-xs opacity-70">DZD</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
