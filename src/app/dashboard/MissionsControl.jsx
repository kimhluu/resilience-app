import { makeStyles } from "@material-ui/core/styles";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import PanToolIcon from "@material-ui/icons/PanTool";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ExitToApp from "@material-ui/icons/ExitToApp";

import clsx from "clsx";
import React from "react";
import { useFirestoreConnect } from "react-redux-firebase";
import { Switch } from "react-router-dom";

import { Mission, User } from "../model";
import Appbar from "./Appbar";
import Drawer from "./Drawer";
import Overview from "./Home";
import DashboardMissions from "./Missions";
import DashboardVolunteers from "./Volunteers/Volunteers";
import { useOrganization } from "../model/Organization";
import { routes, AppRoute } from "../routing";

const useStyles = makeStyles((theme) => ({
  root: {
    // the padding accounted for left menu and top header
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
  },
  contentShift: {
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: theme.spacing(6),
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflow: "auto",
  },
}));

/**
 * Component for controlling missions status
 *
 * @component
 */
const MissionsPage = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const org = useOrganization();

  useFirestoreConnect(() => {
    const id = org?.uid;
    return [
      Mission.fsInProposed(id),
      Mission.fsInPlanning(id),
      Mission.fsInProgress(id),
      Mission.fsInDone(id),
      Mission.fsIncomplete(id),
      User.fsVolunteer(id),
      { collection: "organizations", doc: id },
    ];
  });

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  // this should be async
  const drawerItems = [
    {
      text: "Home",
      id: routes.organizer.dashboard.home,
      route: routes.organizer.dashboard.home,
      icon: <HomeIcon />,
    },
    {
      text: "Missions",
      id: routes.organizer.dashboard.missions,
      route: `${routes.organizer.dashboard.missions}?view=inProposed`,
      icon: <AnnouncementIcon />,
    },
    {
      text: "Volunteer Home",
      id: routes.volunteer.dashboard.home,
      route: routes.volunteer.dashboard.home,
      icon: <PeopleIcon />,
    },
    {
      text: "Volunteers",
      id: routes.organizer.dashboard.volunteers,
      route: routes.organizer.dashboard.volunteers,
      icon: <PanToolIcon />,
    },
    {
      text: "Logout",
      id: routes.logout,
      route: routes.logout,
      icon: <ExitToApp />,
    },
    {
      text: "Resilience App",
      id: "/",
      route: "/",
      icon: <AssignmentIcon />,
    },
  ];
  console.log(DashboardMissions);
  return (
    <div className={classes.root}>
      <Appbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Drawer
        open={open}
        handleDrawerClose={handleDrawerClose}
        drawerItems={drawerItems}
        role="navigation"
      />
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <Switch>
          <AppRoute path={routes.organizer.dashboard.missions} component={DashboardMissions} />
          <AppRoute path={routes.organizer.dashboard.home} component={Overview} />
          <AppRoute path={routes.organizer.dashboard.volunteers} component={DashboardVolunteers} />
        </Switch>
      </main>
    </div>
  );
};

export default MissionsPage;
