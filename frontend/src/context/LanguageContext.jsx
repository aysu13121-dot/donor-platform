'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { BLOOD_TYPES } from '@/lib/constants';

// Tətbiqin tək i18n mənbəyi - hər iki dildə bütün mətnlər buradadır.
const T = {
  az: {
    nav: {
      home: 'Ana səhifə',
      donors: 'Donorlar', requests: 'Sorğular', createRequest: 'Yeni sorğu',
      dashboard: 'Panel', login: 'Daxil ol', register: 'Qeydiyyat', logout: 'Çıxış',
    },
    hero: {
      h1: 'Bir damcı,', h1em: 'min həyat.',
      sub: 'Donor ol, ehtiyacı olana dəstək ol.',
      cta1: 'Donor ol', cta2: 'Qan qrupunu tap',
    },
    blood: {
      title: 'Qan qrupun kimə uyğundur?',
      selectPrompt: 'Qrupunu seç',
      gives: 'Verə bilər', receives: 'Ala bilər',
    },
    cta: { title: 'Bu gün başla', sub: '3 ayda bir neçə dəqiqən, bir insanın həyatı deməkdir.', btn: 'Donor ol' },
    footer: '© 2026 Donor.az. Bütün hüquqlar qorunur.',
    login: {
      title: 'Xoş gəldin',
      email: 'E-poçt', password: 'Şifrə', btn: 'Daxil ol', loading: 'Yoxlanılır...',
      switch: 'Hesabın yoxdur?', switchLink: 'Qeydiyyatdan keç',
      serverErr: 'Bağlantı alınmadı, yenidən cəhd et.',
    },
    signup: {
      title: 'Donor ol',
      fullName: 'Ad Soyad', fullNamePlaceholder: 'Əli Məmmədov', email: 'E-poçt', password: 'Şifrə',
      phone: 'Telefon', bloodType: 'Qan qrupu', city: 'Şəhər', select: 'Seç',
      btn: 'Qeydiyyatdan keç', loading: 'Yaradılır...',
      switch: 'Artıq üzvsən?', switchLink: 'Daxil ol',
      serverErr: 'Bağlantı alınmadı, yenidən cəhd et.',
      requiredError: 'Qan qrupu, şəhər və telefon nömrəsi mütləqdir.',
      invalidPhone: 'Düzgün telefon nömrəsi daxil et (məs: +994 50 123 45 67).',
      passwordHint: 'Ən azı 4 simvol',
    },
    donors: {
      title: 'Donorlar',
      sub: 'Şəhər və qan qrupuna görə donor axtar.',
      allBloodTypes: 'Qan qrupu: Hamısı',
      allCities: 'Şəhər: Hamısı',
      onlyAvailable: 'Yalnız hazır olanlar',
      reset: 'Sıfırla',
      error: 'Yüklənmədi, yenidən cəhd et.',
      empty: 'Uyğun donor tapılmadı.',
      active: 'Hazır',
      inactive: 'Hazır deyil',
      lastDonation: 'Son donorluq',
      call: 'Zəng et',
      prev: 'Geri',
      next: 'İrəli',
      donor: 'Donor',
    },
    requests: {
      title: 'Sorğular',
      sub: 'Aktiv sorğuları gör, kömək təklif et.',
      filters: 'Filtr',
      allUrgency: 'Təciliyyət: Hamısı',
      urgent: 'Təcili',
      normal: 'Normal',
      reset: 'Sıfırla',
      empty: 'Aktiv sorğu yoxdur.',
      error: 'Yüklənmədi, yenidən cəhd et.',
      units: 'vahid',
      call: 'Zəng et',
      postedBy: 'Paylaşan',
    },
    createRequest: {
      badge: 'Yeni sorğu',
      title: 'Qan lazımdır',
      sub: 'Detalları doldur, aktiv donorlara çatsın.',
      patientName: 'Xəstənin adı',
      bloodType: 'Qan qrupu',
      hospital: 'Xəstəxana',
      city: 'Şəhər',
      unitsNeeded: 'Neçə vahid',
      urgency: 'Təciliyyət',
      urgent: 'Təcili',
      normal: 'Normal',
      contactPhone: 'Əlaqə nömrəsi',
      note: 'Qeyd (istəyə görə)',
      submit: 'Sorğunu paylaş',
      cancel: 'Ləğv et',
      loading: 'Paylaşılır...',
      error: 'Alınmadı, yenidən cəhd et.',
      select: 'Seç',
    },
    dashboard: {
      sub: 'Sorğularını izlə və idarə et.',
      overviewTitle: 'Ümumi baxış',
      profile: 'Profil',
      requests: 'Sorğularım',
      logout: 'Çıxış',
      loadingRequests: 'Yüklənir...',
      noRequests: 'Hələ sorğu yoxdur.',
      error: 'Yüklənmədi.',
      deleteError: 'Silinmədi.',
      updateError: 'Yenilənmədi.',
      bloodTypeRequired: 'Qan qrupu seçilməlidir.',
      cityRequired: 'Şəhər seçilməlidir.',
      quickLinks: 'Sürətli keçid',
      active: 'Aktiv',
      fulfilled: 'Tamamlandı',
      cancelled: 'Ləğv edildi',
      delete: 'Sil',
      fullName: 'Ad Soyad',
      bloodType: 'Qan qrupu',
      city: 'Şəhər',
      phone: 'Telefon',
      lastDonation: 'Son donorluq',
      bio: 'Haqqında',
      available: 'Donorluğa hazıram',
      save: 'Yadda saxla',
      saving: 'Saxlanılır...',
      requestsCount: (n) => `${n} sorğu`,
      navOverview: 'Baxış',
      statTotal: 'Ümumi',
      statActive: 'Aktiv',
      statFulfilled: 'Tamamlanan',
      statDonorStatus: 'Status',
    },
  },
  en: {
    nav: {
      home: 'Home',
      donors: 'Donors', requests: 'Requests', createRequest: 'New request',
      dashboard: 'Dashboard', login: 'Sign in', register: 'Sign up', logout: 'Log out',
    },
    hero: {
      h1: 'One drop,', h1em: 'endless lives.',
      sub: 'Become a donor, support someone in need.',
      cta1: 'Become a donor', cta2: 'Find your type',
    },
    blood: {
      title: 'Who matches your type?',
      selectPrompt: 'Choose your type',
      gives: 'Can give to', receives: 'Can receive from',
    },
    cta: { title: 'Start today', sub: 'A few minutes every 3 months. One life, every time.', btn: 'Become a donor' },
    footer: '© 2026 Donor.az. All rights reserved.',
    login: {
      title: 'Welcome back',
      email: 'Email', password: 'Password', btn: 'Sign in', loading: 'Checking...',
      switch: 'No account?', switchLink: 'Sign up',
      serverErr: "Couldn't connect. Try again.",
    },
    signup: {
      title: 'Become a donor',
      fullName: 'Full name', fullNamePlaceholder: 'John Smith', email: 'Email', password: 'Password',
      phone: 'Phone', bloodType: 'Blood type', city: 'City', select: 'Choose',
      btn: 'Sign up', loading: 'Creating...',
      switch: 'Already a member?', switchLink: 'Sign in',
      serverErr: "Couldn't connect. Try again.",
      requiredError: 'Blood type, city, and phone number are required.',
      invalidPhone: 'Enter a valid phone number (e.g. +994 50 123 45 67).',
      passwordHint: 'At least 4 characters',
    },
    donors: {
      title: 'Donors',
      sub: 'Search for a donor by city and blood type.',
      allBloodTypes: 'Blood type: All',
      allCities: 'City: All',
      onlyAvailable: 'Available only',
      reset: 'Reset',
      error: "Couldn't load. Try again.",
      empty: 'No matching donors.',
      active: 'Available',
      inactive: 'Not available',
      lastDonation: 'Last donation',
      call: 'Call',
      prev: 'Prev',
      next: 'Next',
      donor: 'Donor',
    },
    requests: {
      title: 'Requests',
      sub: 'See active requests, offer to help.',
      filters: 'Filters',
      allUrgency: 'Urgency: All',
      urgent: 'Urgent',
      normal: 'Normal',
      reset: 'Reset',
      empty: 'No active requests.',
      error: "Couldn't load. Try again.",
      units: 'units',
      call: 'Call',
      postedBy: 'Posted by',
    },
    createRequest: {
      badge: 'New request',
      title: 'Blood needed',
      sub: 'Fill in the details, reach active donors.',
      patientName: 'Patient name',
      bloodType: 'Blood type',
      hospital: 'Hospital',
      city: 'City',
      unitsNeeded: 'Units needed',
      urgency: 'Urgency',
      urgent: 'Urgent',
      normal: 'Normal',
      contactPhone: 'Contact number',
      note: 'Note (optional)',
      submit: 'Share request',
      cancel: 'Cancel',
      loading: 'Sharing...',
      error: "Couldn't submit. Try again.",
      select: 'Choose',
    },
    dashboard: {
      sub: 'Track and manage your requests.',
      overviewTitle: 'Overview',
      profile: 'Profile',
      requests: 'My requests',
      logout: 'Log out',
      loadingRequests: 'Loading...',
      noRequests: 'No requests yet.',
      error: "Couldn't load.",
      deleteError: "Couldn't delete.",
      updateError: "Couldn't update.",
      bloodTypeRequired: 'Blood type is required.',
      cityRequired: 'City is required.',
      quickLinks: 'Quick links',
      active: 'Active',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
      delete: 'Delete',
      fullName: 'Full name',
      bloodType: 'Blood type',
      city: 'City',
      phone: 'Phone',
      lastDonation: 'Last donation',
      bio: 'About',
      available: 'Available to donate',
      save: 'Save',
      saving: 'Saving...',
      requestsCount: (n) => `${n} requests`,
      navOverview: 'Overview',
      statTotal: 'Total',
      statActive: 'Active',
      statFulfilled: 'Fulfilled',
      statDonorStatus: 'Status',
    },
  },
};

// Landing səhifəsindəki qan-qrupu uyğunluq cədvəli. O- hamıya verə bilər,
// AB+ hamıdan ala bilər - əvvəllər bunlar "hamısına"/"hamısından" kimi tək
// sözlə göstərilirdi, indi digər qruplar kimi tam siyahı olaraq göstərilir.
export function bloodCompatibility() {
  return [
    { type: 'A+', gives: ['A+', 'AB+'], receives: ['A+', 'A-', 'O+', 'O-'] },
    { type: 'A-', gives: ['A+', 'A-', 'AB+', 'AB-'], receives: ['A-', 'O-'] },
    { type: 'B+', gives: ['B+', 'AB+'], receives: ['B+', 'B-', 'O+', 'O-'] },
    { type: 'B-', gives: ['B+', 'B-', 'AB+', 'AB-'], receives: ['B-', 'O-'] },
    { type: 'O+', gives: ['O+', 'A+', 'B+', 'AB+'], receives: ['O+', 'O-'] },
    { type: 'O-', gives: BLOOD_TYPES, receives: ['O-'] },
    { type: 'AB+', gives: ['AB+'], receives: BLOOD_TYPES },
    { type: 'AB-', gives: ['AB+', 'AB-'], receives: ['AB-', 'A-', 'B-', 'O-'] },
  ];
}

const LanguageContext = createContext(null);

// `initialLang` server-də (root layout-da) `lang` cookie-sindən oxunur və
// buraya ötürülür ki, ilk render-dən düzgün dil göstərilsin - əvvəllər
// state həmişə 'az'-dan başlayıb yalnız mount-dan sonra (useEffect-də)
// localStorage-ə baxıb düzəlirdi, bu da EN istifadəçilərdə hər səhifə
// yenilənməsində qısa müddət AZ mətnin "yanıb sönməsinə" səbəb olurdu.
export function LanguageProvider({ children, initialLang }) {
  const [lang, setLang] = useState(initialLang === 'en' ? 'en' : 'az');

  useEffect(() => {
    // Köhnə istifadəçilərdə seçim yalnız localStorage-də ola bilər (cookie
    // hələ yazılmayıb) - bir dəfəlik oxuyub cookie-yə köçürürük ki, növbəti
    // server-render-də də düzgün dil gəlsin.
    if (!initialLang) {
      const stored = localStorage.getItem('lang');
      if (stored === 'az' || stored === 'en') {
        setLang(stored);
        document.cookie = `lang=${stored}; path=/; max-age=31536000`;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle() {
    setLang((prev) => {
      const next = prev === 'az' ? 'en' : 'az';
      localStorage.setItem('lang', next);
      document.cookie = `lang=${next}; path=/; max-age=31536000`;
      return next;
    });
  }

  return (
    <LanguageContext.Provider value={{ lang, t: T[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage() yalnız <LanguageProvider> daxilində istifadə oluna bilər.');
  return ctx;
}
