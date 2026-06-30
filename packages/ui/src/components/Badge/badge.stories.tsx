import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "Design System/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "tech-passed",
        "tech-failed",
        "novice-driver",
      ],
      description: "Visual style of the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: { variant: "default", children: "Run Group A" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Street" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Waitlisted" },
};

export const TechPassed: Story = {
  name: "Tech Passed",
  args: { variant: "tech-passed", children: "Tech Passed" },
};

export const TechFailed: Story = {
  name: "Tech Failed",
  args: { variant: "tech-failed", children: "Tech Failed" },
};

export const NoviceDriver: Story = {
  name: "Novice Driver",
  args: { variant: "novice-driver", children: "Novice" },
};

export const DomainVariants: Story = {
  name: "Domain Variants (all three)",
  render: () => (
    <div className="flex flex-wrap gap-3 p-4">
      <Badge variant="tech-passed">Tech Passed</Badge>
      <Badge variant="tech-failed">Tech Failed</Badge>
      <Badge variant="novice-driver">Novice</Badge>
    </div>
  ),
};

export const EventEntrantList: Story = {
  name: "Event Entrant List (in context)",
  render: () => (
    <div className="w-80 divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
      {[
        { name: "Alex Mercer", car: "2021 Porsche 718", status: "tech-passed" as const, group: "Advanced" },
        { name: "Jordan Lee", car: "2019 Mazda MX-5", status: "novice-driver" as const, group: "Novice" },
        { name: "Sam Rivera", car: "2020 BMW M3", status: "tech-failed" as const, group: "Intermediate" },
      ].map((driver) => (
        <div key={driver.name} className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-900">{driver.name}</p>
            <p className="text-xs text-gray-500">{driver.car}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge variant={driver.status}>
              {driver.status === "tech-passed"
                ? "Tech Passed"
                : driver.status === "tech-failed"
                  ? "Tech Failed"
                  : "Novice"}
            </Badge>
            <Badge variant="outline">{driver.group}</Badge>
          </div>
        </div>
      ))}
    </div>
  ),
};
