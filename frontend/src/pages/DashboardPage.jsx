import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import './AuthPage.css'
import './DashboardPage.css'

const API_BASE = 'http://localhost:5000'
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki']

const COPY = {
  az: {
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
  },
  en: {
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
  },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const strings = COPY[lang]

  const [user, setUser] = useState(null)
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)
  const [form, setForm] = useState({
    full_name: '',
    blood_type: '',
    city: '',
    phone: '',
    last_donation_date: '',
    bio: '',
    is_available: true,
  })

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setLoading(true)
    setRequestsLoading(true)
    setError('')
    setRequestError('')

    try {
      const profileRes = await fetch(API_BASE + '/api/me', {
        headers: { Authorization: 'Bearer ' + token },
      })
      const profileData = await profileRes.json()
      if (!profileRes.ok) {
        throw new Error(profileData.error || strings.error)
      }

      const loadedUser = profileData.user
      setUser(loadedUser)
      setForm({
        full_name: loadedUser.full_name || '',
        blood_type: loadedUser.blood_type || '',
        city: loadedUser.city || '',
        phone: loadedUser.phone || '',
        last_donation_date: loadedUser.last_donation_date || '',
        bio: loadedUser.bio || '',
        is_available: Boolean(loadedUser.is_available),
      })

      const requestsRes = await fetch(`${API_BASE}/api/requests?status=all&user_id=${loadedUser.id}`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      const requestsData = await requestsRes.json()
      if (!requestsRes.ok) {
        throw new Error(requestsData.error || strings.error)
      }
      setRequests(requestsData.requests || [])
    } catch (err) {
      setError(err.message || strings.error)
      if (err.message && err.message.toLowerCase().includes('token')) {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        navigate('/login')
      }
    } finally {
      setLoading(false)
      setRequestsLoading(false)
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSave(event) {
    event.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setSaving(true)
    setError('')
    try {
      const res = await fetch(API_BASE + '/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          blood_type: form.blood_type,
          city: form.city,
          phone: form.phone,
          last_donation_date: form.last_donation_date || null,
          bio: form.bio || null,
          is_available: form.is_available ? 1 : 0,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || strings.saveError)
      }

      const updatedUser = data.user || {}
      setUser(updatedUser)
      localStorage.setItem('userName', updatedUser.full_name || updatedUser.email || 'Donor')
    } catch (err) {
      setError(err.message || strings.saveError)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(requestId) {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setDeleteLoadingId(requestId)
    setRequestError('')
    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || strings.deleteError)
      }

      setRequests(prev => prev.filter(item => item.id !== requestId))
    } catch (err) {
      setRequestError(err.message || strings.deleteError)
    } finally {
      setDeleteLoadingId(null)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/')
  }

  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="dashboard-shell container">
        <header className="dashboard-hero">
          <div>
            <span className="dashboard-hero__eyebrow">{strings.profile}</span>
            <h1 className="dashboard-hero__title">{strings.title}</h1>
            <p className="dashboard-hero__sub">{strings.sub}</p>
          </div>
          <button type="button" className="btn-outline dashboard-logout" onClick={handleLogout}>
            {strings.logout}
          </button>
        </header>

        {error && <div className="dashboard-alert dashboard-alert--error">{error}</div>}
        {requestError && <div className="dashboard-alert dashboard-alert--error">{requestError}</div>}

        <section className="dashboard-grid">
          <article className="auth-card auth-card--wide dashboard-card">
            <h2 className="auth-title">{strings.profile}</h2>
            <p className="auth-sub">{user?.email || ''}</p>

            {loading ? (
              <div className="dashboard-state">{strings.loading}</div>
            ) : (
              <form className="auth-form auth-form--grid dashboard-form" onSubmit={handleSave}>
                <div className="form-group">
                  <label htmlFor="full_name">{strings.fullName}</label>
                  <input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="blood_type">{strings.bloodType}</label>
                  <select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange}>
                    <option value="">{strings.bloodType}</option>
                    {BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">{strings.city}</label>
                  <select id="city" name="city" value={form.city} onChange={handleChange}>
                    <option value="">{strings.city}</option>
                    {CITIES.map(item => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{strings.phone}</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label htmlFor="last_donation_date">{strings.lastDonation}</label>
                  <input id="last_donation_date" name="last_donation_date" type="date" value={form.last_donation_date || ''} onChange={handleChange} />
                </div>

                <div className="form-group dashboard-toggle">
                  <label htmlFor="is_available">{strings.available}</label>
                  <label className="dashboard-switch">
                    <input id="is_available" name="is_available" type="checkbox" checked={form.is_available} onChange={handleChange} />
                    <span>{form.is_available ? strings.active : strings.cancelled}</span>
                  </label>
                </div>

                <div className="form-group dashboard-bio">
                  <label htmlFor="bio">{strings.bio}</label>
                  <textarea id="bio" name="bio" rows="4" value={form.bio || ''} onChange={handleChange} />
                </div>

                <button type="submit" className="btn-primary auth-submit auth-submit--full" disabled={saving || loading}>
                  {saving ? strings.saving : strings.save}
                </button>
              </form>
            )}
          </article>

          <article className="auth-card auth-card--wide dashboard-card dashboard-card--requests">
            <h2 className="auth-title">{strings.requests}</h2>
            <p className="auth-sub">{requestsLoading ? strings.loadingRequests : `${requests.length} ${lang === 'az' ? 'sorğu' : 'requests'}`}</p>

            {requestsLoading ? (
              <div className="dashboard-state">{strings.loadingRequests}</div>
            ) : requests.length === 0 ? (
              <div className="dashboard-state">{strings.noRequests}</div>
            ) : (
              <div className="dashboard-requests">
                {requests.map(item => (
                  <article key={item.id} className="dashboard-request">
                    <div className="dashboard-request__top">
                      <span className="dashboard-request__blood">{item.blood_type}</span>
                      <span className={item.status === 'fulfilled' ? 'dashboard-status dashboard-status--fulfilled' : item.status === 'cancelled' ? 'dashboard-status dashboard-status--cancelled' : 'dashboard-status dashboard-status--active'}>
                        {item.status === 'fulfilled' ? strings.fulfilled : item.status === 'cancelled' ? strings.cancelled : strings.active}
                      </span>
                    </div>

                    <h3 className="dashboard-request__title">{item.patient_name}</h3>
                    <div className="dashboard-request__meta">
                      <span>{strings.hospital}: {item.hospital}</span>
                      <span>{strings.city}: {item.city}</span>
                      <span>{item.units_needed} {strings.units}</span>
                      <span>{strings.urgency}: {item.urgency}</span>
                    </div>

                    <button
                      type="button"
                      className="btn-outline dashboard-request__delete"
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoadingId === item.id}
                    >
                      {strings.delete}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  )
}
