import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props { children: ReactNode }
interface State { hasError: boolean }

export class WizardErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md px-4 py-16">
          <Card>
            <CardContent className="space-y-4 p-6 text-center">
              <p className="text-sm font-medium">Terjadi kesalahan tak terduga.</p>
              <p className="text-xs text-muted-foreground">
                Draft kamu aman tersimpan di browser. Muat ulang untuk melanjutkan.
              </p>
              <Button onClick={() => window.location.reload()}>Muat ulang draft</Button>
            </CardContent>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
