import React, { useMemo, useCallback, useState, useEffect, useRef } from "react";
import { alpha, styled, Theme, CSSObject, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeStyles } from "tss-react/mui";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ComputerIcon from "@mui/icons-material/Computer"; // Hacking
import LastPageIcon from "@mui/icons-material/LastPage"; // Terminal
import CreateIcon from "@mui/icons-material/Create"; // Create Script
import StorageIcon from "@mui/icons-material/Storage"; // Active Scripts
import BugReportIcon from "@mui/icons-material/BugReport"; // Create Program
import EqualizerIcon from "@mui/icons-material/Equalizer"; // Stats
import ContactsIcon from "@mui/icons-material/Contacts"; // Factions
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow"; // Augmentations
import AccountTreeIcon from "@mui/icons-material/AccountTree"; // Hacknet
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; // Sleeves
import LocationCityIcon from "@mui/icons-material/LocationCity"; // City
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive"; // Travel
import WorkIcon from "@mui/icons-material/Work"; // Job
import TrendingUpIcon from "@mui/icons-material/TrendingUp"; // Stock Market
import FormatBoldIcon from "@mui/icons-material/FormatBold"; // Bladeburner
import BusinessIcon from "@mui/icons-material/Business"; // Corp
import SportsMmaIcon from "@mui/icons-material/SportsMma"; // Gang
import CheckIcon from "@mui/icons-material/Check"; // Milestones
import HelpIcon from "@mui/icons-material/Help"; // Tutorial
import SettingsIcon from "@mui/icons-material/Settings"; // options
import DeveloperBoardIcon from "@mui/icons-material/DeveloperBoard"; // Stanek + Dev
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Achievements
import AccountBoxIcon from "@mui/icons-material/AccountBox"; // Character
import PublicIcon from "@mui/icons-material/Public"; // World
import LiveHelpIcon from "@mui/icons-material/LiveHelp"; // Help
import BorderInnerSharpIcon from "@mui/icons-material/BorderInnerSharp"; // IPvGO
import ShareIcon from "@mui/icons-material/Share"; // DarkWeb
import BiotechIcon from "@mui/icons-material/Biotech"; // Grafting

import { Router } from "../../ui/GameRoot";
import { ComplexPage, SimplePage } from "../../ui/Enums";
import { Page, isSimplePage } from "../../ui/Router";
import { SidebarAccordion } from "./SidebarAccordion";
import { Player } from "@player";
import { CONSTANTS } from "../../Constants";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../../InteractiveTutorial";
import { getAvailableCreatePrograms } from "../../Programs/ProgramHelpers";
import { Settings } from "../../Settings/Settings";
import { AugmentationName } from "@enums";

import { ProgramsSeen } from "../../Programs/ui/ProgramsRoot";
import { InvitationsSeen } from "../../Faction/ui/FactionsRoot";
import { commitHash } from "../../utils/helpers/commitHash";
import { useCycleRerender } from "../../ui/React/hooks";
import { playerHasDiscoveredGo } from "../../Go/effects/effect";
import { knowAboutBitverse } from "../../BitNode/BitNodeUtils";
import {
  convertKeyboardEventToKeyCombination,
  determineKeyBindingTypes,
  type GoToPageKeyBindingType,
  KeyBindingEvents,
  KeyBindingEventType,
  ScriptEditorAction,
  type KeyBindingType,
  CurrentKeyBindings,
} from "../../utils/KeyBindingUtils";
import { throwIfReachable } from "../../utils/helpers/throwIfReachable";
import { ErrorState } from "../../ErrorHandling/ErrorState";

import { hasDarknetAccess } from "../../DarkNet/utils/darknetAuthUtils";

const RotatedDoubleArrowIcon = React.forwardRef(function RotatedDoubleArrowIcon(
  props: { color: "primary" | "secondary" | "error" },
  __ref: React.ForwardedRef<SVGSVGElement>,
) {
  return <DoubleArrowIcon {...props} style={{ transform: "rotate(-90deg)" }} ref={__ref} />;
});

const openedMixin = (theme: Theme): CSSObject => ({
  width: theme.spacing(31),
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(2)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(7)} + 1px)`,
  },
});

// `open` must actually reach MuiDrawer (not just this styled wrapper's CSS): the permanent
// variant ignores it, but the mobile temporary/overlay variant relies on it to mount at all.
const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  width: theme.spacing(31),
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles()((theme: Theme) => ({
  active: {},
  listitem: {},
  navButton: {
    position: "relative",
    margin: "1px 8px",
    padding: "6px 8px",
    minHeight: 38,
    borderRadius: theme.shape.borderRadius,
    transition: "background-color 150ms ease",
    "& .MuiListItemIcon-root": { minWidth: 36 },
    "&:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.08) },
    "&.Mui-selected, &.Mui-selected:hover": { backgroundColor: alpha(theme.palette.primary.main, 0.14) },
    // Accent bar on the active page.
    "&.Mui-selected::before": {
      content: '""',
      position: "absolute",
      left: -8,
      top: 8,
      bottom: 8,
      width: 3,
      borderRadius: "0 3px 3px 0",
      backgroundColor: theme.palette.primary.main,
      boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.6)}`,
    },
  },
  sectionButton: {
    margin: "10px 8px 2px",
    padding: "2px 8px",
    minHeight: 30,
    borderRadius: theme.shape.borderRadius,
    "& .MuiListItemIcon-root": { minWidth: 36 },
    "&:hover": { backgroundColor: "transparent", "& .MuiTypography-root": { color: theme.palette.secondary.light } },
  },
  brand: {
    margin: "8px",
    padding: "8px",
    borderRadius: theme.shape.borderRadius,
    "& .MuiListItemIcon-root": { minWidth: 40 },
  },
  logo: {
    width: 26,
    height: 26,
    borderRadius: 8,
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    fontWeight: 800,
    fontSize: 12,
    color: theme.palette.background.default,
    background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.info.main})`,
    boxShadow: `0 4px 14px -4px ${alpha(theme.palette.primary.main, 0.7)}`,
  },
  appBar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    zIndex: 1550,
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0 8px",
    paddingTop: "env(safe-area-inset-top)",
    backgroundColor: alpha(theme.palette.background.default, 0.78),
    backdropFilter: "blur(14px) saturate(140%)",
    WebkitBackdropFilter: "blur(14px) saturate(140%)",
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}));

export function SidebarRoot(props: { page: Page }): React.ReactElement {
  const isSettingUpKeyBindings = useRef(false);
  useCycleRerender();
  const theme = useTheme();
  // noSsr: this is a client-only app, so read the real match on first render instead of
  // useMediaQuery's SSR-safe `false` default (which would race the `open` state initializer below).
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), { noSsr: true });

  let flash: Page | null = null;
  switch (ITutorial.currStep) {
    case iTutorialSteps.CharacterGoToTerminalPage:
    case iTutorialSteps.ActiveScriptsDescription:
      flash = Page.Terminal;
      break;
    case iTutorialSteps.GoToCharacterStatsPage:
      flash = Page.Stats;
      break;
    case iTutorialSteps.TerminalGoToActiveScriptsPage:
      flash = Page.ActiveScripts;
      break;
    case iTutorialSteps.GoToHacknetNodesPage:
      flash = Page.Hacknet;
      break;
    case iTutorialSteps.HacknetNodesGoToWorldPage:
      flash = Page.City;
      break;
    case iTutorialSteps.WorldDescription:
      flash = Page.Documentation;
      break;
  }

  const augmentationCount = Player.queuedAugmentations.length;
  const invitationsCount = Player.factionInvitations.filter((f) => !InvitationsSeen.has(f)).length;
  const programCount = getAvailableCreatePrograms().length - ProgramsSeen.size;
  const errorCount = ErrorState.UnreadErrors;

  const canOpenFactions =
    Player.factionInvitations.length > 0 ||
    Player.factions.length > 0 ||
    Player.factionRumors.size > 0 ||
    Player.augmentations.length > 0 ||
    Player.queuedAugmentations.length > 0 ||
    knowAboutBitverse();

  const canOpenAugmentations =
    Player.augmentations.length > 0 ||
    Player.queuedAugmentations.length > 0 ||
    knowAboutBitverse() ||
    Player.exploits.length > 0;

  const canOpenSleeves = Player.sleeves.length > 0;
  const canOpenGrafting = Player.canAccessGrafting();

  const canCorporation = !!Player.corporation;
  const canGang = !!Player.gang;
  const canJob = Object.values(Player.jobs).length > 0;
  const canStockMarket = Player.hasWseAccount;
  const canBladeburner = !!Player.bladeburner;
  const canStaneksGift = Player.augmentations.some((aug) => aug.name === AugmentationName.StaneksGift1);
  const canIPvGO = playerHasDiscoveredGo();
  const canDarkNet = hasDarknetAccess();

  const clickPage = useCallback(
    (page: Page) => {
      if (page == Page.ScriptEditor) {
        Router.toPage(page, {
          files: new Map(),
          options: { vim: Settings.MonacoDefaultToVim, hostname: Player.currentServer },
        });
      } else if (page === Page.Documentation || page === Page.Options || page === Page.ActiveScripts) {
        Router.toPage(page, {});
      } else if (isSimplePage(page)) {
        Router.toPage(page);
      } else {
        throw new Error("Can't handle click on Page " + page);
      }
      if (flash === page) {
        iTutorialNextStep();
      }
      // On mobile the drawer is a full overlay, so close it after navigating instead of
      // leaving it covering the page content. Desktop's persisted open/closed rail is untouched.
      if (isMobile) {
        setOpen(false);
      }
    },
    [flash, isMobile],
  );

  /**
   * We use "keyBindingType is GoToPageKeyBindingType" to narrow down the type of keyBindingType.
   */
  const canGoToPage = useCallback(
    (keyBindingType: KeyBindingType): keyBindingType is GoToPageKeyBindingType => {
      switch (keyBindingType) {
        case SimplePage.Terminal:
        case ComplexPage.ScriptEditor:
        case ComplexPage.ActiveScripts:
        case SimplePage.CreateProgram:
        case SimplePage.Stats:
        case SimplePage.Hacknet:
        case SimplePage.City:
        case SimplePage.Travel:
        case SimplePage.Milestones:
        case ComplexPage.Documentation:
        case SimplePage.Achievements:
        case ComplexPage.Options:
          return true;
        case SimplePage.StaneksGift:
          return canStaneksGift;
        case SimplePage.Factions:
          return canOpenFactions;
        case SimplePage.Augmentations:
          return canOpenAugmentations;
        case SimplePage.Sleeves:
          return canOpenSleeves;
        case SimplePage.Grafting:
          return canOpenGrafting;
        case SimplePage.Job:
          return canJob;
        case SimplePage.StockMarket:
          return canStockMarket;
        case SimplePage.Bladeburner:
          return canBladeburner;
        case SimplePage.Corporation:
          return canCorporation;
        case SimplePage.Gang:
          return canGang;
        case SimplePage.Go:
          return canIPvGO;
        case SimplePage.DarkNet:
          return canDarkNet;
        case ScriptEditorAction.Save:
        case ScriptEditorAction.GoToTerminal:
        case ScriptEditorAction.Run:
          return false;
        default:
          throwIfReachable(keyBindingType);
      }
      return false;
    },
    [
      canStaneksGift,
      canOpenFactions,
      canOpenAugmentations,
      canOpenSleeves,
      canOpenGrafting,
      canJob,
      canStockMarket,
      canBladeburner,
      canCorporation,
      canGang,
      canIPvGO,
      canDarkNet,
    ],
  );

  useEffect(() => {
    const clearSubscription = KeyBindingEvents.subscribe((eventType) => {
      if (eventType === KeyBindingEventType.StartSettingUp) {
        isSettingUpKeyBindings.current = true;
      }
      if (eventType === KeyBindingEventType.StopSettingUp) {
        isSettingUpKeyBindings.current = false;
      }
    });
    return clearSubscription;
  }, []);

  useEffect(() => {
    function handleShortcuts(this: Document, event: KeyboardEvent): void {
      if (Settings.DisableHotkeys) {
        return;
      }
      if (event.getModifierState(event.key)) {
        return;
      }
      if (isSettingUpKeyBindings.current) {
        return;
      }
      if ((Player.currentWork && Player.focus) || Router.page() === Page.BitVerse) {
        return;
      }
      const keyBindingTypes = determineKeyBindingTypes(CurrentKeyBindings, convertKeyboardEventToKeyCombination(event));
      for (const keyBindingType of keyBindingTypes) {
        if (!canGoToPage(keyBindingType)) {
          continue;
        }
        event.preventDefault();
        clickPage(keyBindingType);
      }
    }

    document.addEventListener("keydown", handleShortcuts);
    return () => document.removeEventListener("keydown", handleShortcuts);
  }, [canGoToPage, clickPage, props.page]);

  const { classes } = useStyles();
  const [open, setOpen] = useState(() => (isMobile ? false : Settings.IsSidebarOpened));
  const toggleDrawer = useCallback(
    (): void =>
      setOpen((old) => {
        // The open/closed rail is a desktop preference; don't let mobile's overlay open/close persist it.
        if (!isMobile) Settings.IsSidebarOpened = !old;
        return !old;
      }),
    [isMobile],
  );
  const li_classes = useMemo(() => ({ root: classes.listitem }), [classes.listitem]);
  const ChevronOpenClose = open ? ChevronLeftIcon : ChevronRightIcon;

  // Explicitly useMemo() to save rerendering deep chunks of this tree.
  // memo() can't be (easily) used on components like <List>, because the
  // props.children array will be a different object every time.
  return (
    <>
      {isMobile && (
        <Box className={classes.appBar}>
          <IconButton aria-label="open sidebar" onClick={toggleDrawer}>
            <MenuIcon color="primary" />
          </IconButton>
          <Box className={classes.logo}>&gt;_</Box>
          <Typography noWrap fontWeight={600} sx={{ ml: 0.5 }}>
            {props.page}
          </Typography>
        </Box>
      )}
      <Drawer
        open={open}
        anchor="left"
        variant={isMobile ? "temporary" : "permanent"}
        onClose={toggleDrawer}
        sx={isMobile ? { zIndex: 1600 } : undefined}
      >
        {useMemo(
          () => (
            <ListItem classes={li_classes} disablePadding>
              <ListItemButton onClick={toggleDrawer} className={classes.brand} aria-label="toggle sidebar">
                <ListItemIcon>
                  <Box className={classes.logo}>&gt;_</Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Tooltip title={commitHash()}>
                      <Box>
                        <Typography fontWeight={700} lineHeight={1.2}>
                          Bitburner
                        </Typography>
                        <Typography variant="caption" color="secondary" lineHeight={1.2}>
                          v{CONSTANTS.VersionString}
                        </Typography>
                      </Box>
                    </Tooltip>
                  }
                />
                <ChevronOpenClose color="secondary" fontSize="small" />
              </ListItemButton>
            </ListItem>
          ),
          [ChevronOpenClose, li_classes, classes.brand, classes.logo, toggleDrawer],
        )}
        <Divider sx={{ mx: 1.5 }} />
        <List sx={{ pt: 0 }}>
          <SidebarAccordion
            key_="Hacking"
            page={props.page}
            clickPage={clickPage}
            flash={flash}
            icon={ComputerIcon}
            sidebarOpen={open}
            classes={classes}
            items={[
              { key_: Page.Terminal, icon: LastPageIcon },
              { key_: Page.ScriptEditor, icon: CreateIcon },
              {
                key_: Page.ActiveScripts,
                icon: StorageIcon,
                count: errorCount,
                alternateKeys: [Page.RecentErrors, Page.RecentlyKilledScripts],
              },
              { key_: Page.CreateProgram, icon: BugReportIcon, count: programCount },
              canStaneksGift && { key_: Page.StaneksGift, icon: DeveloperBoardIcon },
            ]}
          />
          <Typography component="div" id="sidebar-extra-hook-0"></Typography>
          <SidebarAccordion
            key_="Character"
            page={props.page}
            clickPage={clickPage}
            flash={flash}
            icon={AccountBoxIcon}
            sidebarOpen={open}
            classes={classes}
            items={[
              { key_: Page.Stats, icon: EqualizerIcon },
              canOpenFactions && {
                key_: Page.Factions,
                icon: ContactsIcon,
                active: [Page.Factions, Page.Faction].includes(props.page),
                count: invitationsCount,
              },
              canOpenAugmentations && {
                key_: Page.Augmentations,
                icon: RotatedDoubleArrowIcon,
                count: augmentationCount,
              },
              { key_: Page.Hacknet, icon: AccountTreeIcon },
              canOpenSleeves && { key_: Page.Sleeves, icon: PeopleAltIcon },
              canOpenGrafting && { key_: Page.Grafting, icon: BiotechIcon },
            ]}
          />
          <Typography component="div" id="sidebar-extra-hook-1"></Typography>
          <SidebarAccordion
            key_="World"
            page={props.page}
            clickPage={clickPage}
            flash={flash}
            icon={PublicIcon}
            sidebarOpen={open}
            classes={classes}
            items={[
              {
                key_: Page.City,
                icon: LocationCityIcon,
                active: [Page.City, Page.Location].includes(props.page),
              },
              { key_: Page.Travel, icon: AirplanemodeActiveIcon },
              canJob && { key_: Page.Job, icon: WorkIcon },
              canStockMarket && { key_: Page.StockMarket, icon: TrendingUpIcon },
              canBladeburner && { key_: Page.Bladeburner, icon: FormatBoldIcon },
              canCorporation && { key_: Page.Corporation, icon: BusinessIcon },
              canGang && { key_: Page.Gang, icon: SportsMmaIcon },
              canIPvGO && { key_: Page.Go, icon: BorderInnerSharpIcon },
              canDarkNet && { key_: Page.DarkNet, icon: ShareIcon },
            ]}
          />
          <Typography component="div" id="sidebar-extra-hook-2"></Typography>
          <SidebarAccordion
            key_="Help"
            page={props.page}
            clickPage={clickPage}
            flash={flash}
            icon={LiveHelpIcon}
            sidebarOpen={open}
            classes={classes}
            items={[
              { key_: Page.Milestones, icon: CheckIcon },
              { key_: Page.Documentation, icon: HelpIcon },
              { key_: Page.Achievements, icon: EmojiEventsIcon },
              { key_: Page.Options, icon: SettingsIcon },
              process.env.NODE_ENV === "development" && { key_: Page.DevMenu, icon: DeveloperBoardIcon },
            ]}
          />
          <Typography component="div" id="sidebar-extra-hook-3"></Typography>
        </List>
      </Drawer>
    </>
  );
}
