export interface MoodleParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  default?: any;
  description: string;
  placeholder?: string;
  example?: any;
}

export interface MoodleFunctionDoc {
  name: string;
  category: 'Core & Site' | 'Courses' | 'Users & Enrolment' | 'Assignments' | 'Grades' | 'Quizzes' | 'Forums & Messages' | 'Calendar';
  method: 'GET' | 'POST';
  description: string;
  capability?: string;
  since?: string;
  parameters: MoodleParameter[];
  sampleResponse: any;
}

export interface MoodleSiteInfo {
  sitename: string;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  lang: string;
  userid: number;
  siteurl: string;
  userpictureurl: string;
  functions: { name: string; version: string }[];
  downloadfiles: number;
  uploadfiles: number;
  release: string;
  version: string;
  mobilecssurl?: string;
}

export interface MoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname?: string;
  idnumber?: string;
  summary: string;
  summaryformat?: number;
  format: string;
  startdate: number;
  enddate: number;
  categoryid: number;
  categoryname?: string;
  enrolledusercount?: number;
  visible: number;
  courseimage?: string;
}

export interface MoodleModule {
  id: number;
  name: string;
  instance: number;
  modname: 'assign' | 'quiz' | 'forum' | 'resource' | 'page' | 'url' | 'folder';
  modplural?: string;
  modicon?: string;
  indent?: number;
  visible: number;
  uservisible?: boolean;
  completion?: number;
  contents?: {
    type: string;
    filename: string;
    filepath: string;
    filesize: number;
    fileurl: string;
    timemodified: number;
  }[];
}

export interface MoodleCourseSection {
  id: number;
  name: string;
  visible: number;
  summary: string;
  summaryformat?: number;
  section: number;
  hiddenbynumsections?: number;
  uservisible?: boolean;
  modules: MoodleModule[];
}

export interface MoodleUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  department?: string;
  institution?: string;
  idnumber?: string;
  firstaccess?: number;
  lastaccess?: number;
  profileimageurl?: string;
  roles?: { roleid: number; name: string; shortname: string }[];
}

export interface MoodleAssignment {
  id: number;
  cmid: number;
  course: number;
  name: string;
  nosubmissions: number;
  submissiondrafts: number;
  sendnotifications: number;
  duedate: number;
  allowsubmissionsfromdate: number;
  grade: number;
  timemodified: number;
  intro: string;
  introformat?: number;
}

export interface MoodleSubmission {
  id: number;
  assignment: number;
  userid: number;
  userfullname?: string;
  useremail?: string;
  status: 'submitted' | 'draft' | 'new';
  timemodified: number;
  grade?: number | null;
  grader?: number | null;
  feedback?: string;
  plugins?: {
    type: string;
    name: string;
    fileareas?: {
      files: { filename: string; filesize: number; fileurl: string }[];
    }[];
    editorfields?: { text: string }[];
  }[];
}

export interface MoodleGradeItem {
  id: number;
  itemname: string;
  itemtype: string;
  itemmodule?: string;
  itemnumber?: number;
  courseid: number;
  grademin: number;
  grademax: number;
  graderaw?: number;
  gradeformatted?: string;
  percentageformatted?: string;
  feedback?: string;
  gradedategraded?: number;
}

export interface MoodleQuiz {
  id: number;
  course: number;
  name: string;
  intro: string;
  timeopen: number;
  timeclose: number;
  timelimit: number;
  attempts: number;
  grademethod: number;
  grade: number;
  questionscount?: number;
}

export interface MoodleForumDiscussion {
  id: number;
  name: string;
  forumid: number;
  subject: string;
  message: string;
  userid: number;
  userfullname: string;
  userpictureurl?: string;
  numreplies: number;
  created: number;
  modified: number;
  pinned: boolean;
}

export interface MoodleApiExecutionLog {
  id: string;
  timestamp: number;
  functionName: string;
  method: 'GET' | 'POST';
  status: number;
  durationMs: number;
  mode: 'sandbox' | 'live';
  isException: boolean;
  params: Record<string, any>;
  response: any;
}
