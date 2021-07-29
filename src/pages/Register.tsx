import axios from "axios";
import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap"
import {Link} from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext";


const Register = ({history}: any) => {

    const [registerEmail, setRegisterEmail] = useState<string>()
    const [registerPassword, setRegisterPassword] = useState<string>()
    const [registerName, setRegisterName] = useState<string>()

    const [user, setUser] = useContext(AuthContext) 

    const register = () => {
        axios({
          method: "POST",
          data: {
            email: registerEmail,
            password: registerPassword,
            name: registerName
          },
          withCredentials: true,
          url: "http://localhost:8080/api/users/register",
        }).then((res) => {
            setUser(res.data)
            history.push("/")
        })
      };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="text-center">Register</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Name</Form.Label>
                                <Form.Control value={registerName} onChange={(e) => setRegisterName(e.target.value)} type="text" placeholder="Enter name" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Email adress</Form.Label>
                                <Form.Control value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} type="email" placeholder="Enter email" />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col}>
                                <Form.Label>Password</Form.Label>
                                <Form.Control value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} type="password" placeholder="Enter password" />
                            </Form.Group>
                        </Form.Row>
                        <Link to="/login"><p style={{color: "blue"}} className="ml-3">Have an account, login here</p></Link>
                        
                        <Button className="ml-3" onClick={register}>register</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Register