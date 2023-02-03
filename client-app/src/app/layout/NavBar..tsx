import React from "react";
import { Button, Container, Menu } from "semantic-ui-react";

interface Props {
    openForm: ()=> void;
}

export default function NavBar({openForm}: Props) {
    return (
        <Menu inverted fixed='top'>
            <Container>
                <Menu.Item header>
                    <img src="/assets/logo.png" alt="Not download" style={{marginRight: 10}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="activities"/>
                <Menu.Item>
                    <Button positive content='create activity' onClick={openForm}/>
                </Menu.Item>
            </Container>
        </Menu> 
    )
}