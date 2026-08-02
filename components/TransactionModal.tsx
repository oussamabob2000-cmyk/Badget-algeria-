'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db, TransactionType, Category, DebtType } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const { t, lang } = useI18n();
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [note, setNote] = useState('');
  const [debtType, setDebtType] = useState<DebtType>('owed_by_me');

  const categories = useLiveQuery(() => db.categories.where('type').equals(type).toArray(), [type]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setAmount('');
      setCategoryId('');
      setNote('');
      setDate(new Date().toISOString().substring(0, 10));
    }
  }, [open, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !categoryId) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      await db.transactions.add({
        amount: parseFloat(amount),
        type,
        categoryId,
        date,
        note,
        debtType: type === 'debt' ? debtType : undefined,
        createdAt: new Date().toISOString(),
      });
      toast.success(t.successSaved);
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error('Error saving transaction');
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Icons.Circle;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-slate-100 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.addTransaction}</DialogTitle>
        </DialogHeader>

        <Tabs value={type} onValueChange={(v) => setType(v as TransactionType)} className="w-full mt-4">
          <TabsList className="w-full grid grid-cols-3 bg-slate-800">
            <TabsTrigger value="expense" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">{t.expense}</TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">{t.income}</TabsTrigger>
            <TabsTrigger value="debt" className="data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">{t.debt}</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">{t.amount}</label>
            <Input 
              type="number" 
              step="0.01"
              value={amount} 
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              className="text-2xl h-14 bg-slate-950 border-slate-800"
              autoFocus
            />
          </div>

          {type === 'debt' && (
            <div className="space-y-2 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="debtType" 
                  checked={debtType === 'owed_by_me'}
                  onChange={() => setDebtType('owed_by_me')}
                  className="accent-amber-500"
                />
                {t.debtOwedByMe}
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="radio" 
                  name="debtType" 
                  checked={debtType === 'owed_to_me'}
                  onChange={() => setDebtType('owed_to_me')}
                  className="accent-amber-500"
                />
                {t.debtOwedToMe}
              </label>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">{t.category}</label>
            <div className="grid grid-cols-4 gap-2">
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl border text-xs gap-1 transition-all",
                    categoryId === cat.id 
                      ? "border-sky-500 bg-sky-500/10 text-sky-400" 
                      : "border-slate-800 bg-slate-950/50 hover:bg-slate-800 text-slate-400"
                  )}
                >
                  <span style={{ color: categoryId === cat.id ? undefined : cat.color }}>
                    {getIcon(cat.icon)}
                  </span>
                  <span className="text-[10px] text-center line-clamp-1 break-all">
                    {lang === 'ar' ? cat.nameAr : cat.nameFr}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">{t.date}</label>
            <Input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              required
              className="bg-slate-950 border-slate-800"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">{t.note}</label>
            <Input 
              type="text" 
              value={note} 
              onChange={(e) => setNote(e.target.value)}
              className="bg-slate-950 border-slate-800"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <Button type="button" variant="outline" className="flex-1 bg-transparent border-slate-700" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit" className="flex-1 bg-sky-500 hover:bg-sky-600 text-white">
              {t.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
