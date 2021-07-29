import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Form, Modal, Col, Container, Row, Button, Popover, OverlayTrigger } from "react-bootstrap"
import styled from "styled-components"
import { TaskContext } from "../../contexts/TaskContext"

export interface IUpdateTaskModal {
    id: any,
    show: boolean,
    onHide: () => void,
}

const UpdateTaskModal = ({id, show, onHide}: IUpdateTaskModal) => {

    const [task, setTask] = useState<any>()
    const [updateData, setUpdateData] = useState<any>()
    const [showLabels, setShowLabels] = useState<any>(undefined)

    const [forceHide, setForceHide] = useState<boolean>(false)

    const [tasks, setTasks] = useContext(TaskContext);

    const fetchTask = () => {
        axios({
            method: "GET",
            withCredentials: true,
            url: `http://localhost:8080/api/tasks/${id}`
        }).then((res) => {
            setTask(res.data)
        }).catch((e) => {
            console.log(e)
        })
    }

    useEffect(() => {
        if(!task && show) {
            fetchTask()
        }
    }) 

    const patchData = async (data: any) => {
        
        console.log(data)
        try {
            axios({
                method: "PATCH",
                data: data,
                withCredentials: true,
                url: `http://localhost:8080/api/tasks/${id}`
            }).then((res) => {
                console.log(res.data)
    
                axios({
                    method: "GET",
                    withCredentials: true,
                    url: "http://localhost:8080/api/tasks"
                }).then((res) => {
                    setTasks(res.data)
                    console.log(tasks)
                }).catch((e) => {
                    console.log(e)
                })

            }).catch((e) => {
                console.log(e)
            })
        } catch(e) {
            console.log(e)
        }

    }

    const saveEdits = async () => {
        patchData(updateData)        
    }

    const addLabel = (label: string) => {
        
        if(task.labels.includes(label)) {
            const index = task.labels.indexOf(label)
            const labels = task.labels
            labels.splice(index, 1)
            patchData({labels: task.labels})
            return
        }

        const labels = task.labels
        labels.push(label)
        console.log(labels)
        patchData({labels: labels})
    }

    const handleChange = (e: any) => {
        setTask({title: e.target.value})
        setUpdateData({...updateData, title: e.target.value})
    }


    const deleteTask = () => {
        axios({
            method: "DELETE",
            withCredentials: true,
            url: `http://localhost:8080/api/tasks/${id}`
        }).then((res) => {
            console.log(res.data)

            axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/tasks"
            }).then((res) => {
                setTasks(res.data)
                console.log(tasks)
                setForceHide(true)
            }).catch((e) => {
                console.log(e)
            })
        })
    }

    const labelPopover = () => {

        const colors = ["green", "yellow", "blue", "red"]

        return(
            <PopoverMenu show={showLabels}>
                <Container>
                    <Row style={{borderBottom: "1px solid black"}}>
                        <Col className="pb-2 pt-2" lg={10}>
                            <small style={{fontSize: "1.2rem"}}>Labels</small>
                        </Col>
                        <Col className="pb-2 pt-2" lg={2}>
                            <small style={{fontSize: "1.2rem", cursor: "pointer"}} onClick={() => setShowLabels(false)}>X</small>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col>
                            <small style={{fontSize: "1rem"}}>Colors</small>
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <ColorPicker className="p-0">
                                {colors.map((color: string) => {
                                    return(
                                        <li onClick={() => addLabel(color)} className="mt-1" style={{backgroundColor: color, cursor: "pointer"}}>
                                            <span>
                                                <span style={task?.labels?.includes(color) ? {color: "white"} : {color: color}} className="p-2">X</span>
                                            </span>
                                        </li>
                                    )
                                })}
                            </ColorPicker>
                        </Col>
                    </Row>
                </Container>
            </PopoverMenu>
        )
    }

    return (
        <Modal size="lg" show={!forceHide && show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Edit task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col lg={9}>
                            <Container>
                                <Row>
                                    <Col className="p-0">
                                        <TitleForm value={task?.title} onChange={handleChange} />
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col className="p-0">
                                        <Form>
                                            <Form.Group as={Col}>
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control as="textarea" rows={3} placeholder="Enter description" />
                                            </Form.Group>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg={3}>
                            <Container>
                                <Row>
                                    <Col><p className="m-0">Add to card</p></Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <SideButtons onClick={() => setShowLabels(true)}>Labels</SideButtons>
                                    </Col>
                                </Row>
                                {labelPopover()}
                                <Row className="mt-2">
                                    <Col>
                                        <SideButtons>Checklist</SideButtons>
                                    </Col>
                                </Row>
                                <Row className="mt-4">
                                    <Col><p className="m-0">Actions</p></Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <SideButtons onClick={saveEdits}>Update</SideButtons>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <SideButtons>Move</SideButtons>
                                    </Col>
                                </Row>
                                <Row className="mt-2">
                                    <Col>
                                        <SideButtons onClick={deleteTask}>Delete</SideButtons>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    )
}


const TitleForm = styled(Form.Control)`
    background-color: white !important;
    border: none;
    font-size: 1.5rem;

    &:focus{
        box-shadow: inset 0 0 0 2px #0079bf;
    }
`;

const SideButtons = styled(Button)`
    background-color: #F3F3F3 !important;
    color: #172b4d;
    border: none;
    box-shadow: none !important;

    &:hover {
        color: #172b4d;
    }

    &:focus {
        box-shadow: none;
        color: #172b4d !important;
    }

    &:active {
        color: #172b4d !important;
    }
`;

const PopoverMenu = styled(Row)`
    display: ${props => props.show || "none"};
    background-color: white;
    box-shadow: 0 8px 16px -4px rgba(9,30,66,.25),0 0 0 1px rgba(9,30,66,.08);
    position: absolute;
    z-index: 1000;
    width: 20rem;
`;

const ColorPicker = styled.ul`
    list-style-type: none;
`;



export default UpdateTaskModal