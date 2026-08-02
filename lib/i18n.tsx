'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'fr';

const translations = {
  ar: {
    dashboard: 'لوحة القيادة',
    debts: 'الديون',
    analytics: 'التحليلات',
    settings: 'الإعدادات',
    totalBalance: 'الرصيد الإجمالي',
    monthlyExpenses: 'مصاريف هذا الشهر',
    monthlyIncome: 'دخل هذا الشهر',
    recentTransactions: 'المعاملات الأخيرة',
    addTransaction: 'إضافة معاملة',
    amount: 'المبلغ (د.ج)',
    type: 'النوع',
    category: 'الفئة',
    date: 'التاريخ',
    note: 'ملاحظة (اختياري)',
    save: 'حفظ',
    expense: 'مصروف',
    income: 'دخل',
    debt: 'دين',
    debtOwedByMe: 'ديون عليّ',
    debtOwedToMe: 'ديون لي',
    cancel: 'إلغاء',
    language: 'اللغة',
    dataBackup: 'نسخ احتياطي واستعادة',
    exportData: 'تصدير البيانات (JSON)',
    importData: 'استيراد البيانات (JSON)',
    resetDatabase: 'مسح جميع البيانات',
    confirmReset: 'هل أنت متأكد من مسح جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.',
    yesReset: 'نعم، امسح البيانات',
    noCancel: 'لا، إلغاء',
    noTransactions: 'لا توجد معاملات بعد',
    debtManager: 'إدارة الديون',
    debtsToPay: 'ديون يجب دفعها',
    debtsToReceive: 'ديون يجب تحصيلها',
    repay: 'تسديد',
    repaymentAmount: 'مبلغ التسديد',
    repaymentHistory: 'تاريخ التسديدات',
    analyticsTitle: 'تحليل المصاريف',
    expensesByCategory: 'المصاريف حسب الفئة',
    selectCategory: 'اختر الفئة',
    successSaved: 'تم الحفظ بنجاح',
    successDeleted: 'تم الحذف بنجاح',
    importSuccess: 'تم استيراد البيانات بنجاح',
    importError: 'خطأ في استيراد البيانات',
    clearSuccess: 'تم مسح البيانات',
    debtRepayment: 'تسديد دين',
    theme: 'المظهر',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    appTitle: 'محفظتي'
  },
  fr: {
    dashboard: 'Tableau de bord',
    debts: 'Dettes',
    analytics: 'Analytique',
    settings: 'Paramètres',
    totalBalance: 'Solde total',
    monthlyExpenses: 'Dépenses du mois',
    monthlyIncome: 'Revenus du mois',
    recentTransactions: 'Transactions récentes',
    addTransaction: 'Ajouter',
    amount: 'Montant (DZD)',
    type: 'Type',
    category: 'Catégorie',
    date: 'Date',
    note: 'Note (optionnelle)',
    save: 'Enregistrer',
    expense: 'Dépense',
    income: 'Revenu',
    debt: 'Dette',
    debtOwedByMe: 'Dettes à payer',
    debtOwedToMe: 'Dettes à recevoir',
    cancel: 'Annuler',
    language: 'Langue',
    dataBackup: 'Sauvegarde & Restauration',
    exportData: 'Exporter les données (JSON)',
    importData: 'Importer les données (JSON)',
    resetDatabase: 'Réinitialiser les données',
    confirmReset: 'Êtes-vous sûr de vouloir tout supprimer ? Cette action est irréversible.',
    yesReset: 'Oui, supprimer',
    noCancel: 'Non, annuler',
    noTransactions: 'Aucune transaction',
    debtManager: 'Gestion des dettes',
    debtsToPay: 'Dettes à payer',
    debtsToReceive: 'Dettes à recevoir',
    repay: 'Rembourser',
    repaymentAmount: 'Montant du remboursement',
    repaymentHistory: 'Historique des remboursements',
    analyticsTitle: 'Analyse des dépenses',
    expensesByCategory: 'Dépenses par catégorie',
    selectCategory: 'Sélectionner une catégorie',
    successSaved: 'Enregistré avec succès',
    successDeleted: 'Supprimé avec succès',
    importSuccess: 'Données importées avec succès',
    importError: 'Erreur lors de l\'importation',
    clearSuccess: 'Données supprimées',
    debtRepayment: 'Remboursement de dette',
    theme: 'Thème',
    light: 'Clair',
    dark: 'Sombre',
    system: 'Système',
    appTitle: 'Mon Portefeuille'
  }
};

type Translations = typeof translations.ar;

interface I18nContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('app_lang') as Language;
    if (savedLang && (savedLang === 'ar' || savedLang === 'fr')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, t: translations[lang], setLang, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
