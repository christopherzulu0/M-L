"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Filter,
  ChevronDown,
  MoreHorizontal,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Home,
} from "lucide-react"

export default function TasksPage() {
  const [taskTab, setTaskTab] = useState("all")

  // Sample data for tasks
  const tasks = [
    {
      id: 1,
      title: "Follow up with John Smith about property viewing",
      description: "Send email with additional information about the property",
      dueDate: "2023-08-15",
      status: "Pending",
      priority: "High",
      assignedTo: "Sarah Johnson",
      relatedTo: "Modern Apartment with Pool View",
    },
    {
      id: 2,
      title: "Prepare contract for Lisa Wong",
      description: "Draft purchase agreement for Luxury Villa",
      dueDate: "2023-08-16",
      status: "In Progress",
      priority: "High",
      assignedTo: "Michael Chen",
      relatedTo: "Luxury Villa with Garden",
    },
    {
      id: 3,
      title: "Schedule property inspection",
      description: "Arrange for inspector to visit the Cozy Townhouse",
      dueDate: "2023-08-14",
      status: "Completed",
      priority: "Medium",
      assignedTo: "Emily Rodriguez",
      relatedTo: "Cozy Townhouse",
    },
    {
      id: 4,
      title: "Update property listing photos",
      description: "Add new professional photos to the Modern Apartment listing",
      dueDate: "2023-08-18",
      status: "Pending",
      priority: "Low",
      assignedTo: "Sarah Johnson",
      relatedTo: "Modern Apartment with Pool View",
    },
    {
      id: 5,
      title: "Call Maria Garcia about closing details",
      description: "Discuss final steps for property purchase",
      dueDate: "2023-08-12",
      status: "Overdue",
      priority: "High",
      assignedTo: "Michael Chen",
      relatedTo: "Modern Apartment with Pool View",
    },
  ]

  const completedTasks = tasks.filter(task => task.status === "Completed")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-sm text-muted-foreground">
            Manage your tasks and to-dos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." className="pl-8" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Assigned To
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Team Members</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sarah Johnson</DropdownMenuItem>
            <DropdownMenuItem>Michael Chen</DropdownMenuItem>
            <DropdownMenuItem>Emily Rodriguez</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ChevronDown className="mr-2 h-4 w-4" />
              Priority
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>All Priorities</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>High</DropdownMenuItem>
            <DropdownMenuItem>Medium</DropdownMenuItem>
            <DropdownMenuItem>Low</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Tabs value={taskTab} onValueChange={setTaskTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>
            {taskTab === "all"
              ? "All Tasks"
              : taskTab === "pending"
              ? "Pending Tasks"
              : taskTab === "completed"
              ? "Completed Tasks"
              : "Overdue Tasks"}
          </CardTitle>
          <CardDescription>
            {taskTab === "all"
              ? "View and manage all your tasks"
              : taskTab === "pending"
              ? "Tasks that need your attention"
              : taskTab === "completed"
              ? "Tasks you've completed"
              : "Tasks that are past their due date"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(taskTab === "completed" ? completedTasks : tasks)
              .filter((task) => {
                if (taskTab === "all") return true
                if (taskTab === "pending") return task.status === "Pending" || task.status === "In Progress"
                if (taskTab === "completed") return task.status === "Completed"
                if (taskTab === "overdue") {
                  return task.status === "Overdue"
                }
                return true
              })
              .map((task) => (
                <div key={task.id} className="flex items-start space-x-4 rounded-lg border p-4">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.status === "Completed"}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`font-medium ${
                          task.status === "Completed" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </label>
                      <Badge
                        variant={
                          task.priority === "High"
                            ? "destructive"
                            : task.priority === "Medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                        Due: {task.dueDate}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Home className="mr-1 h-3.5 w-3.5" />
                        {task.relatedTo}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="mr-1 h-3.5 w-3.5" />
                        {task.assignedTo}
                      </div>
                      <div className="flex items-center text-sm">
                        <Badge
                          variant={
                            task.status === "Completed"
                              ? "outline"
                              : task.status === "Overdue"
                              ? "destructive"
                              : task.status === "In Progress"
                              ? "default"
                              : "secondary"
                          }
                          className="flex items-center gap-1"
                        >
                          {task.status === "Completed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : task.status === "Overdue" ? (
                            <AlertCircle className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Reassign</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}