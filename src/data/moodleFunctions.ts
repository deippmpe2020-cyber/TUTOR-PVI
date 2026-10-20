import { MoodleFunctionDoc } from '../types/moodle';

export const MOODLE_FUNCTIONS: MoodleFunctionDoc[] = [
  // --- CORE & SITE ---
  {
    name: 'core_webservice_get_site_info',
    category: 'Core & Site',
    method: 'POST',
    description: 'Return site information including sitename, release, Moodle version, logged-in user details, upload limits, and all available web service functions for the user token.',
    capability: 'moodle/webservice:createtoken',
    since: 'Moodle 2.2+',
    parameters: [
      {
        name: 'serviceshortnames',
        type: 'array',
        required: false,
        description: 'Optional array of service shortnames to filter function capabilities.',
        example: ['moodle_mobile_app'],
      },
    ],
    sampleResponse: {
      sitename: 'Apex Institute of Technology - Moodle LMS',
      username: 'moodle_admin',
      firstname: 'Elena',
      lastname: 'Rostova',
      fullname: 'Elena Rostova',
      lang: 'en',
      userid: 2,
      siteurl: 'https://lms.apex-institute.edu',
      userpictureurl: 'https://...',
      release: '4.4.2+',
      version: '2024042202.04',
      downloadfiles: 1,
      uploadfiles: 1,
    },
  },
  {
    name: 'core_course_get_categories',
    category: 'Core & Site',
    method: 'POST',
    description: 'Retrieve course categories by criteria (e.g. parent category, id, name) or all root categories.',
    capability: 'moodle/category:viewcourselist',
    since: 'Moodle 2.5+',
    parameters: [
      {
        name: 'criteria',
        type: 'array',
        required: false,
        description: 'Array of criteria objects: [{ key: "parent", value: "0" }]',
        example: [{ key: 'parent', value: '0' }],
      },
      {
        name: 'addsubcat',
        type: 'boolean',
        required: false,
        default: 1,
        description: 'Whether to include subcategories (1 for yes, 0 for no).',
        example: 1,
      },
    ],
    sampleResponse: [
      { id: 1, name: 'Computer Science & Software', idnumber: 'CS', parent: 0, coursecount: 4 },
      { id: 2, name: 'Artificial Intelligence & Data', idnumber: 'AI', parent: 0, coursecount: 3 },
    ],
  },

  // --- COURSES ---
  {
    name: 'core_course_get_courses',
    category: 'Courses',
    method: 'POST',
    description: 'Return list of courses with basic attributes (fullname, shortname, summary, format, start/end dates). Can filter by array of course IDs.',
    capability: 'moodle/course:view',
    since: 'Moodle 2.2+',
    parameters: [
      {
        name: 'options',
        type: 'object',
        required: false,
        description: 'Optional filtering options, such as { ids: [101, 102] } to only fetch specific courses.',
        example: { ids: [101, 102, 103] },
      },
    ],
    sampleResponse: [
      {
        id: 101,
        shortname: 'CS101-2026',
        fullname: 'CS101: Modern Software Architecture & Web APIs',
        format: 'topics',
        startdate: 1770000000,
        enddate: 1785000000,
        categoryid: 1,
      },
    ],
  },
  {
    name: 'core_course_get_courses_by_field',
    category: 'Courses',
    method: 'POST',
    description: 'Retrieve courses matching a specific field, such as "id", "ids", "shortname", or "category".',
    capability: 'moodle/course:view',
    since: 'Moodle 3.2+',
    parameters: [
      {
        name: 'field',
        type: 'string',
        required: true,
        default: 'id',
        description: 'The field name to filter on: "id", "ids", "shortname", "idnumber", or "category".',
        example: 'id',
      },
      {
        name: 'value',
        type: 'string',
        required: true,
        default: '101',
        description: 'The value to match against the specified field.',
        example: '101',
      },
    ],
    sampleResponse: {
      courses: [
        {
          id: 101,
          fullname: 'CS101: Modern Software Architecture & Web APIs',
          shortname: 'CS101-2026',
          categoryid: 1,
        },
      ],
    },
  },
  {
    name: 'core_course_get_contents',
    category: 'Courses',
    method: 'POST',
    description: 'Get structured course contents, sections, learning modules (assignments, resources, quizzes, forums), file attachments, and completion indicators.',
    capability: 'moodle/course:view',
    since: 'Moodle 2.2+',
    parameters: [
      {
        name: 'courseid',
        type: 'number',
        required: true,
        default: 101,
        description: 'The unique Course ID to retrieve syllabus and section modules for.',
        example: 101,
      },
      {
        name: 'options',
        type: 'array',
        required: false,
        description: 'Options such as excludemodules (0/1) or sectionid to restrict contents.',
        example: [],
      },
    ],
    sampleResponse: [
      {
        id: 501,
        name: 'General Information & Syllabus',
        section: 0,
        modules: [
          { id: 601, name: 'Course Announcements', modname: 'forum', visible: 1 },
          { id: 602, name: 'Syllabus PDF', modname: 'resource', visible: 1 },
        ],
      },
    ],
  },
  {
    name: 'core_course_search_courses',
    category: 'Courses',
    method: 'POST',
    description: 'Search courses by keywords across full title, shortname, summary, and metadata tags.',
    capability: 'moodle/course:view',
    since: 'Moodle 3.0+',
    parameters: [
      {
        name: 'criterianame',
        type: 'string',
        required: true,
        default: 'search',
        description: 'Criteria name, typically "search" or "module".',
        example: 'search',
      },
      {
        name: 'criteriavalue',
        type: 'string',
        required: true,
        default: 'Architecture',
        description: 'Search string query or keyword.',
        example: 'Architecture',
      },
      {
        name: 'page',
        type: 'number',
        required: false,
        default: 0,
        description: 'Page index for pagination (0-based).',
        example: 0,
      },
      {
        name: 'perpage',
        type: 'number',
        required: false,
        default: 10,
        description: 'Number of courses to return per page.',
        example: 10,
      },
    ],
    sampleResponse: {
      total: 1,
      courses: [
        { id: 101, fullname: 'CS101: Modern Software Architecture & Web APIs', shortname: 'CS101-2026' },
      ],
    },
  },

  // --- USERS & ENROLMENT ---
  {
    name: 'core_enrol_get_enrolled_users',
    category: 'Users & Enrolment',
    method: 'POST',
    description: 'Get all enrolled users for a course with full profiles, assigned roles (Student, Teacher, Manager), email, and last access timestamp.',
    capability: 'moodle/course:enrolreview',
    since: 'Moodle 2.1+',
    parameters: [
      {
        name: 'courseid',
        type: 'number',
        required: true,
        default: 101,
        description: 'ID of the course whose enrolled roster is to be retrieved.',
        example: 101,
      },
      {
        name: 'options',
        type: 'array',
        required: false,
        description: 'Optional filters like [{ name: "withcapability", value: "..." }]',
        example: [],
      },
    ],
    sampleResponse: [
      {
        id: 3,
        username: 'marcus_chen',
        firstname: 'Marcus',
        lastname: 'Chen',
        fullname: 'Marcus Chen',
        email: 'm.chen@apex-institute.edu',
        roles: [{ roleid: 5, name: 'Student', shortname: 'student' }],
      },
    ],
  },
  {
    name: 'core_user_get_users',
    category: 'Users & Enrolment',
    method: 'POST',
    description: 'Search Moodle user database by matching criteria (e.g., email, username, firstname, department).',
    capability: 'moodle/user:viewdetails',
    since: 'Moodle 2.5+',
    parameters: [
      {
        name: 'criteria',
        type: 'array',
        required: true,
        description: 'Array of criteria objects, e.g.: [{ key: "department", value: "Computer Science" }]',
        example: [{ key: 'email', value: '@apex-institute.edu' }],
      },
    ],
    sampleResponse: {
      users: [
        { id: 3, username: 'marcus_chen', fullname: 'Marcus Chen', email: 'm.chen@apex-institute.edu' },
      ],
      warnings: [],
    },
  },
  {
    name: 'core_user_get_users_by_field',
    category: 'Users & Enrolment',
    method: 'POST',
    description: 'Retrieve user objects by specifying a field name ("id", "username", "email", "idnumber") and array of values.',
    capability: 'moodle/user:viewdetails',
    since: 'Moodle 2.5+',
    parameters: [
      {
        name: 'field',
        type: 'string',
        required: true,
        default: 'id',
        description: 'Key field to match: "id", "username", "email", or "idnumber".',
        example: 'id',
      },
      {
        name: 'values',
        type: 'array',
        required: true,
        description: 'Array of field values to query for.',
        example: ['3', '4'],
      },
    ],
    sampleResponse: [
      { id: 3, username: 'marcus_chen', fullname: 'Marcus Chen' },
      { id: 4, username: 'sophia_alvarez', fullname: 'Sophia Alvarez' },
    ],
  },

  // --- ASSIGNMENTS ---
  {
    name: 'mod_assign_get_assignments',
    category: 'Assignments',
    method: 'POST',
    description: 'Get all assignment instances across specified courses, including instructions, submission cutoff dates, and grading scales.',
    capability: 'mod/assign:view',
    since: 'Moodle 2.4+',
    parameters: [
      {
        name: 'courseids',
        type: 'array',
        required: false,
        description: 'Array of Course IDs to fetch assignments for (leave empty for all enrolled courses).',
        example: [101],
      },
      {
        name: 'capabilities',
        type: 'array',
        required: false,
        description: 'Array of capabilities to filter assignments.',
        example: [],
      },
    ],
    sampleResponse: {
      courses: [
        {
          id: 101,
          fullname: 'CS101: Modern Software Architecture & Web APIs',
          assignments: [
            { id: 201, name: 'Assignment 1: Distributed RESTful Microservice Design', grade: 100, duedate: 1771200000 },
          ],
        },
      ],
      warnings: [],
    },
  },
  {
    name: 'mod_assign_get_submissions',
    category: 'Assignments',
    method: 'POST',
    description: 'Get student submissions for given assignment IDs, including online text responses, submitted file links, and current grade status.',
    capability: 'mod/assign:grade',
    since: 'Moodle 2.5+',
    parameters: [
      {
        name: 'assignmentids',
        type: 'array',
        required: true,
        description: 'Array of Assignment IDs to inspect submissions for.',
        example: [201],
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        description: 'Optional status filter: "submitted", "draft", or "new".',
        example: 'submitted',
      },
    ],
    sampleResponse: {
      assignments: [
        {
          assignmentid: 201,
          submissions: [
            { id: 301, userid: 3, userfullname: 'Marcus Chen', status: 'submitted', grade: 94 },
          ],
        },
      ],
      warnings: [],
    },
  },
  {
    name: 'mod_assign_save_grade',
    category: 'Assignments',
    method: 'POST',
    description: 'Record or update a numerical grade and textual feedback comments for a student assignment submission.',
    capability: 'mod/assign:grade',
    since: 'Moodle 2.4+',
    parameters: [
      {
        name: 'assignmentid',
        type: 'number',
        required: true,
        default: 201,
        description: 'ID of the assignment being graded.',
        example: 201,
      },
      {
        name: 'userid',
        type: 'number',
        required: true,
        default: 3,
        description: 'Student User ID being graded.',
        example: 3,
      },
      {
        name: 'grade',
        type: 'number',
        required: true,
        default: 95.5,
        description: 'The numerical grade to assign (e.g. 95.5).',
        example: 95.5,
      },
      {
        name: 'attemptnumber',
        type: 'number',
        required: false,
        default: -1,
        description: 'Attempt number (-1 for latest attempt).',
        example: -1,
      },
      {
        name: 'addattempt',
        type: 'boolean',
        required: false,
        default: 0,
        description: 'Allow another attempt (0 for no, 1 for yes).',
        example: 0,
      },
      {
        name: 'workflowstate',
        type: 'string',
        required: false,
        default: 'graded',
        description: 'Grading workflow state ("graded", "released", "inreview").',
        example: 'graded',
      },
      {
        name: 'feedback',
        type: 'string',
        required: false,
        default: 'Excellent modular structure and comprehensive test coverage.',
        description: 'Instructor feedback comment.',
        example: 'Excellent modular structure and comprehensive test coverage.',
      },
    ],
    sampleResponse: null,
  },
  {
    name: 'mod_assign_get_grades',
    category: 'Assignments',
    method: 'POST',
    description: 'Retrieve grades associated with one or more assignments.',
    capability: 'mod/assign:grade',
    since: 'Moodle 2.4+',
    parameters: [
      {
        name: 'assignmentids',
        type: 'array',
        required: true,
        description: 'Array of assignment IDs.',
        example: [201],
      },
    ],
    sampleResponse: {
      assignments: [
        {
          assignmentid: 201,
          grades: [{ id: 1, userid: 3, grade: '94.00' }],
        },
      ],
      warnings: [],
    },
  },

  // --- GRADES ---
  {
    name: 'gradereport_user_get_grade_items',
    category: 'Grades',
    method: 'POST',
    description: 'Retrieve full gradebook report for a user in a course, including weights, min/max scales, formatted percentages, and category totals.',
    capability: 'gradereport/user:view',
    since: 'Moodle 3.2+',
    parameters: [
      {
        name: 'courseid',
        type: 'number',
        required: true,
        default: 101,
        description: 'Course ID for grade report.',
        example: 101,
      },
      {
        name: 'userid',
        type: 'number',
        required: false,
        default: 3,
        description: 'User ID (defaults to current user if omitted and capability allows).',
        example: 3,
      },
      {
        name: 'groupid',
        type: 'number',
        required: false,
        default: 0,
        description: 'Group ID filter (0 for all groups).',
        example: 0,
      },
    ],
    sampleResponse: {
      usergrades: [
        {
          courseid: 101,
          userid: 3,
          userfullname: 'Marcus Chen',
          gradeitems: [
            { id: 7000, itemname: 'Assignment 1', graderaw: 94, grademax: 100, percentageformatted: '94 %' },
            { id: 7999, itemname: 'Course total', graderaw: 94, grademax: 100, percentageformatted: '94 %' },
          ],
        },
      ],
      warnings: [],
    },
  },
  {
    name: 'core_grades_get_grades',
    category: 'Grades',
    method: 'POST',
    description: 'Get raw grade items for a course across all enrolled students.',
    capability: 'moodle/grade:viewall',
    since: 'Moodle 2.7+',
    parameters: [
      {
        name: 'courseid',
        type: 'number',
        required: true,
        default: 101,
        description: 'The target Course ID.',
        example: 101,
      },
      {
        name: 'component',
        type: 'string',
        required: false,
        description: 'Optional component filter, e.g. "mod_assign".',
        example: 'mod_assign',
      },
      {
        name: 'activityid',
        type: 'number',
        required: false,
        description: 'Optional activity ID filter.',
        example: 201,
      },
    ],
    sampleResponse: {
      grades: [
        { activityid: 201, userid: 3, grade: 94, rawgrade: 94 },
        { activityid: 201, userid: 4, grade: 88, rawgrade: 88 },
      ],
    },
  },

  // --- QUIZZES ---
  {
    name: 'mod_quiz_get_quizzes_by_courses',
    category: 'Quizzes',
    method: 'POST',
    description: 'Retrieve quiz activities within specified courses, including duration time limits, open/close dates, and grading methodology.',
    capability: 'mod/quiz:view',
    since: 'Moodle 3.1+',
    parameters: [
      {
        name: 'courseids',
        type: 'array',
        required: false,
        description: 'Array of Course IDs to fetch quizzes for.',
        example: [101, 102],
      },
    ],
    sampleResponse: {
      quizzes: [
        { id: 401, course: 101, name: 'Knowledge Check: REST Architecture Quiz', timelimit: 1800, grade: 100 },
      ],
    },
  },
  {
    name: 'mod_quiz_get_user_attempts',
    category: 'Quizzes',
    method: 'POST',
    description: 'Get all user attempts and scores for a specific quiz.',
    capability: 'mod/quiz:viewreports',
    since: 'Moodle 3.1+',
    parameters: [
      {
        name: 'quizid',
        type: 'number',
        required: true,
        default: 401,
        description: 'Quiz ID to fetch attempts for.',
        example: 401,
      },
      {
        name: 'userid',
        type: 'number',
        required: false,
        default: 3,
        description: 'Student User ID (default: 0 for all users or specific student ID).',
        example: 3,
      },
      {
        name: 'status',
        type: 'string',
        required: false,
        default: 'all',
        description: 'Attempt status: "all", "finished", or "inprogress".',
        example: 'all',
      },
    ],
    sampleResponse: {
      attempts: [
        { id: 901, quiz: 401, userid: 3, attempt: 1, state: 'finished', sumgrades: 92.5 },
      ],
      warnings: [],
    },
  },

  // --- FORUMS & MESSAGES ---
  {
    name: 'mod_forum_get_forum_discussions',
    category: 'Forums & Messages',
    method: 'POST',
    description: 'Get discussion threads from a Moodle course forum, including author profiles, reply counts, and pinned flags.',
    capability: 'mod/forum:viewdiscussion',
    since: 'Moodle 2.8+',
    parameters: [
      {
        name: 'forumid',
        type: 'number',
        required: true,
        default: 1,
        description: 'Forum instance ID.',
        example: 1,
      },
      {
        name: 'sortorder',
        type: 'number',
        required: false,
        default: -1,
        description: 'Sort order: -1 for most recent post first.',
        example: -1,
      },
      {
        name: 'page',
        type: 'number',
        required: false,
        default: 0,
        description: 'Page number for pagination.',
        example: 0,
      },
      {
        name: 'perpage',
        type: 'number',
        required: false,
        default: 10,
        description: 'Number of discussions per page.',
        example: 10,
      },
    ],
    sampleResponse: {
      discussions: [
        { id: 701, name: 'Clarification regarding Assignment 1 Docker container', userfullname: 'Marcus Chen', numreplies: 4 },
      ],
      warnings: [],
    },
  },
  {
    name: 'mod_forum_add_discussion_post',
    category: 'Forums & Messages',
    method: 'POST',
    description: 'Create a new post/reply in an existing forum discussion thread.',
    capability: 'mod/forum:replypost',
    since: 'Moodle 3.8+',
    parameters: [
      {
        name: 'postid',
        type: 'number',
        required: true,
        default: 701,
        description: 'ID of the parent post or discussion to reply to.',
        example: 701,
      },
      {
        name: 'subject',
        type: 'string',
        required: true,
        default: 'Re: Assignment 1 Docker healthcheck endpoint requirements',
        description: 'Subject title for the reply post.',
        example: 'Re: Assignment 1 Docker healthcheck endpoint requirements',
      },
      {
        name: 'message',
        type: 'string',
        required: true,
        default: 'The healthcheck should verify both HTTP listener readiness and database ping.',
        description: 'Message body text (HTML or plain text).',
        example: 'The healthcheck should verify both HTTP listener readiness and database ping.',
      },
    ],
    sampleResponse: {
      postid: 705,
      warnings: [],
    },
  },
  {
    name: 'core_message_send_instant_messages',
    category: 'Forums & Messages',
    method: 'POST',
    description: 'Send direct internal private messages between Moodle users.',
    capability: 'moodle/site:senderrormessage',
    since: 'Moodle 2.1+',
    parameters: [
      {
        name: 'messages',
        type: 'array',
        required: true,
        description: 'Array of message items: [{ touserid: 3, text: "Reminder: Office hours starts at 3pm." }]',
        example: [{ touserid: 3, text: 'Hello Marcus, review the feedback on Assignment 1.' }],
      },
    ],
    sampleResponse: [
      { msgid: 1001, clientmsgid: '' },
    ],
  },

  // --- CALENDAR ---
  {
    name: 'core_calendar_get_calendar_events',
    category: 'Calendar',
    method: 'POST',
    description: 'Retrieve upcoming calendar milestones, assignment due dates, quiz openings, and academic events.',
    capability: 'moodle/calendar:manageentries',
    since: 'Moodle 2.5+',
    parameters: [
      {
        name: 'events',
        type: 'object',
        required: false,
        description: 'Optional filter object, e.g. { eventids: [], courseids: [101] }',
        example: { courseids: [101] },
      },
      {
        name: 'options',
        type: 'object',
        required: false,
        description: 'Options such as userevents (1/0), siteevents (1/0).',
        example: { userevents: 1, siteevents: 1 },
      },
    ],
    sampleResponse: {
      events: [
        { id: 801, name: 'Assignment 1 Due', courseid: 101, eventtype: 'due', timestart: 1771200000 },
      ],
      warnings: [],
    },
  },
  {
    name: 'core_calendar_get_action_events_by_course',
    category: 'Calendar',
    method: 'POST',
    description: 'Get actionable pending events by course (e.g. assignments needing submission or grading).',
    capability: 'moodle/calendar:manageentries',
    since: 'Moodle 3.3+',
    parameters: [
      {
        name: 'courseid',
        type: 'number',
        required: true,
        default: 101,
        description: 'Course ID to check action events for.',
        example: 101,
      },
      {
        name: 'timesortfrom',
        type: 'number',
        required: false,
        default: 0,
        description: 'Timestamp filter to retrieve events starting after.',
        example: 0,
      },
    ],
    sampleResponse: {
      events: [
        { id: 801, name: 'Assignment 1 Due', courseid: 101, eventtype: 'due' },
      ],
      firstid: 801,
      lastid: 803,
    },
  },
];
