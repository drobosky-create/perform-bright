import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserRole } from '@/types/auth';

// Mock team data - would come from API
const mockTeamMembers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Sarah Johnson',
    role: 'admin',
    department: 'HR',
    employmentType: 'employee',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1b1?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: 'Michael Chen',
    role: 'manager',
    department: 'Engineering',
    employmentType: 'employee',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    email: 'team@company.com',
    name: 'Alex Rivera',
    role: 'team_member',
    department: 'Engineering',
    managerId: '2',
    employmentType: 'employee',
    reviewCadence: 'monthly',
    createdAt: new Date('2024-01-01'),
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '4',
    email: 'jennifer.wu@company.com',
    name: 'Jennifer Wu',
    role: 'team_member',
    department: 'Design',
    managerId: '2',
    employmentType: 'contractor',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-02-15'),
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '5',
    email: 'david.chen@company.com',
    name: 'David Chen',
    role: 'team_member',
    department: 'Marketing',
    managerId: '1',
    employmentType: 'employee',
    reviewCadence: 'quarterly',
    createdAt: new Date('2024-03-01'),
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  }
];

export const TeamDirectory: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Get unique departments for filter
  const departments = Array.from(new Set(mockTeamMembers.map(member => member.department).filter(Boolean)));

  // Filter team members
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'default';
      case 'manager': return 'secondary';
      case 'team_member': return 'outline';
      default: return 'outline';
    }
  };

  const getEmploymentBadgeVariant = (type: string) => {
    return type === 'employee' ? 'default' : 'secondary';
  };

  const canManageUser = (targetUser: User) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'manager' && targetUser.managerId === user.id) return true;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Team Directory</h1>
          <p className="text-foreground-muted mt-1">Manage your team members and their review settings</p>
        </div>
        {user?.role === 'admin' && (
          <Button className="gap-2 bg-gradient-primary hover:opacity-90" onClick={() => setShowAddUserModal(true)}>
            <Plus className="h-4 w-4" />
            Add Team Member
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-soft border-border-soft">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Role Filter */}
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="shadow-soft border-border-soft hover:shadow-soft-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{member.name}</CardTitle>
                    <CardDescription className="text-sm">{member.email}</CardDescription>
                  </div>
                </div>
                {canManageUser(member) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Role & Employment */}
              <div className="flex gap-2">
                <Badge variant={getRoleBadgeVariant(member.role)}>
                  {member.role.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant={getEmploymentBadgeVariant(member.employmentType)}>
                  {member.employmentType}
                </Badge>
              </div>

              {/* Department */}
              {member.department && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {member.department}
                </div>
              )}

              {/* Review Cadence */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {member.reviewCadence} reviews
              </div>

              {/* Manager */}
              {member.managerId && (
                <div className="text-sm text-muted-foreground">
                  Reports to: {mockTeamMembers.find(m => m.id === member.managerId)?.name}
                </div>
              )}

              {/* Member since */}
              <div className="text-xs text-muted-foreground">
                Member since {member.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <Card className="shadow-soft border-border-soft">
          <CardContent className="pt-8 pb-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || departmentFilter !== 'all' || roleFilter !== 'all' 
                ? "Try adjusting your search or filters"
                : "Get started by adding your first team member"
              }
            </p>
            {user?.role === 'admin' && (
              <Button onClick={() => setShowAddUserModal(true)}>
                Add Team Member
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};