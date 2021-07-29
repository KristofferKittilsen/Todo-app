import { useEffect } from "react";
import { createContext } from "react";
import { ReactElement, useState } from "react";
import {IUser} from "../../models/IUser"
import axios from "axios"

export const AuthContext = createContext<[IUser | undefined, (user: IUser | undefined) => void]>([undefined, (user: IUser | undefined) => user])

interface Props {
    children: ReactElement
}

export const AuthProvider = ({children}: Props) => {
    
    const [user, setUser] = useState<IUser>()
    const [canDisplay, setCanDisplay] = useState<boolean>(false)

    useEffect(() => {

        const fetchUser = () => {

            if(user) {return false}

            axios({
                method: "GET",
                withCredentials: true,
                url: "http://localhost:8080/api/users/user"
            }).then((res) => {
                if(res.data) {
                    setUser(res.data)
                } else {
                    setUser(undefined)
                }
                setCanDisplay(true)
            }).catch((e) => {
                setCanDisplay(true)
            })
        }

        fetchUser()
    }, [user])

    return (
        <AuthContext.Provider value={[user, setUser]}>
            {canDisplay ? children : <p>...Loading</p>}
        </AuthContext.Provider>
    )
}