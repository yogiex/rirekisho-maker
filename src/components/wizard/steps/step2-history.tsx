'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { strings } from '@/lib/constants/strings';

export function Step2History() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{strings.step2Title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon...</p>
      </CardContent>
    </Card>
  );
}
