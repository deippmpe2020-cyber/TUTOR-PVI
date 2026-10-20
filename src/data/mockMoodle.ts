import {
  MoodleCourse,
  MoodleCourseSection,
  MoodleUser,
  MoodleAssignment,
  MoodleSubmission,
  MoodleGradeItem,
  MoodleQuiz,
  MoodleForumDiscussion,
  MoodleSiteInfo,
} from '../types/moodle';

export const INITIAL_SITE_INFO: MoodleSiteInfo = {
  sitename: 'Apex Institute of Technology - Moodle LMS',
  username: 'moodle_admin',
  firstname: 'Elena',
  lastname: 'Rostova',
  fullname: 'Elena Rostova',
  lang: 'en',
  userid: 2,
  siteurl: 'https://lms.apex-institute.edu',
  userpictureurl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  release: '4.4.2+ (Build: 20240902)',
  version: '2024042202.04',
  downloadfiles: 1,
  uploadfiles: 1,
  functions: [
    { name: 'core_webservice_get_site_info', version: '2024042200' },
    { name: 'core_course_get_courses', version: '2024042200' },
    { name: 'core_course_get_courses_by_field', version: '2024042200' },
    { name: 'core_course_get_contents', version: '2024042200' },
    { name: 'core_course_get_categories', version: '2024042200' },
    { name: 'core_course_search_courses', version: '2024042200' },
    { name: 'core_enrol_get_enrolled_users', version: '2024042200' },
    { name: 'core_user_get_users', version: '2024042200' },
    { name: 'core_user_get_users_by_field', version: '2024042200' },
    { name: 'mod_assign_get_assignments', version: '2024042200' },
    { name: 'mod_assign_get_submissions', version: '2024042200' },
    { name: 'mod_assign_save_grade', version: '2024042200' },
    { name: 'mod_assign_get_grades', version: '2024042200' },
    { name: 'gradereport_user_get_grade_items', version: '2024042200' },
    { name: 'core_grades_get_grades', version: '2024042200' },
    { name: 'mod_quiz_get_quizzes_by_courses', version: '2024042200' },
    { name: 'mod_quiz_get_user_attempts', version: '2024042200' },
    { name: 'mod_forum_get_forum_discussions', version: '2024042200' },
    { name: 'mod_forum_add_discussion_post', version: '2024042200' },
    { name: 'core_calendar_get_calendar_events', version: '2024042200' },
    { name: 'core_calendar_get_action_events_by_course', version: '2024042200' },
    { name: 'core_message_send_instant_messages', version: '2024042200' },
  ],
};

export const INITIAL_CATEGORIES = [
  { id: 1, name: 'Procedimentos Operacionais e POP', idnumber: 'POP', description: 'Cursos de formação, aperfeiçoamento e nivelamento de POP', parent: 0, coursecount: 3, visible: 1 },
  { id: 2, name: 'Legislação e Direito Militar', idnumber: 'LEG', description: 'Legislação penal, processual e administrativa militar', parent: 0, coursecount: 2, visible: 1 },
  { id: 3, name: 'Gestão, Liderança e Doutrina', idnumber: 'GEST', description: 'Gestão de efetivo, comando de frações e mediação de conflitos', parent: 0, coursecount: 2, visible: 1 },
];

export const INITIAL_COURSES: MoodleCourse[] = [
  {
    id: 105,
    shortname: 'PVI-POP-LEG-105',
    fullname: 'Curso de Procedimentos Operacionais Padrão (POP), Legislação Aplicada e Doutrina Policial Militar',
    displayname: 'PVI 105: Procedimentos Operacionais Padrão e Legislação Aplicada (PMPE / ALEPE)',
    idnumber: 'PVI-105-PMPE',
    summary: 'Ambiente oficial da Plataforma Virtual de Instrução da PMPE (https://pvi.pm.pe.gov.br/course/view.php?id=105). Módulos de abordagem policial, busca pessoal, uso diferenciado da força, inviolabilidade domiciliar, lavratura de TCO e legislação estadual da ALEPE (Estatuto PMPE Lei 6.783/74, Código Disciplinar Lei 11.817/2000, LC 320/2015).',
    summaryformat: 1,
    format: 'topics',
    startdate: 1770000000,
    enddate: 1785000000,
    categoryid: 1,
    categoryname: 'Procedimentos Operacionais e POP',
    enrolledusercount: 154,
    visible: 1,
    courseimage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 101,
    shortname: 'PM-POP-2026',
    fullname: 'Curso de Procedimentos Operacionais Padrão (POP) e Prática Policial Militar',
    displayname: 'Curso de Procedimentos Operacionais Padrão (POP) e Prática Policial Militar',
    idnumber: 'PM-POP-2026',
    summary: 'Instrução e padronização operacional em abordagem e busca pessoal, uso diferenciado da força, flagrante delito, entrada em domicílio, lavratura de TCO e conduta técnico-operacional.',
    summaryformat: 1,
    format: 'topics',
    startdate: 1770000000,
    enddate: 1785000000,
    categoryid: 1,
    categoryname: 'Procedimentos Operacionais e POP',
    enrolledusercount: 42,
    visible: 1,
    courseimage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 102,
    shortname: 'PM-LEG-2026',
    fullname: 'Legislação Penal e Processual Militar (CPM e CPPM) Aplicada',
    displayname: 'Legislação Penal e Processual Militar (CPM e CPPM) Aplicada',
    idnumber: 'PM-LEG-2026',
    summary: 'Estudo de crimes militares em tempo de paz, Lei 13.491/17, competência da Justiça Militar Estadual, Inquérito Policial Militar (IPM) e processo penal castrense.',
    summaryformat: 1,
    format: 'topics',
    startdate: 1770000000,
    enddate: 1785000000,
    categoryid: 2,
    categoryname: 'Legislação e Direito Militar',
    enrolledusercount: 36,
    visible: 1,
    courseimage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 103,
    shortname: 'PM-GEST-2026',
    fullname: 'Gestão de Efetivo, Liderança de Pelotão e Mediação de Conflitos',
    displayname: 'Gestão de Efetivo, Liderança de Pelotão e Mediação de Conflitos',
    idnumber: 'PM-GEST-2026',
    summary: 'Administração de escalas, otimização de efetivo orientada por manchas criminais, policiamento comunitário e resolução pacífica de controvérsias.',
    summaryformat: 1,
    format: 'topics',
    startdate: 1770000000,
    enddate: 1785000000,
    categoryid: 3,
    categoryname: 'Gestão, Liderança e Doutrina',
    enrolledusercount: 29,
    visible: 1,
    courseimage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 104,
    shortname: 'DS201-2026',
    fullname: 'DS201: High-Performance Data Structures & Algorithms',
    displayname: 'DS201: High-Performance Data Structures & Algorithms',
    idnumber: 'DS201',
    summary: 'Analysis of algorithms, balanced trees, graph traversal, dynamic programming, and memory hierarchy optimization.',
    summaryformat: 1,
    format: 'topics',
    startdate: 1770000000,
    enddate: 1785000000,
    categoryid: 1,
    categoryname: 'Computer Science & Software',
    enrolledusercount: 40,
    visible: 1,
    courseimage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_USERS: MoodleUser[] = [
  {
    id: 2,
    username: 'moodle_admin',
    firstname: 'Elena',
    lastname: 'Rostova',
    fullname: 'Elena Rostova',
    email: 'elena.rostova@apex-institute.edu',
    department: 'Computer Science & Engineering',
    institution: 'Apex Institute of Technology',
    idnumber: 'FAC-001',
    firstaccess: 1735689600,
    lastaccess: 1770124800,
    profileimageurl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    roles: [{ roleid: 3, name: 'Teacher', shortname: 'editingteacher' }],
  },
  {
    id: 3,
    username: 'marcus_chen',
    firstname: 'Marcus',
    lastname: 'Chen',
    fullname: 'Marcus Chen',
    email: 'm.chen@apex-institute.edu',
    department: 'Computer Science',
    institution: 'Apex Institute of Technology',
    idnumber: 'STU-2024-81',
    firstaccess: 1736000000,
    lastaccess: 1770120000,
    profileimageurl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    roles: [{ roleid: 5, name: 'Student', shortname: 'student' }],
  },
  {
    id: 4,
    username: 'sophia_alvarez',
    firstname: 'Sophia',
    lastname: 'Alvarez',
    fullname: 'Sophia Alvarez',
    email: 's.alvarez@apex-institute.edu',
    department: 'Artificial Intelligence',
    institution: 'Apex Institute of Technology',
    idnumber: 'STU-2024-42',
    firstaccess: 1736100000,
    lastaccess: 1770118000,
    profileimageurl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    roles: [{ roleid: 5, name: 'Student', shortname: 'student' }],
  },
  {
    id: 5,
    username: 'liam_wright',
    firstname: 'Liam',
    lastname: 'Wright',
    fullname: 'Liam Wright',
    email: 'l.wright@apex-institute.edu',
    department: 'Software Engineering',
    institution: 'Apex Institute of Technology',
    idnumber: 'STU-2024-19',
    firstaccess: 1736200000,
    lastaccess: 1770110000,
    profileimageurl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    roles: [{ roleid: 5, name: 'Student', shortname: 'student' }],
  },
  {
    id: 6,
    username: 'amara_patel',
    firstname: 'Amara',
    lastname: 'Patel',
    fullname: 'Amara Patel',
    email: 'a.patel@apex-institute.edu',
    department: 'Human-Computer Interaction',
    institution: 'Apex Institute of Technology',
    idnumber: 'STU-2024-95',
    firstaccess: 1736300000,
    lastaccess: 1770090000,
    profileimageurl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    roles: [{ roleid: 5, name: 'Student', shortname: 'student' }],
  },
];

export const INITIAL_ASSIGNMENTS: MoodleAssignment[] = [
  {
    id: 201,
    cmid: 1001,
    course: 101,
    name: 'Assignment 1: Distributed RESTful Microservice Design',
    nosubmissions: 0,
    submissiondrafts: 0,
    sendnotifications: 1,
    duedate: 1771200000,
    allowsubmissionsfromdate: 1770000000,
    grade: 100,
    timemodified: 1770005000,
    intro: '<p>Design an enterprise-grade OpenAPI 3.1 specification and implement a resilient token-authenticated endpoint gateway with rate limiting and exponential retry handling.</p>',
    introformat: 1,
  },
  {
    id: 202,
    cmid: 1002,
    course: 101,
    name: 'Assignment 2: Event-Driven Kafka Stream Processing',
    nosubmissions: 0,
    submissiondrafts: 0,
    sendnotifications: 1,
    duedate: 1772400000,
    allowsubmissionsfromdate: 1771200000,
    grade: 100,
    timemodified: 1770006000,
    intro: '<p>Construct a partition-tolerant streaming pipeline capable of ingesting 5,000 telemetry events per second with exactly-once delivery guarantees.</p>',
    introformat: 1,
  },
  {
    id: 203,
    cmid: 1003,
    course: 102,
    name: 'Lab 1: Transformer Attention Head Visualization',
    nosubmissions: 0,
    submissiondrafts: 0,
    sendnotifications: 1,
    duedate: 1771500000,
    allowsubmissionsfromdate: 1770100000,
    grade: 50,
    timemodified: 1770010000,
    intro: '<p>Extract query-key attention matrices from a pre-trained BERT encoder and produce interactive heatmaps demonstrating cross-token correlation.</p>',
    introformat: 1,
  },
];

export const INITIAL_SUBMISSIONS: MoodleSubmission[] = [
  {
    id: 301,
    assignment: 201,
    userid: 3,
    userfullname: 'Marcus Chen',
    useremail: 'm.chen@apex-institute.edu',
    status: 'submitted',
    timemodified: 1770800000,
    grade: 94,
    grader: 2,
    feedback: 'Exceptional API documentation and clear separation of concerns in the routing middleware. Well done!',
    plugins: [
      {
        type: 'onlinetext',
        name: 'Online text',
        editorfields: [
          { text: 'Architecture repo deployed at: https://github.com/apex-cs101/marcus-rest-gateway. Docker container passes all 48 integration tests.' },
        ],
      },
      {
        type: 'file',
        name: 'File submissions',
        fileareas: [
          {
            files: [
              { filename: 'marcus_chen_architecture_spec.pdf', filesize: 2450000, fileurl: 'https://lms.apex-institute.edu/files/marcus_spec.pdf' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 302,
    assignment: 201,
    userid: 4,
    userfullname: 'Sophia Alvarez',
    useremail: 's.alvarez@apex-institute.edu',
    status: 'submitted',
    timemodified: 1770900000,
    grade: 88,
    grader: 2,
    feedback: 'Great error envelope design. Consider adding exponential backoff jitter on the 429 Retry-After header.',
    plugins: [
      {
        type: 'onlinetext',
        name: 'Online text',
        editorfields: [
          { text: 'Completed service with Redis caching and JWT validation. Benchmark reached 2,800 RPS.' },
        ],
      },
    ],
  },
  {
    id: 303,
    assignment: 201,
    userid: 5,
    userfullname: 'Liam Wright',
    useremail: 'l.wright@apex-institute.edu',
    status: 'submitted',
    timemodified: 1770950000,
    grade: null,
    grader: null,
    feedback: '',
    plugins: [
      {
        type: 'onlinetext',
        name: 'Online text',
        editorfields: [
          { text: 'Submitted implementation draft with gRPC and REST transcoders.' },
        ],
      },
    ],
  },
  {
    id: 304,
    assignment: 201,
    userid: 6,
    userfullname: 'Amara Patel',
    useremail: 'a.patel@apex-institute.edu',
    status: 'draft',
    timemodified: 1771000000,
    grade: null,
    grader: null,
    feedback: '',
    plugins: [
      {
        type: 'onlinetext',
        name: 'Online text',
        editorfields: [
          { text: 'Working on Docker compose cluster testing.' },
        ],
      },
    ],
  },
];

export const INITIAL_COURSE_CONTENTS: Record<number, MoodleCourseSection[]> = {
  101: [
    {
      id: 501,
      name: 'Apresentação do Curso e Doutrina Institucional da PMPE',
      section: 0,
      visible: 1,
      summary: 'Diretrizes gerais, manual institucional de POP e plano pedagógico da DEIP/CEaD.',
      modules: [
        {
          id: 601,
          name: 'Manual Oficial de Procedimentos Operacionais Padrão (POP PMPE 2026)',
          instance: 1,
          modname: 'resource',
          visible: 1,
          completion: 1,
          contents: [
            {
              type: 'file',
              filename: 'Manual_POP_PMPE_2026.pdf',
              filepath: '/',
              filesize: 3450000,
              fileurl: 'https://ead.pm.pe.gov.br/files/Manual_POP_PMPE_2026.pdf',
              timemodified: 1770000000,
            },
          ],
        },
        {
          id: 602,
          name: 'Fórum Temático de Dúvidas Operacionais com a Tutor PVI',
          instance: 1,
          modname: 'forum',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 502,
      name: 'Módulo 1: Abordagem Policial e Fundada Suspeita (Art. 240 e 244 do CPP)',
      section: 1,
      visible: 1,
      summary: 'Parâmetros técnicos para busca pessoal e veicular, verbalização tática, segurança 360° e requisitos jurídicos da fundada suspeita.',
      modules: [
        {
          id: 603,
          name: 'POP 101: Abordagem a Pessoas a Pé e em Veículos',
          instance: 2,
          modname: 'page',
          visible: 1,
          completion: 1,
        },
        {
          id: 604,
          name: 'Jurisprudência: RHC 158.580/BA do STJ sobre Fundada Suspeita',
          instance: 1,
          modname: 'resource',
          visible: 1,
          completion: 1,
        },
        {
          id: 605,
          name: 'Estudo de Caso Prático: Busca Pessoal em Ponto Crítico de Mancha Criminal',
          instance: 201,
          modname: 'assign',
          visible: 1,
          completion: 1,
        },
      ],
    },
    {
      id: 503,
      name: 'Módulo 2: Uso Diferenciado da Força e Súmula Vinculante 11 (Algemas)',
      section: 2,
      visible: 1,
      summary: 'Escalonamento do uso da força (Lei 13.060/14), instrumentos de menor potencial ofensivo e excepcionalidade do uso de algemas (PRCF).',
      modules: [
        {
          id: 606,
          name: 'POP 102: Emprego Gradual da Força e Dispositivos Não Letais',
          instance: 202,
          modname: 'assign',
          visible: 1,
          completion: 0,
        },
        {
          id: 607,
          name: 'Simulado de Cenários: Aplicação Prática da Súmula Vinculante 11',
          instance: 401,
          modname: 'quiz',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 504,
      name: 'Módulo 3: Flagrante Delito e Inviolabilidade Domiciliar (Tema 280 STF)',
      section: 3,
      visible: 1,
      summary: 'Fundadas razões para ingresso domiciliar sem mandado, registro em áudio/vídeo e preservação da cadeia de custódia.',
      modules: [
        {
          id: 608,
          name: 'POP 103: Conduta em Ocorrências com Entrada em Domicílio',
          instance: 3,
          modname: 'page',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 505,
      name: 'Módulo 4: Lavratura do Termo Circunstanciado de Ocorrência (TCO) na PMPE',
      section: 4,
      visible: 1,
      summary: 'Rito célere da Lei 9.099/95, compromisso de comparecimento e qualificação das partes em crimes de menor potencial ofensivo.',
      modules: [
        {
          id: 609,
          name: 'POP 104: Lavratura e Transmissão Eletrônica de TCO no BOPM/MOP',
          instance: 4,
          modname: 'page',
          visible: 1,
          completion: 0,
        },
      ],
    },
  ],
  105: [
    {
      id: 510,
      name: 'Apresentação do Curso e Doutrina Institucional (PVI PMPE - ID 105)',
      section: 0,
      visible: 1,
      summary: 'Ambiente oficial da Coord. de Ensino a Distância (CEaD - PMPE) e Diretoria de Ensino, Instrução e Pesquisa (DEIP). Normas e base legislativa da ALEPE.',
      modules: [
        {
          id: 610,
          name: 'Manual do Aluno e Guia Didático do PVI PMPE',
          instance: 1,
          modname: 'resource',
          visible: 1,
          completion: 1,
        },
        {
          id: 611,
          name: 'Fórum Temático de Dúvidas com o Tutor PVI',
          instance: 2,
          modname: 'forum',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 511,
      name: 'Módulo 1: Abordagem Policial e Fundada Suspeita (Art. 240/244 CPP)',
      section: 1,
      visible: 1,
      summary: 'Doutrina de busca pessoal e veicular, parâmetros do STJ (RHC 158.580/BA), fundada suspeita objetiva e revista pessoal feminina.',
      modules: [
        {
          id: 612,
          name: 'POP 101: Abordagem Policial Padrão e Parâmetros de Fundada Suspeita',
          instance: 3,
          modname: 'page',
          visible: 1,
          completion: 1,
        },
      ],
    },
    {
      id: 512,
      name: 'Módulo 2: Uso Diferenciado da Força e Súmula Vinculante 11 (Algemas)',
      section: 2,
      visible: 1,
      summary: 'Princípios da Lei 13.060/14, instrumentos de menor potencial ofensivo e mnemônico PRF da Súmula Vinculante 11.',
      modules: [
        {
          id: 613,
          name: 'POP 102: Escala Gradual do Uso da Força e Emprego Técnico de Algemas',
          instance: 4,
          modname: 'page',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 513,
      name: 'Módulo 3: Flagrante Delito e Inviolabilidade Domiciliar (Tema 280 STF)',
      section: 3,
      visible: 1,
      summary: 'Critérios de justa causa prévia para entrada em domicílio, registro de consentimento e cadeia de custódia.',
      modules: [
        {
          id: 614,
          name: 'POP 103: Conduta Técnico-Operacional em Ingresso Domiciliar',
          instance: 5,
          modname: 'page',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 514,
      name: 'Módulo 4: Lavratura do Termo Circunstanciado de Ocorrência (TCO)',
      section: 4,
      visible: 1,
      summary: 'Aplicação da Lei 9.099/95 pela PMPE, julgamento do STF nas ADIs 5.637 e 6.245 e registro eletrônico no BOPM/MOP.',
      modules: [
        {
          id: 615,
          name: 'POP 104: Procedimento de Lavratura de TCO na Guarnição',
          instance: 6,
          modname: 'page',
          visible: 1,
          completion: 0,
        },
      ],
    },
    {
      id: 515,
      name: 'Módulo 5: Legislação Estadual da PMPE na ALEPE (Estatuto e Código Disciplinar)',
      section: 5,
      visible: 1,
      summary: 'Lei Estadual 6.783/74 (Estatuto PMPE), Lei Estadual 11.817/2000 (Código Disciplinar), LC 320/2015 (Promoções) e prazos de Sindicância e IPM.',
      modules: [
        {
          id: 616,
          name: 'Compêndio de Legislação da ALEPE Aplicada aos Militares de Pernambuco',
          instance: 7,
          modname: 'resource',
          visible: 1,
          completion: 0,
        },
      ],
    },
  ],
};

export const INITIAL_QUIZZES: MoodleQuiz[] = [
  {
    id: 401,
    course: 101,
    name: 'Knowledge Check: REST Architecture Quiz',
    intro: 'Comprehensive assessment on HTTP verbs, status codes, idempotent methods, and OAuth 2.0 grant types.',
    timeopen: 1770000000,
    timeclose: 1772000000,
    timelimit: 1800,
    attempts: 2,
    grademethod: 1,
    grade: 100,
    questionscount: 15,
  },
  {
    id: 402,
    course: 102,
    name: 'Midterm Quiz: Matrix Calculus for Deep Learning',
    intro: 'Test your understanding of Jacobians, Hessians, and backpropagation gradients.',
    timeopen: 1770500000,
    timeclose: 1772500000,
    timelimit: 3600,
    attempts: 1,
    grademethod: 1,
    grade: 100,
    questionscount: 20,
  },
];

export const INITIAL_DISCUSSIONS: MoodleForumDiscussion[] = [
  {
    id: 701,
    forumid: 1,
    name: 'Clarification regarding Assignment 1 Docker container healthchecks',
    subject: 'Assignment 1 Docker healthcheck endpoint requirements',
    message: 'Hello class, should the /healthz endpoint verify the upstream PostgreSQL connection or only local server readiness?',
    userid: 3,
    userfullname: 'Marcus Chen',
    userpictureurl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    numreplies: 4,
    created: 1770500000,
    modified: 1770600000,
    pinned: true,
  },
  {
    id: 702,
    forumid: 1,
    name: 'Welcome to CS101 for Spring 2026!',
    subject: 'Welcome to CS101',
    message: 'Welcome everyone! Please review the syllabus and configure your local development environments using the provided devcontainer.',
    userid: 2,
    userfullname: 'Elena Rostova',
    userpictureurl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    numreplies: 12,
    created: 1770000000,
    modified: 1770100000,
    pinned: true,
  },
];

export const INITIAL_CALENDAR_EVENTS = [
  {
    id: 801,
    name: 'Assignment 1 Due: Distributed RESTful Microservice',
    description: 'Final submission deadline for Assignment 1 on Moodle.',
    format: 1,
    courseid: 101,
    categoryid: 0,
    groupid: 0,
    userid: 0,
    modulename: 'assign',
    instance: 201,
    eventtype: 'due',
    timestart: 1771200000,
    timeduration: 0,
    visible: 1,
  },
  {
    id: 802,
    name: 'Midterm Review Office Hours',
    description: 'Join Prof. Rostova via Zoom for live architectural critique and Q&A.',
    format: 1,
    courseid: 101,
    categoryid: 0,
    groupid: 0,
    userid: 2,
    modulename: '',
    instance: 0,
    eventtype: 'site',
    timestart: 1770854400,
    timeduration: 7200,
    visible: 1,
  },
  {
    id: 803,
    name: 'Lab 1 Due: Transformer Attention Head Visualization',
    description: 'PyTorch notebook submission due.',
    format: 1,
    courseid: 102,
    categoryid: 0,
    groupid: 0,
    userid: 0,
    modulename: 'assign',
    instance: 203,
    eventtype: 'due',
    timestart: 1771500000,
    timeduration: 0,
    visible: 1,
  },
];

// In-memory state holding mutable mock records
class MockMoodleDatabase {
  siteInfo = { ...INITIAL_SITE_INFO };
  categories = [...INITIAL_CATEGORIES];
  courses = [...INITIAL_COURSES];
  users = [...INITIAL_USERS];
  assignments = [...INITIAL_ASSIGNMENTS];
  submissions = [...INITIAL_SUBMISSIONS];
  contents = { ...INITIAL_COURSE_CONTENTS };
  quizzes = [...INITIAL_QUIZZES];
  discussions = [...INITIAL_DISCUSSIONS];
  events = [...INITIAL_CALENDAR_EVENTS];

  reset() {
    this.siteInfo = { ...INITIAL_SITE_INFO };
    this.categories = [...INITIAL_CATEGORIES];
    this.courses = [...INITIAL_COURSES];
    this.users = [...INITIAL_USERS];
    this.assignments = [...INITIAL_ASSIGNMENTS];
    this.submissions = [...INITIAL_SUBMISSIONS];
    this.contents = { ...INITIAL_COURSE_CONTENTS };
    this.quizzes = [...INITIAL_QUIZZES];
    this.discussions = [...INITIAL_DISCUSSIONS];
    this.events = [...INITIAL_CALENDAR_EVENTS];
  }

  execute(funcName: string, params: Record<string, any>): any {
    switch (funcName) {
      case 'core_webservice_get_site_info':
        return this.siteInfo;

      case 'core_course_get_categories': {
        const parent = params.criteria?.find((c: any) => c.key === 'parent')?.value;
        if (parent !== undefined) {
          return this.categories.filter((cat) => cat.parent === Number(parent));
        }
        return this.categories;
      }

      case 'core_course_get_courses': {
        if (params.options?.ids && Array.isArray(params.options.ids)) {
          const ids = params.options.ids.map(Number);
          return this.courses.filter((c) => ids.includes(c.id));
        }
        return this.courses;
      }

      case 'core_course_get_courses_by_field': {
        const field = params.field || 'id';
        const value = params.value;
        if (!value) return { courses: this.courses };
        const filtered = this.courses.filter((c: any) => String(c[field]) === String(value));
        return { courses: filtered };
      }

      case 'core_course_search_courses': {
        const q = (params.criterianame === 'search' ? params.criteriavalue : params.search || '').toLowerCase();
        const matches = this.courses.filter(
          (c) => c.fullname.toLowerCase().includes(q) || c.shortname.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q)
        );
        return { total: matches.length, courses: matches };
      }

      case 'core_course_get_contents': {
        const courseid = Number(params.courseid || 101);
        if (this.contents[courseid]) {
          return this.contents[courseid];
        }
        // Generic contents for other courses
        return [
          {
            id: 991,
            name: 'Welcome & Announcements',
            section: 0,
            visible: 1,
            summary: 'General introductory materials',
            modules: [
              { id: 9001, name: 'Syllabus', instance: 1, modname: 'resource', visible: 1 },
              { id: 9002, name: 'Q&A Forum', instance: 1, modname: 'forum', visible: 1 },
            ],
          },
          {
            id: 992,
            name: 'Module 1: Foundations',
            section: 1,
            visible: 1,
            summary: 'Introductory concepts and readings',
            modules: [
              { id: 9003, name: 'Readings & Slides', instance: 2, modname: 'resource', visible: 1 },
              { id: 9004, name: 'Practical Assessment', instance: 3, modname: 'assign', visible: 1 },
            ],
          },
        ];
      }

      case 'core_enrol_get_enrolled_users': {
        const courseid = Number(params.courseid || 101);
        // All students belong to course 101, subset to 102
        if (courseid === 102) {
          return this.users.filter((u) => u.id === 2 || u.id === 4 || u.id === 5);
        }
        return this.users;
      }

      case 'core_user_get_users': {
        const criteria = params.criteria || [];
        if (criteria.length > 0) {
          const crit = criteria[0];
          return {
            users: this.users.filter((u: any) => String(u[crit.key] || '').toLowerCase().includes(String(crit.value).toLowerCase())),
            warnings: [],
          };
        }
        return { users: this.users, warnings: [] };
      }

      case 'core_user_get_users_by_field': {
        const field = params.field || 'id';
        const values = (params.values || []).map(String);
        if (values.length > 0) {
          return this.users.filter((u: any) => values.includes(String(u[field])));
        }
        return this.users;
      }

      case 'mod_assign_get_assignments': {
        const courseids = (params.courseids || []).map(Number);
        let coursesAssignments = this.courses;
        if (courseids.length > 0) {
          coursesAssignments = this.courses.filter((c) => courseids.includes(c.id));
        }

        return {
          courses: coursesAssignments.map((c) => ({
            id: c.id,
            fullname: c.fullname,
            shortname: c.shortname,
            timemodified: c.startdate,
            assignments: this.assignments.filter((a) => a.course === c.id),
          })),
          warnings: [],
        };
      }

      case 'mod_assign_get_submissions': {
        const assignmentids = (params.assignmentids || []).map(Number);
        let targetAssignIds = assignmentids.length > 0 ? assignmentids : [201];

        return {
          assignments: targetAssignIds.map((assignId: number) => ({
            assignmentid: assignId,
            submissions: this.submissions.filter((s) => s.assignment === assignId),
          })),
          warnings: [],
        };
      }

      case 'mod_assign_save_grade': {
        const assignmentid = Number(params.assignmentid);
        const userid = Number(params.userid);
        const grade = Number(params.grade);
        const feedback = params.plugindata?.assignfeedbackcomments_editor?.text || params.feedback || '';

        const sub = this.submissions.find((s) => s.assignment === assignmentid && s.userid === userid);
        if (sub) {
          sub.grade = grade;
          sub.grader = 2;
          sub.feedback = feedback;
          sub.status = 'submitted';
        } else {
          const user = this.users.find((u) => u.id === userid);
          this.submissions.push({
            id: Date.now(),
            assignment: assignmentid,
            userid,
            userfullname: user?.fullname || `Student #${userid}`,
            useremail: user?.email || '',
            status: 'submitted',
            timemodified: Math.floor(Date.now() / 1000),
            grade,
            grader: 2,
            feedback,
          });
        }
        return null; // Moodle save_grade returns null/empty on success
      }

      case 'gradereport_user_get_grade_items': {
        const courseid = Number(params.courseid || 101);
        const userid = Number(params.userid || 3);
        const user = this.users.find((u) => u.id === userid) || this.users[1];

        const userSubmissions = this.submissions.filter((s) => s.userid === userid);
        const courseAssignments = this.assignments.filter((a) => a.course === courseid);

        const gradeitems: MoodleGradeItem[] = courseAssignments.map((a, idx) => {
          const sub = userSubmissions.find((s) => s.assignment === a.id);
          const raw = sub?.grade ?? null;
          return {
            id: 7000 + idx,
            itemname: a.name,
            itemtype: 'mod',
            itemmodule: 'assign',
            itemnumber: a.id,
            courseid,
            grademin: 0,
            grademax: a.grade,
            graderaw: raw !== null ? raw : undefined,
            gradeformatted: raw !== null ? `${raw}.00` : '-',
            percentageformatted: raw !== null ? `${Math.round((raw / a.grade) * 100)} %` : '-',
            feedback: sub?.feedback || '',
            gradedategraded: sub?.timemodified || 0,
          };
        });

        // Add course total
        const gradedCount = gradeitems.filter((g) => g.graderaw !== undefined).length;
        const avg = gradedCount > 0 ? gradeitems.reduce((acc, g) => acc + (g.graderaw || 0), 0) / gradedCount : 92;

        return {
          usergrades: [
            {
              courseid,
              userid: user.id,
              userfullname: user.fullname,
              maxdepth: 2,
              gradeitems: [
                ...gradeitems,
                {
                  id: 7999,
                  itemname: 'Course total',
                  itemtype: 'course',
                  courseid,
                  grademin: 0,
                  grademax: 100,
                  graderaw: Math.round(avg),
                  gradeformatted: `${Math.round(avg)}.00`,
                  percentageformatted: `${Math.round(avg)} %`,
                  feedback: 'Great continuous progress throughout this semester.',
                },
              ],
            },
          ],
          warnings: [],
        };
      }

      case 'core_grades_get_grades': {
        const courseid = Number(params.courseid || 101);
        return {
          grades: this.users.filter((u) => u.roles?.some((r) => r.shortname === 'student')).map((u) => {
            const sub = this.submissions.find((s) => s.userid === u.id);
            return {
              activityid: 201,
              userid: u.id,
              grade: sub?.grade ?? 85,
              rawgrade: sub?.grade ?? 85,
              dategraded: sub?.timemodified || 1770900000,
              feedback: sub?.feedback || 'Good work',
            };
          }),
        };
      }

      case 'mod_quiz_get_quizzes_by_courses': {
        const courseids = (params.courseids || []).map(Number);
        if (courseids.length > 0) {
          return { quizzes: this.quizzes.filter((q) => courseids.includes(q.course)) };
        }
        return { quizzes: this.quizzes };
      }

      case 'mod_quiz_get_user_attempts': {
        const quizid = Number(params.quizid || 401);
        const userid = Number(params.userid || 3);
        return {
          attempts: [
            {
              id: 901,
              quiz: quizid,
              userid,
              attempt: 1,
              uniqueid: 9001,
              layout: '1,2,3,4,5,0',
              currentpage: 0,
              preview: 0,
              state: 'finished',
              timestart: 1770400000,
              timefinish: 1770401500,
              timemodified: 1770401500,
              sumgrades: 92.5,
            },
          ],
          warnings: [],
        };
      }

      case 'mod_forum_get_forum_discussions': {
        const forumid = Number(params.forumid || 1);
        return {
          discussions: this.discussions.filter((d) => d.forumid === forumid),
          warnings: [],
        };
      }

      case 'mod_forum_add_discussion_post': {
        const postid = Number(params.postid || 701);
        const subject = params.subject || 'Re: Clarification';
        const message = params.message || 'Thanks for the quick response!';
        const newPost = {
          postid: Date.now(),
          warnings: [],
        };
        const parentDisc = this.discussions.find((d) => d.id === postid);
        if (parentDisc) {
          parentDisc.numreplies += 1;
        }
        return newPost;
      }

      case 'core_calendar_get_calendar_events': {
        return {
          events: this.events,
          warnings: [],
        };
      }

      case 'core_calendar_get_action_events_by_course': {
        const courseid = Number(params.courseid || 101);
        return {
          events: this.events.filter((e) => e.courseid === courseid),
          firstid: 801,
          lastid: 803,
        };
      }

      case 'core_message_send_instant_messages': {
        const messages = params.messages || [];
        return messages.map((m: any, idx: number) => ({
          msgid: Date.now() + idx,
          clientmsgid: m.clientmsgid || '',
        }));
      }

      default:
        // Generic fallback for any arbitrary function tested
        return {
          status: 'success',
          executed_function: funcName,
          mode: 'sandbox_simulation',
          received_parameters: params,
          message: `The web service function '${funcName}' was simulated successfully in the Moodle Sandbox environment.`,
          timestamp: Math.floor(Date.now() / 1000),
        };
    }
  }
}

export const mockDb = new MockMoodleDatabase();
