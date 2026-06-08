"use client";

import { useUniversity } from './UniversityContext';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

export default function UniversitySelector() {
  const { universityId, selectUniversity, allUniversities } = useUniversity();

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {allUniversities.map((uni) => {
        const isSelected = universityId === uni.id;
        return (
          <Card
            key={uni.id}
            sx={{
              width: 220,
              cursor: 'pointer',
              borderRadius: '12px',
              border: isSelected ? `3px solid ${uni.colors.primary}` : '3px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 15px -3px rgb(0 0 0 / 0.1)',
              },
            }}
            onClick={() => selectUniversity(uni.id)}
          >
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <div
                  className="inline-block px-4 py-2 rounded-lg font-bold text-white mb-2 shadow-md"
                  style={{ backgroundColor: uni.colors.primary }}
                >
                  {uni.shortName}
                </div>
                <Typography variant="body2" sx={{ color: '#6b7280', mt: 1, fontSize: '0.8rem' }}>
                  {uni.name}
                </Typography>
                {isSelected && (
                  <Chip
                    label="Selected"
                    size="small"
                    sx={{
                      mt: 1,
                      backgroundColor: uni.colors.primary,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
}
