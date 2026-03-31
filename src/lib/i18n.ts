import type { Locale } from '@/types';

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.quote': 'Get a Quote',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.portal': 'My Account',

    // Hero
    'hero.title': 'Construction Debris Removal in Miami',
    'hero.subtitle': 'Fast, reliable hauling for remodeling and construction sites across Miami-Dade County.',
    'hero.cta': 'Get an Instant Quote',
    'hero.cta2': 'Call Now',

    // How it works
    'how.title': 'How It Works',
    'how.step1.title': 'Request a Quote',
    'how.step1.desc': 'Tell us about your debris — type, amount, and location. Get an instant price estimate.',
    'how.step2.title': 'We Confirm',
    'how.step2.desc': 'Our team reviews your request and confirms scheduling and final pricing.',
    'how.step3.title': 'We Pick Up',
    'how.step3.desc': 'Our trucks arrive on time, load up your debris, and dispose of it responsibly.',

    // Trust
    'trust.licensed': 'Licensed & Insured',
    'trust.eco': 'Eco-Friendly Disposal',
    'trust.sameday': 'Same-Day Available',
    'trust.bilingual': 'Bilingual Service',
    'trust.estimates': 'Free Estimates',

    // Services
    'services.title': 'Our Services',
    'services.construction': 'Construction & Demolition Debris',
    'services.remodeling': 'Remodeling Waste Pickup',
    'services.materials': 'Concrete, Drywall, Wood, Metal, Roofing',
    'services.recurring': 'Recurring / Scheduled Pickups',
    'services.emergency': 'Emergency Same-Day Service',

    // Quote
    'quote.title': 'Get Your Instant Quote',
    'quote.step1': 'Waste Type',
    'quote.step2': 'Load Size',
    'quote.step3': 'Location',
    'quote.step4': 'Frequency',
    'quote.step5': 'Schedule',
    'quote.step6': 'Your Info',
    'quote.result': 'Your Estimate',
    'quote.next': 'Next',
    'quote.back': 'Back',
    'quote.submit': 'Get My Quote',
    'quote.book': 'Book This Pickup',
    'quote.callback': 'Request Callback',
    'quote.estimate_range': 'Estimated Price Range',
    'quote.disclaimer': 'Final price confirmed after review. Photos help us give a more accurate estimate.',
    'quote.outside_area': 'This address appears to be outside our standard service area. You can still request a quote and we\'ll get back to you.',
    'quote.success': 'Quote submitted! We\'ll be in touch shortly.',

    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.serving': 'Proudly serving Miami-Dade County',

    // Common
    'common.phone': 'Phone',
    'common.email': 'Email',
    'common.name': 'Full Name',
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.services': 'Servicios',
    'nav.quote': 'Cotización',
    'nav.about': 'Nosotros',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.portal': 'Mi Cuenta',

    'hero.title': 'Recogida de Escombros en Miami',
    'hero.subtitle': 'Servicio rápido y confiable para sitios de remodelación y construcción en todo el Condado Miami-Dade.',
    'hero.cta': 'Cotización Instantánea',
    'hero.cta2': 'Llamar Ahora',

    'how.title': 'Cómo Funciona',
    'how.step1.title': 'Solicite una Cotización',
    'how.step1.desc': 'Cuéntenos sobre sus escombros — tipo, cantidad y ubicación. Obtenga un estimado instantáneo.',
    'how.step2.title': 'Confirmamos',
    'how.step2.desc': 'Nuestro equipo revisa su solicitud y confirma la programación y precio final.',
    'how.step3.title': 'Recogemos',
    'how.step3.desc': 'Nuestros camiones llegan a tiempo, cargan sus escombros y los eliminan responsablemente.',

    'trust.licensed': 'Licenciado y Asegurado',
    'trust.eco': 'Eliminación Ecológica',
    'trust.sameday': 'Servicio el Mismo Día',
    'trust.bilingual': 'Servicio Bilingüe',
    'trust.estimates': 'Estimados Gratis',

    'services.title': 'Nuestros Servicios',
    'services.construction': 'Escombros de Construcción y Demolición',
    'services.remodeling': 'Recogida de Residuos de Remodelación',
    'services.materials': 'Concreto, Yeso, Madera, Metal, Techos',
    'services.recurring': 'Recogidas Programadas / Recurrentes',
    'services.emergency': 'Servicio de Emergencia el Mismo Día',

    'quote.title': 'Obtenga Su Cotización Instantánea',
    'quote.step1': 'Tipo de Material',
    'quote.step2': 'Cantidad',
    'quote.step3': 'Ubicación',
    'quote.step4': 'Frecuencia',
    'quote.step5': 'Horario',
    'quote.step6': 'Su Información',
    'quote.result': 'Su Estimado',
    'quote.next': 'Siguiente',
    'quote.back': 'Atrás',
    'quote.submit': 'Obtener Cotización',
    'quote.book': 'Reservar Recogida',
    'quote.callback': 'Solicitar Llamada',
    'quote.estimate_range': 'Rango de Precio Estimado',
    'quote.disclaimer': 'Precio final confirmado después de revisión. Las fotos ayudan a dar un estimado más preciso.',
    'quote.outside_area': 'Esta dirección parece estar fuera de nuestra área de servicio. Puede solicitar una cotización y nos comunicaremos con usted.',
    'quote.success': '¡Cotización enviada! Nos comunicaremos pronto.',

    'footer.rights': 'Todos los derechos reservados.',
    'footer.serving': 'Sirviendo con orgullo al Condado Miami-Dade',

    'common.phone': 'Teléfono',
    'common.email': 'Correo',
    'common.name': 'Nombre Completo',
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
  },
};

export function t(key: string, locale: Locale = 'en'): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function getTranslations(locale: Locale) {
  return (key: string) => t(key, locale);
}
