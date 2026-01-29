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



  const formatCurrency = (value: number) => `₹${(value / 10000000).toFixed(1)}Cr`;

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Ward Dashboard</h1>
          <p className="text-muted-foreground">Compare fund allocation and utilization across different wards.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">



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

        {/* Detailed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wardData.map((data, i) => (
            <Card
              key={data.name}
              className="hover:border-primary/30 transition-colors cursor-pointer hover:shadow-md"
              onClick={() => setSelectedWard(data.name)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-serif">{data.name}</CardTitle>
                  <div className="text-xs font-bold px-2 py-1 rounded bg-primary/10 text-primary">
                    {data.allocated > 0 ? (data.utilized / data.allocated * 100).toFixed(0) : 0}% Utilized
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                  <span className="font-semibold text-foreground">Rep:</span> {data.candidate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="h-[120px] w-[120px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Spent", value: data.utilized },
                            { name: "Planned", value: data.planned },
                            { name: "Balance", value: Math.max(0, data.allocated - data.utilized - data.planned) },
                          ].filter(d => d.value > 0)}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={50}
                          stroke="#fff"
                          strokeWidth={2}
                          dataKey="value"
                        >
                          <Cell fill="#f39c12" />
                          <Cell fill="#3498db" />
                          <Cell fill="#5d6d7e" />
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{
                            fontSize: '10px',
                            borderRadius: '4px',
                            border: '1px solid hsl(var(--border))',
                            backgroundColor: 'hsl(var(--card))'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Allocated</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(data.allocated)}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Spent</p>
                      <p className="text-lg font-bold text-secondary">{formatCurrency(data.utilized)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
