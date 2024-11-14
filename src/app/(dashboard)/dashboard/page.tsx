"use client";
import { useState } from "react";
import ChartTheme from "@/components/dashboard/ChartTheme";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const defaultColors = ["#FF6B6B", "#16a34a", "#14532d", "#fde047", "#60a5fa"];

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

interface DashboardComponent {
  id: string;
  component: JSX.Element;
  width: string;
  defaultWidth: string;
  type: 'stats' | 'chart' | 'regular';
}

export default function Dashboard() {
  const [activeColors, setActiveColors] = useState<string[]>(defaultColors);
  const [isEditMode, setIsEditMode] = useState(false);

  const StatCard = ({ title, value, change, icon }: any) => (
    <Card className="group relative">
      {isEditMode && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 flex items-center justify-center">
          <GripVertical className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );

  // Initialize dashboard components
  const [components, setComponents] = useState<DashboardComponent[]>([
    {
      id: "stats",
      width: "col-span-12",
      defaultWidth: "col-span-12",
      type: 'stats',
      component: (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          <StatCard
            title="Subscriptions"
            value="+2350"
            change="+180.1% from last month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            title="Sales"
            value="+12,234"
            change="+19% from last month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            }
          />
          <StatCard
            title="Active Now"
            value="+573"
            change="+201 since last hour"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
          />
        </div>
      ),
    },
    {
      id: "overview",
      width: "col-span-12 md:col-span-7",
      defaultWidth: "col-span-12 md:col-span-7",
      type: 'chart',
      component: (
        <Card className="group relative">
          {isEditMode && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 flex items-center justify-center">
              <GripVertical className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview colors={activeColors} />
          </CardContent>
        </Card>
      ),
    },
    {
      id: "recent-sales",
      width: "col-span-12 md:col-span-5",
      defaultWidth: "col-span-12 md:col-span-5",
      type: 'regular',
      component: (
        <Card className="group relative">
          {isEditMode && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 flex items-center justify-center">
              <GripVertical className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>You made 265 sales this month.</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentSales />
          </CardContent>
        </Card>
      ),
    },
  ]);

  const handleThemeChange = (newColors: string[]) => {
    setActiveColors(newColors);
  };

  const onDragEnd = (result: any) => {
    console.log("result-----",result)
    if (!result.destination || !isEditMode) return;

    // copy the components array 
    const items = Array.from(components);
    // removes the dragged item from items array and stores in reorderedItem
    const [reorderedItem] = items.splice(result.source.index, 1);
    console.log("reorderedItems----",reorderedItem);
    
    // Adjust widths based on position
    const newItems = items.map(item => ({
      ...item,
      width: item.defaultWidth // Reset to default width
    }));

    console.log("newItems----",newItems)

    // If moving to first position (stats position), make it full width
    if (result.destination.index === 0) {
      reorderedItem.width = "col-span-12";
      // Adjust the next item if it exists
      if (newItems[0]) {
        if (newItems[0].type === 'chart') {
          newItems[0].width = "col-span-12 md:col-span-7";
        } else if (newItems[0].type === 'regular') {
          newItems[0].width = "col-span-12 md:col-span-5";
        }
      }
    } else {
      // If moving away from first position, restore default width
      reorderedItem.width = reorderedItem.defaultWidth;
    }

    // Insert the reordered item at its new position
    newItems.splice(result.destination.index, 0, reorderedItem);
    console.log("newItems after reordering----",newItems)

    setComponents(newItems);
  };

  return (
    <ScrollArea className="h-full w-full">
      <div className="flex-1 space-y-4 p-4 pt-[10%] md:pt-[1%] md:p-8">
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap w-full">
            <div className="flex items-center space-x-4">
              <TabsList className="bg-secondary text-primary">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                  Analytics
                </TabsTrigger>
              </TabsList>
            </div>
            
            <ChartTheme onThemeChange={handleThemeChange} />
          </div>
          <div className="flex items-center space-x-2">
                <Switch
                  id="edit-mode"
                  checked={isEditMode}
                  onCheckedChange={setIsEditMode}
                />
                <Label htmlFor="edit-mode" className="text-sm font-medium">
                  Enable Editing
                </Label>
              </div>
          <TabsContent value="overview" className="space-y-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="dashboard" isDropDisabled={!isEditMode}>
                {(provided: any) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-12 gap-4"
                  >
                    {components.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                        isDragDisabled={!isEditMode}
                      >
                        {(provided: any, snapshot: any) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${item.width} ${
                              snapshot.isDragging ? "z-50" : ""
                            }`}
                          >
                            {item.component}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}