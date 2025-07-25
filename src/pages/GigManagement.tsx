import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, FileText, MessageSquare, Star, Upload, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
const GigManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [pitchText, setPitchText] = useState('');
  const [proposedRate, setProposedRate] = useState('');
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const gigDetails = {
    title: "Traditional Wedding Ceremony - Chandigarh",
    type: "Live Performance",
    date: "March 15, 2025",
    venue: "Golden Temple Banquet Hall",
    budgetRange: "₹25,000 - ₹40,000",
    duration: "4 hours",
    equipment: "Professional sound system, wireless mics",
    style: "Traditional Punjabi Folk + Modern Bhangra",
    specialRequests: "Include Sikh religious hymns",
    audienceSize: "200-300 guests",
    applicationDeadline: "February 28, 2025",
    daysUntilEvent: 45,
    daysUntilDeadline: 12
  };
  const milestones = [{
    name: "Application Deadline",
    date: "Feb 28",
    status: "upcoming",
    progress: 75
  }, {
    name: "Contract Finalization",
    date: "Mar 5",
    status: "pending",
    progress: 0
  }, {
    name: "Sound Check",
    date: "Mar 14",
    status: "pending",
    progress: 0
  }, {
    name: "Event Day",
    date: "Mar 15",
    status: "pending",
    progress: 0
  }];
  const equipmentChecklist = [{
    item: "Professional PA System",
    required: true,
    available: true
  }, {
    item: "Wireless Microphones (4)",
    required: true,
    available: true
  }, {
    item: "Traditional Instruments",
    required: true,
    available: false
  }, {
    item: "Stage Lighting",
    required: false,
    available: true
  }, {
    item: "Recording Equipment",
    required: false,
    available: true
  }];
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  return <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={handleBackToDashboard} className="flex items-center gap-2 hover:bg-gray-100">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={handleBackToDashboard} className="cursor-pointer hover:text-orange-600">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground">Gig Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gigDetails.title}</h1>
              <div className="flex items-center gap-4 text-gray-900">
                <Badge className="bg-saffron text-white border-0">
                  {gigDetails.type}
                </Badge>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{gigDetails.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{gigDetails.venue}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 mb-1">{gigDetails.budgetRange}</div>
              <div className="text-sm text-gray-900">Budget Range</div>
            </div>
          </div>

          {/* Countdown Timers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{gigDetails.daysUntilDeadline}</div>
                    <div className="text-sm text-gray-900">Days to Apply</div>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{gigDetails.daysUntilEvent}</div>
                    <div className="text-sm text-gray-900">Days to Event</div>
                  </div>
                  <Calendar className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{gigDetails.duration}</div>
                    <div className="text-sm text-gray-900">Performance Duration</div>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="communication">Chat</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>

          {/* Requirements & Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Event Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-blue-300">Musical Style</label>
                    <p className="text-gray-900">{gigDetails.style}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue-300">Special Requests</label>
                    <p className="text-gray-900">{gigDetails.specialRequests}</p>
                  </div>
                  <div className="text-[lime-20] text-lime-200">
                    <label className="text-sm font-medium text-blue-300">Equipment Needed</label>
                    <p className="text-gray-900">{gigDetails.equipment}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium text-blue-300">Audience Size</label>
                      <p className="text-gray-900">{gigDetails.audienceSize}</p>
                    </div>
                    <div className="text-lime-200">
                      <label className="text-sm font-medium text-blue-300">Duration</label>
                      <p className="text-gray-900">{gigDetails.duration}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="text-lime-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    Timeline & Milestones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{milestone.name}</span>
                        <span className="text-sm text-gray-900">{milestone.date}</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2 text-[text-blue-300]" />
                    </div>)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Application Interface Tab */}
          <TabsContent value="apply" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="text-[text-blue-300]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-blue-500" />
                    Portfolio & Pitch
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-blue-300 mb-2 block">
                      Upload Audio Samples
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-900">Drop audio files here or click to browse</p>
                      <p className="text-xs text-gray-900 mt-1">MP3, WAV up to 10MB each</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-blue-300 mb-2 block">
                      Custom Pitch ({pitchText.length}/500)
                    </label>
                    <Textarea placeholder="Tell the client why you're perfect for this gig..." value={pitchText} onChange={e => setPitchText(e.target.value)} maxLength={500} className="min-h-[120px]" />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-blue-300 mb-2 block">
                      Rate Proposal (₹)
                    </label>
                    <Input type="number" placeholder="Enter your rate" value={proposedRate} onChange={e => setProposedRate(e.target.value)} />
                    <p className="text-xs text-gray-900 mt-1">Budget range: {gigDetails.budgetRange}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    Equipment Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {equipmentChecklist.map((item, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={item.available} />
                        <span className={item.required ? "font-medium text-gray-900" : "text-gray-900"}>{item.item}</span>
                        {item.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Not Available"}
                      </Badge>
                    </div>)}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900">Travel Requirements</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-blue-300 mb-2 block">
                    Accommodation Needed
                  </label>
                  <select className="w-full p-2 border rounded-md text-gray-900">
                    <option>No</option>
                    <option>Yes - 1 night</option>
                    <option>Yes - 2 nights</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-300 mb-2 block">
                    Transportation
                  </label>
                  <select className="w-full p-2 border rounded-md text-gray-900">
                    <option>Self-arranged</option>
                    <option>Client-provided</option>
                    <option>Reimbursement needed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue-300 mb-2 block">
                    Setup Time Required
                  </label>
                  <select className="w-full p-2 border rounded-md text-gray-900">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3+ hours</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={() => setApplicationSubmitted(true)}>
                Submit Application
              </Button>
            </div>
          </TabsContent>

          {/* Contract Generator Tab */}
          <TabsContent value="contract" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Contract Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-gray-900">Performance Agreement</h3>
                  <p className="text-sm text-gray-900 mb-4">
                    This agreement is between [Artist Name] and [Client Name] for the performance at {gigDetails.title}.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-gray-900">
                      <strong>Event Date:</strong> {gigDetails.date}
                    </div>
                    <div className="text-gray-900">
                      <strong>Venue:</strong> {gigDetails.venue}
                    </div>
                    <div className="text-gray-900">
                      <strong>Duration:</strong> {gigDetails.duration}
                    </div>
                    <div className="text-gray-900">
                      <strong>Total Fee:</strong> ₹{proposedRate || '___'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Payment Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border p-3 rounded">
                      <div className="font-medium text-gray-900">Contract Signing</div>
                      <div className="text-sm text-gray-900">25% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.25)}</div>
                    </div>
                    <div className="border p-3 rounded">
                      <div className="font-medium text-gray-900">Sound Check</div>
                      <div className="text-sm text-gray-900">50% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.50)}</div>
                    </div>
                    <div className="border p-3 rounded">
                      <div className="font-medium text-gray-900">Performance Complete</div>
                      <div className="text-sm text-gray-900">25% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.25)}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Terms & Conditions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-gray-900">Cancellation policy: 72 hours notice required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-gray-900">Recording permissions: Client may record for personal use</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-gray-900">Equipment responsibility: Client provides basic PA system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-gray-900">Force majeure clause: Weather/emergency cancellations</span>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-900 mb-2">Digital Signature Area</p>
                  <Button variant="outline">Sign Contract</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Tracking Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Payment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[{
                  milestone: "Contract Signing",
                  amount: 25,
                  status: "pending",
                  date: "Mar 5"
                }, {
                  milestone: "Sound Check",
                  amount: 50,
                  status: "pending",
                  date: "Mar 14"
                }, {
                  milestone: "Performance Complete",
                  amount: 25,
                  status: "pending",
                  date: "Mar 15"
                }].map((payment, index) => <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{payment.milestone}</div>
                        <div className="text-sm text-gray-900">{payment.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">₹{Math.round((parseInt(proposedRate) || 0) * payment.amount / 100)}</div>
                        <Badge variant={payment.status === "pending" ? "secondary" : "default"}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>)}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-900">Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">₹0</div>
                      <div className="text-sm text-gray-900">Received</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">₹{proposedRate || 0}</div>
                      <div className="text-sm text-gray-900">Pending</div>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Generate Invoice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Communication Center Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="h-96">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      Chat with Event Organizer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-full flex flex-col">
                    <div className="flex-1 bg-gray-50 rounded p-4 mb-4 overflow-y-auto">
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-sm font-medium text-gray-900">Rajesh Kumar (Organizer)</div>
                          <div className="text-sm text-gray-900">Looking forward to your performance! Do you need any specific arrangements?</div>
                          <div className="text-xs text-gray-900 mt-1">2 hours ago</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1" />
                      <Button>Send</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Video Call
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Share Setlist
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Send Contract
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-900">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="p-2 bg-orange-50 rounded text-orange-700">
                        Application deadline in {gigDetails.daysUntilDeadline} days
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-blue-700">
                        New message from organizer
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Performer Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    Upcoming Gigs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Traditional Wedding Ceremony</div>
                        <div className="text-sm text-gray-900">Mar 15, 2025 • Chandigarh</div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-700">Applied</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Corporate Event</div>
                        <div className="text-sm text-gray-900">Mar 22, 2025 • Delhi</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-900">Monthly Earnings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">₹45,000</div>
                    <div className="text-sm text-gray-900">March 2025</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Rating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">4.8</div>
                    <div className="text-sm text-gray-900">Based on 24 reviews</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {applicationSubmitted && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4">
              <CardContent className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Application Submitted!</h3>
                <p className="text-gray-900 mb-4">
                  Your application has been sent to the event organizer. You'll receive a notification once they respond.
                </p>
                <Button onClick={() => setApplicationSubmitted(false)}>
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>}
      </div>
    </div>;
};
export default GigManagement;