import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import {v4 as uuid} from 'uuid'
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activitiy';
import NavBar from './NavBar.';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashboard';


function App() {
  const [activities , setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);

  // then method take call back functio 
  useEffect(() => {
    axios.get<Activity[]>('http://localhost:5000/api/activities')
    .then(response => {
      console.log(response);
      setActivities(response.data)
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id))
  }

  function handleCancelActivity() {
    setSelectedActivity(undefined);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  
  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelActivity();
    setEditMode(true);
  }
 
  function handleCreateOrEditActivity(activitiy : Activity){
    activitiy.id 
    ? setActivities([...activities.filter(x => x.id !== activitiy.id), activitiy])
    : setActivities([...activities, {...activitiy, id: uuid()}]);

    setEditMode(false);
    setSelectedActivity(activitiy);

  }

  function handleDeleteActivity(id: string) {
    setActivities([...activities.filter(x => x.id !==id)])
  }

  return (
    <Fragment>
        <NavBar openForm={handleFormOpen}/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashBoard 
              activities={activities} 
              selectedActivity={selectedActivity}
              selectActivity= {handleSelectActivity}
              cancelSelectActivity={handleCancelActivity}
              editMode={editMode}
              openForm={handleFormOpen}
              closeForm={handleFormClose}
              createOrEdit={handleCreateOrEditActivity}
              deleteActivity={handleDeleteActivity}
          />
        </Container>

    </Fragment>
  );
}

export default App;
