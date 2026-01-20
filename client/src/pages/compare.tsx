import { Layout } from "@/components/layout";
import { MOCK_CANDIDATES } from "@/lib/mock-data";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ComparePage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const ward = searchParams.get('ward');
  const candidateId = searchParams.get('id');

  let candidates = [];
  if (ward) {
    candidates = MOCK_CANDIDATES.filter(c => c.ward === ward);
  } else if (candidateId) {
    const mainCandidate = MOCK_CANDIDATES.find(c => c.id === candidateId);
    if (mainCandidate) {
      candidates = MOCK_CANDIDATES.filter(c => c.ward === mainCandidate.ward);
    }
  }

  if (candidates.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto p-20 text-center">
          <h2 className="text-2xl font-serif font-bold">No candidates found for comparison in this ward.</h2>
        </div>
      </Layout>
    );
  }

  const currentWard = ward || candidates[0].ward;

  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">
            {candidates.length > 1 ? `Compare Candidates: ${currentWard}` : `Candidate Details: ${candidates[0].name}`}
          </h1>
          <p className="text-lg text-muted-foreground">
            {candidates.length > 1 
              ? "Row-by-row comparison of all verified candidates contesting in this ward."
              : "Detailed breakdown of metrics for the selected candidate."}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 overflow-x-auto">
        <Table className="min-w-[1000px] border shadow-sm">
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold py-6 text-primary border-r">Candidate</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r">Criminal Cases</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r">Education</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r">Net Assets</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary border-r">Attendance</TableHead>
              <TableHead className="text-center font-bold py-6 text-primary">Manifesto Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map(c => {
              const score = Math.round((c.promises.filter(p => p.status === 'completed').length / c.promises.length) * 100);
              return (
                <TableRow key={c.id} className="hover:bg-muted/5">
                  <TableCell className="border-r py-6">
                    <div className="flex items-center gap-4">
                      <img src={c.image} alt={c.name} className="w-16 h-16 rounded-xl object-cover border-2 border-background shadow-sm" />
                      <div>
                        <div className="font-serif font-bold text-primary text-base leading-tight">{c.name}</div>
                        <Badge variant="outline" className="mt-1 text-[10px] uppercase font-bold tracking-wider">{c.party}</Badge>
                        <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter font-bold">{c.ward}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold text-lg border-r">
                    <span className={c.criminalCases > 0 ? "text-destructive" : "text-green-600"}>
                      {c.criminalCases}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium border-r">{c.education}</TableCell>
                  <TableCell className="text-center font-bold border-r">{c.assets}</TableCell>
                  <TableCell className="text-center border-r">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-20 bg-muted h-2 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${c.attendance}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-primary">{c.attendance}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-serif font-bold text-primary">{score}%</span>
                      <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Promise Fulfillment</span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Layout>
  );
}
