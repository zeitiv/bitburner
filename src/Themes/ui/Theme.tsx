import React from "react";
import { alpha, createTheme, getLuminance, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { EventEmitter } from "../../utils/EventEmitter";
import { Settings } from "../../Settings/Settings";

export const ThemeEvents = new EventEmitter<[]>();

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      hp: React.CSSProperties["color"];
      money: React.CSSProperties["color"];
      hack: React.CSSProperties["color"];
      combat: React.CSSProperties["color"];
      cha: React.CSSProperties["color"];
      int: React.CSSProperties["color"];
      rep: React.CSSProperties["color"];
      backgroundprimary: React.CSSProperties["color"];
      backgroundsecondary: React.CSSProperties["color"];
      button: React.CSSProperties["color"];
      successlight: React.CSSProperties["color"];
      success: React.CSSProperties["color"];
      successdark: React.CSSProperties["color"];
      white: React.CSSProperties["color"];
      black: React.CSSProperties["color"];
      maplocation: React.CSSProperties["color"];
      disabled: React.CSSProperties["color"];
      primary: React.CSSProperties["color"];
      secondary: React.CSSProperties["color"];
      well: React.CSSProperties["color"];
    };
  }
  interface ThemeOptions {
    colors: {
      hp: React.CSSProperties["color"];
      money: React.CSSProperties["color"];
      hack: React.CSSProperties["color"];
      combat: React.CSSProperties["color"];
      cha: React.CSSProperties["color"];
      int: React.CSSProperties["color"];
      rep: React.CSSProperties["color"];
      backgroundprimary: React.CSSProperties["color"];
      backgroundsecondary: React.CSSProperties["color"];
      button: React.CSSProperties["color"];
      successlight: React.CSSProperties["color"];
      success: React.CSSProperties["color"];
      successdark: React.CSSProperties["color"];
      white: React.CSSProperties["color"];
      black: React.CSSProperties["color"];
      maplocation: React.CSSProperties["color"];
      disabled: React.CSSProperties["color"];
      primary: React.CSSProperties["color"];
      secondary: React.CSSProperties["color"];
      well: React.CSSProperties["color"];
    };
  }
}

let theme: Theme;
const themeStyleSheet = new CSSStyleSheet();

/** alpha() that never throws on a malformed player-supplied color. */
function fade(color: string, opacity: number): string {
  try {
    return alpha(color, opacity);
  } catch {
    return color;
  }
}

function isLightBackground(color: string): boolean {
  try {
    return getLuminance(color) > 0.5;
  } catch {
    return false;
  }
}

export function refreshTheme(): void {
  const c = Settings.theme;
  const radius = 10;
  const border = `1px solid ${fade(c.welllight, 0.9)}`;
  const focusRing = `0 0 0 3px ${fade(c.primary, 0.25)}`;
  const surfaceShadow = `0 1px 0 ${fade(c.white, 0.03)} inset, 0 8px 24px -12px ${fade(c.black, 0.7)}`;
  const popShadow = `0 18px 48px -12px ${fade(c.black, 0.8)}, 0 0 0 1px ${fade(c.welllight, 0.9)}`;
  const glass = {
    backgroundColor: fade(c.backgroundsecondary, 0.82),
    backdropFilter: "blur(14px) saturate(140%)",
    WebkitBackdropFilter: "blur(14px) saturate(140%)",
  };
  const transition =
    "background-color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, color 150ms ease, transform 100ms ease";

  theme = createTheme({
    colors: {
      hp: c.hp,
      money: c.money,
      hack: c.hack,
      combat: c.combat,
      cha: c.cha,
      int: c.int,
      rep: c.rep,
      backgroundprimary: c.backgroundprimary,
      backgroundsecondary: c.backgroundsecondary,
      button: c.button,
      successlight: c.successlight,
      success: c.success,
      successdark: c.successdark,
      white: c.white,
      black: c.black,
      maplocation: c.maplocation,
      disabled: c.disabled,
      primary: c.primary,
      secondary: c.secondary,
      well: c.well,
    },
    shape: { borderRadius: radius },
    palette: {
      mode: isLightBackground(c.backgroundprimary) ? "light" : "dark",
      primary: { light: c.primarylight, main: c.primary, dark: c.primarydark },
      secondary: { light: c.secondarylight, main: c.secondary, dark: c.secondarydark },
      error: { light: c.errorlight, main: c.error, dark: c.errordark },
      info: { light: c.infolight, main: c.info, dark: c.infodark },
      warning: { light: c.warninglight, main: c.warning, dark: c.warningdark },
      success: { light: c.successlight, main: c.success, dark: c.successdark },
      background: { default: c.backgroundprimary, paper: c.well },
      divider: fade(c.welllight, 0.9),
      action: {
        disabled: c.disabled,
        hover: fade(c.primary, 0.08),
        selected: fade(c.primary, 0.14),
      },
    },
    typography: {
      fontFamily: Settings.styles.fontFamily,
      fontSize: Settings.styles.fontSize,
      button: {
        textTransform: "none",
        fontWeight: 500,
        letterSpacing: "0.01em",
      },
      h1: { fontWeight: 700, letterSpacing: "-0.02em" },
      h2: { fontWeight: 700, letterSpacing: "-0.02em" },
      h3: { fontWeight: 600, letterSpacing: "-0.01em" },
      h4: { fontWeight: 600, letterSpacing: "-0.01em" },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: c.well,
            color: c.primary,
            borderRadius: radius - 2,
            transition,
          },
          input: {
            "&::placeholder": {
              userSelect: "none",
              color: c.primarydark,
            },
            // Inputs below 16px trigger iOS Safari's zoom-on-focus, which jars mobile users on every tap.
            "@media (max-width:600px)": {
              fontSize: "16px",
            },
          },
        },
      },

      MuiInput: {
        styleOverrides: {
          root: {
            backgroundColor: c.well,
            border,
            padding: "2px 10px",
            "&:hover:not(.Mui-disabled)": {
              borderColor: fade(c.primary, 0.5),
            },
            "&.Mui-focused": {
              borderColor: c.primary,
              boxShadow: focusRing,
            },
            "&.Mui-error": {
              borderColor: c.error,
            },
          },
          // The boxed look replaces Material's underline.
          underline: {
            "&:before, &:after, &:hover:not(.Mui-disabled):before": {
              display: "none",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: c.primarydark, // why is this switched?
            userSelect: "none",
            "&:before": {
              color: c.primarylight,
            },
          },
          // Leave room for the boxed input's border and padding.
          standard: {
            "&.MuiInputLabel-shrink": {
              transform: "translate(0, -4px) scale(0.75)",
            },
          },
        },
      },

      MuiFormControl: {
        styleOverrides: {
          root: {
            "& label + .MuiInput-root": {
              marginTop: "18px",
            },
          },
        },
      },

      MuiButtonGroup: {
        styleOverrides: {
          root: {
            "& .MuiButton-root:not(:last-of-type)": {
              marginRight: "1px",
            },
          },
          grouped: {
            "&:not(:first-of-type)": { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 },
            "&:not(:last-of-type)": { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
          },
        },
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: c.button,
            backgroundImage: `linear-gradient(180deg, ${fade(c.white, 0.04)}, ${fade(c.white, 0)})`,
            border,
            borderRadius: radius - 2,
            padding: "5px 14px",
            transition,
            "&:hover": {
              backgroundColor: fade(c.primary, 0.12),
              borderColor: fade(c.primary, 0.55),
              boxShadow: `0 0 0 1px ${fade(c.primary, 0.15)}, 0 6px 18px -8px ${fade(c.primary, 0.45)}`,
            },
            "&:active": {
              transform: "translateY(1px)",
            },
            "&.Mui-focusVisible": {
              boxShadow: focusRing,
            },
            "&.Mui-disabled": {
              opacity: 0.55,
              backgroundImage: "none",
            },
          },
          sizeSmall: {
            padding: "3px 10px",
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: c.primary,
          },
        },
        defaultProps: {
          variant: "standard",
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "standard",
        },
      },
      MuiTypography: {
        defaultProps: {
          color: "primary",
        },
        styleOverrides: {
          root: {
            lineHeight: Settings.styles.lineHeight,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            ...glass,
            borderRadius: radius,
            boxShadow: popShadow,
            border: "none",
            marginTop: 4,
          },
          list: {
            backgroundColor: "transparent",
            padding: 4,
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: radius,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: c.primary,
            borderRadius: radius - 4,
            margin: "1px 0",
            "&.Mui-selected": {
              backgroundColor: fade(c.primary, 0.16),
            },
          },
        },
      },
      MuiAccordion: {
        defaultProps: {
          disableGutters: true,
        },
        styleOverrides: {
          root: {
            overflow: "hidden",
            "&:before": { display: "none" },
            "&:not(:last-of-type)": { marginBottom: 6 },
          },
        },
      },
      MuiAccordionSummary: {
        styleOverrides: {
          root: {
            backgroundColor: c.backgroundprimary,
            transition,
            "&:hover": {
              backgroundColor: fade(c.primary, 0.06),
            },
          },
        },
      },
      MuiAccordionDetails: {
        styleOverrides: {
          root: {
            backgroundColor: c.backgroundsecondary,
            borderTop: border,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: c.primary,
            borderRadius: radius - 2,
            transition,
            "&:hover": {
              backgroundColor: fade(c.primary, 0.1),
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            ...glass,
            fontSize: "0.95em",
            color: c.primary,
            borderRadius: radius - 2,
            border,
            boxShadow: popShadow,
            padding: "8px 12px",
            maxWidth: "100vh",
          },
          popper: {
            zIndex: 25000,
          },
        },
        defaultProps: {
          disableInteractive: true,
        },
      },
      MuiSlider: {
        styleOverrides: {
          valueLabel: {
            color: c.primary,
            backgroundColor: c.well,
            borderRadius: radius - 4,
          },
          thumb: {
            "&:hover, &.Mui-focusVisible": {
              boxShadow: `0 0 0 8px ${fade(c.primary, 0.16)}`,
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            "&::-webkit-scrollbar": {
              // webkit
              display: "none",
            },
            scrollbarWidth: "none", // firefox
            backgroundColor: c.backgroundsecondary,
            backgroundImage: `linear-gradient(180deg, ${fade(c.primary, 0.04)}, ${fade(c.primary, 0)} 240px)`,
            borderRadius: 0,
          },
          paperAnchorDockedLeft: {
            borderRight: border,
          },
          paperAnchorLeft: {
            borderRight: border,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: fade(c.welllight, 0.9),
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: c.primary,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            padding: 8,
          },
          switchBase: {
            color: c.secondary,
            "&.Mui-checked": {
              color: c.white,
            },
            "&.Mui-checked + .MuiSwitch-track": {
              backgroundColor: c.primary,
              opacity: 1,
            },
          },
          thumb: {
            width: 16,
            height: 16,
            margin: 2,
            boxShadow: "none",
          },
          track: {
            borderRadius: 11,
            backgroundColor: c.welllight,
            opacity: 1,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            borderRadius: radius - 4,
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundColor: c.backgroundsecondary,
            backgroundImage: "none",
            border,
            boxShadow: surfaceShadow,
          },
          rounded: {
            borderRadius: radius + 2,
          },
        },
      },
      MuiTable: {
        styleOverrides: {
          root: {
            borderCollapse: "separate",
            borderSpacing: 0,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${fade(c.welllight, 0.6)}`,
          },
          head: {
            color: c.secondary,
            fontWeight: 600,
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            transition,
            "&.MuiTableRow-hover:hover": {
              backgroundColor: fade(c.primary, 0.05),
            },
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          select: {
            color: c.primary,
          },
          selectLabel: {
            color: c.primary,
          },
          displayedRows: {
            color: c.primary,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          textColorPrimary: {
            color: c.secondary,
            "&.Mui-selected": {
              color: c.primary,
            },
          },
          root: {
            backgroundColor: "transparent",
            border: "1px solid transparent",
            borderRadius: radius - 2,
            margin: "3px",
            minHeight: 36,
            padding: "6px 14px",
            transition,
            "&:hover": {
              backgroundColor: fade(c.primary, 0.06),
              color: c.secondarylight,
            },
            "&.Mui-selected": {
              backgroundColor: fade(c.primary, 0.14),
              borderColor: fade(c.primary, 0.35),
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            minHeight: 0,
            backgroundColor: c.backgroundsecondary,
            border,
            borderRadius: radius + 2,
            padding: 2,
          },
          scrollButtons: {
            backgroundColor: "transparent",
            borderRadius: radius - 2,
            color: c.secondary,
            margin: "3px",
            opacity: 1,
            width: "fit-content",

            "&.Mui-disabled": {
              opacity: 0.35,
            },
          },
        },
        defaultProps: {
          TabIndicatorProps: {
            style: {
              display: "none",
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: c.backgroundsecondary,
            borderRadius: radius,
            border,
            borderLeftWidth: 3,
          },
          standardSuccess: {
            color: c.successlight,
            borderLeftColor: c.success,
          },
          standardError: {
            color: c.errorlight,
            borderLeftColor: c.error,
          },
          standardWarning: {
            color: c.warninglight,
            borderLeftColor: c.warning,
          },
          standardInfo: {
            color: c.infolight,
            borderLeftColor: c.info,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: radius - 2,
          },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: {
            fontWeight: 700,
            boxShadow: `0 0 0 2px ${c.backgroundsecondary}`,
          },
        },
      },
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            backgroundColor: c.well,
          },
          bar: {
            borderRadius: 999,
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          option: {
            color: c.primary,
            borderRadius: radius - 4,
          },
          inputRoot: {
            height: "100%",
          },
          paper: {
            ...glass,
            boxShadow: popShadow,
            border: "none",
          },
        },
      },
      MuiModal: {
        styleOverrides: {
          root: {
            zIndex: 20000,
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            "&:not(.MuiBackdrop-invisible)": {
              backgroundColor: fade(c.black, 0.6),
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            fontFamily: Settings.styles.fontFamily,
            textUnderlineOffset: "3px",
          },
        },
      },
    },
  });

  document.body.style.backgroundColor = theme.colors.backgroundprimary?.toString() ?? "black";

  const styleSheet =
    ":root {" +
    Object.entries(Settings.theme)
      .map(([k, v]) => `--bb-theme-${k}: ${v}`)
      .join(";") +
    "}" +
    // A faint accent glow at the top of the page gives the flat background some depth.
    `body { background-image: radial-gradient(1200px 600px at 70% -10%, ${fade(c.primary, 0.07)}, transparent 60%),` +
    ` radial-gradient(900px 500px at -10% 110%, ${fade(
      c.info,
      0.05,
    )}, transparent 60%); background-attachment: fixed; }` +
    `::selection { background: ${fade(c.primary, 0.3)}; color: ${c.white}; }` +
    `:focus-visible { outline: 2px solid ${fade(c.primary, 0.6)}; outline-offset: 2px; }` +
    // Thin, themed scrollbars on devices with a mouse; touch devices keep them hidden.
    "@media (hover: hover) and (pointer: fine) {" +
    ` * { scrollbar-width: thin !important; scrollbar-color: ${c.welllight} transparent; }` +
    " *::-webkit-scrollbar { display: block !important; width: 10px; height: 10px; }" +
    " *::-webkit-scrollbar-track { background: transparent; }" +
    ` *::-webkit-scrollbar-thumb { background: ${c.welllight}; border-radius: 999px; border: 3px solid transparent; background-clip: padding-box; }` +
    ` *::-webkit-scrollbar-thumb:hover { background: ${fade(c.primary, 0.5)}; background-clip: padding-box; }` +
    "}";

  themeStyleSheet.replaceSync(styleSheet);
}

document.adoptedStyleSheets.push(themeStyleSheet);
refreshTheme();

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

export const TTheme = ({ children }: IProps): React.ReactElement => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);
