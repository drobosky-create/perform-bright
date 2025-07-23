import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Users, TrendingUp, TrendingDown, BarChart3, FileText, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from "recharts";
import { useAuth } from "@/contexts/AuthContext";

// Mock data - replace with actual API calls
const reviewStats = {
  totalReviews: 156,
  completedReviews: 142,
  averageScore: 4.2,
  overdue: 8,
  thisMonth: 24,
  lastMonth: 18
};

const departmentPerformance = [
  { name: "Engineering", avgScore: 4.3, reviews: 45, completion: 95 },
  { name: "Design", avgScore: 4.5, reviews: 20, completion: 100 },
  { name: "Product", avgScore: 4.1, reviews: 15, completion: 87 },
  { name: "Marketing", avgScore: 4.4, reviews: 25, completion: 92 },
  { name: "Sales", avgScore: 4.2, reviews: 30, completion: 90 },
  { name: "Operations", avgScore: 4.0, reviews: 21, completion: 86 }
];

const reviewTrends = [
  { month: "Jan", completed: 28, average: 4.1 },
  { month: "Feb", completed: 32, average: 4.2 },
  { month: "Mar", completed: 35, average: 4.0 },
  { month: "Apr", completed: 30, average: 4.3 },
  { month: "May", completed: 38, average: 4.4 },
  { month: "Jun", completed: 42, average: 4.2 }
];

const scoreDistribution = [
  { range: "1-2", count: 8, color: "#ef4444" },
  { range: "2-3", count: 15, color: "#f97316" },
  { range: "3-4", count: 45, color: "#eab308" },
  { range: "4-5", count: 88, color: "#22c55e" }
];

const reviewTypes = [
  { name: "Quarterly", value: 65, color: "#3b82f6" },
  { name: "Monthly", value: 25, color: "#8b5cf6" },
  { name: "Annual", value: 10, color: "#10b981" }
];

export function ReportsPage() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState("6months");
  const [department, setDepartment] = useState("all");

  if (!user || !["admin", "manager"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You need admin or manager privileges to view reports.</p>
        </div>
      </div>
    );
  }

  const completionRate = ((reviewStats.completedReviews / reviewStats.totalReviews) * 100).toFixed(1);
  const monthlyGrowth = ((reviewStats.thisMonth - reviewStats.lastMonth) / reviewStats.lastMonth * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Comprehensive performance review insights</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewStats.totalReviews}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-xs text-muted-foreground">
              {reviewStats.completedReviews} of {reviewStats.totalReviews} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewStats.averageScore}/5</div>
            <div className="text-xs text-green-600">
              Above target (4.0)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{reviewStats.overdue}</div>
            <div className="text-xs text-muted-foreground">
              Require immediate attention
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Score Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Review Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Review Completion Trends</CardTitle>
                <CardDescription>Monthly review completion over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reviewTrends}>
                    <defs>
                      <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorCompleted)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Review Types */}
            <Card>
              <CardHeader>
                <CardTitle>Review Types Distribution</CardTitle>
                <CardDescription>Breakdown by review frequency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reviewTypes}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                    >
                      {reviewTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {reviewTypes.map((type) => (
                    <div key={type.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span className="text-sm">{type.name} ({type.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Average scores and completion rates by department</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" />
                  <Bar yAxisId="right" dataKey="completion" fill="hsl(var(--secondary))" name="Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departmentPerformance.map((dept) => (
              <Card key={dept.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <Badge variant={dept.avgScore >= 4.0 ? "default" : "secondary"}>
                      {dept.avgScore}/5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Reviews</span>
                    <span className="font-medium">{dept.reviews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Completion</span>
                    <span className={`font-medium ${dept.completion >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                      {dept.completion}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Average review scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reviewTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[3.5, 4.5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
              <CardDescription>How review scores are distributed across ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                {scoreDistribution.map((item) => (
                  <div key={item.range} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.count}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Score {item.range}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}