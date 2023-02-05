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
    loadingInitial = true;


    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) -Date.parse(b.date)  )
    }

    loadActivities = async () => {
        // this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();

                    activities.forEach(activity => {
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistry.set(activity.id, activity);
                  })
                  this.setLoadingInitial(false);           
              
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);   
       
        }

    }

    setLoadingInitial = (state: boolean) =>{
        this.loadingInitial = state;
    }

    selectActivity = (id:string) => {
        this.selectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        console.log("jknbsdbsbnd");
        id ? this.selectActivity(id) :this.cancelSelectedActivity();
        this.editMode = true;

    }

    closeForm = () => {
        this.editMode = false;
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
                if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
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