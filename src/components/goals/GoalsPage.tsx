import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Target, TrendingUp, Calendar, Filter } from 'lucide-react';
import { Goal, GoalStatus, GoalCategory } from '@/types/goals';
import { CreateGoalDialog } from './CreateGoalDialog';
import { GoalDetailsDialog } from './GoalDetailsDialog';

export const GoalsPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filter, setFilter] = useState<'all' | GoalStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GoalCategory>('all');

  // Mock data
  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Improve Code Review Efficiency',
      description: 'Reduce average code review time and improve quality feedback',
      category: 'technical',
      priority: 'high',
      status: 'on-track',
      progress: 75,
      targetDate: new Date('2024-12-31'),
      createdDate: new Date('2024-01-15'),
      updatedDate: new Date('2024-12-15'),
      userId: '1',
      assignedBy: '2',
      milestones: [
        {
          id: '1',
          title: 'Complete Code Review Training',
          targetDate: new Date('2024-06-30'),
          completed: true,
          completedDate: new Date('2024-06-25')
        },
        {
          id: '2',
          title: 'Implement Review Checklist',
          targetDate: new Date('2024-09-30'),
          completed: true,
          completedDate: new Date('2024-09-20')
        },
        {
          id: '3',
          title: 'Achieve Target Review Time',
          targetDate: new Date('2024-12-31'),
          completed: false
        }
      ],
      metrics: [
        {
          id: '1',
          name: 'Average Review Time',
          target: 2,
          current: 2.5,
          unit: 'hours'
        },
        {
          id: '2',
          name: 'Review Quality Score',
          target: 9,
          current: 8.5,
          unit: '/10'
        }
      ]
    },
    {
      id: '2',
      title: 'Leadership Development',
      description: 'Develop leadership skills through mentoring and team management',
      category: 'leadership',
      priority: 'medium',
      status: 'active',
      progress: 45,
      targetDate: new Date('2025-03-31'),
      createdDate: new Date('2024-10-01'),
      updatedDate: new Date('2024-12-10'),
      userId: '1',
      milestones: [
        {
          id: '3',
          title: 'Start Mentoring Program',
          targetDate: new Date('2024-11-30'),
          completed: true,
          completedDate: new Date('2024-11-15')
        },
        {
          id: '4',
          title: 'Complete Leadership Course',
          targetDate: new Date('2025-01-31'),
          completed: false
        }
      ],
      metrics: [
        {
          id: '3',
          name: 'Team Members Mentored',
          target: 3,
          current: 1,
          unit: 'people'
        }
      ]
    }
  ];

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on-track': return 'bg-blue-500';
      case 'active': return 'bg-yellow-500';
      case 'at-risk': return 'bg-orange-500';
      case 'behind': return 'bg-red-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const filteredGoals = mockGoals.filter(goal => {
    const statusMatch = filter === 'all' || goal.status === filter;
    const categoryMatch = categoryFilter === 'all' || goal.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const stats = {
    total: mockGoals.length,
    completed: mockGoals.filter(g => g.status === 'completed').length,
    onTrack: mockGoals.filter(g => g.status === 'on-track').length,
    atRisk: mockGoals.filter(g => ['at-risk', 'behind'].includes(g.status)).length,
    avgProgress: Math.round(mockGoals.reduce((acc, g) => acc + g.progress, 0) / mockGoals.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Goals & Objectives</h1>
          <p className="text-muted-foreground">
            Track your professional development and performance goals
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.onTrack}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter('all')}>All Goals</TabsTrigger>
          <TabsTrigger value="active" onClick={() => setFilter('active')}>Active</TabsTrigger>
          <TabsTrigger value="on-track" onClick={() => setFilter('on-track')}>On Track</TabsTrigger>
          <TabsTrigger value="at-risk" onClick={() => setFilter('at-risk')}>At Risk</TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter('completed')}>Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {/* Goals Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                    onClick={() => setSelectedGoal(goal)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{goal.title}</CardTitle>
                    <Badge variant={getPriorityColor(goal.priority)} className="text-xs">
                      {goal.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {goal.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={`${getStatusColor(goal.status)} text-white`}
                    >
                      {goal.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Due {goal.targetDate.toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateGoalDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
      
      <GoalDetailsDialog 
        goal={selectedGoal}
        open={!!selectedGoal}
        onOpenChange={(open) => !open && setSelectedGoal(null)}
      />
    </div>
  );
};