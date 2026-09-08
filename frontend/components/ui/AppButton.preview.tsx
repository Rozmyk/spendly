import { Box, Stack } from "@mui/material";
import AppButton from "./AppButton";

export default function AppButtonPreview() {
  return <Stack spacing={2} sx={{ width: 280, p: 3 }}><Box>Default</Box><AppButton>Continue</AppButton><Box>Hover</Box><AppButton className="is-hover">Continue</AppButton><Box>Focus</Box><AppButton className="is-focus">Continue</AppButton><Box>Active</Box><AppButton className="is-active">Continue</AppButton><Box>Disabled</Box><AppButton disabled>Continue</AppButton><Box>Loading</Box><AppButton loading>Continue</AppButton><Box>Error</Box><AppButton tone="danger">Try again</AppButton><Box>Success</Box><AppButton tone="success">Saved</AppButton></Stack>;
}
