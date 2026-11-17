import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: { translation: {
    navHome: 'الرئيسية', navAbout: 'من نحن', navCourses: 'الكورسات', navStudents: 'طلابنا', navContact: 'تواصل معنا',
    login: 'تسجيل الدخول', heroEyebrow: 'تعلم • ابنِ • انطلق', heroTitle: 'ابدأ رحلتك في عالم البرمجة مع',
    heroText: 'مش مجرد كورسات، إحنا بنساعدك تبني مستقبلك في عالم التكنولوجيا والبرمجة من الصفر، من خلال شرح عملي ومشاريع حقيقية ومتابعة مستمرة.',
    explore: 'اكتشف الكورسات', join: 'انضم للأكاديمية', why: 'لماذا تختار MAX CODE؟',
    fromZero: 'تعلم من الصفر', practical: 'شرح عملي', projects: 'مشاريع حقيقية',
    followup: 'متابعة مستمرة', evaluation: 'اختبارات وتقييمات', community: 'مجتمع تعليمي',
    aboutTitle: 'من نحن؟', aboutText: 'MAX CODE أكاديمية متخصصة في تعليم البرمجة والتكنولوجيا. هدفنا تقديم تجربة تعليمية عملية تساعد الطلاب على فهم البرمجة وتطوير مهاراتهم خطوة بخطوة.',
    coursesTitle: 'الكورسات المتاحة', coursesText: 'اختار المسار المناسب ليك وابدأ رحلتك.',
    duration: 'المدة', level: 'المستوى', price: 'السعر', details: 'التفاصيل', register: 'احجز مكانك الآن',
    contactTitle: 'خلينا نبدأ رحلتك', footer: '© MAX CODE ACADEMY. جميع الحقوق محفوظة.',
    loading: 'جاري تحميل الكورسات...', noCourses: 'لا توجد كورسات متاحة حالياً.',
    name: 'الاسم بالكامل', phone: 'رقم الهاتف', whatsapp: 'رقم واتساب', email: 'البريد الإلكتروني',
    age: 'السن (اختياري)', university: 'الجامعة / الكلية (اختياري)', experience: 'خبرتك في البرمجة',
    notes: 'ملاحظات إضافية', submit: 'إرسال التسجيل', none: 'بدون خبرة', beginner: 'مبتدئ',
    intermediate: 'متوسط', advanced: 'متقدم', success: 'تم تسجيل بياناتك بنجاح في MAX CODE!',
    welcome: 'أهلاً بيك في عائلة MAX CODE ❤️', joinGroup: 'انضم إلى جروب WhatsApp',
    noGroup: 'تم التسجيل بنجاح. سيتم التواصل معك بخصوص مجموعة الكورس.',
    back: 'العودة للكورسات', error: 'حصل خطأ، حاول مرة أخرى.', adminAccess: 'دخول المسؤولين', emailLabel: 'البريد الإلكتروني', passwordLabel: 'كلمة المرور', language: 'English'
  }},
  en: { translation: {
    navHome: 'Home', navAbout: 'About', navCourses: 'Courses', navStudents: 'Our Students', navContact: 'Contact',
    login: 'Login', heroEyebrow: 'Learn • Build • Grow', heroTitle: 'Start your coding journey with',
    heroText: 'More than courses. We help you build your future in technology from the ground up through practical learning, real projects, and continuous guidance.',
    explore: 'Explore Courses', join: 'Join the Academy', why: 'Why choose MAX CODE?',
    fromZero: 'Start from zero', practical: 'Practical learning', projects: 'Real projects',
    followup: 'Continuous support', evaluation: 'Assessments', community: 'Learning community',
    aboutTitle: 'Who are we?', aboutText: 'MAX CODE is an academy focused on programming and technology. We deliver practical learning that helps students understand programming and grow step by step.',
    coursesTitle: 'Available Courses', coursesText: 'Choose your path and start learning.',
    duration: 'Duration', level: 'Level', price: 'Price', details: 'Details', register: 'Register now',
    contactTitle: 'Let’s start your journey', footer: '© MAX CODE ACADEMY. All rights reserved.',
    loading: 'Loading courses...', noCourses: 'No courses are available right now.',
    name: 'Full name', phone: 'Phone number', whatsapp: 'WhatsApp number', email: 'Email address',
    age: 'Age (optional)', university: 'University / Faculty (optional)', experience: 'Programming experience',
    notes: 'Additional notes', submit: 'Submit registration', none: 'No experience', beginner: 'Beginner',
    intermediate: 'Intermediate', advanced: 'Advanced', success: 'Your registration was successful!',
    welcome: 'Welcome to the MAX CODE family ❤️', joinGroup: 'Join WhatsApp Group',
    noGroup: 'Registered successfully. We will contact you about the course group.',
    back: 'Back to courses', error: 'Something went wrong. Please try again.', adminAccess: 'Administrator access', emailLabel: 'Email address', passwordLabel: 'Password', language: 'العربية'
  }}
};

i18n.use(initReactI18next).init({
  resources, lng: localStorage.getItem('maxcode_lang') || 'ar',
  fallbackLng: 'ar', interpolation: { escapeValue: false }
});
const initialLanguage = localStorage.getItem('maxcode_lang') || 'ar';
document.documentElement.dir = initialLanguage === 'ar' ? 'rtl' : 'ltr';
document.documentElement.lang = initialLanguage;
export default i18n;
