import { HashRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { CourseOverview, ModulePage } from '@/pages/Course';
import { LessonPage } from '@/pages/Lesson';
import { SkillsPage } from '@/pages/Skills';
import { ProjectsPage, ProjectPage } from '@/pages/Projects';
import { LabsPage, LabPage } from '@/pages/Labs';
import { ChallengesPage } from '@/pages/Challenges';
import { QuizzesPage } from '@/pages/Quizzes';
import { CommandsPage, ToolsPage } from '@/pages/Reference';
import { ResourcesPage } from '@/pages/Resources';
import { SettingsPage } from '@/pages/Settings';
import { RoadmapPage } from '@/pages/Roadmap';
import { NotFound } from '@/pages/NotFound';

/** Forces LessonPage to remount when the lesson ID changes so useParams() stays fresh. */
function LessonRoute() {
  const { id } = useParams();
  const { pathname } = useLocation();
  return <LessonPage key={id ?? pathname} />;
}

/*
 * HashRouter keeps the production build portable: the compiled dist works when
 * opened from any folder or a static host, without server-side rewrite rules.
 */
export function App() {
  return (
    <HashRouter useTransitions={false}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="course" element={<CourseOverview />} />
          <Route path="modules/:num" element={<ModulePage />} />
          <Route path="lessons/:id" element={<LessonRoute />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectPage />} />
          <Route path="labs" element={<LabsPage />} />
          <Route path="labs/:id" element={<LabPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="quizzes" element={<QuizzesPage />} />
          <Route path="reference/commands" element={<CommandsPage />} />
          <Route path="reference/tools" element={<ToolsPage />} />
          <Route path="resources" element={<ResourcesPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
