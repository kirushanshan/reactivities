import React, { Fragment, useEffect, useState } from 'react';
import {  Container } from 'semantic-ui-react';
import { Activity } from '../models/activitiy';
import NavBar from './NavBar.';
import ActivityDashBoard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingCombonent from './LoadingCombonent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { Outlet, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/homePage';


function App() {

const location = useLocation()

  return (
    <Fragment>
      {location.pathname === '/' ? <HomePage/> : (
        <>
                    <NavBar/>
              <Container style={{marginTop: '7em'}}>
            <Outlet  />
          </Container> 
        </>
      )}
    </Fragment>
  );
}

export default observer(App);
