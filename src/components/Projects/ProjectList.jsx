import React, { useState, useEffect } from 'react';
import supabase from '../../services/supabase/supabaseClient';
import './ProjectList.css';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  });
  const [newProjectForm, setNewProjectForm] = useState({
    title: '',
    description: '',
  });
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');



// recuperer tou les donnee de l'utilisateur
  useEffect(() => {
    fetchProjects();
  }, [refresh]);

  const fetchProjects = async () => {
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Error fetching user:', userError);
      return;
    }

    const user = data.user;
    if (!user) {
      console.error('No user data found');
      setLoading(false);
      return;
    }

    if (!user.id) {
      console.error('User ID is undefined');
      setLoading(false);
      return;
    }

    const { data: projectsData, error } = await supabase
      .from('Projects')
      .select('*')
      .eq('id_user', user.id);

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(projectsData);
    }
    setLoading(false);
  };




// modifier le projet
  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditForm({
      title: project.title,
      description: project.description,
    });
  };




  const handleDeleteClick = async (project) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the project? "${project.title}"?`);
    if (confirmDelete) {
      try {
        const { error } = await supabase
          .from('Projects')
          .delete()
          .eq('id_project', project.id_project);

        if (error) {
          throw error;
        }

        setConfirmationMessage('Project deleted successfully!');
        setTimeout(() => {
          setConfirmationMessage('');
        }, 3000);
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error deleting project:', error.message);
      }
    }
  };

  const handleFormChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };




  const handleNewProjectFormChange = (e) => {
    setNewProjectForm({
      ...newProjectForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('Projects')
        .update({
          title: editForm.title,
          description: editForm.description,
        })
        .eq('id_project', editingProject.id_project);

      if (error) {
        throw error;
      }

      setConfirmationMessage('Project updated successfully!');
      setTimeout(() => {
        setConfirmationMessage('');
      }, 3000);
      setEditingProject(null);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating project:', error.message);
    }
  };



  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        return;
      }

      const user = data.user;
      if (!user) {
        console.error('No user data found');
        return;
      }

      const { error } = await supabase
        .from('Projects')
        .insert({
          title: newProjectForm.title,
          description: newProjectForm.description,
          id_user: user.id,
        });

      if (error) {
        throw error;
      }

      setConfirmationMessage('Project added successfully!');
      setTimeout(() => {
        setConfirmationMessage('');
      }, 3000);
      setNewProjectForm({
        title: '',
        description: '',
      });
      setShowNewProjectForm(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error adding project:', error.message);
    }
  };

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div>
      <h1>Projects</h1>
      {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
      
      <button onClick={() => setShowNewProjectForm(!showNewProjectForm)}>New Project</button>

      {showNewProjectForm && (
        <form onSubmit={handleNewProjectSubmit} className="new-project-form">
          <h2>Add New Project</h2>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={newProjectForm.title}
              onChange={handleNewProjectFormChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={newProjectForm.description}
              onChange={handleNewProjectFormChange}
            />
          </label>
          <button type="submit">Add Project</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Completed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id_project}>
              <td>{project.title}</td>
              <td>{project.description}</td>
              <td>{new Date(project.created_at).toLocaleDateString()}</td>
              <td>{project.completed_at ? new Date(project.completed_at).toLocaleDateString() : 'Not completed'}</td>
              <td>
                <button onClick={() => handleEditClick(project)}>Edit</button>
                <button onClick={() => handleDeleteClick(project)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProject && (
        <div className="modal">
          <form onSubmit={handleFormSubmit}>
            <h2>Edit Project</h2>
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Description:
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleFormChange}
              />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingProject(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProjectList;