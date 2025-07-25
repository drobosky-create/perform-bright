import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  User, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string | null;
  department: string | null;
  job_title: string | null;
  photo_url: string | null;
  manager_id: string | null;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  target_date: string;
  category: string;
  priority: string;
}

interface Review {
  id: string;
  type: string;
  status: string;
  period: string;
  due_date: string;
  completed_at: string | null;
  self_review_completed: boolean;
  manager_review_completed: boolean;
}

export function ReportCard() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { profile: currentUser } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!currentUser || !userId) return;
    
    checkAccessAndLoadData();
  }, [currentUser, userId]);

  const checkAccessAndLoadData = async () => {
    if (!currentUser || !userId) return;

    // Check access permissions
    let canAccess = false;
    
    if (currentUser.role === 'admin') {
      canAccess = true;
    } else if (currentUser.id === userId) {
      canAccess = true; // Can view own report
    } else if (currentUser.role === 'manager') {
      // Check if this user reports to the current manager
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('manager_id')
        .eq('id', userId)
        .single();
      
      if (userProfile?.manager_id === currentUser.id) {
        canAccess = true;
      }
    }

    if (!canAccess) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    setHasAccess(true);
    await loadUserData();
  };

  const loadUserData = async () => {
    if (!userId) return;

    try {
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Load goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (goalsError) throw goalsError;
      setGoals(goalsData || []);

      // Load reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', userId)
        .order('due_date', { ascending: false });

      if (reviewsError) throw reviewsError;
      setReviews(reviewsData || []);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading report card...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to view this report card.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">User Not Found</h1>
          <p className="text-muted-foreground mt-2">The requested user could not be found.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const pendingReviews = reviews.filter(r => r.status !== 'completed');
  const completedReviews = reviews.filter(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.photo_url || undefined} />
              <AvatarFallback className="text-lg">
                {profile.name?.split(' ').map(n => n[0]).join('') || 
                 profile.email?.slice(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{profile.name || profile.email}</h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline">{profile.role}</Badge>
                {profile.job_title && <span className="text-muted-foreground">•</span>}
                {profile.job_title && <span className="text-muted-foreground">{profile.job_title}</span>}
                {profile.department && <span className="text-muted-foreground">•</span>}
                {profile.department && <span className="text-muted-foreground">{profile.department}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedGoals.length} completed this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingReviews.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {goals.length > 0 ? Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across all goals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2/5</div>
            <p className="text-xs text-muted-foreground">
              Latest review score
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Active Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeGoals.slice(0, 5).map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{goal.title}</span>
                      <Badge variant="outline" className="text-xs">{goal.status}</Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.progress}% complete</span>
                      <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {activeGoals.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No active goals</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(review.status)}
                      <div>
                        <p className="font-medium text-sm">{review.type} Review</p>
                        <p className="text-xs text-muted-foreground">{review.period}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                        {review.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {review.completed_at 
                          ? `Completed ${new Date(review.completed_at).toLocaleDateString()}`
                          : `Due ${new Date(review.due_date).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No reviews available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{goal.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{goal.category}</Badge>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Priority: {goal.priority}</span>
                    <span>Due: {new Date(goal.target_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No goals available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Review History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(review.status)}
                      <div>
                        <h4 className="font-medium">{review.type} Review</h4>
                        <p className="text-sm text-muted-foreground">{review.period}</p>
                      </div>
                    </div>
                    <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                      {review.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Self Review:</span>
                      <span className={`ml-2 ${review.self_review_completed ? 'text-green-600' : 'text-orange-600'}`}>
                        {review.self_review_completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Manager Review:</span>
                      <span className={`ml-2 ${review.manager_review_completed ? 'text-green-600' : 'text-orange-600'}`}>
                        {review.manager_review_completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {review.completed_at 
                      ? `Completed on ${new Date(review.completed_at).toLocaleDateString()}`
                      : `Due on ${new Date(review.due_date).toLocaleDateString()}`
                    }
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No reviews available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Performance analytics coming soon...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  This section will show detailed performance metrics, trends, and comparisons.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}