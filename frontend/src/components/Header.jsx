import { Code2, Globe2, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function Header() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const lang = i18n.language;
  const switchLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    localStorage.setItem('maxcode_lang', next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
  };
  const links = [['#home', t('navHome')], ['#about', t('navAbout')], ['#courses', t('navCourses')], ['/students', t('navStudents'), true], ['#contact', t('navContact')]];
  return <header className="site-header">
    <div className="container nav-wrap">
      <Link to="/" className="brand"><span className="brand-mark"><Code2 size={23}/></span><span>MAX <b>CODE</b><small>LEARN • BUILD • GROW</small></span></Link>
      <nav className={open ? 'nav-links show' : 'nav-links'}>
        {links.map(([href, label, route]) => <Link key={href} to={route ? href : `/${href}`} onClick={() => setOpen(false)}>{label}</Link>)}
      </nav>
      <div className="nav-actions">
        <button className="lang-btn" onClick={switchLang}><Globe2 size={16}/>{lang === 'ar' ? 'English' : 'العربية'}</button>
        <button className="mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
  </header>;
}
