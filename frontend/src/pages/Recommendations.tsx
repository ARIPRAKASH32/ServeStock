import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Alert } from '../components/ui/Alert';
import { Badge } from '../components/ui/Badge';
import { Lightbulb, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';

export function Recommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/recommendations')
      .then((res) => setRecommendations(res.data.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'EXPIRED':
        return <Badge variant="error">{priority}</Badge>;
      case 'HIGH':
        return <Badge variant="warning">{priority}</Badge>;
      default:
        return <Badge variant="info">{priority}</Badge>;
    }
  };

  const handleActionClick = (type: string) => {
    if (type === 'PURCHASE_ADJUSTMENT') {
      navigate('../purchases');
    } else if (type === 'EXPIRED_ACTION') {
      navigate('../waste');
    } else {
      navigate('../inventory');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Intelligence & Recommendations</h2>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Analyzing inventory patterns...</div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          icon={Lightbulb}
          title="No action required"
          description="Your inventory is perfectly optimized. No high-risk items or waste patterns detected."
        />
      ) : (
        <div className="grid gap-4">
          {recommendations.map((rec, index) => (
            <Card key={index} className="overflow-hidden border-l-4 border-l-brand-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-gray-900">{rec.title}</h3>
                      {getPriorityBadge(rec.priority)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong className="text-gray-900">Problem:</strong> {rec.problem}</p>
                      <p><strong className="text-gray-900">Evidence:</strong> {rec.evidence}</p>
                    </div>

                    <div className="mt-4">
                      <Alert variant="default" className="bg-brand-50 border-brand-200 text-brand-900">
                        <div className="flex items-center gap-2 font-medium">
                          <Lightbulb className="w-4 h-4" />
                          Recommended Action
                        </div>
                        <p className="mt-1">{rec.recommendedAction}</p>
                      </Alert>
                    </div>
                  </div>
                  
                  <div className="hidden md:block">
                    <button 
                      onClick={() => handleActionClick(rec.type)}
                      className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-3 py-2 rounded-md transition-colors"
                    >
                      Take Action <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
