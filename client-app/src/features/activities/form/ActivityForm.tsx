import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react"; 
import { useStore } from "../../../app/stores/store";



export default observer( function ActivityForm() {

    const {activityStore} = useStore();
    const {selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;

    const initialState = selectedActivity ?? {
        id:'',
        title: '',
        category: '',  
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activitiy, setActivity] = useState(initialState);

    function handleSubmit() {
        activitiy.id ?  updateActivity(activitiy) : createActivity(activitiy);
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const {name, value} = event.target
        setActivity({...activitiy, [name]: value})
    }

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
                <Button floated="right" positive type='button' content="Cancel" onClick={() => closeForm()}/>
            </Form>
        </Segment>
    )
})