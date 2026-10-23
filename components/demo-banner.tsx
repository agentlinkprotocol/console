import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DemoBanner({ demo }: { demo: boolean }) {
  if (!demo) return null;
  return (
    <Alert>
      <AlertTitle>Demo data</AlertTitle>
      <AlertDescription>
        No observer node answered. Figures below are simulated so you can see the layout. Set <code>OBSERVER_URLS</code> to one or
        more Grid nodes running with <code>node.observer = true</code>.
      </AlertDescription>
    </Alert>
  );
}
