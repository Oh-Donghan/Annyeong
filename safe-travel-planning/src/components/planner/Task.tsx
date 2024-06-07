import { useState, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 35rem;
  margin-top: 16px;
`;

const Header = styled.header`
  padding-bottom: 4px;
  margin-bottom: 4px;
  border-bottom: 2px solid #ccc;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const TaskList = styled.ul`
  padding: 16px;
  margin-top: 32px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const TaskItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Button = styled.button`
  color: #333;
  &:hover {
    color: #0071bc;
  }
`;

const Input = styled.input`
  width: 256px;
  padding: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
`;

export default function ProjectManagement({
  project,
  tasks,
  onAddTask,
  onDeleteTask,
  onDeleteProject,
}) {
  const [enteredTask, setEnteredTask] = useState('');
  const inputRef = useRef();

  const handleChange = (event) => {
    setEnteredTask(event.target.value);
  };

  const handleAddTask = () => {
    if (enteredTask.trim() === '') {
      inputRef.current.placeholder = 'Please enter a task';
      return;
    }
    onAddTask(enteredTask);
    setEnteredTask('');
  };

  const formattedDate = new Date(project.dueDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Title>{project.title}</Title>
          <Button onClick={onDeleteProject}>Delete Project</Button>
        </div>
        <p>{formattedDate}</p>
        <p>{project.description}</p>
      </Header>
      <section>
        <Title>Tasks</Title>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Input
            type='text'
            onChange={handleChange}
            value={enteredTask}
            ref={inputRef}
          />
          <Button onClick={handleAddTask}>Add Task</Button>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <TaskList>
            {tasks.map((task) => (
              <TaskItem key={task.id}>
                <span>{task.text}</span>
                <Button onClick={() => onDeleteTask(task.id)}>Clear</Button>
              </TaskItem>
            ))}
          </TaskList>
        )}
      </section>
    </Container>
  );
}
