import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Clock3, GraduationCap, Wallet } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import api from '../services/api';

export default function CourseDetails() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState('');
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  useEffect(() => { api.get(`/courses/${slug}`).then(r => setCourse(r.data.data)).catch(() => setError(t('error'))); }, [slug]);
  if (error) return <><Header/><div className="empty-state">{error}</div></>;
  if (!course) return <><Header/><div className="empty-state">{t('loading')}</div></>;
  const list = course.curriculum?.[lang] || [];
  return <><Header/><main className="details-page"><div className="container">
    <Link to="/#courses" className="back-link"><ArrowRight size={17}/>{t('back')}</Link>
    <div className="details-grid"><div className="details-art">{course.imageUrl ? <img src={course.imageUrl} alt=""/> : <div className="code-art"><span>&lt;/&gt;</span><small>MAX CODE</small></div>}</div>
      <div className="details-copy"><span className="section-kicker">MAX CODE COURSE</span><h1>{course.name?.[lang]}</h1><p>{course.description?.[lang] || course.shortDescription?.[lang]}</p>
        <div className="details-meta"><span><Clock3/>{t('duration')}: {course.duration?.[lang]}</span><span><GraduationCap/>{t('level')}: {course.level?.[lang]}</span><span><Wallet/>{t('price')}: {course.price} EGP</span></div>
        <Link className="btn btn-blue" to={`/courses/${course._id}/register`}>{t('register')} <ArrowRight size={18}/></Link>
      </div></div>
    {list.length > 0 && <div className="curriculum"><h2>{lang === 'ar' ? 'محتوى الكورس' : 'Curriculum'}</h2><div className="curriculum-grid">{list.map((item, i) => <div key={i}><CheckCircle2/>{item}</div>)}</div></div>}
  </div></main></>;
}
