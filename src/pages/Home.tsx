import axios from "axios"
import React, { useContext, useState } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { Col, Container, Form, Row } from "react-bootstrap"
import styled from "styled-components"
import Table from "../components/Table"
import { AuthContext } from "../contexts/AuthContext"
import { TableContext } from "../contexts/TableContext"
import { TaskContext } from "../contexts/TaskContext"

const Home = ({history}: any) => {

    const [user, setUser] = useContext(AuthContext)
    const [tableTitle, setTableTitle] = useState<string>()
    const [updateTableTitle, setUpdateTableTitle] = useState<string>("")
    const [tableId, setTableId] = useState<any>()
    const [tables, setTables] = useContext(TableContext)
    const [tasks, setTasks] = useContext(TaskContext)


    const addTable = () => {
        axios({
            method: "POST",
            data: {title: tableTitle, owner: user?._id},
            withCredentials: true,
            url: "http://localhost:8080/api/tables"
        }).then((res) => {
            setTables((old: any) => [...old, res.data])
        }).catch((e) => {
            console.log(e)
        })
    }

    const keyPress = (e: any) => {
        if(e.keyCode === 13) {
            setTableTitle("")
            addTable()
        }
    }

    const patchTasks = async (taskId: string, tableId: string) => {
        try {
            axios({
                method: "PATCH",
                data: {table: tableId},
                withCredentials: true,
                url: `http://localhost:8080/api/tasks/${taskId}`
            }).then((res) => {
    
                axios({
                    method: "GET",
                    withCredentials: true,
                    url: "http://localhost:8080/api/tasks"
                }).then((res) => {
                    setTasks(res.data)
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

    const handleOnDragEnd = (result: any) => {
        const {destination, source, draggableId} = result
        console.log(result)

        if(!destination) {return}
        if(destination.droppableId === source.droppableId && destination.index === source.index) {return}

        if(tasks?.length !== 0 && tasks) {
            const allTasks = tasks
            const task = allTasks.splice(source.index, 1)
            setTasks([...tasks, task])
        }

        patchTasks(result.draggableId, result.destination.droppableId)
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <OuterContainer className="h-100 w-100" fluid>
                <Row className="w-100">
                    {
                        tables?.map((table, i) => {
                            return (
                                <Table id={table._id} title={table.title} /> 
                            )
                        })
                    }
                    <Col lg={2} className="m-2">
                        <Container className="p-2" style={{backgroundColor: "#474448"}}>
                            <Row>
                                <Col>
                                    <TitleForm placeholder="New table" onKeyDown={(e: any) => keyPress(e)} value={tableTitle} onChange={(e: any) => setTableTitle(e.target.value)} />
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </OuterContainer>
        </DragDropContext>
    )
}

const TitleForm = styled(Form.Control)`
    background-color: #474448 !important;
    border: none;
    font-size: 1rem;
    color: white;

    &::placeholder{
        color: white;
    }

    &:focus{
        box-shadow: inset 0 0 0 2px #0079bf;
        color: white;
    }
`;

const OuterContainer = styled(Container)`
    display: inline-flex;
`;

export default Home