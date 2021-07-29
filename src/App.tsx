//React
import { useContext } from "react";
import Col from 'react-bootstrap/Col';
//Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { BrowserRouter, Route, Switch } from "react-router-dom";
//Components
import { ProtectedRoute } from "./components/ProtectedRoute";
import Topmenu from "./components/Topmenu";
import { AuthContext } from "./contexts/AuthContext";
import { TableProvider } from "./contexts/TableContext";
import { TaskProvider } from "./contexts/TaskContext";
//Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";




function App() {

  const [user] = useContext(AuthContext)

  return (
      <BrowserRouter>
        <TaskProvider>
          <TableProvider>
            <Container style={{overflow: "hidden"}} className="h-100 w-100" fluid>
              {
                user !== undefined &&
                <Row>
                  <Col className="p-0">
                    <Topmenu />
                  </Col>
                </Row>
              }
              <Row style={{position: "relative", overflow: "hidden"}} className={"h-100 w-100" + (user === undefined) && " justify-content-center h-100 w-100"}>
                <Col style={{overflowY: "hidden", overflowX: "scroll"}} lg={user === undefined ? 6 : 12} className={user === undefined ? "p-0" : ""}>
                  <Switch>
                    <ProtectedRoute exact path="/" component={Home} />
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                  </Switch>
                </Col>
              </Row>
            </Container>
          </TableProvider>
        </TaskProvider>
      </BrowserRouter>
  );
}

export default App;
