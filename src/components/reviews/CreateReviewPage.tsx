import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CalendarIcon, Users, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ReviewType } from '@/types/review';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TeamMember {
  id: string;
  name: string;
  department: string;
  role: string;
  managerId?: string;
}

// Mock team data
const mockTeamMembers: TeamMember[] = [
  { id: '2', name: 'Sarah Chen', department: 'Engineering', role: 'team_member', managerId: '1' },
  { id: '3', name: 'Alex Rivera', department: 'Engineering', role: 'team_member', managerId: '1' },
  { id: '4', name: 'Jordan Kim', department: 'Design', role: 'team_member', managerId: '5' },
  { id: '5', name: 'Taylor Morgan', department: 'Design', role: 'manager' },
  { id: '6', name: 'Casey Park', department: 'Marketing', role: 'team_member', managerId: '7' },
  { id: '7', name: 'Morgan Lee', department: 'Marketing', role: 'manager' },
];

export const CreateReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [reviewType, setReviewType] = useState<ReviewType>('monthly');
  const [period, setPeriod] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter team members based on user role
  const availableMembers = mockTeamMembers.filter(member => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'manager') return member.managerId === user.id;
    return false;
  });

  const handleMemberToggle = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers.length === availableMembers.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(availableMembers.map(m => m.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedMembers.length === 0) {
      toast({
        title: "No members selected",
        description: "Please select at least one team member.",
        variant: "destructive"
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Due date required",
        description: "Please select a due date for the reviews.",
        variant: "destructive"
      });
      return;
    }

    if (!period) {
      toast({
        title: "Period required",
        description: "Please enter a review period.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reviews created successfully",
        description: `Created ${selectedMembers.length} review(s) for ${period}`,
      });

      navigate('/reviews');
    } catch (error) {
      toast({
        title: "Error creating reviews",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/reviews')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reviews
        </Button>
      </div>

      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Create Reviews</h1>
          <p className="text-muted-foreground mt-2">
            Create performance reviews for your team members
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Review Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Review Details
              </CardTitle>
              <CardDescription>
                Configure the review settings and timeline
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewType">Review Type</Label>
                <Select value={reviewType} onValueChange={(value: ReviewType) => setReviewType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly Review</SelectItem>
                    <SelectItem value="quarterly">Quarterly Review</SelectItem>
                    <SelectItem value="annual">Annual Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Review Period</Label>
                <Input
                  id="period"
                  placeholder="e.g., 2024-Q1, 2024-12, 2024"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  placeholder="Additional instructions for reviewers..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Team Member Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Team Members
              </CardTitle>
              <CardDescription>
                Choose who will receive reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {selectedMembers.length} of {availableMembers.length} selected
                </Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  {selectedMembers.length === availableMembers.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {availableMembers.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <Checkbox
                      id={member.id}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => handleMemberToggle(member.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={member.id} className="cursor-pointer">
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {member.department} • {member.role.replace('_', ' ')}
                        </div>
                      </Label>
                    </div>
                  </div>
                ))}
              </div>

              {availableMembers.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No team members available to assign reviews to.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/reviews')}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || selectedMembers.length === 0}
            className="gap-2"
          >
            {isSubmitting ? 'Creating...' : `Create ${selectedMembers.length} Review${selectedMembers.length !== 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
};