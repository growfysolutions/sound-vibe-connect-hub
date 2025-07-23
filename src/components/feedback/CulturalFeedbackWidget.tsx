
import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const CulturalFeedbackWidget = () => {
  return (
    <Card className="floating-card">
      <CardHeader>
        <h3 className="text-lg font-semibold">Cultural Feedback</h3>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Share your thoughts on cultural authenticity and collaboration experiences.
        </p>
      </CardContent>
    </Card>
  );
};

export default CulturalFeedbackWidget;
