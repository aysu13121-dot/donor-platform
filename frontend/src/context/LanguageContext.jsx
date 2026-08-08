'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// Tətbiqin tək i18n mənbəyi. Əvvəlki versiyada bəzi səhifələr bu kontekstdən,
// bəziləri isə öz yerli "COPY" obyektlərindən istifadə edirdi (Donors səhifəsi
// isə heç bunlardan istifadə etmirdi). İndi hər şey buradadır.
const T = {
  az: {
    nav: {
      home: 'Ana Səhifə', how: 'Necə İşləyir', types: 'Qan Qrupları',
      donors: 'Donorlar', requests: 'Qan Sorğuları', createRequest: 'Sorğu Yarat',
      dashboard: 'Profil', login: 'Daxil ol', register: 'Qeydiyyat', logout: 'Çıxış',
    },
    hero: {
      eyebrow: 'Azərbaycanın donor şəbəkəsi',
      h1: 'Bir damcı qan,', h1em: 'bir həyat.',
      sub: 'Regional Qan Donoru Sistemi vasitəsilə ən yaxın donoru tapın və ya özünüz donor olaraq həyat xilas edin.',
      cta1: 'Donor ol', cta2: 'Qan qrupu tap',
    },
    how: {
      title: 'Necə işləyir?', sub: 'Üç addımda donorluq prosesini başlat',
      steps: [
        { num: '01', title: 'Qeydiyyatdan keç', desc: 'Adınızı, qan qrupunuzu və əlaqə məlumatlarınızı daxil edin.' },
        { num: '02', title: 'Profil yarat', desc: 'Şəhərinizi və donor olmağa hazır olduğunuzu bildirin.' },
        { num: '03', title: 'Həyat xilas et', desc: 'Ehtiyacı olan xəstələr sizi tapa bilər. Siz də donor tapa bilərsiniz.' },
      ],
    },
    blood: {
      title: 'Qan qrupları', sub: 'Hər qan qrupu kimin üçün donor ola bilər?',
      gives: 'Verir', receives: 'Alır',
      all: 'Hamısına', allFrom: 'Hamısından',
      uDonor: 'Universal donor', uReceiver: 'Universal alıcı',
    },
    cta: { title: 'Bugün donor olun', sub: 'Hər 3 aydan bir — bir saatınız, bir həyat deməkdir.', btn: 'İndi başla' },
    footer: '© 2026 Regional Qan Donoru Sistemi. Bütün hüquqlar qorunur.',
    login: {
      title: 'Xoş gəldiniz', sub: 'Hesabınıza daxil olun',
      email: 'E-poçt', password: 'Şifrə', btn: 'Daxil ol', loading: 'Gözləyin...',
      switch: 'Hesabınız yoxdur?', switchLink: 'Qeydiyyatdan keçin',
      serverErr: 'Server ilə əlaqə qurmaq mümkün olmadı.',
    },
    signup: {
      title: 'Donor ol', sub: 'Pulsuz qeydiyyatdan keçin',
      fullName: 'Ad Soyad', email: 'E-poçt', password: 'Şifrə',
      phone: 'Telefon', bloodType: 'Qan qrupu', city: 'Şəhər', select: 'Seçin...',
      btn: 'Qeydiyyatdan keç', loading: 'Gözləyin...',
      switch: 'Artıq hesabınız var?', switchLink: 'Daxil olun',
      serverErr: 'Server ilə əlaqə qurmaq mümkün olmadı.',
      passwordHint: 'Minimum 4 simvol',
    },
    donors: {
      title: 'Donor Kataloqu',
      sub: 'Qan qrupuna və şəhərə görə aktiv donorları tapın',
      allBloodTypes: 'Bütün qan qrupları',
      allCities: 'Bütün şəhərlər',
      onlyAvailable: 'Yalnız aktiv donorlar',
      reset: 'Sıfırla',
      loading: 'Yüklənir...',
      error: 'Donorlar yüklənərkən xəta baş verdi.',
      empty: 'Axtarışa uyğun donor tapılmadı.',
      active: 'Aktiv',
      inactive: 'Passiv',
      lastDonation: 'Son donorluq',
      noInfo: 'Məlumat yoxdur',
      call: 'Zəng et',
      prev: 'Əvvəlki',
      next: 'Növbəti',
      donor: 'Donor',
    },
    requests: {
      title: 'Qan sorğuları',
      sub: 'Aktiv ehtiyacları filtrə görə izləyin və uyğun sorğuya donor təklifi göndərin.',
      filters: 'Filtrlər',
      bloodType: 'Qan qrupu',
      city: 'Şəhər',
      urgency: 'Təciliyyət',
      all: 'Hamısı',
      urgent: 'Təcili',
      normal: 'Normal',
      reset: 'Sıfırla',
      loading: 'Sorğular yüklənir...',
      empty: 'Uyğun qan sorğusu tapılmadı.',
      error: 'Sorğular yüklənərkən xəta baş verdi.',
      donorButton: 'Donor ol',
      loginToRespond: 'Daxil ol və donor ol',
      responseSuccess: 'Təklifiniz göndərildi.',
      responseError: 'Təklif göndərilə bilmədi.',
      phone: 'Əlaqə',
      units: 'vahid',
      hospital: 'Xəstəxana',
      call: 'Zəng et',
    },
    createRequest: {
      badge: 'Yeni sorğu',
      title: 'Qan ehtiyacı yaradın',
      sub: 'Məlumatları doldurun və aktiv donor şəbəkəsinə sorğu göndərin.',
      patientName: 'Xəstə adı',
      bloodType: 'Qan qrupu',
      hospital: 'Xəstəxana',
      city: 'Şəhər',
      unitsNeeded: 'Lazım olan vahid sayı',
      urgency: 'Təciliyyət',
      urgent: 'Təcili',
      normal: 'Normal',
      contactPhone: 'Əlaqə telefonu',
      note: 'Qeyd',
      submit: 'Sorğunu yarat',
      loading: 'Yaradılır...',
      error: 'Sorğu yaradılarkən xəta baş verdi.',
      select: 'Seçin...',
    },
    dashboard: {
      title: 'Profil və sorğularım',
      sub: 'Məlumatlarınızı yeniləyin və yaratdığınız sorğuları idarə edin.',
      profile: 'Profil məlumatları',
      requests: 'Mənim sorğularım',
      logout: 'Çıxış et',
      save: 'Yadda saxla',
      saving: 'Saxlanılır...',
      loading: 'Profil yüklənir...',
      loadingRequests: 'Sorğular yüklənir...',
      noRequests: 'Hələ sorğu yaratmamısınız.',
      error: 'Məlumatlar yüklənərkən xəta baş verdi.',
      saveError: 'Profil yenilənə bilmədi.',
      deleteError: 'Sorğu silinə bilmədi.',
      fullName: 'Ad soyad',
      bloodType: 'Qan qrupu',
      city: 'Şəhər',
      phone: 'Telefon',
      lastDonation: 'Son qanvermə tarixi',
      bio: 'Bio',
      available: 'Donorluğa hazıram',
      status: 'Status',
      active: 'Aktiv',
      fulfilled: 'Tamamlanıb',
      cancelled: 'Ləğv edilib',
      delete: 'Sil',
      hospital: 'Xəstəxana',
      units: 'vahid',
      urgency: 'Təciliyyət',
      requestsCount: (n) => `${n} sorğu`,
    },
  },
  en: {
    nav: {
      home: 'Home', how: 'How It Works', types: 'Blood Types',
      donors: 'Donors', requests: 'Requests', createRequest: 'Create Request',
      dashboard: 'Profile', login: 'Log in', register: 'Register', logout: 'Log out',
    },
    hero: {
      eyebrow: "Azerbaijan's donor network",
      h1: 'One drop of blood,', h1em: 'one life.',
      sub: 'Find the nearest donor through the Regional Blood Donor System, or save a life by becoming a donor yourself.',
      cta1: 'Become a donor', cta2: 'Find blood type',
    },
    how: {
      title: 'How does it work?', sub: 'Start the donation process in three steps',
      steps: [
        { num: '01', title: 'Register', desc: 'Enter your name, blood type, and contact information.' },
        { num: '02', title: 'Create a profile', desc: 'Indicate your city and readiness to donate.' },
        { num: '03', title: 'Save a life', desc: 'Patients in need can find you. You can also find a donor.' },
      ],
    },
    blood: {
      title: 'Blood types', sub: 'Which blood type can donate to whom?',
      gives: 'Donates to', receives: 'Receives from',
      all: 'Everyone', allFrom: 'Everyone',
      uDonor: 'Universal donor', uReceiver: 'Universal receiver',
    },
    cta: { title: 'Become a donor today', sub: 'Once every 3 months — one hour of your time means one life.', btn: 'Start now' },
    footer: '© 2026 Regional Blood Donor System. All rights reserved.',
    login: {
      title: 'Welcome back', sub: 'Log in to your account',
      email: 'Email', password: 'Password', btn: 'Log in', loading: 'Please wait...',
      switch: "Don't have an account?", switchLink: 'Register',
      serverErr: 'Could not connect to the server.',
    },
    signup: {
      title: 'Become a donor', sub: 'Register for free',
      fullName: 'Full Name', email: 'Email', password: 'Password',
      phone: 'Phone', bloodType: 'Blood type', city: 'City', select: 'Select...',
      btn: 'Register', loading: 'Please wait...',
      switch: 'Already have an account?', switchLink: 'Log in',
      serverErr: 'Could not connect to the server.',
      passwordHint: 'Minimum 4 characters',
    },
    donors: {
      title: 'Donor Catalog',
      sub: 'Find active donors by blood type and city',
      allBloodTypes: 'All blood types',
      allCities: 'All cities',
      onlyAvailable: 'Only active donors',
      reset: 'Reset',
      loading: 'Loading...',
      error: 'Could not load donors.',
      empty: 'No matching donors found.',
      active: 'Active',
      inactive: 'Inactive',
      lastDonation: 'Last donation',
      noInfo: 'No info',
      call: 'Call',
      prev: 'Previous',
      next: 'Next',
      donor: 'Donor',
    },
    requests: {
      title: 'Blood requests',
      sub: 'Track active needs with filters and send a donor response to the right request.',
      filters: 'Filters',
      bloodType: 'Blood type',
      city: 'City',
      urgency: 'Urgency',
      all: 'All',
      urgent: 'Urgent',
      normal: 'Normal',
      reset: 'Reset',
      loading: 'Loading requests...',
      empty: 'No matching blood requests found.',
      error: 'Could not load requests.',
      donorButton: 'Become a donor',
      loginToRespond: 'Log in to respond',
      responseSuccess: 'Your offer was sent.',
      responseError: 'Could not send your offer.',
      phone: 'Contact',
      units: 'units',
      hospital: 'Hospital',
      call: 'Call',
    },
    createRequest: {
      badge: 'New request',
      title: 'Create a blood need',
      sub: 'Fill in the form and send a request to the active donor network.',
      patientName: 'Patient name',
      bloodType: 'Blood type',
      hospital: 'Hospital',
      city: 'City',
      unitsNeeded: 'Units needed',
      urgency: 'Urgency',
      urgent: 'Urgent',
      normal: 'Normal',
      contactPhone: 'Contact phone',
      note: 'Note',
      submit: 'Create request',
      loading: 'Creating...',
      error: 'Could not create the request.',
      select: 'Select...',
    },
    dashboard: {
      title: 'Profile and my requests',
      sub: 'Update your details and manage the requests you created.',
      profile: 'Profile details',
      requests: 'My requests',
      logout: 'Log out',
      save: 'Save changes',
      saving: 'Saving...',
      loading: 'Loading profile...',
      loadingRequests: 'Loading requests...',
      noRequests: 'You have not created any requests yet.',
      error: 'Could not load your data.',
      saveError: 'Could not update the profile.',
      deleteError: 'Could not delete the request.',
      fullName: 'Full name',
      bloodType: 'Blood type',
      city: 'City',
      phone: 'Phone',
      lastDonation: 'Last donation date',
      bio: 'Bio',
      available: 'Available for donation',
      status: 'Status',
      active: 'Active',
      fulfilled: 'Fulfilled',
      cancelled: 'Cancelled',
      delete: 'Delete',
      hospital: 'Hospital',
      units: 'units',
      urgency: 'Urgency',
      requestsCount: (n) => `${n} requests`,
    },
  },
};

// Landing səhifəsindəki qan-qrupu uyğunluq cədvəli də bura köçürüldü ki,
// tərcümə açarlarına (t.blood.all və s.) birbaşa əlçatan olsun.
export function bloodCompatibility(t) {
  return [
    { type: 'A+', gives: ['A+', 'AB+'], receives: ['A+', 'A-', 'O+', 'O-'] },
    { type: 'A-', gives: ['A+', 'A-', 'AB+', 'AB-'], receives: ['A-', 'O-'] },
    { type: 'B+', gives: ['B+', 'AB+'], receives: ['B+', 'B-', 'O+', 'O-'] },
    { type: 'B-', gives: ['B+', 'B-', 'AB+', 'AB-'], receives: ['B-', 'O-'] },
    { type: 'O+', gives: ['O+', 'A+', 'B+', 'AB+'], receives: ['O+', 'O-'] },
    { type: 'O-', gives: [t.blood.all], receives: ['O-'], tag: t.blood.uDonor },
    { type: 'AB+', gives: ['AB+'], receives: [t.blood.allFrom], tag: t.blood.uReceiver },
    { type: 'AB-', gives: ['AB+', 'AB-'], receives: ['AB-', 'A-', 'B-', 'O-'] },
  ];
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('az');

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored === 'az' || stored === 'en') setLang(stored);
  }, []);

  function toggle() {
    setLang((prev) => {
      const next = prev === 'az' ? 'en' : 'az';
      localStorage.setItem('lang', next);
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
