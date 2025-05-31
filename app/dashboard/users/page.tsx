"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Plus,
  Edit,
  Trash2,
  UserCog,
  Download,
  Users,
  UserCheck,
  UserX,
  Crown,
  Shield,
  ArrowUpDown,
  Eye,
  Mail,
  Calendar,
  Activity,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define the User type based on the schema
interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  status: string
  profileImage?: string
  lastLogin?: Date
  createdAt: Date
}

interface UserStats {
  total: number
  active: number
  inactive: number
  admins: number
  agents: number
  users: number
}

export default function UsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("createdAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    agents: 0,
    users: 0,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [users])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error("Error fetching users:", error)

      // Set some fallback mock data if API fails
      const fallbackUsers = [
        {
          id: 1,
          email: "john.doe@example.com",
          firstName: "John",
          lastName: "Doe",
          role: "admin",
          status: "active",
          profileImage: "",
          lastLogin: new Date("2024-01-15T10:30:00Z"),
          createdAt: new Date("2023-06-01T09:00:00Z"),
        },
        {
          id: 2,
          email: "jane.smith@example.com",
          firstName: "Jane",
          lastName: "Smith",
          role: "agent",
          status: "active",
          profileImage: "",
          lastLogin: new Date("2024-01-14T14:20:00Z"),
          createdAt: new Date("2023-07-15T11:30:00Z"),
        },
        {
          id: 3,
          email: "mike.johnson@example.com",
          firstName: "Mike",
          lastName: "Johnson",
          role: "user",
          status: "active",
          profileImage: "",
          lastLogin: new Date("2024-01-13T16:45:00Z"),
          createdAt: new Date("2023-08-20T13:15:00Z"),
        },
      ]

      setUsers(fallbackUsers)

      toast({
        title: "Warning",
        description: "Using demo data. API connection failed.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    const total = users.length
    const active = users.filter((u) => u.status === "active").length
    const inactive = users.filter((u) => u.status === "inactive").length
    const admins = users.filter((u) => u.role === "admin").length
    const agents = users.filter((u) => u.role === "agent").length
    const regularUsers = users.filter((u) => u.role === "user").length

    setStats({
      total,
      active,
      inactive,
      admins,
      agents,
      users: regularUsers,
    })
  }

  // Filter and sort users
  const filteredAndSortedUsers = users
      .filter((user) => {
        const matchesSearch =
            user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesRole = roleFilter === "all" || user.role === roleFilter
        const matchesStatus = statusFilter === "all" || user.status === statusFilter

        return matchesSearch && matchesRole && matchesStatus
      })
      .sort((a, b) => {
        let aValue: any = a[sortBy as keyof User]
        let bValue: any = b[sortBy as keyof User]

        if (sortBy === "name") {
          aValue = `${a.firstName} ${a.lastName}`
          bValue = `${b.firstName} ${b.lastName}`
        }

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedUsers.length / itemsPerPage)
  const paginatedUsers = filteredAndSortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectUser = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return

    if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      try {
        const response = await fetch("/api/users/bulk-delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: selectedUsers }),
        })

        if (response.ok) {
          setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
          setSelectedUsers([])
          toast({
            title: "Success",
            description: `${selectedUsers.length} users deleted successfully`,
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to delete users",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while deleting users",
          variant: "destructive",
        })
      }
    }
  }

  const handleBulkRoleChange = async (newRole: string) => {
    if (selectedUsers.length === 0) return

    try {
      const response = await fetch("/api/users/bulk-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: selectedUsers, role: newRole }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (selectedUsers.includes(user.id) ? { ...user, role: newRole } : user)))
        setSelectedUsers([])
        toast({
          title: "Success",
          description: `Role updated for ${selectedUsers.length} users`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update user roles",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating user roles",
        variant: "destructive",
      })
    }
  }

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Status", "Created", "Last Login"],
      ...filteredAndSortedUsers.map((user) => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.status,
        new Date(user.createdAt).toLocaleDateString(),
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never",
      ]),
    ]
        .map((row) => row.join(","))
        .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <Crown className="h-3 w-3" />
      case "agent":
        return <Shield className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-red-500 to-pink-500 text-white"
      case "agent":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
      case "user":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      case "inactive":
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
      case "suspended":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white"
    }
  }

  if (loading) {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
    )
  }

  return (
      <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-2">Manage users, roles, and permissions across your organization</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => router.push("/dashboard/users/add")}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Users</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Inactive</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
                <UserX className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Admins</p>
                  <p className="text-2xl font-bold text-red-900">{stats.admins}</p>
                </div>
                <Crown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Agents</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.agents}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Users</p>
                  <p className="text-2xl font-bold text-emerald-900">{stats.users}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search users by name or email..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("email")}>Email</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("role")}>Role</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("createdAt")}>Created Date</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                    {sortOrder === "asc" ? "Descending" : "Ascending"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? "s" : ""} selected
                </span>
                    <Button variant="outline" size="sm" onClick={() => setSelectedUsers([])}>
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserCog className="mr-2 h-4 w-4" />
                          Change Role
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleBulkRoleChange("admin")}>Admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkRoleChange("agent")}>Agent</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkRoleChange("user")}>User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredAndSortedUsers.length})</CardTitle>
            <CardDescription>Manage your organization's users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                        checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12">
                        <div className="flex flex-col items-center gap-2">
                          <Users className="h-12 w-12 text-muted-foreground" />
                          <p className="text-lg font-medium">No users found</p>
                          <p className="text-muted-foreground">
                            {searchQuery || roleFilter !== "all" || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Get started by adding your first user"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                ) : (
                    paginatedUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Checkbox
                                checked={selectedUsers.includes(user.id)}
                                onCheckedChange={() => handleSelectUser(user.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.profileImage || ""} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {user.firstName.charAt(0) + user.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{`${user.firstName} ${user.lastName}`}</p>
                                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getRoleBadgeColor(user.role)} flex items-center gap-1 w-fit`}>
                              {getRoleIcon(user.role)}
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4 text-muted-foreground" />
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/roles/${user.id}`)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/roles/${user.id}`)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/users/roles/${user.id}`)}>
                                  <UserCog className="mr-2 h-4 w-4" />
                                  Manage Role
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={async () => {
                                      if (confirm("Are you sure you want to delete this user?")) {
                                        try {
                                          const response = await fetch(`/api/users/${user.id}`, {
                                            method: "DELETE",
                                          })

                                          if (response.ok) {
                                            setUsers(users.filter((u) => u.id !== user.id))
                                            toast({
                                              title: "Success",
                                              description: "User deleted successfully",
                                            })
                                          } else {
                                            toast({
                                              title: "Error",
                                              description: "Failed to delete user",
                                              variant: "destructive",
                                            })
                                          }
                                        } catch (error) {
                                          toast({
                                            title: "Error",
                                            description: "An error occurred while deleting the user",
                                            variant: "destructive",
                                          })
                                        }
                                      }
                                    }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, filteredAndSortedUsers.length)} of {filteredAndSortedUsers.length}{" "}
                    users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
