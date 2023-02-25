import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activitiy";
import {v4 as uuid} from 'uuid'

// export default class ActivityStore {
//     title = 'Hello form';

//     constructor() {
//         makeObservable(this, {
//             title: observable,
//             setTitle: action.bound
//         })
//     }

//     setTitle() {
//         this.title = this.title + '!';
//     }
// }

// export default class ActivityStore {
//     title = 'Hello form';

//     constructor() {
//         makeObservable(this, {
//             title: observable,
//             setTitle: action
//         })
//     }

//     setTitle = () => {
//         this.title = this.title + '!';
//     }
// }


// export default class ActivityStore {
//     title = 'Hello form';

//     constructor() {
//         makeAutoObservable(this)
//     }

//     setTitle = () => {
//         this.title = this.title + '!';
//     }
// }


// this run in action use for mobx strict mode

// export default class ActivityStore {
//     activities : Activity[] = [];
//     selectedActivity: Activity | null = null;
//     editMode = false;
//     loading = false;
//     loadingInitial = false;


//     constructor() {
//         makeAutoObservable(this)
//     }

//     loadActivities = async () => {
        

//         try {
//             const activities = await agent.Activities.list();
//             runInAction(() => {
//                     activities.forEach(activity => {
//                     activity.date = activity.date.split('T')[0];
//                     this.activities.push(activity);
//                   })
//                   this.setLoadingInitial(true);
//             })
            
              
//         } catch (error) {
//             console.log(error);
//             runInAction(() => {
//                 this.loadingInitial= false;
//             })
       
//         }

//     }


// }


export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;


    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) -Date.parse(b.date)  )
    }

    get groupedActivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
                activities[date] = activities[date] ? [...activities[date], activity] 
                :[activity];

                return activities;
            },{} as {[key: string] : Activity[]}  )
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();

                    activities.forEach(activity => {
                     this.setActivity(activity)
                  })
                  this.setLoadingInitial(false);           
              
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);   
       
        }

    }

    loadActivity = async (id:string) => {
        let activitiy = this.getActivity(id);

        if(activitiy) {
            this.selectedActivity = activitiy;
            return activitiy;
        }
        else {
           this.setLoadingInitial(true);

            try {
                activitiy = await agent.Activities.details(id);
                this.setActivity(activitiy);
                runInAction(() =>this.selectedActivity = activitiy);
                this.setLoadingInitial(false);
                return activitiy;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
                
            }
        }
    }

    private setActivity = (activity : Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    } 

    private getActivity = (id:string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) =>{
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity)=> {
        this.loading = true;
        activity.id = uuid();

        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading =false;
            })
        }
    } 

    updateActivity =async (activitiy:Activity) => {
        this.loading = true;

        try {
            await agent.Activities.update(activitiy);

            runInAction( () => {
                this.activityRegistry.set(activitiy.id, activitiy);
                this.selectedActivity = activitiy;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id:string) => {
        this.loading= true;

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
        } catch (error) {
            console.log(error);

            runInAction(() => {
                this.loading = false;
            })
        }
    }
}