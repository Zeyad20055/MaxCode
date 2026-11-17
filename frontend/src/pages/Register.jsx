import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import api from '../services/api';

export default function Register() {
  const { courseId } = useParams();
  const { t } = useTranslation();
  const [form, setForm] = useState({ fullName:'', phone:'', whatsapp:'', email:'', age:'', university:'', experience:'none', notes:'' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const update = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post(`/registrations/course/${courseId}`, form);
      setResult(data.data);
    } catch (err) { setError(err.response?.data?.message || t('error')); }
    finally { setBusy(false); }
  }
  return <><Header/><main className="form-page"><div className="form-shell">
    {result ? <div className="success-panel"><span className="success-icon"><CheckCircle2 size={42}/></span><h1>{t('success')}</h1><h2>{t('welcome')}</h2><p>{result.registrationCode}</p>
      {result.whatsappGroupLink ? <a className="btn btn-whatsapp" href={result.whatsappGroupLink} target="_blank" rel="noreferrer"><MessageCircle/>{t('joinGroup')}</a> : <p>{t('noGroup')}</p>}
      <Link className="back-link" to="/">{t('back')}</Link>
    </div> : <><Link to="/" className="back-link"><ArrowRight size={17}/>{t('back')}</Link><span className="section-kicker">JOIN MAX CODE</span><h1>{t('register')}</h1>
      <form className="registration-form" onSubmit={submit}>
        <label>{t('name')}<input name="fullName" value={form.fullName} onChange={update} required minLength="3" maxLength="120" autoComplete="name"/></label>
        <label>{t('phone')}<input name="phone" value={form.phone} onChange={update} required type="tel" maxLength="20" autoComplete="tel"/></label>
        <label>{t('whatsapp')}<input name="whatsapp" value={form.whatsapp} onChange={update} required type="tel" maxLength="20"/></label>
        <label>{t('email')}<input name="email" value={form.email} onChange={update} required type="email" maxLength="254" autoComplete="email"/></label>
        <label>{t('age')}<input name="age" value={form.age} onChange={update} type="number" min="10" max="100" step="1"/></label>
        <label>{t('university')}<input name="university" value={form.university} onChange={update} maxLength="160"/></label>
        <label>{t('experience')}<select name="experience" value={form.experience} onChange={update}><option value="none">{t('none')}</option><option value="beginner">{t('beginner')}</option><option value="intermediate">{t('intermediate')}</option><option value="advanced">{t('advanced')}</option></select></label>
        <label className="full-field">{t('notes')}<textarea name="notes" value={form.notes} onChange={update} rows="3" maxLength="1000"/></label>
        {error && <p className="form-error full-field">{error}</p>}
        <button className="btn btn-blue full-field" disabled={busy}>{busy ? '...' : t('submit')}</button>
      </form>
    </>}
  </div></main></>;
}
