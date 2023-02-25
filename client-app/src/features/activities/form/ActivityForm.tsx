import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react"; 
import LoadingCombonent from "../../../app/layout/LoadingCombonent";
import { Activity } from "../../../app/models/activitiy";
import { useStore } from "../../../app/stores/store";
import {v4 as uuid} from 'uuid'



export default observer( function ActivityForm() {

    const {activityStore} = useStore();
    const {selectedActivity,createActivity, updateActivity, 
        loading, loadActivity, loadingInitial } = activityStore;
    const {id} = useParams();
    const navigate= useNavigate();

    const [activitiy, setActivity] = useState<Activity>({
        id:'',
        title: '',
        category: '',  
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if(id) loadActivity(id).then(activitiy => setActivity(activitiy!)) 
    }, [id, loadActivity]);

    function handleSubmit() {
        if(!activitiy.id ) {
            activitiy.id = uuid();
            createActivity(activitiy).then(() => navigate(`/activities/${activitiy.id}`));
        }
        else {
            updateActivity(activitiy).then(() => navigate(`/activities/${activitiy.id}`));
        }
    }

    function cancelForm() {
        navigate(`/activities/${activitiy.id}`)
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target
        setActivity({...activitiy, [name]: value})
    }

    if (loadingInitial) return <LoadingCombonent content="Loading activity ..."/>

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder="Title" value={activitiy.title} name='title' onChange={handleInputChange}/>
                <Form.TextArea placeholder="Description" value={activitiy.description} name='description' onChange={handleInputChange} />
                <Form.Input placeholder="Category" value={activitiy.category} name='category' onChange={handleInputChange} />
                <Form.Input type="date" placeholder="Date" value={activitiy.date} name='date' onChange={handleInputChange}/>
                <Form.Input placeholder="City" value={activitiy.city} name='city' onChange={handleInputChange} />
                <Form.Input placeholder="Venue" value={activitiy.venue} name='venue' onChange={handleInputChange} />

                <Button loading={loading} floated="right" positive type='submit' content="Submit"/>
                <Button onClick={()=> cancelForm()} floated="right" positive type='button' content="Cancel"/>
            </Form>
        </Segment>
    )
})