import { useContext, useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import { Card, Col, Row } from "react-bootstrap"
import styled from "styled-components"
import UpdateTaskModal from "./modals/UpdateTaskModal"

export interface ITaskCard {
    title?: string,
    description?: string,
    id: any,
    indexId: number,
    labels?: string[]
}

const TaskCards = ({title, description, id, indexId, labels}: ITaskCard) => {

    const [chosenTaskId, setChosenTaskId] = useState<any>()
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false)

    const openUpdateModal = (id: any) => {
        setChosenTaskId(id)
        setShowUpdateModal(true)
    }

    return (
        
            <Draggable key={`TaskCard-${indexId}`} index={indexId} draggableId={id}>
                {(provided) => (
                    <>
                        <OuterCol className="mt-4" lg={12} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} innerRef={provided.innerRef}>
                            <Card onClick={() => openUpdateModal(id)} style={{border: "none"}} className="p-2">
                                <Row>
                                {
                                    labels?.map((label) => {
                                        return (
                                            <Col className="ml-2" lg={2} style={{backgroundColor: label, color: label, height: "0.4rem"}}>
                                                <span className="pl-2 pr-2"><span style={{display:"none"}}>{label}</span></span>
                                            </Col>
                                        )
                                    })
                                }
                                </Row>
                                
                                <Card.Title className={`m-0 ${labels?.length !== 0 && "mt-2"}`} style={{fontSize: "1rem"}}>{title}</Card.Title>
                                <Card.Text>{description}</Card.Text>
                            </Card>
                        </OuterCol>
                    
                        <UpdateTaskModal id={id} show={showUpdateModal} onHide={() => setShowUpdateModal(false)} />
                    </>
                )}
            </Draggable>
            
    )
}

const OuterCol = styled(Col)`

`;

export default TaskCards