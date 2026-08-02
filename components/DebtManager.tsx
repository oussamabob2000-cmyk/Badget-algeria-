'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDownRight, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function DebtManager() {
  const { t } = useI18n();

  const debts = useLiveQuery(() => db.transactions.where('type').equals('debt').toArray());

  // In a real app we would link repayments to debts. For simplicity, we just list debts.
  const owedByMe = debts?.filter(d => d.debtType === 'owed_by_me') || [];
  const owedToMe = debts?.filter(d => d.debtType === 'owed_to_me') || [];

  const totalOwedByMe = owedByMe.reduce((sum, d) => sum + d.amount, 0);
  const totalOwedToMe = owedToMe.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-red-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{t.debtsToPay}</p>
                <h3 className="text-2xl font-bold text-red-400">{totalOwedByMe.toLocaleString()} <span className="text-base font-normal">DZD</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-emerald-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{t.debtsToReceive}</p>
                <h3 className="text-2xl font-bold text-emerald-400">{totalOwedToMe.toLocaleString()} <span className="text-base font-normal">DZD</span></h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-slate-200 mb-4">{t.debtOwedByMe}</h4>
          {owedByMe.length === 0 ? (
            <p className="text-sm text-slate-500">{t.noTransactions}</p>
          ) : (
            <div className="space-y-3">
              {owedByMe.map(debt => (
                <div key={debt.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{debt.note || t.debt}</div>
                    <div className="text-xs text-slate-500">{debt.date}</div>
                  </div>
                  <div className="text-red-400 font-semibold">{debt.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-4">{t.debtOwedToMe}</h4>
          {owedToMe.length === 0 ? (
            <p className="text-sm text-slate-500">{t.noTransactions}</p>
          ) : (
            <div className="space-y-3">
              {owedToMe.map(debt => (
                <div key={debt.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-medium">{debt.note || t.debt}</div>
                    <div className="text-xs text-slate-500">{debt.date}</div>
                  </div>
                  <div className="text-emerald-400 font-semibold">{debt.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
