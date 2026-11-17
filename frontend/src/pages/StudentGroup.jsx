import { useEffect, useState } from 'react';
import { ArrowLeft, Award, CheckCircle2, XCircle, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import api from '../services/api';
import './StudentDirectory.css';

export default function StudentGroup() {
  const { groupId } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'ar';
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get(`/students/directory/groups/${groupId}`).then(({data})=>setGroup(data.data)).catch(()=>setGroup(null)).finally(()=>setLoading(false)); }, [groupId]);
  return <><Header/><main className="directory-page"><div className="container">
    <Link to="/students" className="back-link"><ArrowLeft size={17}/>{lang==='ar'?'كل المجموعات':'All groups'}</Link>
    {loading?<div className="empty-state">{t('loading')}</div>:!group?<div className="empty-state">{t('error')}</div>:<>
      <div className="directory-heading"><span className="section-kicker">{group.course?.name?.[lang]||group.course?.name?.ar}</span><h1>{group.name}</h1><p>{lang==='ar'?'طلاب المجموعة ومؤشرات الحضور ومتوسط الدرجات':'Group members, attendance, and grade averages'}</p>{group.showStudentCount&&<span className="group-member-pill"><Users size={15}/>{group.studentCount} {lang==='ar'?'طالب':'students'}</span>}</div>
      {!group.students.length?<div className="empty-state"><Users size={30}/><p>{lang==='ar'?'لا يوجد طلاب منشورون في هذه المجموعة بعد.':'No students are published in this group yet.'}</p></div>:<div className="public-student-grid">{group.students.map(student=><article className="public-student-card" key={student._id}>
        <div className="public-student-top">{group.showPhotos&&(student.photoUrl?<img className="public-student-photo" src={student.photoUrl} alt="" onError={e=>{e.currentTarget.style.display='none';}}/>:<span className="public-student-avatar">{student.fullName.trim().charAt(0)}</span>)}<div className="public-student-name"><small>{lang==='ar'?'طالب في المجموعة':'GROUP MEMBER'}</small><h2>{student.fullName}</h2></div>{group.showAverageGrade&&<div className="grade-badge"><Award size={17}/><b>{student.averageGradePercent}%</b><small>{lang==='ar'?'متوسط الدرجات':'Average grade'}</small></div>}</div>
        {(group.showAttendance||group.showAbsence)&&<div className={`student-metric-row ${group.showAttendance!==group.showAbsence?'single':''}`}>{group.showAttendance&&<div className="student-metric"><span><CheckCircle2 size={16}/>{lang==='ar'?'الحضور':'Attendance'}</span><b>{student.attendancePercent}%</b><div className="metric-track"><i style={{width:`${student.attendancePercent}%`}}/></div><small>{student.presentCount} {lang==='ar'?'مرات حضور':'present'}</small></div>}{group.showAbsence&&<div className="student-metric absence"><span><XCircle size={16}/>{lang==='ar'?'الغياب':'Absence'}</span><b>{student.absencePercent}%</b><div className="metric-track"><i style={{width:`${student.absencePercent}%`}}/></div><small>{student.absentCount} {lang==='ar'?'مرات غياب':'absent'}</small></div>}</div>}
      </article>)}</div>}
    </>}
  </div></main></>;
}
