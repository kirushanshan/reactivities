import React, { Fragment, useEffect, useState } from 'react';
import {  Container } from 'semantic-ui-react';
import { Activity } from '../models/activitiy';
import NavBar from './NavBar.';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingCombonent from './LoadingCombonent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';


function App() {

  const {activityStore} = useStore();

  // then method take call back functio 
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore])

 

  if (activityStore.loadingInitial) return <LoadingCombonent content='Loading App'/>

  return (
    <Fragment>
        <NavBar/>
        <Container style={{marginTop: '7em'}}>
          <ActivityDashBoard  />
        </Container>

    </Fragment>
  );
}

export default observer(App);
