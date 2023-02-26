import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Grid, Icon, Image } from "semantic-ui-react";
import LoadingCombonent from "../../../app/layout/LoadingCombonent";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedChat from "./ActivityDetailChat";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSideBar from "./ActivityDetailedSideBar";
import ActivityDetailsHeader from "./ActivityDetailsHeader";



export default observer ( function ActivityDetails() {

    const {activityStore} =useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial} =  activityStore;
    const {id} = useParams();

    useEffect (() => {
        if(id) loadActivity(id);
    }, [id, loadActivity])

    if (loadingInitial ||  !activity) return <LoadingCombonent/>;

    return (

        <Grid>
            <Grid.Column width={10}>
                 <ActivityDetailsHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/> 
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}> 
                <ActivityDetailedSideBar/>
            </Grid.Column>
        </Grid>

        // <Card fluid>
        //     <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
        //     <Card.Content>
        //         <Card.Header>{activity.title}</Card.Header>
        //         <Card.Meta><span>{activity.date}</span></Card.Meta>
        //         <Card.Description>{activity.description}</Card.Description>
        //     </Card.Content>
        //     <Card.Content extra>
        //         <Button.Group widths='2'>
        //             <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content='Edit' />
        //             <Button as={Link} to='/activities' basic color='grey' content='Cancel'/>
        //         </Button.Group>
        //     </Card.Content>
        // </Card>
    )
})