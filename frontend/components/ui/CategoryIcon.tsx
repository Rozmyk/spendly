import { Box } from "@mui/material";
import {
  IconBuildingEstate,
  IconBus,
  IconDeviceGamepad,
  IconDots,
  IconShoppingBag,
} from "@tabler/icons-react";

const visuals = {
  Food: { Icon: IconShoppingBag, color: "#a76718", background: "#fff0d8" },
  Home: { Icon: IconBuildingEstate, color: "#3d7e67", background: "#dff5eb" },
  Transport: { Icon: IconBus, color: "#356bc2", background: "#e3edff" },
  Entertainment: {
    Icon: IconDeviceGamepad,
    color: "#885bc5",
    background: "#f0e5ff",
  },
  Other: { Icon: IconDots, color: "#a94c6d", background: "#ffe5ec" },
} as const;

export function CategoryIcon({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
}) {
  const visual = visuals[name as keyof typeof visuals] || visuals.Other;
  const Icon = visual.Icon;

  return (
    <Box
      aria-hidden="true"
      sx={{
        display: "grid",
        width: size,
        height: size,
        flexShrink: 0,
        placeItems: "center",
        borderRadius: `${Math.round(size * 0.32)}px`,
        color: visual.color,
        bgcolor: visual.background,
      }}
    >
      <Icon size={Math.round(size * 0.6)} stroke={2} />
    </Box>
  );
}
