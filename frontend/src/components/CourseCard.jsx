import { ArrowUpLeft, Clock3, GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  return <article className="course-card">
    <div className="course-art">
      {course.imageUrl ? <img src={course.imageUrl} alt={course.name?.[lang]} /> :
        <div className="code-art"><span>&lt;/&gt;</span><small>MAX CODE</small></div>}
      <span className="course-level">{course.level?.[lang] || (lang === 'ar' ? 'متاح الآن' : 'Available')}</span>
    </div>
    <div className="course-content">
      <h3>{course.name?.[lang] || course.name?.ar}</h3>
      <p>{course.shortDescription?.[lang] || course.shortDescription?.ar}</p>
      <div className="course-meta">
        <span><Clock3 size={15}/>{course.duration?.[lang] || '—'}</span>
        <span><GraduationCap size={15}/>{course.instructorName || 'MAX CODE'}</span>
      </div>
      <div className="course-bottom"><strong>{course.price ? `${course.price.toLocaleString()} EGP` : (lang === 'ar' ? 'تواصل لمعرفة السعر' : 'Contact for price')}</strong>
        <Link to={`/courses/${course.slug}`} className="text-link">{t('details')} <ArrowUpLeft size={16}/></Link>
      </div>
    </div>
  </article>;
}
