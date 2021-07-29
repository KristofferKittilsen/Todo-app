import axios from "axios"
import { useContext, useEffect, useRef, useState } from "react"
import { Droppable } from "react-beautiful-dnd"
import { Col, Container, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../contexts/AuthContext"
import { TableContext } from "../contexts/TableContext"
import { TaskContext } from "../contexts/TaskContext"
import TaskCards from "./TaskCards"


interface ITable {
    id: any,
    title: string
}

const Table = ({id, title}: ITable) => {

    const [user] = useContext(AuthContext)
    const [tasks, setTasks] = useContext(TaskContext)
    const [taskTitle, setTaskTitle] = useState<string>("")
    const [showTitleInput, setShowTitleInput] = useState<string>("")
    const [updateTableTitle, setUpdateTableTitle] = useState<string>(title)
    const node = useRef<any>()

    const [tables, setTables] = useContext(TableContext)

    const addTask = () => {
        axios({
            method: "POST",
            data: {
                table: id,
                title: taskTitle,
                owner: user?._id
            },
            withCredentials: true,
            url: "http://localhost:8080/api/tasks"
        }).then((res) => {
            console.log(res.data)
            setTasks((old: any) => [...old, res.data])
            setTaskTitle(taskTitle)
        }).catch((e) => {
            console.log(e)
        })
    }

    const patchTables = async () => {
        axios({
            method: "PATCH",
            data: {title: updateTableTitle},
            withCredentials: true,
            url: `http://localhost:8080/api/tables/${id}`
        }).then((res) => {
            
            axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/tables"
            }).then((res) => {
                setTables(res.data)
                console.log(res.data)
            }).catch((e) => {
                console.log(e)
            })

        }).catch((e) => {
            console.log(e)
        })
    }

    const deleteTable = async () => {
        axios({
            method: "DELETE",
            withCredentials: true,
            url: `http://localhost:8080/api/tables/${id}`
        }).then((res) => {
            console.log(res.data)

            axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/tables"
            }).then((res) => {
                setTables(res.data)
                console.log(res.data)
            }).catch((e) => {
                console.log(e)
            })
        })
    }

    const keyPress = (e: any) => {
        if(e.keyCode === 13) {
            setShowTitleInput("")
            addTask()
        }

        if(e.keyCode === 27) {
            setShowTitleInput("")
            console.log("ESCAPE")
        }
    }

    const keyPressTableTitle = (e: any) => {
        if(e.keyCode === 13) {
            if(title === updateTableTitle) {
                alert("Cannot make table with same name")
            } else {
                patchTables()
            }
        }

        if(e.keyCode === 27) {
            setUpdateTableTitle(title)
        }
    }

    const handleClick = (e: any) => {
        if(node.current.contains(e.target)) {
            return 
        }

        setShowTitleInput("")
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick)
        }
    })

    return (
        <OuterCol lg={2} className="m-2 p-0 pb-5" >
            <Container>
                <Row style={{backgroundColor: "#474448", color: "white"}} className="p-2">
                    <Col lg={10} className="p-0">
                        <TableTitleForm onKeyDown={(e: any) => keyPressTableTitle(e)} value={updateTableTitle} onChange={(e: any) => setUpdateTableTitle(e.target.value)} />
                    </Col>
                    <Col lg={2} onClick={deleteTable} className="my-auto">
                        <p className="m-0">X</p>
                    </Col>
                </Row>
                <Row ref={node} className="mt-2">
                    {showTitleInput === title ? 
                        <Col>
                            <TitleForm placeholder="Enter title" onKeyDown={(e: any) => keyPress(e)} value={taskTitle} onChange={(e: any) => setTaskTitle(e.target.value)} />
                        </Col>
                    :
                        <Col className="text-center">
                            <h2 className="m-0" onClick={() => setShowTitleInput(title)}>+</h2>
                        </Col>
                
                } 
                </Row>
                <Droppable droppableId={id}> 
                    {(provided: any, snapshot: any) => (
                        <Row style={{minHeight: "100px"}} {...provided.droppableProps} ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
                            {
                                tasks?.map((task, i) => {
                                    if(task.table === id) {
                                        return (
                                            <TaskCards labels={task.labels} indexId={i} id={task._id} title={task.title} description={task.description}></TaskCards>
                                        )
                                    }
                                })
                            }
                            {provided.placeholder}
                        </Row> 
                    )}
                </Droppable>
            </Container>
        </OuterCol>
            
    )
}

const TitleForm = styled(Form.Control)`
    background-color: #f1f0ea !important;
    border: none;
    font-size: 1rem;
    color: black;
    border: 1px solid black;

    &:focus{
        box-shadow: inset 0 0 0 2px #0079bf;
        color: black;
    }
`;

const TableTitleForm = styled(Form.Control)`
    background-color: #474448 !important;
    border: none;
    color: white;

    &:focus{
        box-shadow: inset 0 0 0 2px #0079bf;
        color: white;
    }   
`;

const OuterCol = styled(Col)`
    background-color: ${props => (props.isDraggingOver ? "#b9b9b9ab" : "#b9b9b97d")};
`;

export default Table