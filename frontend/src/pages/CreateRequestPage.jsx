import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useLanguage } from '../context/LanguageContext'
import './AuthPage.css'
import './CreateRequestPage.css'

const API_BASE = 'http://localhost:5000'
const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']
const CITIES = ['Bakı', 'Gəncə', 'Sumqayıt', 'Mingəçevir', 'Naxçıvan', 'Şirvan', 'Lənkəran', 'Şəki']

const COPY = {
  az: {
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
  },
  en: {
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
  },
}

export default function CreateRequestPage() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const strings = COPY[lang]

  const [form, setForm] = useState({
    patient_name: '',
    blood_type: '',
    hospital: '',
    city: '',
    units_needed: 1,
    urgency: 'Urgent',
    contact_phone: '',
    note: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      const res = await fetch(API_BASE + '/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          ...form,
          units_needed: Number(form.units_needed) || 1,
          note: form.note.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || strings.error)
      }

      navigate('/requests')
    } catch (err) {
      setError(err.message || strings.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-request-page">
      <Navbar />
      <main className="create-request-shell">
        <div className="container create-request-container">
          <section className="auth-card auth-card--wide create-request-card">
            <span className="create-request-badge">{strings.badge}</span>
            <h1 className="auth-title">{strings.title}</h1>
            <p className="auth-sub">{strings.sub}</p>

            {error && <div className="auth-error">{error}</div>}

            <form className="auth-form auth-form--grid" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="patient_name">{strings.patientName}</label>
                <input id="patient_name" name="patient_name" value={form.patient_name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="blood_type">{strings.bloodType}</label>
                <select id="blood_type" name="blood_type" value={form.blood_type} onChange={handleChange} required>
                  <option value="">{strings.bloodType}</option>
                  {BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="hospital">{strings.hospital}</label>
                <input id="hospital" name="hospital" value={form.hospital} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="city">{strings.city}</label>
                <select id="city" name="city" value={form.city} onChange={handleChange} required>
                  <option value="">{strings.city}</option>
                  {CITIES.map(item => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="units_needed">{strings.unitsNeeded}</label>
                <input
                  id="units_needed"
                  name="units_needed"
                  type="number"
                  min="1"
                  value={form.units_needed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="urgency">{strings.urgency}</label>
                <select id="urgency" name="urgency" value={form.urgency} onChange={handleChange} required>
                  <option value="Urgent">{strings.urgent}</option>
                  <option value="Normal">{strings.normal}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="contact_phone">{strings.contactPhone}</label>
                <input id="contact_phone" name="contact_phone" value={form.contact_phone} onChange={handleChange} required />
              </div>

              <div className="form-group create-request-note">
                <label htmlFor="note">{strings.note}</label>
                <textarea id="note" name="note" rows="4" value={form.note} onChange={handleChange} />
              </div>

              <button type="submit" className="btn-primary auth-submit auth-submit--full" disabled={loading}>
                {loading ? strings.loading : strings.submit}
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
