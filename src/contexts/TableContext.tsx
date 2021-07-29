import axios from "axios"
import { createContext, ReactElement, useEffect, useState } from "react"
import {ITable} from "../../models/ITable"

interface Props {
    children: ReactElement
}

export const TableContext = createContext<[ITable[] | undefined, any]>([undefined, undefined])

export const TableProvider = ({children}: Props) => {

    const [tables, setTables] = useState<ITable[]>([] as ITable[])

    useEffect(() => {

        const fetchTables = () => {

            if(tables.length !== 0) {return false}

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
        }

        fetchTables()

    }, [tables])

    return (
        <TableContext.Provider value={[tables, setTables]}>
            {children}
        </TableContext.Provider>
    )
}