import axios from "axios"
import { createContext, ReactElement, useEffect, useState } from "react"
import {ITask} from "../../models/ITask"

export const TaskContext = createContext<[ITask[] | undefined, any]>([undefined, undefined])

interface Props {
    children: ReactElement
}

export const TaskProvider = ({children}: Props) => {
    
    const [tasks, setTasks] = useState<ITask[]>([] as ITask[])

    useEffect(() => {

        const fetchTasks = () => {
            axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/tasks"
            }).then((res) => {
                setTasks(res.data)
            }).catch((e) => {
                console.log(e)
            })
        }

        fetchTasks()
        
    }, [])

    return (
        <TaskContext.Provider value={[tasks, setTasks]}>
            {children}
        </TaskContext.Provider>
    )
}