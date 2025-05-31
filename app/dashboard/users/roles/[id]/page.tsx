"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Save,
  UserCog,
  Shield,
  Crown,
  Users,
  Mail,
  Phone,
  Calendar,
  Activity,
  Edit,
  History,
  AlertTriangle,
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
  phone?: string
  bio?: string
  lastLogin?: Date
  createdAt: Date
}

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface ActivityLog {
  id: number
  action: string
  timestamp: Date
  details: string
}

export default function UserRolePage({ params }: { params: { id: string } }) {
  const unwrappedParams = React.use(params);
  const userId = unwrappedParams.id;

  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [notes, setNotes] = useState("")
  const [activeTab, setActiveTab] = useState("role")

  // Available roles with detailed information
  const availableRoles = [
    {
      value: "user",
      label: "User",
      description: "Basic access to the platform with limited permissions",
      icon: <Users className="h-4 w-4" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "agent",
      label: "Agent",
      description: "Can manage properties, handle inquiries, and interact with clients",
      icon: <Shield className="h-4 w-4" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      value: "admin",
      label: "Administrator",
      description: "Full access to all features and system settings",
      icon: <Crown className="h-4 w-4" />,
      color: "from-red-500 to-pink-500",
    },
  ]

  const availableStatuses = [
    {
      value: "active",
      label: "Active",
      description: "User can access the system normally",
      color: "from-green-500 to-emerald-500",
    },
    {
      value: "inactive",
      label: "Inactive",
      description: "User cannot access the system",
      color: "from-gray-500 to-slate-500",
    },
    {
      value: "suspended",
      label: "Suspended",
      description: "Temporarily blocked from accessing the system",
      color: "from-yellow-500 to-orange-500",
    },
  ]

  useEffect(() => {
    fetchUserData()
    fetchPermissions()
    fetchActivityLogs()
  }, [userId])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`)

      if (!response.ok) {
        if (response.status === 404) {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Error",
            description: "Failed to fetch user data",
            variant: "destructive",
          })
        }
        router.push("/dashboard/users")
        return
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON")
      }

      const data = await response.json()
      setUser(data)
      setSelectedRole(data.role)
      setSelectedStatus(data.status)
      setNotes(data.notes || "")
    } catch (error) {
      console.error("Error fetching user:", error)
      toast({
        title: "Error",
        description: "An error occurred while fetching user data",
        variant: "destructive",
      })
      router.push("/dashboard/users")
    } finally {
      setLoading(false)
    }
  }

  const fetchPermissions = async () => {
    // Mock permissions data - replace with actual API call
    setPermissions([
      { id: "read_users", name: "View Users", description: "Can view user profiles and lists", enabled: true },
      { id: "write_users", name: "Manage Users", description: "Can create, edit, and delete users", enabled: false },
      { id: "read_properties", name: "View Properties", description: "Can view property listings", enabled: true },
      {
        id: "write_properties",
        name: "Manage Properties",
        description: "Can create, edit, and delete properties",
        enabled: false,
      },
      { id: "read_reports", name: "View Reports", description: "Can access system reports", enabled: false },
      { id: "admin_settings", name: "System Settings", description: "Can modify system configuration", enabled: false },
    ])
  }

  const fetchActivityLogs = async () => {
    // Mock activity logs - replace with actual API call
    setActivityLogs([
      { id: 1, action: "Login", timestamp: new Date(), details: "Successful login from 192.168.1.1" },
      {
        id: 2,
        action: "Profile Updated",
        timestamp: new Date(Date.now() - 86400000),
        details: "Updated profile information",
      },
      {
        id: 3,
        action: "Password Changed",
        timestamp: new Date(Date.now() - 172800000),
        details: "Password was changed",
      },
    ])
  }

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      // Update user role and status
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          status: selectedStatus,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User settings updated successfully",
        })
        router.push("/dashboard/users")
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.message || "Failed to update user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the user",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePermissionChange = (permissionId: string, enabled: boolean) => {
    setPermissions((prev) => prev.map((p) => (p.id === permissionId ? { ...p, enabled } : p)))
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

  if (!user) {
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">User not found</p>
              <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
            </div>
          </div>
        </div>
    )
  }

  const currentRoleInfo = availableRoles.find((r) => r.value === selectedRole)
  const currentStatusInfo = availableStatuses.find((s) => s.value === selectedStatus)

  return (
      <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard/users")} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
          </Button>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Manage User
          </h1>
        </div>

        {/* User Profile Header */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profileImage || ""} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.firstName.charAt(0) + user.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{`${user.firstName} ${user.lastName}`}</h2>
                  <Badge className={`bg-gradient-to-r ${currentRoleInfo?.color} text-white flex items-center gap-1`}>
                    {currentRoleInfo?.icon}
                    {currentRoleInfo?.label}
                  </Badge>
                  <Badge className={`bg-gradient-to-r ${currentStatusInfo?.color} text-white`}>
                    {currentStatusInfo?.label}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {user.lastLogin && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Activity className="h-4 w-4" />
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                )}
              </div>
              <Button variant="outline" onClick={() => window.location.reload()}>
                <Edit className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
          <Button variant={activeTab === "role" ? "default" : "ghost"} size="sm" onClick={() => setActiveTab("role")}>
            <UserCog className="mr-2 h-4 w-4" />
            Role & Permissions
          </Button>
          <Button
              variant={activeTab === "activity" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("activity")}
          >
            <History className="mr-2 h-4 w-4" />
            Activity Log
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "role" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role and Status Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    Role & Status
                  </CardTitle>
                  <CardDescription>Manage user role and account status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Current Role</Label>
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        {currentRoleInfo?.icon}
                        <div>
                          <p className="font-medium">{currentRoleInfo?.label}</p>
                          <p className="text-sm text-muted-foreground">{currentRoleInfo?.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="role">Assign New Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-2">
                                {role.icon}
                                <div>
                                  <div className="font-medium">{role.label}</div>
                                  <div className="text-sm text-muted-foreground">{role.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="status">Account Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div>
                                <div className="font-medium">{status.label}</div>
                                <div className="text-sm text-muted-foreground">{status.description}</div>
                              </div>
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="notes">Admin Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Add notes about this user..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Permissions
                  </CardTitle>
                  <CardDescription>Configure specific permissions for this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-muted-foreground">{permission.description}</div>
                          </div>
                          <Switch
                              checked={permission.enabled}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked)}
                          />
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
        )}

        {activeTab === "activity" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Activity Log
                </CardTitle>
                <CardDescription>Recent user activity and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.map((log) => (
                      <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{log.action}</p>
                            <p className="text-sm text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                        </div>
                      </div>
                  ))}
                  {activityLogs.length === 0 && (
                      <div className="text-center py-8">
                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium">No activity found</p>
                        <p className="text-muted-foreground">This user hasn't performed any actions yet.</p>
                      </div>
                  )}
                </div>
              </CardContent>
            </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardFooter className="flex justify-between p-6">
            <Button variant="outline" onClick={() => router.push("/dashboard/users")}>
              Cancel
            </Button>
            <Button
                onClick={handleSave}
                disabled={saving || (selectedRole === user.role && selectedStatus === user.status)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {saving ? "Saving..." : "Save Changes"}
              {!saving && <Save className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
  )
}
