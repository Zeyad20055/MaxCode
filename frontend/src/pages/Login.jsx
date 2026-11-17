import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Code2, Globe2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

export default function Login() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  function toggleLanguage(){ const next=lang==='ar'?'en':'ar'; i18n.changeLanguage(next); localStorage.setItem('maxcode_lang',next); document.documentElement.dir=next==='ar'?'rtl':'ltr'; document.documentElement.lang=next; }
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('maxcode_token', data.data.token);
      localStorage.setItem('maxcode_user', JSON.stringify(data.data.user));
      navigate(data.data.user.role === 'student' ? '/' : '/admin');
    } catch (err) { setError(err.response?.data?.message || t('error')); }
    finally { setBusy(false); }
  }
  return <main className="login-page"><div className="login-card"><button className="lang-btn login-lang" onClick={toggleLanguage}><Globe2 size={16}/>{t('language')}</button><Link to="/" className="brand"><span className="brand-mark"><Code2/></span><span>MAX <b>CODE</b><small>ACADEMY PORTAL</small></span></Link><h1>{t('login')}</h1><p>{t('adminAccess')}</p><form onSubmit={submit}><label>{t('emailLabel')}<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>{t('passwordLabel')}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>{error && <p className="form-error">{error}</p>}<button className="btn btn-blue" disabled={busy}>{busy ? '...' : t('login')}</button></form></div></main>;
}
