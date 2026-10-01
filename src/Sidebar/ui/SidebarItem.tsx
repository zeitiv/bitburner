import React, { memo } from "react";
import Badge from "@mui/material/Badge";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { Page } from "../../ui/Router";

export interface ICreateProps {
  key_: Page;
  icon: React.ReactElement["type"];
  count?: number;
  active?: boolean;
  alternateKeys?: Page[];
}

export interface SidebarItemProps extends ICreateProps {
  clickFn: () => void;
  flash: boolean;
  classes: Record<"listitem" | "active" | "navButton", string>;
  sidebarOpen: boolean;
}

export const SidebarItem = memo(function SidebarItem(props: SidebarItemProps): React.ReactElement {
  const color = props.flash ? "error" : props.active ? "primary" : "secondary";
  return (
    <ListItem
      classes={{ root: props.classes.listitem }}
      key={props.key_}
      className={props.active ? props.classes.active : ""}
      disablePadding
    >
      <Tooltip title={!props.sidebarOpen ? props.key_ : ""} placement="right">
        <ListItemButton onClick={props.clickFn} className={props.classes.navButton} selected={props.active}>
          <ListItemIcon>
            <Badge badgeContent={(props.count ?? 0) > 0 ? props.count : undefined} color="error">
              <props.icon color={color} fontSize="small" />
            </Badge>
          </ListItemIcon>
          <ListItemText>
            <Typography color={color} fontWeight={props.active ? 600 : 400}>
              {props.key_}
            </Typography>
          </ListItemText>
        </ListItemButton>
      </Tooltip>
    </ListItem>
  );
});
