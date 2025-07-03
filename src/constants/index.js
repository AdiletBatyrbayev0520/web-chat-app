export const API_ENDPOINT = 'https://bvtoi4h2yxsm4irflom4r7qnru0krroe.lambda-url.eu-central-1.on.aws/';
// export const API_ENDPOINT = 'https://mqvf0rd7n1.execute-api.eu-central-1.amazonaws.com/dev/SDUChatBot/';
export const SDU_COLORS = {
  blue: '#212153',
  orange: '#f3a366'
};

export const IMAGE_SOURCES = {
  sduLogoSource: "https://sdu-bot-web-app-elements-bucket.s3.us-east-1.amazonaws.com/sdu_logo.jpg",
  backgroundImage: "https://sdu-bot-web-app-elements-bucket.s3.us-east-1.amazonaws.com/logo-1024x1016.png"
}

export const LANGUAGES = {
  'en': { name: 'English', flag: '🇺🇸' },
  'es': { name: 'Español', flag: '🇪🇸' },
  'fr': { name: 'Français', flag: '🇫🇷' },
  'de': { name: 'Deutsch', flag: '🇩🇪' },
  'zh': { name: '中文', flag: '🇨🇳' },
  'kk': { name: 'Қазақша', flag: '🇰🇿' },
  'tr': { name: 'Türkçe', flag: '🇹🇷' },
  'ru': { name: 'Русский', flag: '🇷🇺' }
};

export const PLACEHOLDERS = {
  'en': 'Ask your question about SDU University...',
  'es': 'Haz tu pregunta sobre la Universidad SDU...',
  'fr': 'Posez votre question sur l\'Université SDU...',
  'de': 'Stellen Sie Ihre Frage zur SDU Universität...',
  'zh': '询问关于SDU大学的问题...',
  'kk': 'SDU университеті туралы сұрағыңызды қойыңыз...',
  'tr': 'SDU Üniversitesi hakkında sorunuzu sorun...',
  'ru': 'Задайте ваш вопрос об университете SDU...'
};

export const UI_TEXT = {
  'en': {
    title: 'SDU Knowledge Base',
    subtitle: 'Suleyman Demirel University Q&A Assistant',
    userIdPlaceholder: 'Enter your student/staff ID',
    send: 'Send',
    connecting: 'Connecting...',
    connected: 'Connected',
    disconnected: 'Disconnected',
    error: 'Error',
    cached: 'Cached Response',
    sources: 'Sources:',
    noSources: 'No sources available',
    welcomeMessage: 'Welcome to SDU University Knowledge Base! Ask me anything about academics, programs, admissions, or campus life.',
    processing: 'Processing your question...'
  },
  'ru': {
    title: 'База знаний SDU',
    subtitle: 'Помощник Q&A Университета Сулеймана Демиреля',
    userIdPlaceholder: 'Введите ваш ID студента/сотрудника',
    send: 'Отправить',
    connecting: 'Подключение...',
    connected: 'Подключено',
    disconnected: 'Отключено',
    error: 'Ошибка',
    cached: 'Кэшированный ответ',
    sources: 'Источники:',
    noSources: 'Источники недоступны',
    welcomeMessage: 'Добро пожаловать в базу знаний университета SDU! Спрашивайте меня о программах, поступлении или университетской жизни.',
    processing: 'Обрабатываю ваш вопрос...'
  },
  'kk': {
    title: 'SDU білім базасы',
    subtitle: 'Сүлейман Демирел университетінің Q&A көмекшісі',
    userIdPlaceholder: 'Студент/қызметкер ID енгізіңіз',
    send: 'Жіберу',
    connecting: 'Қосылуда...',
    connected: 'Қосылды',
    disconnected: 'Ажыратылды',
    error: 'Қате',
    cached: 'Кэштелген жауап',
    sources: 'Дереккөздер:',
    noSources: 'Дереккөздер жоқ',
    welcomeMessage: 'SDU университетінің білім базасына қош келдіңіз! Академиялық бағдарламалар, түсу немесе университет өмірі туралы сұраңыз.',
    processing: 'Сұрағыңызды өңдеп жатырмын...'
  }
};