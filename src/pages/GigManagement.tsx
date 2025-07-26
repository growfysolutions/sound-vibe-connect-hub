import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText, Upload, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Badge } from '@/components/ui/badge';
import { CulturalButton } from '@/components/ui/CulturalButton';
import { CulturalCard } from '@/components/cards/CulturalCard';
import { getCulturalNavigationStyle } from '@/lib/cultural-design';

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

  const tabItems = [
    { id: 'details', label: 'Details' },
    { id: 'apply', label: 'Apply' },
    { id: 'contract', label: 'Contract' },
    { id: 'payments', label: 'Payments' },
    { id: 'communication', label: 'Chat' },
    { id: 'dashboard', label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-hsl(var(--ocean-blue)) to-hsl(var(--teal)) text-white py-6 shadow-xl shadow-hsl(var(--ocean-blue))/20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header with Navigation */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <CulturalButton 
                variant="secondary" 
                size="sm" 
                onClick={handleBackToDashboard} 
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </CulturalButton>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink onClick={handleBackToDashboard} className="cursor-pointer hover:text-white/80 text-white/90">
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">Gig Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{gigDetails.title}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
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
                <div className="text-2xl font-bold text-white mb-1">{gigDetails.budgetRange}</div>
                <div className="text-sm text-white/80">Budget Range</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Countdown Timers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <CulturalCard variant="default" className="border-hsl(var(--color-warning-500))/30">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-hsl(var(--color-warning-500))">{gigDetails.daysUntilDeadline}</div>
                  <div className="text-sm text-muted-foreground">Days to Apply</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-hsl(var(--color-warning-500))" />
              </div>
            </div>
          </CulturalCard>

          <CulturalCard variant="default" className="border-hsl(var(--color-success-500))/30">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-hsl(var(--color-success-500))">{gigDetails.daysUntilEvent}</div>
                  <div className="text-sm text-muted-foreground">Days to Event</div>
                </div>
                <Calendar className="w-8 h-8 text-hsl(var(--color-success-500))" />
              </div>
            </div>
          </CulturalCard>

          <CulturalCard variant="default" className="border-hsl(var(--ocean-blue))/30">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-hsl(var(--ocean-blue))">{gigDetails.duration}</div>
                  <div className="text-sm text-muted-foreground">Performance Duration</div>
                </div>
                <Clock className="w-8 h-8 text-hsl(var(--ocean-blue))" />
              </div>
            </div>
          </CulturalCard>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="border-b border-border bg-card/50 backdrop-blur-sm rounded-lg">
            <TabsList className="bg-transparent p-2 rounded-lg border-none h-auto w-full">
              {tabItems.map((item) => (
                <TabsTrigger 
                  key={item.id}
                  value={item.id} 
                  className={getCulturalNavigationStyle(activeTab === item.id)}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Requirements & Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CulturalCard variant="default" title="Event Requirements" culturalIcon="🎵">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue))">Musical Style</label>
                    <p className="text-foreground">{gigDetails.style}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue))">Special Requests</label>
                    <p className="text-foreground">{gigDetails.specialRequests}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue))">Equipment Needed</label>
                    <p className="text-foreground">{gigDetails.equipment}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="text-sm font-medium text-hsl(var(--ocean-blue))">Audience Size</label>
                      <p className="text-foreground">{gigDetails.audienceSize}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-hsl(var(--ocean-blue))">Duration</label>
                      <p className="text-foreground">{gigDetails.duration}</p>
                    </div>
                  </div>
                </div>
              </CulturalCard>

              <CulturalCard variant="default" title="Timeline & Milestones" culturalIcon="⏰">
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">{milestone.name}</span>
                        <span className="text-sm text-muted-foreground">{milestone.date}</span>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </CulturalCard>
            </div>
          </TabsContent>

          {/* Application Interface Tab */}
          <TabsContent value="apply" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CulturalCard variant="default" title="Portfolio & Pitch" culturalIcon="🎨">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                      Upload Audio Samples
                    </label>
                    <div className="border-2 border-dashed border-hsl(var(--ocean-blue))/30 rounded-lg p-6 text-center hover:border-hsl(var(--ocean-blue))/60 transition-colors cursor-pointer bg-hsl(var(--ocean-blue))/5">
                      <Upload className="w-8 h-8 text-hsl(var(--ocean-blue)) mx-auto mb-2" />
                      <p className="text-sm text-foreground">Drop audio files here or click to browse</p>
                      <p className="text-xs text-muted-foreground mt-1">MP3, WAV up to 10MB each</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                      Custom Pitch ({pitchText.length}/500)
                    </label>
                    <Textarea 
                      placeholder="Tell the client why you're perfect for this gig..." 
                      value={pitchText} 
                      onChange={e => setPitchText(e.target.value)} 
                      maxLength={500} 
                      className="min-h-[120px] border-hsl(var(--ocean-blue))/30 focus:border-hsl(var(--ocean-blue))" 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                      Rate Proposal (₹)
                    </label>
                    <Input 
                      type="number" 
                      placeholder="Enter your rate" 
                      value={proposedRate} 
                      onChange={e => setProposedRate(e.target.value)} 
                      className="border-hsl(var(--ocean-blue))/30 focus:border-hsl(var(--ocean-blue))"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Budget range: {gigDetails.budgetRange}</p>
                  </div>
                </div>
              </CulturalCard>

              <CulturalCard variant="default" title="Equipment Checklist" culturalIcon="🎧">
                <div className="space-y-3">
                  {equipmentChecklist.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-hsl(var(--ocean-blue))/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <Checkbox checked={item.available} />
                        <span className={item.required ? "font-medium text-foreground" : "text-foreground"}>{item.item}</span>
                        {item.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      <Badge variant={item.available ? "default" : "secondary"} className={item.available ? "bg-hsl(var(--color-success-500)) text-white" : ""}>
                        {item.available ? "Available" : "Not Available"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CulturalCard>
            </div>

            <CulturalCard variant="default" title="Travel Requirements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                    Accommodation Needed
                  </label>
                  <select className="w-full p-2 border border-hsl(var(--ocean-blue))/30 rounded-md text-foreground bg-background focus:border-hsl(var(--ocean-blue))">
                    <option>No</option>
                    <option>Yes - 1 night</option>
                    <option>Yes - 2 nights</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                    Transportation
                  </label>
                  <select className="w-full p-2 border border-hsl(var(--ocean-blue))/30 rounded-md text-foreground bg-background focus:border-hsl(var(--ocean-blue))">
                    <option>Self-arranged</option>
                    <option>Client-provided</option>
                    <option>Reimbursement needed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-hsl(var(--ocean-blue)) mb-2 block">
                    Setup Time Required
                  </label>
                  <select className="w-full p-2 border border-hsl(var(--ocean-blue))/30 rounded-md text-foreground bg-background focus:border-hsl(var(--ocean-blue))">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3+ hours</option>
                  </select>
                </div>
              </div>
            </CulturalCard>

            <div className="flex justify-end">
              <CulturalButton 
                size="lg" 
                variant="primary"
                onClick={() => setApplicationSubmitted(true)}
              >
                Submit Application
              </CulturalButton>
            </div>
          </TabsContent>

          {/* Contract Generator Tab */}
          <TabsContent value="contract" className="space-y-6">
            <CulturalCard variant="default" title="Contract Template" culturalIcon="📄">
              <div className="space-y-4">
                <div className="bg-hsl(var(--ocean-blue))/5 p-4 rounded-lg border border-hsl(var(--ocean-blue))/20">
                  <h3 className="font-semibold mb-2 text-foreground">Performance Agreement</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This agreement is between [Artist Name] and [Client Name] for the performance at {gigDetails.title}.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="text-foreground">
                      <strong>Event Date:</strong> {gigDetails.date}
                    </div>
                    <div className="text-foreground">
                      <strong>Venue:</strong> {gigDetails.venue}
                    </div>
                    <div className="text-foreground">
                      <strong>Duration:</strong> {gigDetails.duration}
                    </div>
                    <div className="text-foreground">
                      <strong>Total Fee:</strong> ₹{proposedRate || '___'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Payment Milestones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-border p-3 rounded bg-hsl(var(--color-success-500))/5">
                      <div className="font-medium text-foreground">Contract Signing</div>
                      <div className="text-sm text-muted-foreground">25% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.25)}</div>
                    </div>
                    <div className="border border-border p-3 rounded bg-hsl(var(--color-warning-500))/5">
                      <div className="font-medium text-foreground">Sound Check</div>
                      <div className="text-sm text-muted-foreground">50% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.50)}</div>
                    </div>
                    <div className="border border-border p-3 rounded bg-hsl(var(--ocean-blue))/5">
                      <div className="font-medium text-foreground">Performance Complete</div>
                      <div className="text-sm text-muted-foreground">25% - ₹{Math.round((parseInt(proposedRate) || 0) * 0.25)}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Terms & Conditions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-foreground">Cancellation policy: 72 hours notice required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-foreground">Recording permissions: Client may record for personal use</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-foreground">Equipment responsibility: Client provides basic PA system</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox />
                      <span className="text-foreground">Force majeure clause: Weather/emergency cancellations</span>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-hsl(var(--ocean-blue))/30 p-4 rounded-lg text-center bg-hsl(var(--ocean-blue))/5">
                  <p className="text-sm text-muted-foreground mb-2">Digital Signature Area</p>
                  <CulturalButton variant="secondary">Sign Contract</CulturalButton>
                </div>
              </div>
            </CulturalCard>
          </TabsContent>

          {/* Payment Tracking Tab */}
          <TabsContent value="payments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CulturalCard variant="default" title="Payment Schedule" culturalIcon="💰">
                <div className="space-y-4">
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
                  }].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-hsl(var(--ocean-blue))/5 transition-colors">
                      <div>
                        <div className="font-medium text-foreground">{payment.milestone}</div>
                        <div className="text-sm text-muted-foreground">{payment.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">₹{Math.round((parseInt(proposedRate) || 0) * payment.amount / 100)}</div>
                        <Badge variant={payment.status === "pending" ? "secondary" : "default"}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CulturalCard>

              <CulturalCard variant="default" title="Earnings Summary">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-hsl(var(--color-success-500))/10 border border-hsl(var(--color-success-500))/20 rounded-lg">
                      <div className="text-2xl font-bold text-hsl(var(--color-success-500))">₹0</div>
                      <div className="text-sm text-muted-foreground">Received</div>
                    </div>
                    <div className="text-center p-4 bg-hsl(var(--color-warning-500))/10 border border-hsl(var(--color-warning-500))/20 rounded-lg">
                      <div className="text-2xl font-bold text-hsl(var(--color-warning-500))">₹{proposedRate || 0}</div>
                      <div className="text-sm text-muted-foreground">Pending</div>
                    </div>
                  </div>
                  
                  <CulturalButton variant="secondary" className="w-full">
                    Generate Invoice
                  </CulturalButton>
                </div>
              </CulturalCard>
            </div>
          </TabsContent>

          {/* Communication Center Tab */}
          <TabsContent value="communication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CulturalCard variant="default" title="Chat with Event Organizer" culturalIcon="💬" className="h-96">
                  <div className="h-full flex flex-col">
                    <div className="flex-1 bg-hsl(var(--ocean-blue))/5 rounded p-4 mb-4 overflow-y-auto border border-hsl(var(--ocean-blue))/20">
                      <div className="space-y-3">
                        <div className="bg-background p-3 rounded-lg shadow-sm border border-border">
                          <div className="text-sm font-medium text-foreground">Rajesh Kumar (Organizer)</div>
                          <div className="text-sm text-foreground">Looking forward to your performance! Do you need any specific arrangements?</div>
                          <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type your message..." className="flex-1 border-hsl(var(--ocean-blue))/30 focus:border-hsl(var(--ocean-blue))" />
                      <CulturalButton variant="primary">Send</CulturalButton>
                    </div>
                  </div>
                </CulturalCard>
              </div>

              <div className="space-y-4">
                <CulturalCard variant="default" title="Quick Actions">
                  <div className="space-y-2">
                    <CulturalButton variant="secondary" className="w-full justify-start" size="sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Video Call
                    </CulturalButton>
                    <CulturalButton variant="secondary" className="w-full justify-start" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Share Setlist
                    </CulturalButton>
                    <CulturalButton variant="secondary" className="w-full justify-start" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      Send Contract
                    </CulturalButton>
                  </div>
                </CulturalCard>

                <CulturalCard variant="default" title="Notifications">
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-hsl(var(--color-warning-500))/10 border border-hsl(var(--color-warning-500))/20 rounded text-hsl(var(--color-warning-500))">
                      Application deadline in {gigDetails.daysUntilDeadline} days
                    </div>
                    <div className="p-2 bg-hsl(var(--ocean-blue))/10 border border-hsl(var(--ocean-blue))/20 rounded text-hsl(var(--ocean-blue))">
                      New message from organizer
                    </div>
                  </div>
                </CulturalCard>
              </div>
            </div>
          </TabsContent>

          {/* Performer Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <CulturalCard variant="default" title="Upcoming Gigs" culturalIcon="📅" className="lg:col-span-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-hsl(var(--ocean-blue))/5 transition-colors">
                    <div>
                      <div className="font-medium text-foreground">Traditional Wedding Ceremony</div>
                      <div className="text-sm text-muted-foreground">Mar 15, 2025 • Chandigarh</div>
                    </div>
                    <Badge className="bg-hsl(var(--color-warning-500))/20 text-hsl(var(--color-warning-500)) border-hsl(var(--color-warning-500))/30">Applied</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-hsl(var(--ocean-blue))/5 transition-colors">
                    <div>
                      <div className="font-medium text-foreground">Corporate Event</div>
                      <div className="text-sm text-muted-foreground">Mar 22, 2025 • Delhi</div>
                    </div>
                    <Badge className="bg-hsl(var(--color-success-500))/20 text-hsl(var(--color-success-500)) border-hsl(var(--color-success-500))/30">Confirmed</Badge>
                  </div>
                </div>
              </CulturalCard>

              <div className="space-y-4">
                <CulturalCard variant="default" title="Monthly Earnings">
                  <div>
                    <div className="text-2xl font-bold text-hsl(var(--color-success-500))">₹45,000</div>
                    <div className="text-sm text-muted-foreground">March 2025</div>
                  </div>
                </CulturalCard>

                <CulturalCard variant="default" title="Rating" culturalIcon="⭐">
                  <div>
                    <div className="text-2xl font-bold text-foreground">4.8</div>
                    <div className="text-sm text-muted-foreground">Based on 24 reviews</div>
                  </div>
                </CulturalCard>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {applicationSubmitted && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <CulturalCard variant="default" className="max-w-md mx-4">
              <div className="p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-hsl(var(--color-success-500)) mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-foreground">Application Submitted!</h3>
                <p className="text-muted-foreground mb-4">
                  Your application has been sent to the event organizer. You'll receive a notification once they respond.
                </p>
                <CulturalButton onClick={() => setApplicationSubmitted(false)} variant="primary">
                  Continue
                </CulturalButton>
              </div>
            </CulturalCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default GigManagement;
