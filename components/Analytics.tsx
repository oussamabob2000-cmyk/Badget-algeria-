'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useI18n } from '@/lib/i18n';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Analytics() {
  const { t, lang } = useI18n();

  const transactions = useLiveQuery(() => db.transactions.where('type').equals('expense').toArray());
  const categories = useLiveQuery(() => db.categories.toArray());

  const expensesByCategory = transactions?.reduce((acc, tx) => {
    acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = expensesByCategory && categories ? Object.entries(expensesByCategory).map(([catId, amount]) => {
    const cat = categories.find(c => c.id === catId);
    return {
      name: cat ? (lang === 'ar' ? cat.nameAr : cat.nameFr) : 'Unknown',
      value: amount,
      color: cat?.color || '#8884d8'
    };
  }).sort((a, b) => b.value - a.value) : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>{t.expensesByCategory}</CardTitle>
        </CardHeader>
        <CardContent>
          {pieData.length === 0 ? (
            <div className="text-center py-12 text-slate-500">{t.noTransactions}</div>
          ) : (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} DZD`, '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Category Breakdown List */}
      {pieData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pieData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                <span className="font-medium text-slate-200">{data.name}</span>
              </div>
              <span className="font-semibold">{data.value.toLocaleString()} DZD</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
