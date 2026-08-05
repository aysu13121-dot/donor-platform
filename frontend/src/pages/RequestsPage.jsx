import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import './RequestsPage.css'

const API_BASE = 'http://localhost:5000'
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki']

const COPY = {
  az: {
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
    cityLabel: 'Şəhər',
  },
  en: {
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
    cityLabel: 'City',
  },
}

export default function RequestsPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const strings = COPY[lang]

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [bloodType, setBloodType] = useState('')
  const [city, setCity] = useState('')
  const [urgency, setUrgency] = useState('')
  const [sendingId, setSendingId] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [bloodType, city, urgency])

  async function fetchRequests() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ status: 'active' })
      if (bloodType) params.append('blood_type', bloodType)
      if (city) params.append('city', city)
      if (urgency) params.append('urgency', urgency)

      const res = await fetch(API_BASE + '/api/requests?' + params.toString())
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || strings.error)
      }
      setRequests(data.requests || [])
    } catch (err) {
      setError(err.message || strings.error)
    } finally {
      setLoading(false)
    }
  }

  function resetFilters() {
    setBloodType('')
    setCity('')
    setUrgency('')
  }

  async function handleRespond(requestId) {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setSendingId(requestId)
    setError('')
    setNotice('')
    try {
      const res = await fetch(`${API_BASE}/api/requests/${requestId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({ message: 'Mən bu sorğu üçün kömək etməyə hazıram.' }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || strings.responseError)
      }
      setNotice(data.message || strings.responseSuccess)
    } catch (err) {
      setError(err.message || strings.responseError)
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="requests-page">
      <Navbar />
      <main className="requests-shell container">
        <header className="requests-hero">
          <span className="requests-hero__eyebrow">{strings.filters}</span>
          <h1 className="requests-hero__title">{strings.title}</h1>
          <p className="requests-hero__sub">{strings.sub}</p>
        </header>

        <section className="requests-filters" aria-label={strings.filters}>
          <select value={bloodType} onChange={e => setBloodType(e.target.value)}>
            <option value="">{strings.bloodType}: {strings.all}</option>
            {BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          <select value={city} onChange={e => setCity(e.target.value)}>
            <option value="">{strings.city}: {strings.all}</option>
            {CITIES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>

          <select value={urgency} onChange={e => setUrgency(e.target.value)}>
            <option value="">{strings.urgency}: {strings.all}</option>
            <option value="Urgent">{strings.urgent}</option>
            <option value="Normal">{strings.normal}</option>
          </select>

          <button type="button" className="btn-outline requests-filters__reset" onClick={resetFilters}>
            {strings.reset}
          </button>
        </section>

        {notice && <div className="requests-alert requests-alert--success">{notice}</div>}
        {error && <div className="requests-alert requests-alert--error">{error}</div>}

        {loading && <div className="requests-state">{strings.loading}</div>}

        {!loading && !error && requests.length === 0 && (
          <div className="requests-state">{strings.empty}</div>
        )}

        {!loading && requests.length > 0 && (
          <section className="requests-grid">
            {requests.map(request => {
              const phone = request.contact_phone || ''
              const digits = phone.replace(/\D/g, '')
              const token = localStorage.getItem('token')

              return (
                <article key={request.id} className="request-card">
                  <div className="request-card__top">
                    <span className="request-blood">{request.blood_type || '?'}</span>
                    <span className={request.urgency === 'Urgent' ? 'request-tag request-tag--urgent' : 'request-tag request-tag--normal'}>
                      {request.urgency || strings.normal}
                    </span>
                  </div>

                  <h2 className="request-title">{request.patient_name}</h2>
                  <div className="request-meta">
                    <span>{strings.hospital}: {request.hospital}</span>
                    <span>{strings.cityLabel}: {request.city}</span>
                    <span>{request.units_needed} {strings.units}</span>
                    {request.note && <span className="request-note">{request.note}</span>}
                  </div>

                  <p className="request-contact">{strings.phone}: {phone || '--'}</p>

                  <div className="request-actions">
                    {phone ? <a href={`tel:${phone}`} className="btn-outline request-actions__link">Call</a> : <span className="request-actions__link request-actions__link--muted">Call</span>}
                    {digits ? (
                      <a href={`https://wa.me/${digits}`} target="_blank" rel="noreferrer" className="btn-primary request-actions__link request-actions__link--whatsapp">WhatsApp</a>
                    ) : (
                      <span className="request-actions__link request-actions__link--muted">WhatsApp</span>
                    )}
                    <button
                      type="button"
                      className="btn-primary request-actions__button"
                      onClick={() => handleRespond(request.id)}
                      disabled={sendingId === request.id}
                    >
                      {token ? (sendingId === request.id ? strings.loading : strings.donorButton) : strings.loginToRespond}
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </main>
    </div>
  )
}
