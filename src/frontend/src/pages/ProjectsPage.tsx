import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProjectTableSort } from '../components/project-table/ProjectTableSort';
import { CreateProjectForm } from '../components/create-project-modal/CreateProjectModal';
import { Button } from '@mantine/core';
import { modals } from '@mantine/modals';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const modalOpenedRef = useRef(false);

  const fetchProjects = () => {
    fetch('http://localhost:8000/projects/')
      .then(res => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then(data => setProjects(data))
      .catch(err => console.error('Failed to fetch projects:', err));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'create' && !modalOpenedRef.current) {
      modalOpenedRef.current = true;
      openCreateProjectModal();
      setSearchParams({}, { replace: true });
    }
  }, []);

  const formattedData = projects.map((project: any) => ({
    id: project.id,
    name: project.name,
    description: project.description,
    status: project.status,
    priority: project.priority,
    client: `${project.client_name} - ${project.company}`,
    deadline: project.deadline ?? 'N/A',
    agreedValue: project.agreed_value ?? null,
    currency: project.currency ?? 'USD',
    latest_note: project.latest_note ?? '',
  }));

  const openCreateProjectModal = () => {
    modals.open({
      title: 'Create New Project',
      children: <CreateProjectForm onProjectCreated={fetchProjects} />,
    });
  };

  return (
    <>
      <Button radius="md" mb="md" onClick={openCreateProjectModal}>
        Create New Project
      </Button>
      <ProjectTableSort data={formattedData} onProjectUpdated={fetchProjects} />
    </>
  );
};

export default ProjectsPage;