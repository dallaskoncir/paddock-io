import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "../Badge/badge";
import { Button } from "../Button/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta: Meta<typeof Card> = {
  title: "Design System/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Event Card</CardTitle>
        <CardDescription>A generic card shell</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Card content goes here.</p>
      </CardContent>
    </Card>
  ),
};

export const EventCard: Story = {
  name: "Event Card (Discovery grid)",
  render: () => (
    <Card className="w-80">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>NCM Motorsports Park</CardTitle>
            <CardDescription className="mt-0.5">hosted by SCCA Solo</CardDescription>
          </div>
          <Badge variant="default">12 spots</Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-700">
          <span className="flex items-center gap-1">
            <span>📅</span> Aug 3–4, 2025
          </span>
          <span className="flex items-center gap-1 font-semibold">
            <span>💲</span> from $299
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline">Novice</Badge>
          <Badge variant="outline">Intermediate</Badge>
          <Badge variant="outline">Advanced</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Event</Button>
      </CardFooter>
    </Card>
  ),
};

export const VehicleCard: Story = {
  name: "Vehicle Card (Garage step)",
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      {[
        { year: 2021, make: "Porsche", model: "718 Cayman GTS", drive: "RWD", selected: true },
        { year: 2019, make: "Mazda", model: "MX-5 Miata", drive: "RWD", selected: false },
      ].map((vehicle) => (
        <Card
          key={vehicle.model}
          className={`cursor-pointer transition-shadow hover:shadow-md ${
            vehicle.selected
              ? "ring-2 ring-paddock-600 border-paddock-300"
              : ""
          }`}
        >
          <CardContent className="pt-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">
                {vehicle.year} {vehicle.make}
              </p>
              <p className="text-sm text-gray-500">{vehicle.model}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline">{vehicle.drive}</Badge>
              {vehicle.selected && (
                <span className="text-xs text-paddock-600 font-medium">Selected ✓</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
