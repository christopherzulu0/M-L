"use client"
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Loader2, 
  Search, 
  Bell, 
  CheckCircle2, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCheck,
  Clock,
  X
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: number
  title: string
  message: string
  type: string | null
  isRead: boolean
  relatedTo: string | null
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/notifications')
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }
      const data = await response.json()
      setNotifications(data.notifications)
      setFilteredNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Apply filters and sorting
    let result = [...notifications]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(notification => 
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term)
      )
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      result = result.filter(notification => notification.type === typeFilter)
    }
    
    // Apply read/unread filter
    if (readFilter === 'read') {
      result = result.filter(notification => notification.isRead)
    } else if (readFilter === 'unread') {
      result = result.filter(notification => !notification.isRead)
    }
    
    // Apply tab filter
    if (activeTab === 'unread') {
      result = result.filter(notification => !notification.isRead)
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'type':
          comparison = (a.type || '').localeCompare(b.type || '')
          break
        default:
          comparison = 0
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    setFilteredNotifications(result)
  }, [notifications, searchTerm, typeFilter, readFilter, sortField, sortDirection, activeTab])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSelectNotification = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notificationId => notificationId !== id))
    } else {
      setSelectedNotifications([...selectedNotifications, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(notification => notification.id))
    }
  }

  const markAsRead = async (notificationIds?: number[]) => {
    try {
      const ids = notificationIds || selectedNotifications
      const markAll = !ids.length
      
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: ids,
          markAll: markAll
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read')
      }

      // Update local state
      setNotifications(notifications.map(notification => {
        if (markAll && !notification.isRead) {
          return { ...notification, isRead: true }
        } else if (ids.includes(notification.id)) {
          return { ...notification, isRead: true }
        }
        return notification
      }))

      // Update unread count
      setUnreadCount(markAll ? 0 : unreadCount - ids.filter(id => 
        notifications.find(n => n.id === id && !n.isRead)
      ).length)

      // Clear selection
      setSelectedNotifications([])

      toast({
        title: "Success",
        description: markAll 
          ? "All notifications marked as read" 
          : `${ids.length} notification${ids.length === 1 ? '' : 's'} marked as read`,
      })
    } catch (error) {
      console.error('Error marking notifications as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notifications as read. Please try again.",
        variant: "destructive"
      })
    }
  }

  const deleteNotifications = async (deleteAll: boolean = false) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds: selectedNotifications,
          deleteAll: deleteAll
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete notifications')
      }

      // Update local state
      if (deleteAll) {
        setNotifications([])
        setUnreadCount(0)
      } else {
        const newNotifications = notifications.filter(
          notification => !selectedNotifications.includes(notification.id)
        )
        setNotifications(newNotifications)
        
        // Update unread count
        setUnreadCount(unreadCount - selectedNotifications.filter(id => 
          notifications.find(n => n.id === id && !n.isRead)
        ).length)
      }

      // Clear selection
      setSelectedNotifications([])
      setIsDeleteDialogOpen(false)
      setIsDeleteAllDialogOpen(false)

      toast({
        title: "Success",
        description: deleteAll 
          ? "All notifications deleted" 
          : `${selectedNotifications.length} notification${selectedNotifications.length === 1 ? '' : 's'} deleted`,
      })
    } catch (error) {
      console.error('Error deleting notifications:', error)
      toast({
        title: "Error",
        description: "Failed to delete notifications. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffSecs < 60) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const getNotificationTypeIcon = (type: string | null) => {
    switch (type) {
      case 'payment':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Payment</Badge>
      case 'property':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Property</Badge>
      case 'inquiry':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Inquiry</Badge>
      case 'system':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">System</Badge>
      case 'alert':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Alert</Badge>
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notifications and alerts</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {selectedNotifications.length > 0 ? (
            <>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial"
                onClick={() => markAsRead()}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark as Read
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial text-red-600 hover:text-red-700"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial"
                onClick={() => markAsRead([])}
                disabled={unreadCount === 0}
              >
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark All as Read
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 sm:flex-initial text-red-600 hover:text-red-700"
                onClick={() => setIsDeleteAllDialogOpen(true)}
                disabled={notifications.length === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">
            All Notifications
            <Badge className="ml-2 bg-gray-100 text-gray-800">{notifications.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread
            <Badge className="ml-2 bg-indigo-100 text-indigo-800">{unreadCount}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notifications..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="inquiry">Inquiry</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={readFilter} onValueChange={setReadFilter}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Notification
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    Type
                    {sortField === 'type' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    Date
                    {sortField === 'createdAt' && (
                      sortDirection === 'asc' ? 
                        <ChevronUp className="ml-1 h-4 w-4" /> : 
                        <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Bell className="h-12 w-12 mb-2 opacity-20" />
                      <p>No notifications found</p>
                      {searchTerm || typeFilter !== 'all' || readFilter !== 'all' ? (
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSearchTerm("")
                            setTypeFilter("all")
                            setReadFilter("all")
                          }}
                        >
                          Clear filters
                        </Button>
                      ) : (
                        <p className="text-sm">You're all caught up!</p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotifications.map((notification) => (
                  <TableRow 
                    key={notification.id}
                    className={notification.isRead ? "" : "bg-indigo-50 dark:bg-indigo-950/10"}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        checked={selectedNotifications.includes(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-2">
                        {!notification.isRead && (
                          <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500"></div>
                        )}
                        <div>
                          <p className={`font-medium ${!notification.isRead ? "text-indigo-900 dark:text-indigo-100" : ""}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getNotificationTypeIcon(notification.type)}
                    </TableCell>
                    <TableCell>
                      {formatDate(notification.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!notification.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead([notification.id])}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem onClick={() => markAsRead([notification.id])}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedNotifications([notification.id])
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Delete Selected Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedNotifications.length} selected notification{selectedNotifications.length === 1 ? '' : 's'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => deleteNotifications(false)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete All Dialog */}
      <Dialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete All Notifications</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all notifications? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteAllDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => deleteNotifications(true)}
            >
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}