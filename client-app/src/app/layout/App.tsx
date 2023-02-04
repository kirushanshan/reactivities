import React, { Fragment, useEffect, useState } from 'react';
import {v4 as uuid} from 'uuid'
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activitiy';
import NavBar from './NavBar.';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingCombonent from './LoadingCombonent';


function App() {
  const [activities , setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // then method take call back functio 
  useEffect(() => {
    agent.Activities.list().then(response => {

      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(activities)
      setLoading(false);
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
    setSubmitting(true);
    if(activitiy.id) {
      agent.Activities.update(activitiy).then(() => {
        setActivities([...activities.filter(x => x.id !== activitiy.id), activitiy])
        setSelectedActivity(activitiy);
        setEditMode(false);
        setSubmitting(false);
      })
    }
    else {
      activitiy.id = uuid();
          agent.Activities.create(activitiy).then(() => {
          setActivities([...activities, activitiy]);
          setSelectedActivity(activitiy);
          setEditMode(false);
          setSubmitting(false);
      })
    }

  }

  function handleDeleteActivity(id: string) {
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !==id)])
      setSubmitting(false);
    })
    
  }

  if (loading) return <LoadingCombonent content='Loading App'/>

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
              submitting={submitting}
          />
        </Container>

    </Fragment>
  );
}

export default App;
