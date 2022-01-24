import {
  AppBar,
  Tabs,
  Tab,
  IconButton,
  Toolbar,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from '@material-ui/core';
import React from 'react';
import MenuIcon from '@material-ui/icons/ArrowBack';
import ProfileIcon from '../../common/toolbar/ProfileIcon';
import { useAuthContext } from '../../../modules/auth/auth-context';
import { useRouter } from 'next/router';
import styles from './PlanningToolbar.module.css';
import SettingsIcon from '@material-ui/icons/Settings';
import SettingsDialog from './PlannerSettings';

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const TABS = ['Plan', 'More'] as const;

export type SectionType = typeof TABS[number];

const useStyles = () => {
  return makeStyles((theme: Theme) => {
    return createStyles({
      root: {
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '17vh',
      },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
    });
  })();
};

/**
 * Component properties for a Planning Toolbar.
 */
interface PlanningToolbarProps {
  planId: string;
  /**
   * The currently active tab index.
   */
  sectionIndex: number;

  planTitle: string;

  setPlanTitle: (title: string) => void;

  shouldShowTabs: boolean;

  onTabChange: (newIndex: number) => void;

  /**
   * A callback triggered when the user wants to export the currently loaded plan.
   */
  onExportPlan?: () => void;

  /**
   * A callback triggered when the user wants to import a plan into a planner view.
   *
   * @param event The React form event called when the selected plan is changed.
   */
  onImportPlan?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * A toolbar used for planning mode.
 */
export default function PlanningToolbar({
  planId,
  sectionIndex,
  planTitle,
  setPlanTitle,
  shouldShowTabs: showTabs,
  onTabChange,
  onImportPlan = () => undefined,
  onExportPlan = () => undefined,
}: PlanningToolbarProps) {
  const { signOut } = useAuthContext();

  const handleTabChange = (event, newValue) => {
    onTabChange(newValue);
  };

  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signIn');
  };

  const handleSignOut = () => {
    signOut();
  };

  const classes = useStyles();

  const [dialog, setDialog] = React.useState(false);
  const handleSettings = () => {
    setDialog(!dialog);
  };

  return (
    <AppBar position="relative" className={classes.root}>
      <Toolbar className="flex">
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={() => router.push('/app')}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {planTitle}
        </Typography>
        <Button
          color="inherit"
          onClick={() => {
            onExportPlan();
          }}
        >
          Export plan
        </Button>
        <input
          id="planUpload"
          className={styles.visuallyHidden}
          type="file"
          accept="application/json"
          onChange={onImportPlan}
        />
        <label htmlFor="planUpload">
          {/* This must render as a span for the input to function */}
          <Button color="inherit" component="span">
            Import plan
          </Button>
        </label>
        <IconButton onClick={handleSettings} className="">
          <SettingsIcon color="inherit" className="text-white" />
        </IconButton>
        {/* <ProfileIcon onSignIn={handleSignIn} onSignOut={handleSignOut} /> */}
      </Toolbar>
      <SettingsDialog
        planId={planId}
        isOpen={dialog}
        setOpen={setDialog}
        updatePlanTitle={setPlanTitle}
      />
      {showTabs && (
        <Tabs
          className="flex"
          value={sectionIndex}
          onChange={handleTabChange}
          aria-label="Degree plan sections"
        >
          {TABS.map((tab, index) => {
            return <Tab key={tab + '-' + index} label={tab} {...a11yProps(index)} />;
          })}
        </Tabs>
      )}
    </AppBar>
  );
}

export function usePlanningToolbar(initialSection = 0, initialTitle = 'Your plan') {
  const [section, setSection] = React.useState(initialSection);
  const [title, setTitle] = React.useState(initialTitle);
  const [shouldShowTabs, setShouldShowTabs] = React.useState(true);

  const hideTabs = () => {
    setShouldShowTabs(false);
  };

  const showTabs = () => {
    setShouldShowTabs(true);
  };

  return {
    title,
    setTitle,
    section,
    setSection,
    showTabs,
    hideTabs,
    shouldShowTabs,
  };
}
