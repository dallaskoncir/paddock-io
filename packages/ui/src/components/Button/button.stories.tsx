import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "Design System/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg", "icon"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "default", children: "Register — $299" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Save for later" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Cancel registration" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "View event details" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Back" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large — Register Now</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { variant: "default", children: "Register — $299", disabled: true },
};

export const WizardCTARow: Story = {
  name: "Wizard CTA Row (in context)",
  render: () => (
    <div className="flex w-full max-w-sm items-center justify-between gap-4">
      <Button variant="ghost">Back</Button>
      <Button size="lg" className="flex-1">
        Continue to Driver Profile →
      </Button>
    </div>
  ),
};
