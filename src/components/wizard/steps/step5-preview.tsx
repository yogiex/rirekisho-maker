'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { strings } from '@/lib/constants/strings';
import type { RirekishoFormData } from '@/lib/schema/rirekisho-schema';

interface Step5Props {
  data: RirekishoFormData;
  onReset: () => void;
}

export function Step5Preview({ data, onReset }: Step5Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{strings.step5Title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Coming soon — Paper preview & PDF export.</p>
        <div className="flex gap-2">
          <Button variant="destructive" onClick={onReset}>
            {strings.reset}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
