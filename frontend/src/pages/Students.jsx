import { useEffect, useState } from 'react';
import { ArrowLeft, Users, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import api from '../services/api';
import './StudentDirectory.css';

export default function Students() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/students/directory/groups').then(({data})=>setGroups(data.data)).catch(()=>setGroups([])).finally(()=>setLoading(false)); }, []);
  return <><Header/><main className="directory-page"><div className="container">
    <Link to="/#home" className="back-link"><ArrowLeft size={17}/>{t('navHome')}</Link>
    <div className="directory-heading"><span className="section-kicker">MAX CODE COMMUNITY</span><h1>{lang==='ar'?'طلابنا ومجموعاتهم':'Our Students & Groups'}</h1><p>{lang==='ar'?'تعرّف على مجموعاتنا وطلاب الأكاديمية':'Meet our learning groups and academy students'}</p></div>
    {loading?<div className="empty-state">{t('loading')}</div>:groups.length?<div className="group-directory-grid">{groups.map(group=><Link className="group-directory-card" to={`/students/${group._id}`} key={group._id}><span className="group-directory-icon"><GraduationCap size={25}/></span><div><h2>{group.name}</h2><p>{group.course?.name?.[lang]||group.course?.name?.ar}</p></div>{group.showStudentCount&&<span className="group-directory-count"><Users size={16}/>{group.studentCount} {lang==='ar'?'طلاب':'students'}</span>}</Link>)}</div>:<div className="empty-state"><Users size={30}/><p>{lang==='ar'?'لا توجد مجموعات منشورة حاليًا.':'No groups are published yet.'}</p></div>}
  </div></main></>;
}
