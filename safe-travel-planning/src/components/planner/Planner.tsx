import { useState } from 'react';
import styled from 'styled-components';
import NewProject from './NewProject';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 반투명 검정색 배경 */
  z-index: 999; /* 다른 요소들보다 앞에 배치 */
`;

const Wrapper = styled.div`
  position: relative;
  height: 100%;
  color: ${(props) => props.theme.bgColor};
  background-color: ${(props) => props.theme.textColor};
  border: 3px solid ${(props) => props.theme.textColor};
  border-radius: 10px;
  overflow: hidden;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  padding: 35px 0 0 25px;
  font-size: 25px;
`;

const Button = styled.button`
  background-color: ${(props) => props.theme.textColor};
  font-size: 15px;
  margin: 35px 0 35px 25px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
`;

const Sidebar = styled.div`
  position: absolute;
  width: 250px;
  height: 95%;
  bottom: 0;
  border-top-right-radius: 15px;
  background-color: ${(props) => props.theme.bgColor};
`;

const Main = styled.div`
  margin-left: 250px;
  width: calc(100% - 250px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${Title} {
    color: ${(props) => props.theme.bgColor};
    font-weight: bold;
    padding: 0;
  }
  ${Button} {
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 20px;
`;

const ListItem = styled.li`
  padding: 10px 10px 5px;
  border-bottom: 1px solid #ccc;
  color: ${(props) => props.theme.textColor};
  transition: all 0.2s ease-in-out;
  &:hover {
    border-bottom: 1px solid #dda94b;
    color: #dda94b;
    cursor: pointer;
  }
`;

interface IProject {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function Planner() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);

  const addProject = (title: string, description: string, date: string) => {
    const newProject = { id: Date.now(), title, description, date };
    setProjects([...projects, newProject]);
    setShowNewProject(false);
  };

  const onCancel = () => {
    setShowNewProject(false);
  };

  return (
    <Wrapper>
      <Sidebar>
        <Title>내 여행계획</Title>
        <Button onClick={() => setShowNewProject(true)}>계획 세우기</Button>
        <List>
          {projects.map((project) => (
            <ListItem key={project.id}>{project.title}</ListItem>
          ))}
        </List>
      </Sidebar>
      <Main>
        {showNewProject ? (
          <NewProject onSave={addProject} onCancel={onCancel} />
        ) : (
          <Title>아직 계획이 없습니다.</Title>
        )}
      </Main>
    </Wrapper>
  );
}
