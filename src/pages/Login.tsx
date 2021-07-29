import React from "react"
import {Link} from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useState } from "react"
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import axios from "axios"
import { IUser } from "../../models/IUser"

const Login = ({history}: any) => {

    const [user, setUser] = useContext(AuthContext)
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()

      const login = () => {
        axios({
          method: "POST",
          data: {
            email,
            password
          },
          withCredentials: true,
          url: "http://localhost:8080/api/users/login",
        }).then((res) => {
            setUser(res.data)
            history.push("/")
        })
      };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="text-center">Login</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form>
                        <Form.Group as={Col}>
                            <Form.Label>Email adress</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                        </Form.Group>
                        <Link to="/register"><p style={{color: "blue"}} className="ml-3">Dont have an account, register here</p></Link>


                        <Button className="ml-3" onClick={login}>Login</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default Login