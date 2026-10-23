import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExplorerForm } from "@/components/explorer-form";

export const dynamic = "force-dynamic";

export default function ExplorerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explore the Atlas</CardTitle>
        <CardDescription>
          A semantic search over public cards, through this observer. What is shown here is already public in the Atlas. The Explorer never lists agents
          exhaustively; it answers a question.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExplorerForm />
      </CardContent>
    </Card>
  );
}
