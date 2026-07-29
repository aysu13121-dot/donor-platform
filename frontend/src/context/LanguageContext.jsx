import { createContext, useContext, useState } from 'react'

const T = {
  az: {
    nav: {
      home: 'Ana Səhifə', how: 'Necə İşləyir', types: 'Qan Qrupları',
      login: 'Daxil ol', register: 'Qeydiyyat', logout: 'Çıxış',
    },
    hero: {
      eyebrow: 'Azərbaycanın donor şəbəkəsi',
      h1: 'Bir damcı qan,', h1em: 'bir həyat.',
      sub: 'Regional Qan Donoru Sistemi vasitəsilə ən yaxın donoru tapın və ya özünüz donor olaraq həyat xilas edin.',
      cta1: '🩸 Donor ol', cta2: 'Qan qrupu tap',
    },
    stats: [
      { num: '2,400+', label: 'Qeydiyyatlı donor' },
      { num: '8',      label: 'Qan qrupu' },
      { num: '15+',    label: 'Şəhər' },
    ],
    how: {
      title: 'Necə işləyir?', sub: 'Üç addımda donorluq prosesini başlat',
      steps: [
        { num: '01', title: 'Qeydiyyatdan keç', desc: 'Adınızı, qan qrupunuzu və əlaqə məlumatlarınızı daxil edin.' },
        { num: '02', title: 'Profil yarat',      desc: 'Şəhərinizi və donor olmağa hazır olduğunuzu bildirin.' },
        { num: '03', title: 'Həyat xilas et',    desc: 'Ehtiyacı olan xəstələr sizi tapa bilər. Siz də donor tapa bilərsiniz.' },
      ],
    },
    blood: {
      title: 'Qan qrupları', sub: 'Hər qan qrupu kimin üçün donor ola bilər?',
      gives: 'Verir', receives: 'Alır',
      all: 'Hamısına', allFrom: 'Hamısından',
      uDonor: 'Universal donor', uReceiver: 'Universal alıcı',
    },
    cta: { title: 'Bugün donor olun', sub: 'Hər 3 aydan bir — bir saatınız, bir həyat deməkdir.', btn: 'İndi başla →' },
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
      btn: '🩸 Qeydiyyatdan keç', loading: 'Gözləyin...',
      switch: 'Artıq hesabınız var?', switchLink: 'Daxil olun',
      serverErr: 'Server ilə əlaqə qurmaq mümkün olmadı.',
    },
  },
  en: {
    nav: {
      home: 'Home', how: 'How It Works', types: 'Blood Types',
      login: 'Log in', register: 'Register', logout: 'Log out',
    },
    hero: {
      eyebrow: "Azerbaijan's donor network",
      h1: 'One drop of blood,', h1em: 'one life.',
      sub: 'Find the nearest donor through the Regional Blood Donor System, or save a life by becoming a donor yourself.',
      cta1: '🩸 Become a donor', cta2: 'Find blood type',
    },
    stats: [
      { num: '2,400+', label: 'Registered donors' },
      { num: '8',      label: 'Blood types' },
      { num: '15+',    label: 'Cities' },
    ],
    how: {
      title: 'How does it work?', sub: 'Start the donation process in three steps',
      steps: [
        { num: '01', title: 'Register',         desc: 'Enter your name, blood type, and contact information.' },
        { num: '02', title: 'Create a profile', desc: 'Indicate your city and readiness to donate.' },
        { num: '03', title: 'Save a life',      desc: 'Patients in need can find you. You can also find a donor.' },
      ],
    },
    blood: {
      title: 'Blood types', sub: 'Which blood type can donate to whom?',
      gives: 'Donates to', receives: 'Receives from',
      all: 'Everyone', allFrom: 'Everyone',
      uDonor: 'Universal donor', uReceiver: 'Universal receiver',
    },
    cta: { title: 'Become a donor today', sub: 'Once every 3 months — one hour of your time means one life.', btn: 'Start now →' },
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
      btn: '🩸 Register', loading: 'Please wait...',
      switch: 'Already have an account?', switchLink: 'Log in',
      serverErr: 'Could not connect to the server.',
    },
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('az')
  return (
    <LanguageContext.Provider value={{ lang, t: T[lang], toggle: () => setLang(l => l === 'az' ? 'en' : 'az') }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
