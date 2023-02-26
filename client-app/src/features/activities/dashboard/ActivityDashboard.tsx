
import { observer } from 'mobx-react-lite';
import React, { useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import LoadingCombonent from '../../../app/layout/LoadingCombonent';
import { useStore } from "../../../app/stores/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityFilters from './ActivityFilter';
import ActivityList from "./ActivityList";


export default observer ( function ActivityDashBoard() {

    const {activityStore} = useStore();
    const {selectedActivity, editMode } = activityStore;
    // then method take call back functio 
    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore])
  
   
  
    if (activityStore.loadingInitial) return <LoadingCombonent content='Loading App'/>


    return (
        <Grid>
            <GridColumn width='10'>
                <ActivityList/>
            </GridColumn>
            <GridColumn width='6'>
                <ActivityFilters/>
            </GridColumn>
            
        </Grid>
    )
})