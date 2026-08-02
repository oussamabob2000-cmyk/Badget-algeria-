'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, ReceiptText, PieChart, Settings } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { DebtManager } from '@/components/DebtManager';
import { Analytics } from '@/components/Analytics';
import { SettingsPage } from '@/components/SettingsPage';
import { TransactionModal } from '@/components/TransactionModal';

export default function Home() {
  const { t, dir } = useI18n();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 pb-20 md:pb-0" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
          {t.appTitle}
        </h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500 text-white"
        >
          +
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Desktop/Tablet Tabs */}
          <div className="hidden md:flex justify-between items-center mb-8">
            <TabsList className="bg-slate-800/50 p-1 border border-slate-700/50">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
                <LayoutDashboard className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.dashboard}
              </TabsTrigger>
              <TabsTrigger value="debts" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
                <ReceiptText className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.debtManager}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
                <PieChart className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.analytics}
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-sky-500/20 data-[state=active]:text-sky-400">
                <Settings className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" /> {t.settings}
              </TabsTrigger>
            </TabsList>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              + {t.addTransaction}
            </button>
          </div>

          {/* Mobile Bottom Navigation (TabsList) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900 z-40 pb-safe">
            <TabsList className="flex w-full justify-between h-16 bg-transparent border-none">
              <TabsTrigger value="dashboard" className="flex-1 flex-col h-full rounded-none data-[state=active]:text-sky-400 bg-transparent data-[state=active]:bg-slate-800/50">
                <LayoutDashboard className="w-5 h-5 mb-1" />
                <span className="text-[10px]">{t.dashboard}</span>
              </TabsTrigger>
              <TabsTrigger value="debts" className="flex-1 flex-col h-full rounded-none data-[state=active]:text-sky-400 bg-transparent data-[state=active]:bg-slate-800/50">
                <ReceiptText className="w-5 h-5 mb-1" />
                <span className="text-[10px]">{t.debts}</span>
              </TabsTrigger>
              <div className="flex-1 flex justify-center -mt-5">
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-14 h-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center border-4 border-slate-900"
                >
                  <span className="text-2xl font-light">+</span>
                </button>
              </div>
              <TabsTrigger value="analytics" className="flex-1 flex-col h-full rounded-none data-[state=active]:text-sky-400 bg-transparent data-[state=active]:bg-slate-800/50">
                <PieChart className="w-5 h-5 mb-1" />
                <span className="text-[10px]">{t.analytics}</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 flex-col h-full rounded-none data-[state=active]:text-sky-400 bg-transparent data-[state=active]:bg-slate-800/50">
                <Settings className="w-5 h-5 mb-1" />
                <span className="text-[10px]">{t.settings}</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <Dashboard />
          </TabsContent>
          <TabsContent value="debts" className="mt-0">
            <DebtManager />
          </TabsContent>
          <TabsContent value="analytics" className="mt-0">
            <Analytics />
          </TabsContent>
          <TabsContent value="settings" className="mt-0">
            <SettingsPage />
          </TabsContent>
        </Tabs>
      </main>

      <TransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
