'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { strings } from '@/lib/constants/strings';

export function Step4Preferences() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{strings.step4Title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Coming soon...</p>
      </CardContent>
    </Card>
  );
}
