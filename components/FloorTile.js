"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function FloorTile({ name, image, id, libraryId}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt="Floor Image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
            
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" href={"/library/" + libraryId + "/floor/" + id}>
          Select
        </Button>
      </CardActions>
    </Card>
  );
}