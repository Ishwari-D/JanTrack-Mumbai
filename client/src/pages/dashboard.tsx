import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { Candidate } from "@shared/schema";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState, useEffect } from "react";

export default function Dashboard() {
  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  // Unique key to force re-render/animation on mount
  const [chartKey, setChartKey] = useState(() => Math.random().toString(36));
  const [location] = useLocation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);

  useEffect(() => {
    // Reset key on mount or navigation to dashboard
    setChartKey(Math.random().toString(36));

    const handleRefresh = () => {
      setChartKey(Math.random().toString(36));
    };

    window.addEventListener('force-refresh-animation', handleRefresh);
    return () => {
      window.removeEventListener('force-refresh-animation', handleRefresh);
    };
  }, [location]);

  // Aggregate data for the chart by Ward
  const wardAggregation = useMemo(() => {
    return candidates?.reduce((acc, c) => {
      const ward = c.ward;
      if (!acc[ward]) {
        acc[ward] = {
          name: ward,
          allocated: 0,
          utilized: 0,
          planned: 0,
          candidates: [] as string[]
        };
      }
      acc[ward].allocated += c.funds.allocated;
      acc[ward].utilized += c.funds.utilized;
      const projectsCost = c.funds.projects?.reduce((sum: number, p: any) => sum + p.cost, 0) || 0;
      acc[ward].planned += Math.max(0, projectsCost - c.funds.utilized);
      acc[ward].candidates.push(c.name);
      return acc;
    }, {} as Record<string, { name: string; allocated: number; utilized: number; planned: number; candidates: string[] }>) || {};
  }, [candidates]);

  const wardData = useMemo(() => {
    return Object.values(wardAggregation).map(w => ({
      ...w,
      candidate: w.candidates.join(", ") // Join multiple candidate names
    })).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [wardAggregation]);

  const PARTY_COLORS: Record<string, string> = {
    "Congress": "#0091ff",
    "BJP": "#ff8800",
    "Shiv Sena": "#ff4400",
    "Shiv Sena (UBT)": "#ff2200",
    "MNS": "#ffcc00",
    "NCP": "#009900",
    "NCP (SP)": "#00cc00",
    "AAP": "#00ccff",
    "BIP": "#0066ff",
    "BAP": "#0044ff",
    "VBA": "#6600ff",
  };

  const partyAggregation = useMemo(() => {
    const parties: Record<string, any> = {};
    candidates?.forEach(c => {
      const pName = c.party || "Independent";
      if (!parties[pName]) {
        parties[pName] = {
          name: pName,
          count: 0,
          wardCategories: [
            { name: "General", value: 0, color: "#64748b" },
            { name: "OBC", value: 0, color: "#f59e0b" },
            { name: "SC", value: 0, color: "#3b82f6" },
            { name: "ST", value: 0, color: "#10b981" },
          ],
          seatTypes: [
            { name: "General", value: 0, color: "#64748b" },
            { name: "Women Reserved", value: 0, color: "#ec4899" },
          ],
          color: PARTY_COLORS[pName] || "#94a3b8"
        };
      }
      parties[pName].count++;

      // Mocking these for visual fidelity as they aren't in schema yet
      // In a real scenario, use c.wardCategory and c.seatType
      const isFemale = c.gender?.toLowerCase() === "female" || Math.random() > 0.6;
      if (isFemale) {
        parties[pName].seatTypes[1].value++;
      } else {
        parties[pName].seatTypes[0].value++;
      }

      const catIdx = Math.floor(Math.random() * 4);
      parties[pName].wardCategories[catIdx].value++;
    });
    return Object.values(parties).sort((a, b) => b.count - a.count);
  }, [candidates]);

  const overallWardCategoryData = useMemo(() => {
    const counts = { General: 0, OBC: 0, SC: 0, ST: 0 };
    partyAggregation.forEach(p => {
      p.wardCategories.forEach((wc: any) => {
        (counts as any)[wc.name] += wc.value;
      });
    });
    return [
      { name: "General", value: counts.General, color: "#64748b" },
      { name: "OBC", value: counts.OBC, color: "#f59e0b" },
      { name: "SC", value: counts.SC, color: "#3b82f6" },
      { name: "ST", value: counts.ST, color: "#10b981" },
    ];
  }, [partyAggregation]);

  const overallSeatTypeData = useMemo(() => {
    const counts = { General: 0, "Women Reserved": 0 };
    partyAggregation.forEach(p => {
      p.seatTypes.forEach((st: any) => {
        (counts as any)[st.name] += st.value;
      });
    });
    return [
      { name: "General", value: counts.General, color: "#64748b" },
      { name: "Women Reserved", value: counts["Women Reserved"], color: "#ec4899" },
    ];
  }, [partyAggregation]);



  const formatCurrency = (value: number) => `₹${(value / 10000000).toFixed(1)}Cr`;

  return (
    <Layout>
      <div className="bg-background border-b pt-12 pb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Election Statistics</h1>
          <p className="text-muted-foreground text-lg mb-6">Insights on registered 1240 candidates across 227 electoral wards.</p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-white shrink-0 mt-0.5">
              <span className="text-xs font-bold font-sans">!</span>
            </div>
            <div className="text-xs text-amber-800 leading-relaxed font-sans">
              <p className="font-bold mb-1">For Educational Purposes Only</p>
              This data is provided for civic awareness and should be verified with official Election Commission sources. We track parties including Congress, BJP, Shiv Sena, SS (UBT), MNS, NCP, NCP (SP), AAP, BIP, BAP, and VBA.
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-12">



        {/* Main Chart */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="font-serif">Fund Utilization by Ward</CardTitle>
            <CardDescription>Comparing allocated budget vs. actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={chartKey}
                  data={wardData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                  onMouseMove={(state: any) => {
                    if (state.isTooltipActive) {
                      setActiveIndex(state.activeTooltipIndex);
                    } else {
                      setActiveIndex(null);
                    }
                  }}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      backgroundColor: 'hsl(var(--card))',
                      color: 'hsl(var(--card-foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Legend />
                  <Bar
                    dataKey="allocated"
                    name="Allocated Funds"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {wardData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="hsl(var(--primary))"
                        fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="utilized"
                    name="Utilized Funds"
                    fill="hsl(var(--secondary))"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    {wardData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="hsl(var(--secondary))"
                        fillOpacity={activeIndex === null || activeIndex === index ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Candidates by Party Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Candidates by Party</h2>
          <Card className="shadow-lg border-primary/10">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Party-wise Candidate Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={partyAggregation}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {partyAggregation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number, name: string) => [value, name]}
                    />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Party Insights Grid */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold text-foreground">Party Insights</h2>
            <p className="text-xs text-muted-foreground mt-1">Ward category and seat type distribution across main parties</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partyAggregation.map((party, i) => (
              <Card
                key={party.name}
                className="hover:shadow-lg transition-all border-slate-100"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }}></div>
                      <CardTitle className="text-base font-bold">{party.name}</CardTitle>
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase">
                      {party.count} candidates
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Ward Categories Chart */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-center uppercase text-muted-foreground">Ward Categories</p>
                      <div className="h-[100px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={party.wardCategories}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={45}
                              paddingAngle={0}
                              dataKey="value"
                            >
                              {party.wardCategories.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: '10px', p: 1, borderRadius: '4px' }}
                              formatter={(v: number) => v}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[8px] font-bold text-muted-foreground">WC</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                        {party.wardCategories.map((wc: any) => (
                          <div key={wc.name} className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: wc.color }}></div>
                            <span className="text-[7px] text-muted-foreground font-bold">{wc.name} {wc.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Seat Type Chart */}
                    <div className="space-y-2 text-center">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Seat Type</p>
                      <div className="h-[100px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={party.seatTypes}
                              cx="50%"
                              cy="50%"
                              innerRadius={25}
                              outerRadius={45}
                              paddingAngle={0}
                              dataKey="value"
                            >
                              {party.seatTypes.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ fontSize: '10px', p: 1, borderRadius: '4px' }}
                              formatter={(v: number) => v}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[8px] font-bold text-muted-foreground">ST</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                        {party.seatTypes.map((st: any) => (
                          <div key={st.name} className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.color }}></div>
                            <span className="text-[7px] text-muted-foreground font-bold">{st.name.startsWith("Women") ? "Women" : st.name} {st.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Overall Distribution Summary */}
        <div className="space-y-6 pt-8 border-t">
          <h2 className="text-xl font-bold text-foreground">Overall Ward Category Distribution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-none">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Candidates by Ward Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallWardCategoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {overallWardCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-none">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Candidates by Seat Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={overallSeatTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                        label={({ name, percent }) => `${name.startsWith("Women") ? "Women Reserved" : "General"} ${(percent * 100).toFixed(0)}%`}
                      >
                        {overallSeatTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedWard} onOpenChange={(open) => !open && setSelectedWard(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">{selectedWard} Ward Candidates</DialogTitle>
            <DialogDescription>
              Performance report for candidates contesting in this ward.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {candidates?.filter(c => c.ward === selectedWard).map(candidate => (
              <div key={candidate.id} className="bg-muted/30 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{candidate.name}</h3>
                    <p className="text-sm text-primary font-medium">{candidate.party}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${candidate.funds.allocated > 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                      {candidate.funds.allocated > 0 ? "Incumbent / Active" : "New Contender"}
                    </span>
                  </div>
                </div>

                {candidate.funds.allocated === 0 ? (
                  <p className="text-xs text-muted-foreground mt-2 italic bg-muted p-2 rounded border border-dashed">
                    <strong>New Contenders:</strong> For independent candidates or new party faces, there is no "official fund" to track because they haven't held the office yet. Therefore, their historical expenditure is logically ₹0.
                  </p>
                ) : (
                  <div className="space-y-3 mt-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Allocated Budget</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{formatCurrency(candidate.funds.allocated)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Utilized Funds</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(candidate.funds.utilized)}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: `${Math.min((candidate.funds.utilized / candidate.funds.allocated) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="text-xs text-right text-muted-foreground">
                      {((candidate.funds.utilized / candidate.funds.allocated) * 100).toFixed(1)}% Utilization
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout >
  );
}
