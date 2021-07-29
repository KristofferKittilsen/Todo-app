import { useContext } from "react"
import { Image, Nav, Navbar, NavDropdown } from "react-bootstrap"
import styled from "styled-components"
import { AuthContext } from "../contexts/AuthContext"


const Topmenu = ({history}: any) => {

    const [user, setUser] = useContext(AuthContext)

    const logout = async () => {
        let response

        try {
            response = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json"
                }
            })

            if(response.status !== 204) {
                return console.log("Failed to logout")
            }

            setUser(undefined)
            history.push("/login")
        } catch(e) {
            console.log(e)
        }
    }

    return (
        <NavbarStyled className="pl-0">
            <NavbarBrandStyled className="m-0 pl-5">Table title</NavbarBrandStyled>
            <Navbar.Collapse className="justify-content-end">
                <NavDropdownStyled title={user?.email} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdownStyled>
                <Image rounded/>
            </Navbar.Collapse>
        </NavbarStyled>
    )
}

const NavbarStyled = styled(Navbar)`
    background-color: #b9b9b97d;
`;  

const NavbarBrandStyled = styled(Navbar.Brand)`
    font-size: 2rem;
`;

const NavDropdownStyled = styled(NavDropdown)`
    a{
        color: black !important;
    }
`;

export default Topmenu