'use client';

import { useI18n, Language } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/db';
import { toast } from 'sonner';
import { Download, Upload, Trash2, Globe } from 'lucide-react';
import { useRef } from 'react';

export function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      const transactions = await db.transactions.toArray();
      const categories = await db.categories.toArray();
      
      const data = { transactions, categories };
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `mywallet-backup-${new Date().toISOString().substring(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error('Export failed');
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.transactions && json.categories) {
          await db.transaction('rw', db.transactions, db.categories, async () => {
            await db.transactions.clear();
            await db.categories.clear();
            await db.transactions.bulkAdd(json.transactions);
            await db.categories.bulkAdd(json.categories);
          });
          toast.success(t.importSuccess);
        } else {
          throw new Error('Invalid format');
        }
      } catch (err) {
        console.error(err);
        toast.error(t.importError);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (confirm(t.confirmReset)) {
      try {
        await db.transactions.clear();
        // Keep categories or re-seed them by deleting and letting it populate
        await db.categories.clear();
        toast.success(t.clearSuccess);
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        toast.error('Reset failed');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl mx-auto">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> {t.language}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button 
              variant={lang === 'ar' ? 'default' : 'outline'} 
              className={lang === 'ar' ? 'bg-sky-500 hover:bg-sky-600' : 'border-slate-700 text-slate-300'}
              onClick={() => setLang('ar')}
            >
              العربية
            </Button>
            <Button 
              variant={lang === 'fr' ? 'default' : 'outline'} 
              className={lang === 'fr' ? 'bg-sky-500 hover:bg-sky-600' : 'border-slate-700 text-slate-300'}
              onClick={() => setLang('fr')}
            >
              Français
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>{t.dataBackup}</CardTitle>
          <CardDescription className="text-slate-400">Export your data to a JSON file to keep it safe, or import it to another device.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExport} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white">
              <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.exportData}
            </Button>
            
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef}
              className="hidden" 
              onChange={handleImport}
            />
            <Button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white">
              <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.importData}
            </Button>
          </div>
          
          <div className="pt-6 border-t border-slate-800">
            <Button onClick={handleReset} variant="destructive" className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
              <Trash2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.resetDatabase}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
