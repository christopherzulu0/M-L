import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  Flag,
  MessageSquare,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Calendar,
  Award,
  CheckCircle,
  Clock,
  Home,
  ChevronRight,
  Heart,
  Eye,
  ArrowUpRight,
  Send,
  Download,
  Briefcase,
  Bed,
  Bath,
  Square,
} from "lucide-react"

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AgentSingle(props: Props) {
  const { id } = props.params

  // Fetch agent data here based on id
  // For now we'll just return the UI
  return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-6 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-6">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Home
            </a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Agents
            </a>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-foreground font-medium">Andy Sposty</span>
          </div>

          {/* Agent Header */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden mb-8">
            <div className="relative h-48 md:h-64 w-full bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-[url('/placeholder-pattern.svg')] opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-[260px] px-8 -mt-16 relative z-10">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                    <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/agents-kw5QiaoD5tLQ5ImzVbAFMWwolWxIF7.png"
                        alt="Andy Sposty"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent h-1/3"></div>
                    <Badge className="absolute bottom-2 left-2 bg-indigo-600 hover:bg-indigo-700">
                      <Briefcase className="h-3 w-3 mr-1" />
                      Top Agent
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="flex flex-col">
                      <h1 className="text-2xl font-bold">Andy Sposty</h1>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">Mavers RealEstate Agency</p>
                      <div className="mt-2 flex items-center">
                        <StarRating rating={4} label="Good" />
                        <span className="ml-2 text-sm text-muted-foreground">(24 reviews)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30"
                      >
                        <Award className="h-3 w-3 mr-1" />
                        Top Seller
                      </Badge>
                      <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        5+ Years
                      </Badge>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span>+7(123)987654</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm">MaversRealEstate@domain.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span>70 Bright St New York, USA</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                          <Globe className="h-4 w-4" />
                        </div>
                        <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                          themeforest.net
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold">Agent Overview</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">156</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Eye className="h-3 w-3" />
                          Profile Views
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">24</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          Reviews
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">16</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Home className="h-3 w-3" />
                          Active Listings
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Success Rate
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Tabs defaultValue="about" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 mb-6">
                      <TabsTrigger
                          value="about"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                      >
                        About
                      </TabsTrigger>
                      <TabsTrigger
                          value="listings"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                      >
                        Listings
                      </TabsTrigger>
                      <TabsTrigger
                          value="reviews"
                          className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 data-[state=active]:shadow-sm"
                      >
                        Reviews
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="about" className="mt-0">
                      <Card className="border-0 shadow-md">
                        <CardContent className="p-6 space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold mb-3">About This Agent</h3>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                              Vivamus vel lacus lacinia, condimentum nunc non, iaculis diam. Proin in mollis augue, eget
                              fermentum quam. Donec semper purus ut ante tempus gravida. Quisque et ante orci. Sed
                              venenatis turpis mi, non varius justo scelerisque id.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                              Placerat in egestas erat imperdiet sed euismod. Erat pellentesque adipiscing commodo elit at
                              imperdiet dui accumsan sit. Quam viverra orci sagittis eu volutpat odio facilisis.
                            </p>
                          </div>

                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-3">Specializations</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Luxury Properties</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Commercial Real Estate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Residential Sales</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span>Investment Properties</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-3">Service Areas</h3>
                            <div className="flex gap-2 flex-wrap">
                              {["London", "New York", "Rome", "Dubai", "Paris", "Tokyo", "Sydney"].map((area) => (
                                  <Badge
                                      key={area}
                                      variant="outline"
                                      className="px-3 py-1 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                                  >
                                    {area}
                                  </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold mb-3">Languages</h3>
                            <div className="flex gap-2 flex-wrap">
                              {["English", "Spanish", "French", "Italian"].map((language) => (
                                  <Badge
                                      key={language}
                                      variant="outline"
                                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/30"
                                  >
                                    {language}
                                  </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-6">
                        <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                              <div className="space-y-2">
                                <h3 className="text-xl font-bold">Need help finding your dream home?</h3>
                                <p className="text-indigo-100">Schedule a consultation with Andy today.</p>
                              </div>
                              <div className="flex gap-2">
                                <Button className="bg-white text-indigo-700 hover:bg-indigo-100">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Schedule Call
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="listings" className="mt-0">
                      <div className="grid gap-6">
                        {[1, 2, 3].map((item) => (
                            <Card key={item} className="border-0 shadow-md overflow-hidden">
                              <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row">
                                  <div className="relative sm:w-[240px] h-[200px] sm:h-auto">
                                    <Image src="/placeholder.jpg" alt="Property" fill className="object-cover" />
                                    <div className="absolute top-2 left-2 flex gap-2">
                                      <Badge className="bg-blue-600">Sale</Badge>
                                      <Badge className="bg-indigo-600">Featured</Badge>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white"
                                    >
                                      <Heart className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="p-5 flex-1">
                                    <div className="flex justify-between">
                                      <div>
                                        <h3 className="text-lg font-semibold">Luxury Family Home</h3>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                          <MapPin className="mr-1 h-3 w-3" />
                                          <span>40 Journal Square, NJ, USA</span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">$320,000</p>
                                      </div>
                                    </div>

                                    <div className="flex gap-6 mt-4">
                                      <div className="flex items-center gap-1">
                                        <Bed className="h-4 w-4 text-muted-foreground" />
                                        <span>4 Beds</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Bath className="h-4 w-4 text-muted-foreground" />
                                        <span>2 Baths</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Square className="h-4 w-4 text-muted-foreground" />
                                        <span>460 sqft</span>
                                      </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>Listed 2 weeks ago</span>
                                      </div>
                                      <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                                        View Details
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                        ))}
                      </div>

                      <div className="flex justify-center mt-6">
                        <Button variant="outline">
                          View All Listings
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-0">
                      <Card className="border-0 shadow-md">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h3 className="text-lg font-semibold">Client Reviews</h3>
                              <p className="text-sm text-muted-foreground">See what others are saying about Andy</p>
                            </div>
                            <Button className="bg-indigo-600 hover:bg-indigo-700">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Write a Review
                            </Button>
                          </div>

                          <div className="space-y-6">
                            {[1, 2, 3].map((review) => (
                                <div
                                    key={review}
                                    className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                                >
                                  <div className="flex justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                        <Image
                                            src="/placeholder-user.jpg"
                                            alt="Reviewer"
                                            width={48}
                                            height={48}
                                            className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <h4 className="font-semibold">Liza Rose</h4>
                                        <StarRating rating={5} label="Excellent" />
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>12 April 2023</span>
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground">
                                    "Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat
                                    massa quis enim. Working with Andy was a pleasure from start to finish."
                                  </p>
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Section */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2">
                <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  <h2 className="text-2xl font-bold mb-4">Get In Touch With Andy</h2>
                  <p className="mb-6 text-indigo-100">
                    Have questions about buying or selling a property? Send Andy a message and he'll get back to you as
                    soon as possible.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-200">Phone Number</p>
                        <p className="font-medium">+7(123)987654</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-200">Email Address</p>
                        <p className="font-medium">MaversRealEstate@domain.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm text-indigo-200">Office Address</p>
                        <p className="font-medium">70 Bright St New York, USA</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Download className="mr-2 h-4 w-4" />
                      Download vCard
                    </Button>
                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2">Send a Message</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill out the form below and Andy will get back to you shortly.
                  </p>

                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input
                            placeholder="Your name*"
                            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                      <div>
                        <Input
                            placeholder="Your email*"
                            type="email"
                            className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                        />
                      </div>
                    </div>
                    <div>
                      <Input
                          placeholder="Subject"
                          className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <Textarea
                          placeholder="Your message"
                          className="min-h-[120px] bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  )
}
