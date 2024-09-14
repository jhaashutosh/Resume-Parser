import "./App.css";
import UploadResume from "./components/UploadResume/UploadResume";
import styled from "styled-components";

const AppWrapper = styled.div`
  text-align: center;
  width: 100%;
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <AppWrapper className="App">
      <UploadResume />
    </AppWrapper>
  );
}

export default App;
