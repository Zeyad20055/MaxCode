import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpLeft, BadgeCheck, BookOpen, Code2, Headset, Rocket, Users, Trophy, MessageCircle, Facebook, Link2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import api from '../services/api';
import './Home.css';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [contactLinks, setContactLinks] = useState({ whatsapp:'', facebook:'', portfolio:'' });
  const [loading, setLoading] = useState(true);
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  useEffect(() => {
    api.get('/courses').then(r => setCourses(r.data.data)).catch(() => setCourses([])).finally(() => setLoading(false));
  }, []);
  useEffect(() => { api.get('/site-settings/public').then(r => setContactLinks(r.data.data)).catch(() => {}); }, []);
  const features = [
    [Rocket, t('fromZero')], [BookOpen, t('practical')], [Code2, t('projects')],
    [Headset, t('followup')], [BadgeCheck, t('evaluation')], [Users, t('community')]
  ];
  return <>
    <Header/>
    <main>
      <section className="hero" id="home">
        <div className="hero-grid container">
          <div className="hero-copy">
            <span className="eyebrow"><span/> {t('heroEyebrow')}</span>
            <h1>{t('heroTitle')} <em>MAX CODE</em></h1>
            <p>{t('heroText')}</p>
            <div className="hero-actions">
              <a href="#courses" className="btn btn-gold">{t('explore')} <ArrowUpLeft size={18}/></a>
              <a href="#about" className="btn btn-outline">{t('join')}</a>
            </div>
            <div className="hero-proof"><span><BadgeCheck size={17}/></span>{lang === 'ar' ? 'تعليم عملي • متابعة • مشاريع' : 'Practical learning • Mentorship • Projects'}</div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="visual-window"><div className="window-top"><i/><i/><i/><span>max-code.dev</span></div>
              <div className="window-code"><small>01&nbsp; const future =</small><strong>“YOUR CODE”;</strong><small>02&nbsp; buildSkills(future);</small><b>03&nbsp; launchCareer();</b><span className="cursor">_</span></div>
            </div>
            <div className="float-chip chip-html">HTML5</div><div className="float-chip chip-js">JS</div><div className="float-chip chip-css">CSS3</div>
            <div className="visual-caption"><Code2 size={19}/><span>Build your future<br/><b>one line at a time.</b></span></div>
          </div>
        </div>
        <div className="hero-bottom container"><span>01 / LEARN</span><span>02 / BUILD</span><span>03 / GROW</span></div>
      </section>

      <section className="section features-section">
        <div className="container">
          <div className="section-heading"><span className="section-kicker">THE MAX CODE WAY</span><h2>{t('why')}</h2><p>{lang === 'ar' ? 'تجربة تعليمية مصممة علشان تنقلك من المعرفة للتطبيق.' : 'A learning experience designed to turn knowledge into real skills.'}</p></div>
          <div className="feature-grid">{features.map(([Icon, title], i) => <div className="feature-card" key={title}><span className="feature-icon"><Icon size={23}/></span><b>{title}</b><small>0{i+1}</small></div>)}</div>
        </div>
      </section>

      <section className="section about-section" id="about"><div className="container about-grid">
        <div className="about-graphic"><div className="about-logo"><Code2 size={42}/><b>MAX<br/>CODE</b></div><span className="about-orbit"></span><small>LEARN. BUILD. GROW.</small></div>
        <div className="about-copy"><span className="section-kicker">OUR STORY</span><h2>{t('aboutTitle')}</h2><p>{t('aboutText')}</p>
          <div className="about-points"><span><BadgeCheck/> {lang === 'ar' ? 'تعلم قائم على التطبيق' : 'Learning by doing'}</span><span><BadgeCheck/> {lang === 'ar' ? 'خطوات واضحة من البداية' : 'A clear path from day one'}</span></div>
        </div>
      </div></section>

      <section className="section courses-section" id="courses"><div className="container">
        <div className="section-heading row-heading"><div><span className="section-kicker">CHOOSE YOUR PATH</span><h2>{t('coursesTitle')}</h2><p>{t('coursesText')}</p></div><span className="course-count">{String(courses.length).padStart(2,'0')} COURSES</span></div>
        {loading ? <div className="empty-state">{t('loading')}</div> : courses.length ? <div className="course-grid">{courses.map(course => <CourseCard key={course._id} course={course}/>)}</div> : <div className="empty-state"><Code2 size={30}/><p>{t('noCourses')}</p></div>}
      </div></section>

      <section className="contact-strip" id="contact"><div className="container contact-inner"><div><span className="section-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2>{t('contactTitle')}</h2><p>{lang==='ar'?'تابعنا أو تواصل معنا من خلال الروابط التالية':'Follow or contact us through these links'}</p></div><div className="contact-socials">
        <ContactLink Icon={MessageCircle} label="WhatsApp" href={contactLinks.whatsapp} />
        <ContactLink Icon={Facebook} label="Facebook" href={contactLinks.facebook} />
        <ContactLink Icon={Link2} label={lang==='ar'?'البورتفوليو':'Portfolio'} href={contactLinks.portfolio} />
      </div></div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><Link to="/" className="brand footer-brand"><span className="brand-mark"><Code2/></span><span>MAX <b>CODE</b><small>LEARN • BUILD • GROW</small></span></Link><p>{t('footer')}</p></div></footer>
  </>;
}

function ContactLink({ Icon, label, href }) {
  const content=<><span className="contact-social-icon"><Icon size={22}/></span><b>{label}</b></>;
  return href
    ? <a className="contact-social" href={href} target="_blank" rel="noopener noreferrer">{content}</a>
    : <span className="contact-social contact-social-disabled" title="Add this link in admin settings">{content}</span>;
}
