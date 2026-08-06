import { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import Navbar from '../components/Navbar'
import './DonorsPage.css'

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki']
const API_BASE = 'http://localhost:5000'

export default function DonorsPage() {
  const [donors, setDonors]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [bloodType, setBloodType]   = useState('')
  const [city, setCity]             = useState('')
  const [onlyAvail, setOnlyAvail]   = useState(true)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { t } = useLanguage()

  useEffect(() => {
    fetchDonors()
  }, [bloodType, city, onlyAvail, page])

  async function fetchDonors() {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ page, limit: 12 })
      if (bloodType) params.append('blood_type', bloodType)
      if (city)      params.append('city', city)
      if (onlyAvail) params.append('is_available', 1)

      const res  = await fetch(API_BASE + '/api/donors?' + params.toString())
      const data = await res.json()
      setDonors(data.donors || [])
      setTotalPages(Math.max(data.pagination ? data.pagination.total_pages : 1, 1))
    } catch (err) {
      setError('Donorlar yuklenirken xeta bas verdi.')
    } finally {
      setLoading(false)
    }
  }

  function resetFilters() {
    setBloodType('')
    setCity('')
    setOnlyAvail(true)
    setPage(1)
  }

  return (
    <div className="donors-page">
      <Navbar />
      <div className="container">

        <div className="page-header">
          <h1 className="page-title">Donor Kataloqu</h1>
          <p className="page-sub">Qan qrupuna ve sehere gore aktiv donorlari tapin</p>
        </div>

        <div className="filter-bar">
          <select value={bloodType} onChange={function(e) { setBloodType(e.target.value); setPage(1) }}>
            <option value="">Butun qan qruplari</option>
            {BLOOD_TYPES.map(function(b) { return <option key={b} value={b}>{b}</option> })}
          </select>

          <select value={city} onChange={function(e) { setCity(e.target.value); setPage(1) }}>
            <option value="">Butun seherler</option>
            {CITIES.map(function(c) { return <option key={c} value={c}>{c}</option> })}
          </select>

          <label className="avail-toggle">
            <input
              type="checkbox"
              checked={onlyAvail}
              onChange={function(e) { setOnlyAvail(e.target.checked); setPage(1) }}
            />
            Yalniz aktiv donorlar
          </label>

          <button className="btn-outline reset-btn" onClick={resetFilters}>
            Sifirla
          </button>
        </div>

        {loading && <div className="state-msg">Yuklenir...</div>}
        {error && <div className="state-msg error">{error}</div>}

        {!loading && !error && donors.length === 0 && (
          <div className="state-msg">Axtarisa uygun donor tapilmadi.</div>
        )}

        {!loading && donors.length > 0 && (
          <div>
            <div className="donors-grid">
              {donors.map(function(d) {
                return (
                  <div key={d.id} className="donor-card">
                    <div className="card-top">
                      <div className="blood-badge">{d.blood_type || '?'}</div>
                      <span className={d.is_available ? 'status-tag active' : 'status-tag inactive'}>
                        {d.is_available ? 'Aktiv' : 'Passiv'}
                      </span>
                    </div>
                    <h3 className="donor-name">{d.full_name || 'Donor'}</h3>
                    <div className="donor-info">
                      <span>{d.city || '--'}</span>
                      <span>Son donorluq: {d.last_donation_date || 'Melumat yoxdur'}</span>
                    </div>
                    {d.bio && (
                      <p className="donor-bio">{d.bio}</p>
                    )}
                    {d.phone && (
                      <div className="card-actions">
                        <a href={'tel:' + d.phone} className="btn-call">Zeng Et</a>
                        <a
                          href={'https://wa.me/' + d.phone.replace(/\D/g, '')}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-whatsapp"
                        >
                          WhatsApp
                        </a>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 1}
                  onClick={function() { setPage(function(p) { return p - 1 }) }}
                >
                  Evvelki
                </button>
                <span>{page} / {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={function() { setPage(function(p) { return p + 1 }) }}
                >
                  Novbeti
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
