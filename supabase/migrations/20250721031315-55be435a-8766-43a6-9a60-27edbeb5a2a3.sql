-- Add missing foreign key relationships for connections table
ALTER TABLE connections 
ADD CONSTRAINT connections_requester_id_fkey 
FOREIGN KEY (requester_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE connections 
ADD CONSTRAINT connections_addressee_id_fkey 
FOREIGN KEY (addressee_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add missing foreign key relationships for project_collaborators table
ALTER TABLE project_collaborators 
ADD CONSTRAINT project_collaborators_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add missing foreign key for projects table
ALTER TABLE project_collaborators 
ADD CONSTRAINT project_collaborators_project_id_fkey 
FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;