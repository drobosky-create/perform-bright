import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Crown, Shield } from "lucide-react";

type UserRole = 'admin' | 'manager' | 'team_member';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: UserRole | null;
  department: string | null;
  job_title: string | null;
  photo_url: string | null;
  created_at: string;
}

const roleIcons = {
  admin: Crown,
  manager: Shield,
  team_member: User,
};

const roleColors = {
  admin: "destructive",
  manager: "secondary",
  team_member: "outline",
} as const;

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">User Management</h2>
        <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => {
          const RoleIcon = roleIcons[user.role as keyof typeof roleIcons] || User;
          
          return (
            <Card key={user.id}>
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.photo_url || undefined} />
                    <AvatarFallback>
                      {user.name?.split(' ').map(n => n[0]).join('') || 
                       user.email?.slice(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground">
                        {user.name || user.email}
                      </h3>
                      <Badge 
                        variant={roleColors[user.role as keyof typeof roleColors] || "outline"}
                        className="flex items-center space-x-1"
                      >
                        <RoleIcon className="h-3 w-3" />
                        <span>{user.role || 'team_member'}</span>
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{user.email}</p>
                      {user.department && (
                        <p>{user.department} {user.job_title && `• ${user.job_title}`}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Select
                    value={user.role || 'team_member'}
                    onValueChange={(newRole) => updateUserRole(user.id, newRole as UserRole)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="team_member">Team Member</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {updating === user.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}